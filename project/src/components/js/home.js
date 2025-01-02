import React from 'react'
import styles from '../css/home.module.css'
import Poster from '../../assets/lacasa.jpg'
import netflix from '../../assets/net.png';
import search from '../../assets/search-icon.png'
import user from '../../assets/user.jpg'

function home() {
  return (<div className={styles.page}>
     <div className={styles.container1}>
        <div className={styles.container2}>
          <div className={styles.nav}>
        <img src={netflix} className={styles.logo}></img>
        <ul className={styles.navtext}>
        <li className={styles.text}>Home</li>
        <li className={styles.text}>Series</li>
        <li className={styles.text}>Films</li>
        <li className={styles.text}>Recently Added</li>
        <li className={styles.text}>My List</li>
        </ul>
            <div className={styles.icons}>
                <img src={search} className={styles.search}></img>
                <img src={user} className={styles.user}></img>
             </div>

          </div>
      

        </div>
     
      

    </div>
    </div>
      
  
  )
}

export default home
