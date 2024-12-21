import React from 'react'
import styles from '../css/login.module.css'
import netflix from '../../assets/net.png'

function login() {

      
          
    
 
  return(
      <div className={styles.page}>
       <div className={styles.container1}>
          <div className={styles.navbar}>
                <img className={styles.logo} src={netflix}></img>
                <select className={styles.dropmenu} > <option value="en">English</option> <option value="ar">العربية</option> </select>
                <button className={styles.signup}>Sign In</button>
          </div>
          <div className={styles.midsection}>
           
                <h1 className={styles.text}>Unlimited Movies, TV</h1>
                <h1 className={styles.text2}>shows ,and more</h1>
                <h1 className={styles.text3}>Starts at EGP 70. Cancel anytime.</h1>
                <h1 className={styles.text4}>Ready to watch? Enter your email to create or restart your membership.</h1>
          </div>

          <div className={styles.midsection2}>

          <input type="text" id="email-field"  placeholder="Email address" className={styles.box}></input>
          <button className={styles.getstarted}>Get Started</button>
         

          </div>
      </div>
       <div className={styles.container2}>

      <h1>gftft</h1>

    </div>


    </div>
   
);




  
  
}

export default login
