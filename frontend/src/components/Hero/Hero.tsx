import React from 'react'
import heroImage from '../../assets/hotelHeroImage.jpg'
import './Hero.module.css'

export const Hero = () => {
  return (
    <div className="hero-container">
      <img className="hero-image" src={heroImage} alt="Hotel Hero" />
    </div>
  )
}
