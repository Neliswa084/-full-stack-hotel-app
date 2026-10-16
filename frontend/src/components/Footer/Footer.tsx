import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          BUDGIE STAYS
        </Link>

        <p className={styles.copy}>
          © {year} Budgie Stays. All rights reserved.
        </p>

        <nav className={styles.links}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact us</Link>
        </nav>
      </div>
    </footer>
  )
}