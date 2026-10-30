import { useState } from 'react'
import styles from './Contact.module.css'

export const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Contact us</h1>
      <p className={styles.intro}>Have a question about a booking? Send us a message.</p>

      <div className={styles.layout}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Get in touch</h2>
          <p><strong>Email:</strong> support@budgiestays.co.za</p>
          <p><strong>Phone:</strong> 031 000 0000</p>
          <p><strong>Hours:</strong> Mon to Fri, 08:00 to 17:00</p>
        </div>

        <div className={styles.box}>
          {sent ? (
            <div className={styles.thanks}>
              <h2 className={styles.boxTitle}>Thank you!</h2>
              <p>We got your message and will reply soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className={styles.label}>Name</label>
              <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />

              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <label className={styles.label}>Message</label>
              <textarea className={styles.input} value={message} onChange={(e) => setMessage(e.target.value)} required />

              <button type="submit" className={styles.button}>Send message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}