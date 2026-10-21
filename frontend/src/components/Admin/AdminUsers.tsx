import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import type { AdminUser } from '../../types/user'
import { fetchUsers, updateUserStatus } from '../../redux/reducers/adminUsersSlice'
import styles from './AdminHotels.module.css'

export const AdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, error } = useSelector((state: RootState) => state.users)

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [status, setStatus] = useState('active')

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user)
    setStatus(user.account_status)
  }

  const closeModal = () => {
    setSelectedUser(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    const result = await dispatch(updateUserStatus({ id: selectedUser.id, account_status: status }))

    if (result.meta.requestStatus === 'fulfilled') {
      closeModal()
      dispatch(fetchUsers())
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Loading...</p>}

      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number || '-'}</td>
                <td>{user.role}</td>
                <td>
                  <span className={user.account_status === 'active' ? styles.activeStatus : styles.blockedStatus}>
                    {user.account_status}
                  </span>
                </td>
                <td>
                  <button className={styles.editButton} onClick={() => openEditModal(user)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Edit modal ===== */}
      {selectedUser && (
        <div className={styles.overlay}>
          <form className={styles.modal} onSubmit={handleSave}>
            <h2>Edit user</h2>

            <label>First name</label>
            <input value={selectedUser.first_name} disabled />

            <label>Last name</label>
            <input value={selectedUser.last_name} disabled />

            <label>Email</label>
            <input value={selectedUser.email} disabled />

            <label>Phone</label>
            <input value={selectedUser.phone_number || '-'} disabled />

            <label>Account status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>

            <div className={styles.modalButtons}>
              <button type="button" className={styles.cancelButton} onClick={closeModal}>
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