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
import { CheckoutPage } from './pages/CheckoutPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PaymentPage } from './pages/PaymentPage'
import { AboutUsPage } from './pages/AboutUsPage'
import { ContactPage } from './pages/ContactPage'
import { ProfilePage } from './pages/ProfilePage'

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
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/payment/callback" element={<PaymentPage />} />

        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      
        <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default App