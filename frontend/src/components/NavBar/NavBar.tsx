import styles from './NavBar.module.css'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.link} ${styles.active}` : styles.link

export const NavBar = () => {
  const { currentUser } = useSelector((state: RootState) => state.login)

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main">
        <Link to="/" className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9v11h14V9" /><path d="M10 20v-6h4v6" />
          </svg>
          BUDGIE STAYS
        </Link>

        <div className={styles.links}>
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/hotels" className={linkClass}>Hotels</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>

        {currentUser ? (
          <Link to="/profile" className={styles.cta}>Profile</Link>
        ) : (
          <Link to="/login" className={styles.cta}>Get Started</Link>
        )}
      </nav>
    </header>
  )
}