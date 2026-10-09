import React from 'react'
import styles from './Input.module.css'

type InputProps ={
    id?: string,
    value?: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    style?: React.CSSProperties,
    label: string,
    error?: string,
    name?: string,
    type?: string
}
export const TextInput:React.FC<InputProps> = ({id, value, onChange, style, label, error, name, type = 'text'}) => {
  return (
   <div className={styles['input-container']}>
       <label className={styles['input-label']}>{label}</label>
       <input name={name} type={type} id={id} style={style} value={value} onChange={onChange} className={styles.input}/>
       {error && <span className={styles['input-error']}>{error}</span>}
    </div>
  )
}
