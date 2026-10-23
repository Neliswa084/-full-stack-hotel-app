import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchHotelById } from '../../redux/reducers/hotelSlice'
import styles from './HotelDetails.module.css'
import { ArrowLeft } from 'lucide-react';
import { fetchPhotos } from '../../redux/reducers/photosSlice'
import { fetchRooms } from '../../redux/reducers/roomsSlice'
import { fetchHotelAmenities } from '../../redux/reducers/amenitiesSlice'
import { fetchReviews, addReview } from '../../redux/reducers/reviewsSlice'


export const HotelDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedHotel, loading, error } = useSelector((state: RootState) => state.hotels)

  const { photos } = useSelector((state: RootState) => state.photos)
  const { rooms } = useSelector((state: RootState) => state.rooms)
  const { hotelAmenities } = useSelector((state: RootState) => state.amenities)
  const { reviews, average, total, error: reviewError } = useSelector((state: RootState) => state.reviews)
  const { currentUser } = useSelector((state: RootState) => state.login)

  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')



  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    dispatch(fetchHotelById(id!))
    dispatch(fetchPhotos(id!))
    dispatch(fetchRooms(id!))
    dispatch(fetchHotelAmenities(id!))
    dispatch(fetchReviews(id!))
    setActivePhoto(0)
  }, [dispatch, id])

  const handleReviewSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const result = await dispatch(addReview({ hotelId: id!, rating: Number(rating), comment }))

  if (result.meta.requestStatus === 'fulfilled') {
    setRating('5')
    setComment('')
    dispatch(fetchReviews(id!))
  }
}
  if (loading) return <p className={styles.message}>Loading...</p>
  if (error) return <p className={styles.message}>{error}</p>
  if (!selectedHotel) return null

  const alreadyReviewed = reviews.some((review) => review.user_id === currentUser?.id)

  const mapAddress = encodeURIComponent(`${selectedHotel.address}, ${selectedHotel.city}`)

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={18} className={styles.icon} aria-hidden="true" />
        Back to hotels
      </Link>

      <h1 className={styles.name}>{selectedHotel.name}</h1>
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