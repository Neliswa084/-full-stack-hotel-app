import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchDashboard } from '../../redux/reducers/adminSlice'
import styles from './AdminDashboard.module.css'

export const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { stats, bookings, loading, error } = useSelector((state: RootState) => state.admin)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  if (loading) return <p>Loading...</p>
  if (error) return <p className={styles.error}>{error}</p>

  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>

      {/* Stat cards */}
      <div className={styles.cards}>
        <div className={styles.card} onClick={() => navigate('/admin/hotels')}>
          <p className={styles.cardLabel}>Accommodations</p>
          <p className={styles.cardNumber}>{stats?.hotels}</p>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/users')}>
          <p className={styles.cardLabel}>Users</p>
          <p className={styles.cardNumber}>{stats?.users}</p>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/bookings')}>
          <p className={styles.cardLabel}>Bookings</p>
          <p className={styles.cardNumber}>{stats?.bookings}</p>
        </div>
      </div>

      {/* Recent bookings */}
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Recent bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Guest</th>
                <th>Hotel</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.booking_reference}</td>
                  <td>{booking.guest_first_name} {booking.guest_last_name}</td>
                  <td>{booking.hotel_name}</td>
                  <td>{booking.check_in_date}</td>
                  <td>{booking.check_out_date}</td>
                  <td>R {booking.total_amount}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}