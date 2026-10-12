import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Register } from './components/Auth/Register'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'

function App() {


  return (
    <>
         <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />


          </Routes>
    </>
  )
}

export default App
