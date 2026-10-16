import heroImage from '../../assets/hotelHeroImage.jpg'
import { SearchBar } from '../SearchBar/SearchBar'
import styles from './Hero.module.css'

export const Hero = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.hero}>
        <img className={styles.image} src={heroImage} alt="Hotel with a pool at dusk" />
        <div className={styles.overlay}></div>

        <div className={styles.content}>
          <div>
            <h1 className={styles.title}>
              Cute stays,<br />smart prices
            </h1>
            <p className={styles.subtitle}>
              Find cosy, budget-friendly hotels across South Africa — book in minutes
              and save more for the fun part of your trip.
            </p>
          </div>

          <SearchBar />
        </div>
      </div>
    </section>
  )
}