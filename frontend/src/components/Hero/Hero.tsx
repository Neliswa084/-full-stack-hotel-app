import { useNavigate } from 'react-router-dom'
import heroImage from '../../assets/hotelHeroImage.jpg'
import styles from './Hero.module.css'

export const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className={styles.hero}>
      <img className={styles.image} src={heroImage} alt="Hotel with a pool at sunset" />

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <span className={styles.badge}>Budget-friendly stays</span>
        <h1 className={styles.title}>
          Cosy hotels,<br />happy budgets
        </h1>
        <p className={styles.subtitle}>
          Find clean, comfortable rooms across South Africa at prices that make sense.
        </p>
        <button className={styles.button} onClick={() => navigate('/hotels')}>
          Explore hotels
        </button>
      </div>
    </section>
  )
}