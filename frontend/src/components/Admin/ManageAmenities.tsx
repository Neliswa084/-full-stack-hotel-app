import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import {
  fetchAllAmenities,
  fetchHotelAmenities,
  saveHotelAmenities,
} from '../../redux/reducers/amenitiesSlice'
import styles from './ManageHotel.module.css'

export const ManageAmenities = ({ hotelId }: { hotelId: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { allAmenities, hotelAmenities, error, saved } = useSelector(
    (state: RootState) => state.amenities
  )

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Load all amenities and this hotel's amenities
  useEffect(() => {
    dispatch(fetchAllAmenities())
    dispatch(fetchHotelAmenities(hotelId))
  }, [dispatch, hotelId])

  // When the hotel's amenities arrive, tick their boxes
  useEffect(() => {
    setSelectedIds(hotelAmenities.map((amenity) => amenity.id))
  }, [hotelAmenities])

  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleSave = () => {
    dispatch(saveHotelAmenities({ hotelId, amenityIds: selectedIds }))
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Amenities</h2>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.amenityGrid}>
        {allAmenities.map((amenity) => (
          <label key={amenity.id} className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={selectedIds.includes(amenity.id)}
              onChange={() => handleToggle(amenity.id)}
            />
            {amenity.name}
          </label>
        ))}
      </div>

      <button className={styles.primaryButton} onClick={handleSave}>Save amenities</button>
      {saved && <p className={styles.message}>Amenities saved ✓</p>}
    </section>
  )
}