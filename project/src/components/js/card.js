import React from 'react'
import styles from '../css/card.module.css'
import image from '../../assets/money-heist-netflix-144238.jpg'

function card(data) {
  return (
    <div className={styles.contain}>

    

     
 
     <img src={image} className={styles.img}></img>
     <h1 className={styles.number}>{data.number}</h1>



    

    </div>
  )
}

export default card
