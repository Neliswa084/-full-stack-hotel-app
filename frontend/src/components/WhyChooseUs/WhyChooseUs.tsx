import { FiHome, FiTag, FiShield, FiHeadphones } from 'react-icons/fi'
import styles from './WhyChooseUs.module.css'

const reasons = [
  {
    icon: <FiHome />,
    title: 'Handpicked stays',
    text: 'Every hotel is checked for comfort, cleanliness and great service.',
  },
  {
    icon: <FiTag />,
    title: 'Budget-friendly',
    text: "Lovely stays that don't break the bank , see the full price before you book.",
  },
  {
    icon: <FiShield />,
    title: 'Secure payments',
    text: 'Pay safely online , your card details are never stored by us.',
  },
  {
    icon: <FiHeadphones />,
    title: 'Here to help',
    text: 'Get booking updates and friendly support whenever you need it.',
  },
]

export const WhyChooseUs = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Why choose us</h2>

      <div className={styles.grid}>
        {reasons.map((reason) => (
          <div key={reason.title} className={styles.item}>
            <div className={styles.iconCircle}>{reason.icon}</div>
            <h3 className={styles.title}>{reason.title}</h3>
            <p className={styles.text}>{reason.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}