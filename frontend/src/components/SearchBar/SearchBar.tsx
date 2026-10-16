import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SearchBar.module.css'

export const SearchBar = () => {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)

  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/hotels?city=${city}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`)
  }

  return (
    <form className={styles.bar} onSubmit={handleSearch}>
      <div className={styles.field}>
        <label htmlFor="city">Location</label>
        <input
          id="city"
          type="text"
          placeholder="Where are you going?"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="checkIn">Check-in</label>
        <input
          id="checkIn"
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="checkOut">Check-out</label>
        <input
          id="checkOut"
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="guests">Guests</label>
        <select id="guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={styles.button}>Search</button>
    </form>
  )
}