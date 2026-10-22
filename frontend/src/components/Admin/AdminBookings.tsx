import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import type { Booking } from '../../types/booking'
import { fetchAllBookings, updateBookingStatus } from '../../redux/reducers/adminBookingsSlice'
import styles from './AdminHotels.module.css'

export const AdminBookings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { bookings, loading, error } = useSelector((state: RootState) => state.bookings)

  const [filter, setFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    dispatch(fetchAllBookings())
  }, [dispatch])

  // Only show bookings that match the filter
  const filteredBookings =
    filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter)

  const openModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setStatus(booking.status)
  }

  const closeModal = () => {
    setSelectedBooking(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBooking) return

    const result = await dispatch(updateBookingStatus({ id: selectedBooking.id, status }))

    if (result.meta.requestStatus === 'fulfilled') {
      closeModal()
      dispatch(fetchAllBookings())
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Bookings</h1>

        <select className={styles.filter} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All bookings</option>
          <option value="awaiting_payment">Awaiting payment</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Loading...</p>}

      <div className={styles.panel}>
        {filteredBookings.length === 0 ? (
          <p>No bookings found.</p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.booking_reference}</td>
                  <td>{booking.guest_first_name} {booking.guest_last_name}</td>
                  <td>{booking.hotel_name}</td>
                  <td>{booking.check_in_date}</td>
                  <td>{booking.check_out_date}</td>
                  <td>R {booking.total_amount}</td>
                  <td>
                    <span className={styles[booking.status]}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <button className={styles.editButton} onClick={() => openModal(booking)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== Manage modal ===== */}
      {selectedBooking && (
        <div className={styles.overlay}>
          <form className={styles.modal} onSubmit={handleSave}>
            <h2>Booking {selectedBooking.booking_reference}</h2>

            <label>Guest</label>
            <input value={`${selectedBooking.guest_first_name} ${selectedBooking.guest_last_name}`} disabled />

            <label>Email</label>
            <input value={selectedBooking.guest_email} disabled />

            <label>Hotel & room</label>
            <input value={`${selectedBooking.hotel_name} — ${selectedBooking.room_name}`} disabled />

            <label>Dates</label>
            <input value={`${selectedBooking.check_in_date} to ${selectedBooking.check_out_date}`} disabled />

            <label>Guests</label>
            <input
              value={`${selectedBooking.number_of_adults} adults, ${selectedBooking.number_of_children} children, ${selectedBooking.number_of_rooms} room(s)`}
              disabled
            />

            <label>Payment</label>
            <input value={`R ${selectedBooking.total_amount} — ${selectedBooking.payment_method.replace(/_/g, ' ')}`} disabled />

            {selectedBooking.special_requests && (
              <>
                <label>Special requests</label>
                <textarea value={selectedBooking.special_requests} disabled />
              </>
            )}

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="awaiting_payment">Awaiting payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className={styles.modalButtons}>
              <button type="button" className={styles.cancelButton} onClick={closeModal}>
                Close
              </button>
              <button type="submit" className={styles.addButton}>
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}