import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import { logout } from '../../redux/reducers/loginSlice'
import styles from './AdminLayout.module.css'

export const AdminLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state: RootState) => state.login)

 
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" />
  }

  const handleSignOut = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>BUDGIE STAYS</h2>

        <NavLink to="/admin" end className={({ isActive }) => isActive ? styles.active : styles.link}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/hotels" className={({ isActive }) => isActive ? styles.active : styles.link}>
          Accommodations
        </NavLink>
        <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? styles.active : styles.link}>
          Bookings
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? styles.active : styles.link}>
          Users
        </NavLink>

        <div className={styles.bottom}>
          <NavLink to="/" className={styles.link}>View website</NavLink>
          <button className={styles.link} onClick={handleSignOut}>Sign out</button>
        </div>
      </aside>

      <main className={styles.main}>
        <p className={styles.welcome}>Welcome back, {currentUser.first_name}</p>
        <Outlet />
      </main>
    </div>
  )
}