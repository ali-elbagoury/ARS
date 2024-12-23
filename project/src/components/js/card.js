import React from 'react'
import styles from '../css/card.module.css'
import image from '../../assets/money-heist-netflix-144238.jpg'

function card() {
  return (
    <div className={styles.contain}>

    

     <h1 className={styles.number}>1</h1>
 
     <img src={image} className={styles.img}></img>



    

    </div>
  )
}

export default card
