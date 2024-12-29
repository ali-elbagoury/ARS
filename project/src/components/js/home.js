import React from 'react'
import styles from '../css/home.module.css'
import Poster from '../../assets/lacasa.jpg'
import netflix from '../../assets/net.png';

function home() {
  return (
    <div>
        <div className={styles.container}>
      <div className={styles.nav}>
        <img src={netflix} className={styles.logo}></img>
        <ul className={styles.navtext}>
        <li className={styles.text}>Home</li>
        <li className={styles.text}>Series</li>
        <li className={styles.text}>Films</li>
        <li className={styles.text}>Recently Added</li>
        <li className={styles.text}>My List</li>

        </ul>

      </div>

      </div>
    </div>
  )
}

export default home
