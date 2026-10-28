import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchHotels } from '../../redux/reducers/hotelSlice'
import { HotelCard } from '../HotelCard/HotelCard'
import styles from './Hotels.module.css'

export const Hotels = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams] = useSearchParams()
  const { hotels, loading, error } = useSelector((state: RootState) => state.hotels)

  // If the landing page search sends ?location=..., it fills this in
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [maxPrice, setMaxPrice] = useState('')
  const [minStars, setMinStars] = useState('0')
  const [minRating, setMinRating] = useState('0')
  const [sortBy, setSortBy] = useState('recommended')

  useEffect(() => {
    dispatch(fetchHotels())
  }, [dispatch])

  const filtered = useMemo(() => {
    const search = location.trim().toLowerCase()

    const result = hotels.filter((hotel) => {
      const price = hotel.price_from ? Number(hotel.price_from) : null
      const rating = hotel.average_rating ? Number(hotel.average_rating) : 0

      if (search && !`${hotel.name} ${hotel.city}`.toLowerCase().includes(search)) return false
      if (maxPrice && (price === null || price > Number(maxPrice))) return false
      if (hotel.star_rating < Number(minStars)) return false
      if (rating < Number(minRating)) return false
      return true
    })

    if (sortBy === 'price_low') {
      result.sort((a, b) => Number(a.price_from ?? Infinity) - Number(b.price_from ?? Infinity))
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => Number(b.price_from ?? 0) - Number(a.price_from ?? 0))
    } else if (sortBy === 'rating') {
      result.sort((a, b) => Number(b.average_rating ?? 0) - Number(a.average_rating ?? 0))
    }

    return result
  }, [hotels, location, maxPrice, minStars, minRating, sortBy])

  const clearFilters = () => {
    setLocation('')
    setMaxPrice('')
    setMinStars('0')
    setMinRating('0')
    setSortBy('recommended')
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>All hotels</h1>

      <div className={styles.layout}>
        <aside className={styles.filters}>
          <div className={styles.filterHeader}>
            <h2 className={styles.filterTitle}>Filters</h2>
            <button type="button" className={styles.clear} onClick={clearFilters}>Clear all</button>
          </div>

          <label className={styles.label}>Location or hotel name</label>
          <input
            className={styles.input}
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label className={styles.label}>Max price per night (R)</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            placeholder="e.g. 1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <label className={styles.label}>Hotel stars</label>
          <select className={styles.input} value={minStars} onChange={(e) => setMinStars(e.target.value)}>
            <option value="0">Any</option>
            <option value="2">2+ stars</option>
            <option value="3">3+ stars</option>
            <option value="4">4+ stars</option>
          </select>

          <label className={styles.label}>Guest rating</label>
          <select className={styles.input} value={minRating} onChange={(e) => setMinRating(e.target.value)}>
            <option value="0">Any</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </aside>

        <section className={styles.results}>
          <div className={styles.resultsTop}>
            <p className={styles.count}>
              {filtered.length} {filtered.length === 1 ? 'hotel' : 'hotels'} found
            </p>

            <select className={styles.sort} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="price_low">Price: low to high</option>
              <option value="price_high">Price: high to low</option>
              <option value="rating">Best rated</option>
            </select>
          </div>

          {loading && <p className={styles.message}>Loading hotels...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p className={styles.message}>No hotels match your filters</p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className={styles.grid}>
              {filtered.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}