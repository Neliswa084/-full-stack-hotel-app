import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import type { Hotel } from '../../types/hotel'
import {
  fetchAdminHotels,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../../redux/reducers/adminHotelsSlice'
import styles from './AdminHotels.module.css'

const emptyHotel: Hotel = {
  name: '',
  description: '',
  address: '',
  city: '',
  star_rating: 3,
  is_visible: true,
}

export const AdminHotels = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { hotels, loading, error } = useSelector((state: RootState) => state.adminHotels)

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<Hotel>(emptyHotel)

  useEffect(() => {
    dispatch(fetchAdminHotels())
  }, [dispatch])

  const openAddModal = () => {
    setForm(emptyHotel)
    setShowModal(true)
  }

  const openEditModal = (hotel: Hotel) => {
    setForm(hotel)
    setShowModal(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.id) {
      await dispatch(updateHotel(form))
    } else {
      await dispatch(createHotel(form))
    }

    setShowModal(false)
    dispatch(fetchAdminHotels())
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return

    await dispatch(deleteHotel(id))
    dispatch(fetchAdminHotels())
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Accommodations</h1>
        <button className={styles.addButton} onClick={openAddModal}>+ Add hotel</button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Loading...</p>}

      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Stars</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>{hotel.city}</td>
                <td>{hotel.star_rating} ★</td>
                <td>{hotel.is_visible ? 'Visible' : 'Hidden'}</td>
                <td>
                  <button className={styles.editButton} onClick={() => openEditModal(hotel)}>Edit</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(hotel.id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Add / Edit modal ===== */}
      {showModal && (
        <div className={styles.overlay}>
          <form className={styles.modal} onSubmit={handleSubmit}>
            <h2>{form.id ? 'Edit hotel' : 'Add hotel'}</h2>

            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />

            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} required />

            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} required />

            <label>Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} />

            <label>Star rating</label>
            <select name="star_rating" value={form.star_rating} onChange={handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
              />
              Visible to guests
            </label>

            <div className={styles.modalButtons}>
              <button type="button" className={styles.cancelButton} onClick={() => setShowModal(false)}>
                Cancel
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