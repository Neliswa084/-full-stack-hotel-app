import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchHotelById } from '../../redux/reducers/hotelSlice'
import styles from './HotelDetails.module.css'
import { ArrowLeft } from 'lucide-react';
import { fetchPhotos } from '../../redux/reducers/photosSlice'
import { fetchRooms } from '../../redux/reducers/roomsSlice'

export const HotelDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedHotel, loading, error } = useSelector((state: RootState) => state.hotels)

  const { photos } = useSelector((state: RootState) => state.photos)
  const { rooms } = useSelector((state: RootState) => state.rooms)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    dispatch(fetchHotelById(id!))
    dispatch(fetchPhotos(id!))
    dispatch(fetchRooms(id!))
    setActivePhoto(0)
  }, [dispatch, id])

  if (loading) return <p className={styles.message}>Loading...</p>
  if (error) return <p className={styles.message}>{error}</p>
  if (!selectedHotel) return null

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
      </section>
    </div>
  )
}