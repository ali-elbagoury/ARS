import React from 'react'
import styles from '../css/login.module.css'
import netflix from '../../assets/net.png'

function login() {
 
  return(
   
    <div className={styles.container1}>
          <div className={styles.navbar}>
                <img className={styles.logo} src={netflix}></img>
                <select className={styles.dropmenu} > <option value="en">English</option> <option value="ar">العربية</option> </select>
                <button className={styles.signup}>Sign In</button>
          </div>
          <div className={styles.midsection}>
           
                <h1 className={styles.text}>Unlimited Movies, TV</h1>
                <h1 className={styles.text2}>shows ,and more</h1>
            
          

          </div>
    </div>
   
);




  
  
}

export default login
