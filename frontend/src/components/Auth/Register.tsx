import React from 'react'
 import { TextInput } from '../UI/Inputs/TextInput'
 import {Button} from '../UI/Buttons/Button'
import styles from '../Auth/Auth.module.css'
import { useDispatch ,useSelector } from 'react-redux'
import type { RootState ,AppDispatch } from '../../redux/store'
import {
  setFirstName, setLastName, setPhoneNumber, setEmail, setPassword, registerUserThunk
} from '../../redux/reducers/signUpSlice'
import { Link, useNavigate } from 'react-router-dom'



export const Register = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { first_name, last_name, phone_number, email, password, loading, error } =
    useSelector((state: RootState) => state.signUp)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(registerUserThunk({ first_name, last_name, phone_number, email, password }))
    if (registerUserThunk.fulfilled.match(result)) {
      alert('Account created! Please sign in.')
      navigate('/login')
    }
  }

   return (
    <div className={styles.page}>
      <div className={styles.card}>

        <aside className={styles.brandPanel}>
          <Link to="/" className={styles.brand}>BUDGIE STAYS</Link>
          <div>
            {/* <h2 className={styles.brandTitle}>Join the flock</h2>
            <ul className={styles.perks}>
              <li>Book cosy hotels in a few clicks</li>
              <li>Save your favourite stays</li>
              <li>Keep all your bookings in one place</li>
            </ul> */}
          </div>
        </aside>

        <div className={styles.formPanel}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Link to="/" className={styles.back}>← Back to home</Link>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>It's free and only takes a minute.</p>

            {error && <p className={styles.error} role="alert">{error}</p>}

            <div className={styles.row}>
              <TextInput label="First name" name="firstName" value={first_name}
                onChange={(e) => dispatch(setFirstName(e.target.value))} />
              <TextInput label="Last name" name="lastName" value={last_name}
                onChange={(e) => dispatch(setLastName(e.target.value))} />
            </div>

            <TextInput label="Phone number" name="phoneNumber" type="tel" value={phone_number}
              onChange={(e) => dispatch(setPhoneNumber(e.target.value))} />
            <TextInput label="Email address" name="email" type="email" value={email}
              onChange={(e) => dispatch(setEmail(e.target.value))} />
            <TextInput label="Password" name="password" type="password" value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))} />
            <p className={styles.hint}>At least 8 characters.</p>

            <Button label={loading ? 'Creating…' : 'Create account'} type="submit" disabled={loading} />

            <p className={styles.switchText}>
              Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}
