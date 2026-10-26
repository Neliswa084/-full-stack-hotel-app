import { useState } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import styles from './Checkout.module.css'

export const Checkout = () => {
  const location = useLocation()
  const booking = location.state // this means holds everything the Hotel Details page sent: hotel name, room, dates, guests and total.

  const { currentUser } = useSelector((state: RootState) => state.login)

  const [firstName, setFirstName] = useState(currentUser?.first_name || '')
  const [lastName, setLastName] = useState(currentUser?.last_name || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [phone, setPhone] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  // If someone opens /checkout directly, there is nothing to show
  if (!booking) {
    return <Navigate to="/" />
  }

  return (
    <div className={styles.page}>
      <Link to={-1 as any} className={styles.back}>Back</Link>
      <h1 className={styles.title}>Confirm your booking</h1>

      <div className={styles.summary}>
        <h2 className={styles.summaryTitle}>{booking.hotelName}</h2>
        <p className={styles.room}>{booking.roomName}</p>

        <div className={styles.row}>
          <span>Check-in</span>
          <span>{booking.checkIn}</span>
        </div>
        <div className={styles.row}>
          <span>Check-out</span>
          <span>{booking.checkOut}</span>
        </div>
        <div className={styles.row}>
          <span>Guests</span>
          <span>
            {booking.adults} {booking.adults === 1 ? 'adult' : 'adults'}
            {booking.children > 0 && `, ${booking.children} children`}
          </span>
        </div>
        <div className={styles.row}>
          <span>Rooms</span>
          <span>{booking.numberOfRooms}</span>
        </div>
        <div className={styles.row}>
          <span>
            R {booking.pricePerNight} × {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
            {booking.numberOfRooms > 1 && ` × ${booking.numberOfRooms} rooms`}
          </span>
          <span>R {booking.total.toLocaleString('en-ZA')}</span>
        </div>

        <div className={styles.totalRow}>
          <span>Total</span>
          <span>R {booking.total.toLocaleString('en-ZA')}</span>
        </div>
      </div>
      <div className={styles.summary}>
        <h2 className={styles.summaryTitle}>Your details</h2>
        <p className={styles.room}>Who is staying? Change these if you're booking for someone else.</p>

        <div className={styles.twoColumns}>
          <div>
            <label className={styles.label}>First name</label>
            <input className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className={styles.label}>Last name</label>
            <input className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        <label className={styles.label}>Email</label>
        <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label className={styles.label}>Phone (optional)</label>
        <input className={styles.input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label className={styles.label}>Arrival time (optional)</label>
        <select className={styles.input} value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)}>
          <option value="">I don't know yet</option>
          <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
          <option value="Afternoon (12:00 - 17:00)">Afternoon (12:00 - 17:00)</option>
          <option value="Evening (17:00 - 21:00)">Evening (17:00 - 21:00)</option>
          <option value="Late night (after 21:00)">Late night (after 21:00)</option>
        </select>

        <label className={styles.label}>Special requests (optional)</label>
        <textarea
          className={styles.input}
          placeholder="e.g. Ground floor room, extra pillows"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
        />
      </div>
    </div>
  )
}