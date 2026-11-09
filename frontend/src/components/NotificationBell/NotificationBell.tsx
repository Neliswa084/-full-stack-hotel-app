import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell } from 'lucide-react'
import type { AppDispatch, RootState } from '../../redux/store'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../redux/reducers/notificationsSlice'
import styles from './NotificationBell.module.css'

export const NotificationBell = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser } = useSelector((state: RootState) => state.login)
  const { notifications } = useSelector((state: RootState) => state.notifications)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchNotifications())
    }
  }, [dispatch, currentUser])

  // Only logged-in users see the bell
  if (!currentUser) return null

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.bellButton}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <strong>Notifications</strong>
            {unreadCount > 0 && (
              <button
                type="button"
                className={styles.markAll}
                onClick={() => dispatch(markAllNotificationsRead())}
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className={styles.empty}>No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={notification.is_read ? styles.item : styles.itemUnread}
                onClick={() => {
                  if (!notification.is_read) {
                    dispatch(markNotificationRead(notification.id))
                  }
                }}
              >
                <p className={styles.title}>{notification.title}</p>
                <p className={styles.message}>{notification.message}</p>
                <p className={styles.date}>
                  {new Date(notification.created_at).toLocaleDateString('en-ZA')}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}