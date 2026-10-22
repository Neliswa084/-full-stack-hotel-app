import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchHotelById } from '../../redux/reducers/hotelSlice'
import styles from './HotelDetails.module.css'

export const HotelDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedHotel, loading, error } = useSelector((state: RootState) => state.hotels)

  useEffect(() => {
    dispatch(fetchHotelById(id!))
  }, [dispatch, id])

  if (loading) return <p className={styles.message}>Loading...</p>
  if (error) return <p className={styles.message}>{error}</p>
  if (!selectedHotel) return null

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>← Back to hotels</Link>

      <h1 className={styles.name}>{selectedHotel.name}</h1>
      <p className={styles.location}>
        {selectedHotel.address}, {selectedHotel.city} · {selectedHotel.star_rating} 
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About this hotel</h2>
        <p className={styles.description}>
          {selectedHotel.description || 'No description yet.'}
        </p>
      </section>
    </div>
  )
}