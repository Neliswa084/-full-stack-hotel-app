import React from 'react'
import styles from '../Auth/Auth.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { TextInput } from '../UI/Inputs/TextInput'
import { Button } from '../UI/Buttons/Button'

export const Login = () => {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <aside className={styles.brandPanel}>
                    <Link to="/" className={styles.brand}>BUDGIE STAYS</Link>
                    <div>
                        <h2 className={styles.brandTitle}>Cute Stays, Smart Prices</h2>
                        <ul className={styles.perks}>
                            <li>Save the little hotels you love</li>
                            <li>Book in minutes</li>
                        </ul>
                    </div>
                </aside>

                <div className={styles.formPanel}>
                    <form className={styles.form}>
                        <Link to="/" className={styles.back}> Back to home</Link>
                        <h1 className={styles.title}>Welcome back</h1>
                        <p className={styles.subtitle}>Sign in to book hotels and see your favourites</p>


                        <TextInput label="Email address" name="email" value={""} onChange={() => { }} />
                        <Link to="/changePassword" >Forgot password?</Link>
                        <TextInput label="Password" name="password" value={""} onChange={() => { }} />


                        <Button label={'Sign In'} type="submit" />
                        <p className={styles.switchText}>
                        New to Budgie Stays? <Link to="/register" className={styles.link}>Create an account</Link>
                        </p>
                        <p>By continuing you agree to our Terms and Pricacy Policy</p>


                    </form>

                </div>


            </div>
        </div>

    )
}
