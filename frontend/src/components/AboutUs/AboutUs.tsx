import styles from './AboutUs.module.css'

export const AboutUs = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>About Budgie Stays</h1>
      <p className={styles.intro}>
        Budgie Stays helps you find cosy, budget-friendly hotels across South Africa.
        Search, compare and book in minutes, and pay safely online.
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Handpicked stays</h2>
          <p>Every hotel on our site is checked for comfort, cleanliness and good service.</p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Budget-friendly</h2>
          <p>You see the full price before you book, so there are no surprises later.</p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Secure payments</h2>
          <p>Pay online with Paystack, or choose to pay at the hotel when you arrive.</p>
        </div>
      </div>
    </div>
  )
}