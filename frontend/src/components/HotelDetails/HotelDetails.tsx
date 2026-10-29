import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchHotelById } from '../../redux/reducers/hotelSlice'
import styles from './HotelDetails.module.css'
import { ArrowLeft, Heart } from 'lucide-react';
import { fetchPhotos } from '../../redux/reducers/photosSlice'
import { fetchRooms } from '../../redux/reducers/roomsSlice'
import { fetchHotelAmenities } from '../../redux/reducers/amenitiesSlice'
import { fetchReviews, addReview } from '../../redux/reducers/reviewsSlice'
import { fetchFavourites, addFavourite, removeFavourite } from '../../redux/reducers/favouritesSlice'


export const HotelDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedHotel, loading, error } = useSelector((state: RootState) => state.hotels)

  const { photos } = useSelector((state: RootState) => state.photos)
  const { rooms } = useSelector((state: RootState) => state.rooms)
  const { hotelAmenities } = useSelector((state: RootState) => state.amenities)
  const { reviews, average, total, error: reviewError } = useSelector((state: RootState) => state.reviews)
  const { currentUser } = useSelector((state: RootState) => state.login)
  const { favourites } = useSelector((state: RootState) => state.favourites)

  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')



  const [activePhoto, setActivePhoto] = useState(0)

  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)

  const [roomId, setRoomId] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [numberOfRooms, setNumberOfRooms] = useState(1)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    dispatch(fetchHotelById(id!))
    dispatch(fetchPhotos(id!))
    dispatch(fetchRooms(id!))
    dispatch(fetchHotelAmenities(id!))
    dispatch(fetchReviews(id!))
    setActivePhoto(0)
  }, [dispatch, id])

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavourites())
    }
  }, [dispatch, currentUser])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await dispatch(addReview({ hotelId: id!, rating: Number(rating), comment }))

    if (result.meta.requestStatus === 'fulfilled') {
      setRating('5')
      setComment('')
      dispatch(fetchReviews(id!))
    }
  }

  const isFavourite = favourites.some((hotel) => hotel.id === Number(id))

  const handleFavourite = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    if (isFavourite) {
      await dispatch(removeFavourite(Number(id)))
    } else {
      const result = await dispatch(addFavourite(Number(id)))
      if (addFavourite.fulfilled.match(result)) {
        dispatch(fetchFavourites())
      }
    }
  }


  if (loading) return <p className={styles.message}>Loading...</p>
  if (error) return <p className={styles.message}>{error}</p>
  if (!selectedHotel) return null

  const alreadyReviewed = reviews.some((review) => review.user_id === currentUser?.id)

  // Price calculation
  const selectedRoom = rooms.find((room) => room.id === Number(roomId))

  let nights = 0
  if (checkIn && checkOut) {
    nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  }

  let totalPrice = 0
  if (selectedRoom && nights > 0) {
    totalPrice = Number(selectedRoom.price_per_night) * nights * numberOfRooms
  }
  const handleBook = () => {
    setBookingError('')

    if (!currentUser) {
      navigate('/login')
      return
    }
    if (!selectedRoom) {
      setBookingError('Please choose a room')
      return
    }
    if (!checkIn || !checkOut || nights < 1) {
      setBookingError('Please choose valid check-in and check-out dates')
      return
    }

    navigate('/checkout', {
      state: {
        hotelName: selectedHotel.name,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        pricePerNight: Number(selectedRoom.price_per_night),
        checkIn,
        checkOut,
        nights,
        adults,
        children,
        numberOfRooms,
        total: totalPrice,
      },
    })
  }

  const mapAddress = encodeURIComponent(`${selectedHotel.address}, ${selectedHotel.city}`)

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={18} className={styles.icon} aria-hidden="true" />
        Back to hotels
      </Link>
      <div className={styles.titleRow}>
        <h1 className={styles.name}>{selectedHotel.name}</h1>

        <button type="button" className={styles.favouriteButton} onClick={handleFavourite}>
          <Heart size={18} fill={isFavourite ? 'currentColor' : 'none'} aria-hidden="true" />
          {isFavourite ? 'Saved' : 'Save'}
        </button>
      </div>

      <p className={styles.location}>
        {selectedHotel.address}, {selectedHotel.city} · {selectedHotel.star_rating} ⭐
      </p>

      {photos.length > 0 ? (
        <div className={styles.gallery}>
          <img
            src={photos[activePhoto].image_url}
            alt={selectedHotel.name}
            className={styles.mainPhoto}
          />

          {photos.length > 1 && (
            <div className={styles.thumbnails}>
              {photos.map((photo, index) => (
                <img
                  key={photo.id}
                  src={photo.image_url}
                  alt={`${selectedHotel.name} photo ${index + 1}`}
                  className={index === activePhoto ? styles.thumbnailActive : styles.thumbnail}
                  onClick={() => setActivePhoto(index)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.noPhoto}>No photos yet</div>
      )}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About this hotel</h2>
        <p className={styles.description}>
          {selectedHotel.description || 'No description yet.'}
        </p>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Amenities</h2>

          {hotelAmenities.length === 0 ? (
            <p className={styles.empty}>No amenities listed yet.</p>
          ) : (
            <div className={styles.amenities}>
              {hotelAmenities.map((amenity) => (
                <span key={amenity.id} className={styles.amenity}>
                  {amenity.name}
                </span>
              ))}
            </div>
          )}
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Rooms</h2>

          {rooms.length === 0 ? (
            <p className={styles.empty}>No rooms available yet.</p>
          ) : (
            <div className={styles.roomList}>
              {rooms.map((room) => (
                <div key={room.id} className={styles.roomCard}>
                  <div>
                    <h3 className={styles.roomName}>{room.name}</h3>
                    {room.description && <p className={styles.roomDescription}>{room.description}</p>}
                    <p className={styles.roomGuests}>Sleeps {room.capacity}</p>
                  </div>

                  <p className={styles.roomPrice}>
                    R {Number(room.price_per_night).toLocaleString('en-ZA')}
                    <span> / night</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.bookingBox}>
          <h2 className={styles.sectionTitle}>Book your stay</h2>

          {bookingError && <p className={styles.reviewError}>{bookingError}</p>}

          <label className={styles.formLabel}>Room</label>
          <select className={styles.formInput} value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            <option value="">Choose a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — R {room.price_per_night} / night
              </option>
            ))}
          </select>

          <div className={styles.bookingRow}>
            <div>
              <label className={styles.formLabel}>Check-in</label>
              <input
                type="date"
                className={styles.formInput}
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.formLabel}>Check-out</label>
              <input
                type="date"
                className={styles.formInput}
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.bookingRow}>
            <div>
              <label className={styles.formLabel}>Adults</label>
              <input
                type="number"
                className={styles.formInput}
                min="1"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={styles.formLabel}>Children</label>
              <input
                type="number"
                className={styles.formInput}
                min="0"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={styles.formLabel}>Rooms</label>
              <input
                type="number"
                className={styles.formInput}
                min="1"
                value={numberOfRooms}
                onChange={(e) => setNumberOfRooms(Number(e.target.value))}
              />
            </div>
          </div>

          {totalPrice > 0 && selectedRoom && (
            <p className={styles.totalLine}>
              {nights} {nights === 1 ? 'night' : 'nights'} × R {selectedRoom.price_per_night}
              {numberOfRooms > 1 && ` × ${numberOfRooms} rooms`}
              <strong> = R {totalPrice.toLocaleString('en-ZA')}</strong>
            </p>
          )}

          <button className={styles.submitButton} onClick={handleBook}>
            {currentUser ? 'Book now' : 'Log in to book'}
          </button>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Location</h2>
          <p className={styles.mapAddress}>{selectedHotel.address}, {selectedHotel.city}</p>

          <iframe
            title="Hotel location"
            className={styles.map}
            src={`https://www.google.com/maps?q=${mapAddress}&output=embed`}
            loading="lazy"
          ></iframe>

        </section>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hotel policies</h2>

        <div className={styles.policies}>
          <p className={styles.policy}>
            <strong>Check-in:</strong> from {selectedHotel.check_in_time.slice(0, 5)}
          </p>
          <p className={styles.policy}>
            <strong>Check-out:</strong> by {selectedHotel.check_out_time.slice(0, 5)}
          </p>

          {selectedHotel.cancellation_policy && (
            <p className={styles.policy}>
              <strong>Cancellation:</strong> {selectedHotel.cancellation_policy}
            </p>
          )}
          {selectedHotel.children_policy && (
            <p className={styles.policy}>
              <strong>Children:</strong> {selectedHotel.children_policy}
            </p>
          )}
          {selectedHotel.pet_policy && (
            <p className={styles.policy}>
              <strong>Pets:</strong> {selectedHotel.pet_policy}
            </p>
          )}
          {selectedHotel.smoking_policy && (
            <p className={styles.policy}>
              <strong>Smoking:</strong> {selectedHotel.smoking_policy}
            </p>
          )}
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Reviews</h2>

        {total === 0 ? (
          <p className={styles.empty}>No reviews yet.</p>
        ) : (
          <>
            <p className={styles.average}>
              ★ {average} <span>({total} {total === 1 ? 'review' : 'reviews'})</span>
            </p>

            <div className={styles.reviewList}>
              {reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <strong>{review.reviewer}</strong>
                    <span className={styles.reviewStars}>{'★'.repeat(review.rating)}</span>
                  </div>
                  {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
                  <p className={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString('en-ZA')}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
        <div className={styles.reviewForm}>
          {!currentUser ? (
            <p>
              <Link to="/login" className={styles.back}>Log in</Link> to write a review.
            </p>
          ) : alreadyReviewed ? (
            <p className={styles.thanks}>Thanks for your review!</p>
          ) : (
            <form onSubmit={handleReviewSubmit}>
              <h3 className={styles.formTitle}>Write a review</h3>

              {reviewError && <p className={styles.reviewError}>{reviewError}</p>}

              <label className={styles.formLabel}>Rating</label>
              <select className={styles.formInput} value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★ Good</option>
                <option value="3">★★★ Okay</option>
                <option value="2">★★ Poor</option>
                <option value="1">★ Bad</option>
              </select>

              <label className={styles.formLabel}>Comment</label>
              <textarea
                className={styles.formInput}
                placeholder="Tell other guests about your stay"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button type="submit" className={styles.submitButton}>Submit review</button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}