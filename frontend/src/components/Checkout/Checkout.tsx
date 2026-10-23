import { useLocation, Navigate, Link } from 'react-router-dom'
import styles from './Checkout.module.css'

export const Checkout = () => {
  const location = useLocation()
  const booking = location.state // this means holds everything the Hotel Details page sent: hotel name, room, dates, guests and total.

  // If someone opens /checkout directly, there is nothing to show
  if (!booking) {
    return <Navigate to="/" />
  }

  return (
    <div className={styles.page}>
      <Link to={-1 as any} className={styles.back}>Back</Link> // means “go back one page”, like the browser’s back button. It returns to the hotel they were booking.
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
    </div>
  )
}