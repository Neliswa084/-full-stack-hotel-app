import React, { useState } from 'react'
import styles from '../Auth/Auth.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TextInput } from '../UI/Inputs/TextInput'
import { Button } from '../UI/Buttons/Button'
import type { RootState, AppDispatch } from '../../redux/store'
import { loginUser } from '../../redux/reducers/loginSlice'

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  
  const { loading, error } = useSelector((state: RootState) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser({ email, password }))

    if (loginUser.fulfilled.match(result)) {
      
      if (result.payload.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.brandPanel}>
          <Link to="/" className={styles.brand}>BUDGIE STAYS</Link>
          <div>
            {/* <h2 className={styles.brandTitle}>Cute Stays, Smart Prices</h2>
            {/* <ul className={styles.perks}>
              <li>Save the little hotels you love</li>
              <li>Book in minutes</li>
            </ul> */} 
          </div>
        </aside>

        <div className={styles.formPanel}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Link to="/" className={styles.back}>Back to home</Link>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to book hotels and see your favourites</p>

            {error && <p className={styles.error} role="alert">{error}</p>}

            <TextInput label="Email address" name="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <TextInput label="Password" name="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Link to="/forgot-password" className={styles.forgot}>Forgot password?</Link>

            <Button label={loading ? 'Signing in…' : 'Sign in'} type="submit" disabled={loading} />

            <p className={styles.switchText}>
              New to Budgie Stays? <Link to="/register" className={styles.link}>Create an account</Link>
            </p>
            <p className={styles.terms}>By continuing you agree to our Terms and Privacy Policy.</p>
          </form>
        </div>
      </div>
    </div>
  )
}