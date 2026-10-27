import React from 'react'
import styles from './Profile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/reducers/loginSlice'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../redux/store'


export const Profile = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.login.currentUser)

  const initials = currentUser
    ? `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase()
    : 'NN'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <>
      <div className={styles.container}>
    
      <div className={styles.content}>
      <div className={styles.sidebar}>
        <div className={styles.avatar}>{initials}</div>
        <p className={styles.fullName}>
          {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : ''}
        </p>
        <p className={styles.email}>{currentUser?.email}</p>

        <div className={styles.nav}>
          <button className={`${styles.navItem} ${styles.active}`}>My Profile</button>
          <button className={styles.navItem} >My bookings</button>
          <button className={styles.navItem}  >Favourites</button>
        </div>

        <button className={styles.logout} onClick={handleLogout}>Sign out</button>
      </div>
      
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Personal Details</h3>
      <div className={styles.main}>
           <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <p className={styles.value}>{currentUser?.first_name}</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Surname</label>
                <p className={styles.value}>{currentUser?.last_name}</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <p className={styles.value}>{currentUser?.email}</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Cell Phone Number</label>
                <p className={styles.value}>{currentUser?.phone_number}</p>
              </div>
            </div>
      </div>
            </div>
                  </div>
                  </div>
                  </div>

    </>
  )
}

