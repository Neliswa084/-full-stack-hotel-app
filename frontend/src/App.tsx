import './App.css'
import { Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { AdminLayout } from './components/Admin/AdminLayout'
import { AdminPage } from './pages/AdminPage'
import { AdminHotelsPage } from './pages/AdminHotelsPage'
import {AdminManageHotelPage} from './pages/AdminManageHotelPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import {AdminBookingsPage } from './pages/AdminBookingsPage'
import {HotelDetailsPage} from './pages/HotelDetailsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
        <Route path="hotels" element={<AdminHotelsPage />} />
        <Route path="hotels/:id" element={<AdminManageHotelPage />} />
        <Route path="users" element= {<AdminUsersPage />} />
        <Route path="bookings" element= {<AdminBookingsPage />} />
      </Route>
      
        <Route path="hotels/:id" element={<HotelDetailsPage />} />
      

    </Routes>
  )
}

export default App