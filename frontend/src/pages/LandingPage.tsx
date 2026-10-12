import React from 'react'
import {useNavigate} from 'react-router-dom'
import { NavBar } from '../components/NavBar/NavBar'


export const LandingPage = () => {

    const navigate = useNavigate()

    const navigateToRegister = () => {
        navigate('/register')
    }
  return (
<>
    <NavBar />
    <div>
        
      <h1>Welcome to Landing Page </h1>
      <button onClick={navigateToRegister}>Get Started</button>
     </div>

     </>
  )
}
