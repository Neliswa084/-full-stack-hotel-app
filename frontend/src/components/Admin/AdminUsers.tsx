import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import type { AdminUser } from '../../types/user'
import { useNavigate } from 'react-router-dom'
import { fetchUsers } from '../../redux/reducers/adminUsersSlice'
import styles from './AdminHotels.module.css'


export const AdminUsers = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const { users , loading , error } = useSelector((state: RootState) => state.users)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    return (
         <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Users</h1>
            
            </div>
      <div className={styles.panel}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Role</th>
                             <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) =>(
                            <tr key={user.id}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone_number}</td>
                                 <td>{user.role}</td>
                    
                            </tr>
                        )) }
                    </tbody>
     </table>
            </div>
              </div>
                 
  )
}
