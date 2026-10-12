import React from 'react'
import styles from './NavBar.module.css'
import { Link } from 'react-router-dom'
import { Button } from '../UI/Buttons/Button'

export const NavBar = () => {
  return (
      <nav>
        <div className={styles.logo}>
            <h1>BUDGIE STAYS</h1>
        </div>
        <div>
           <Link to="/home" className={styles.link}>Home</Link>
           <Link to="/" >Hotels</Link>
           <Link to="/" >About</Link>
           <Link to="/" >Contact</Link>
           
        
        </div>

        <div>
            <button> GET STARTED</button>
        </div>
      </nav>
  )
}
