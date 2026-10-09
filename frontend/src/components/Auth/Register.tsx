import React from 'react'
import { TextInput } from '../UI/Inputs/TextInput'
import { Button } from '../UI/Buttons/Button'
import styles from '../Auth/Auth.module.css'
import { useDispatch ,useSelector } from 'react-redux'
import type { RootState ,AppDispatch } from '../../redux/store'
import {
  setFirstName, setLastName, setPhoneNumber, setEmail, setPassword, registerUserThunk
} from '../../redux/reducers/signUpSlice'
import { useNavigate } from 'react-router-dom'



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
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Register</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <TextInput
         label="First name" 
         name="firstName" 
         value={first_name}
          onChange={(e) => dispatch(setFirstName(e.target.value))} 
          />

        <TextInput
         label="Last name"
          name="lastName" 
          value={last_name}
          onChange={(e) => dispatch(setLastName(e.target.value))} 
          />

        <TextInput 
        label="Phone Number" 
        name="phoneNumber" 
        type="tel" value={phone_number}
        onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
           />

        <TextInput 
        label="Email address" 
        name="email" 
        type="email" 
        value={email}
        onChange={(e) => dispatch(setEmail(e.target.value))} 
        />

        <TextInput 
        label="Password" 
        name="password" 
        type="password"
        value={password}
        onChange={(e) => dispatch(setPassword(e.target.value))}
         />

        <Button label={loading ? 'Creating…' : 'Create account'} type="submit" />

        <p className={styles.switchText}>
          Already have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/login')}>Log in</span>
        </p>
      </form>
    </div>
  )
}
