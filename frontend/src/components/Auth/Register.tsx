import React from 'react'
import { TextInput } from '../UI/Inputs/TextInput'
import { Button } from '../UI/Buttons/Button'
import styles from '../Auth/Auth.module.css'




export const Register = () => {
  return (
    <div className={styles.container}>
   <form className={styles.form}>
        <h1>Register</h1>

        <TextInput label='First name' name='firstName' onChange={()=>{}}/>
        <TextInput label= 'Last name' name='lastName' onChange= {() => {}} />
        <TextInput label= 'Phone Number' name='phoneNumber' onChange= {() => {}} />
        <TextInput label= 'Email address' name='email' onChange= {() => {}} />
        <TextInput label= 'Password' name='password' onChange= {() => {}} />
        <Button label="Create account" type="submit" />
          <p className={styles.switchText}>
            Already have an account?{' '}
            <span className={styles.link} onClick={() => {}}>
              Log in
            </span>
            </p>
        
    </form>
</div>


    


  )
}
