import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchRooms, addRoom, updateRoom, deleteRoom } from '../../redux/reducers/roomsSlice'
import styles from './ManageHotel.module.css'

const emptyRoom = {
  name: '',
  description: '',
  capacity: '',
  price_per_night: '',
  total_rooms: '',
}

export const ManageRooms = ({ hotelId }: { hotelId: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { rooms, error } = useSelector((state: RootState) => state.rooms)

  const [form, setForm] = useState(emptyRoom)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    dispatch(fetchRooms(hotelId))
  }, [dispatch, hotelId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const room = {
      name: form.name,
      description: form.description,
      capacity: Number(form.capacity),
      price_per_night: Number(form.price_per_night),
      total_rooms: Number(form.total_rooms),
    }

    let result
    if (editingId) {
      result = await dispatch(updateRoom({ id: editingId, room }))
    } else {
      result = await dispatch(addRoom({ hotelId, room }))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      setForm(emptyRoom)
      setEditingId(null)
      dispatch(fetchRooms(hotelId))
    }
  }

  const handleEdit = (room: any) => {
    setForm({
      name: room.name,
      description: room.description || '',
      capacity: room.capacity,
      price_per_night: room.price_per_night,
      total_rooms: room.total_rooms,
    })
    setEditingId(room.id)
  }

  const handleCancel = () => {
    setForm(emptyRoom)
    setEditingId(null)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this room?')) return
    await dispatch(deleteRoom(id))
    dispatch(fetchRooms(hotelId))
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Rooms</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="name" placeholder="Room name e.g. Deluxe Room" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="capacity" type="number" min="1" placeholder="Guests" value={form.capacity} onChange={handleChange} required />
        <input name="price_per_night" type="number" min="0" placeholder="Price per night" value={form.price_per_night} onChange={handleChange} required />
        <input name="total_rooms" type="number" min="0" placeholder="How many rooms" value={form.total_rooms} onChange={handleChange} required />

        <button type="submit" className={styles.primaryButton}>
          {editingId ? 'Save changes' : 'Add room'}
        </button>
        {editingId && (
          <button type="button" className={styles.lightButton} onClick={handleCancel}>Cancel</button>
        )}
      </form>

      {rooms.length === 0 ? (
        <p className={styles.empty}>No rooms yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Guests</th>
              <th>Price / night</th>
              <th>Total rooms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>R {room.price_per_night}</td>
                <td>{room.total_rooms}</td>
                <td>
                  <button className={styles.lightButton} onClick={() => handleEdit(room)}>Edit</button>
                  <button className={styles.dangerButton} onClick={() => handleDelete(room.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}