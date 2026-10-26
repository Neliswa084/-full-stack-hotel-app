import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../redux/store'
import { verifyPayment } from '../../redux/reducers/paymentSlice'
import styles from './Payment.module.css'

type Status = 'loading' | 'success' | 'pending' | 'failed'

export const Payment = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()


  const reference = searchParams.get('reference') || searchParams.get('trxref')

  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')
  const [bookingReference, setBookingReference] = useState('')

  // Stops the check from running twice in development (React StrictMode)
  const hasChecked = useRef(false)

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    if (!reference) {
      setStatus('failed')
      setMessage('No payment reference found')
      return
    }

    const check = async () => {
      const result = await dispatch(verifyPayment(reference))

      if (verifyPayment.fulfilled.match(result)) {
        if (result.payload.message === 'Payment successful') {
          setBookingReference(result.payload.booking.booking_reference)
          setStatus('success')
        } else {
          setStatus('pending')
        }
      } else {
        setMessage(result.payload as string)
        setStatus('failed')
      }
    }

    check()
  }, [dispatch, reference])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {status === 'loading' && <h1 className={styles.title}>Checking your payment...</h1>}

        {status === 'success' && (
          <>
            <h1 className={styles.title}>Payment successful!</h1>
            <p>Your booking is confirmed.</p>
            <p>Booking reference: <strong>{bookingReference}</strong></p>
            <Link to="/" className={styles.button}>Back to home</Link>
          </>
        )}

        {status === 'pending' && (
          <>
            <h1 className={styles.title}>Payment is still processing</h1>
            <p>Please wait a moment and refresh this page.</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <h1 className={styles.title}>Payment failed</h1>
            <p className={styles.error}>{message}</p>
            <Link to="/" className={styles.button}>Back to home</Link>
          </>
        )}
      </div>
    </div>
  )
}