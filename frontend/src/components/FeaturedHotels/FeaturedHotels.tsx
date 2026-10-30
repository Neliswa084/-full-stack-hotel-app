import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchHotels } from '../../redux/reducers/hotelSlice'
import { HotelCard } from '../HotelCard/HotelCard'
import styles from './FeaturedHotels.module.css'

export const FeaturedHotels = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { hotels, loading, error } = useSelector((state: RootState) => state.hotels)

  useEffect(() => {
    dispatch(fetchHotels())
  }, [dispatch])

  const featured = hotels.slice(0, 4)

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Featured hotels</h2>
      <p className={styles.subheading}>
        Cosy little hotels our guests love , at prices you'll love too
      </p>
      <Link to="/hotels" className={styles.viewAll}>View all hotels</Link>

      {loading && <p className={styles.message}>Loading hotels...</p>}

      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && featured.length === 0 && (
        <p className={styles.message}>No hotels yet check back soon</p>
      )}

      {!loading && !error && featured.length > 0 && (
        <div className={styles.grid}>
          {featured.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </section>
  )
}