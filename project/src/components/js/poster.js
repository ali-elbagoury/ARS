import React from 'react'
import styles from '../css/poster.module.css'
import image from '../../assets/money-heist-netflix-144238.jpg'

function card() {
  return (
    <div className={styles.container}>
    <div className={styles.contain}>
     <img src={image} className={styles.img}></img>
    </div>
    <h1 className={styles.text}>ddddsssssssssssssssssssssss</h1>
    </div>
  )
}

export default card
