import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../redux/store'
import { fetchAdminHotels } from '../redux/reducers/adminHotelsSlice'
import { ManageRooms } from '../components/Admin/ManageRooms'
import { ManagePhotos } from '../components/Admin/ManagePhotos'
import { ManageAmenities } from '../components/Admin/ManageAmenities'
import styles from '../components/Admin/ManageHotel.module.css'

export const AdminManageHotelPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { hotels } = useSelector((state: RootState) => state.adminHotels)

  useEffect(() => {
    if (hotels.length === 0) {
      dispatch(fetchAdminHotels())
    }
  }, [dispatch, hotels.length])

  const hotel = hotels.find((h) => h.id === Number(id))

  return (
    <div>
      <Link to="/admin/hotels" className={styles.backLink}> Back to accommodations</Link>
      <h1 className={styles.title}>{hotel ? hotel.name : 'Manage hotel'}</h1>

      <ManageRooms hotelId={id!} />
      <ManagePhotos hotelId={id!} />
      <ManageAmenities hotelId={id!} />
    </div>
  )
}