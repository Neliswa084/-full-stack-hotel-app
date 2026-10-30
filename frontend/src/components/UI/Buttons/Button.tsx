import styles from './Button.module.css'

import React from 'react'

type ButtonProps = {
  label: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export const Button:React.FC<ButtonProps> = ({label,onClick,type='button',disabled= false}) => {
  return (
     <button
      className={styles.button}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
