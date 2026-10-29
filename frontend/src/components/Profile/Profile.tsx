
import React, { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { logout  ,updateProfile} from '../../redux/reducers/loginSlice'
import { useNavigate ,Navigate } from 'react-router-dom'
import type {AppDispatch, RootState } from '../../redux/store'
import { fetchUserBooking } from '../../redux/reducers/bookingSlice'


type ProfileTab = 'profile' | 'bookings' | 'favourites'
const formatDate = (date: string) =>
  new Date(date.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

const statusLabels: Record<string, string> = {
  awaiting_payment: 'Awaiting payment',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const currentUser = useSelector((state: RootState) => state.login.currentUser)
  const profileError = useSelector((state: RootState) => state.login.error)
  const bookings = useSelector((state: RootState) => state.bookingGuest.bookings)

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    first_name: currentUser?.first_name ?? '',
    last_name: currentUser?.last_name ?? '',
    email: currentUser?.email ?? '',
    phone_number: currentUser?.phone_number ?? '',
  })

  const [formData, setFormData] = useState(profile)


  useEffect(() => {
    dispatch(fetchUserBooking())
  }, [dispatch])
  
  useEffect(() => {
    const updatedProfile = {
      first_name: currentUser?.first_name ?? '',
      last_name: currentUser?.last_name ?? '',
      email: currentUser?.email ?? '',
      phone_number: currentUser?.phone_number ?? '',
    }

    setProfile(updatedProfile)
    setFormData(updatedProfile)
  }, [currentUser])

    if (!currentUser) {
    return <Navigate to="/login" />
  }

  const initials =
    `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`
      .toUpperCase() || 'NN'

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  const result = await dispatch(
    updateProfile({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
    })
  )

  if (result.meta.requestStatus === 'fulfilled') {
    setIsEditing(false)
  }
}

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{initials}</div>

            <p className={styles.fullName}>
              {profile.first_name} {profile.last_name}
            </p>

            <p className={styles.email}>{profile.email}</p>
          </div>

          <nav className={styles.nav}>
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'profile' ? styles.active : ''
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <span></span> My Profile
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'bookings' ? styles.active : ''
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              <span></span> My Bookings
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'favourites' ? styles.active : ''
              }`}
              onClick={() => setActiveTab('favourites')}
            >
              <span></span> Favourites
            </button>
          </nav>

          <button
            type="button"
            className={styles.logout}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          {activeTab === 'profile' && (
            <>
              <h1 className={styles.pageTitle}>My profile</h1>

              <section className={styles.section}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileIdentity}>
                    <div className={styles.largeAvatar}>
                      {initials}
                    </div>

                    <div>
                      <h2 className={styles.profileName}>
                        {profile.first_name} {profile.last_name}
                      </h2>
                      <p className={styles.memberText}>
                        Your Budgie Stays account
                      </p>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => {
                        setFormData(profile)
                        setIsEditing(true)
                      }}
                    >
                       Edit profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave}>
                    <div className={styles.grid}>
                      <div className={styles.field}>
                        <label htmlFor="first_name" className={styles.label}>
                          First name
                        </label>
                        <input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className={styles.input}
                          required
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="last_name" className={styles.label}>
                          Last name
                        </label>
                        <input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className={styles.input}
                          required
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>
                          Email address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          className={styles.input}
                          disabled
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="phone_number" className={styles.label}>
                          Cell phone number
                        </label>
                        <input
                          id="phone_number"
                          name="phone_number"
                          type="tel"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className={styles.input}
                        />
                      </div>
                    </div>

                    {profileError && <p className={styles.error}>{profileError}</p>}

                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>

                      <button type="submit" className={styles.saveBtn}>
                        Save changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.grid}>
                    <div className={styles.field}>
                      <span className={styles.label}>First name</span>
                      <p className={styles.value}>
                        {profile.first_name || 'Not provided'}
                      </p>
                    </div>

                    <div className={styles.field}>
                      <span className={styles.label}>Last name</span>
                      <p className={styles.value}>
                        {profile.last_name || 'Not provided'}
                      </p>
                    </div>

                    <div className={styles.field}>
                      <span className={styles.label}>Email address</span>
                      <p className={styles.value}>
                        {profile.email || 'Not provided'}
                      </p>
                    </div>

                    <div className={styles.field}>
                      <span className={styles.label}>Cell phone number</span>
                      <p className={styles.value}>
                        {profile.phone_number || 'Not provided'}
                      </p>
                    </div>
                  </div>
                )}
              </section>

            </>
          )}

{activeTab === 'bookings' && (
  <section className={styles.section}>
    <h1 className={styles.pageTitle}>My bookings</h1>

    {bookings.length === 0 ? (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}></span>
        <h2>No bookings found</h2>
        <p>You haven't made any bookings yet.</p>
      </div>
    ) : (
      <div className={styles.bookingsList}>
        {bookings.map((booking) => (
          <div key={booking.id} className={styles.bookingCard}>
            <div className={styles.bookingTop}>
              <div>
                <h3 className={styles.bookingHotel}>{booking.hotel_name}</h3>
                <p className={styles.bookingRoom}>{booking.room_name}</p>
              </div>
              <span className={`${styles.badge} ${styles[booking.status]}`}>
                {statusLabels[booking.status]}
              </span>
            </div>

            <div className={styles.bookingRow}>
              <span>Check-in</span>
              <span>{formatDate(booking.check_in_date)}</span>
            </div>
            <div className={styles.bookingRow}>
              <span>Check-out</span>
              <span>{formatDate(booking.check_out_date)}</span>
            </div>
            <div className={styles.bookingRow}>
              <span>Total</span>
              <span>R {Number(booking.total_amount).toLocaleString('en-ZA')}</span>
            </div>

            <p className={styles.bookingRef}>Reference: {booking.booking_reference}</p>
          </div>
        ))}
      </div>
    )}
  </section>
)}
          {activeTab === 'favourites' && (
            <section className={styles.section}>
              <h1 className={styles.pageTitle}>My favourites</h1>
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}></span>
                <h2>Your favourite hotels</h2>
                <p>
                  Hotels you save will appear here when your favourites
                  data is connected.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
