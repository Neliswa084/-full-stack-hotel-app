import React from 'react'
import {useNavigate} from 'react-router-dom'
import { NavBar } from '../components/NavBar/NavBar'
import heroImage from '../assets/hotelHeroImage.jpg'
import { Hero } from '../components/Hero/Hero'



export const LandingPage = () => {

    const navigate = useNavigate()

    const navigateToRegister = () => {
        navigate('/register')
    }
  return (
<>
    <NavBar />
      <Hero />

     </>
  )
}
