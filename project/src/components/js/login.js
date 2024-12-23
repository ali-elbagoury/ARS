import React, { useState } from 'react';
import styles from '../css/login.module.css';
import netflix from '../../assets/net.png';
import Card from '../js/card'
function Login() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    const emailRegex = /^[^\s@]+@[^\s@(0-9)]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(emailInput));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container1}>
        <div className={styles.navbar}>
          <img className={styles.logo} src={netflix} alt="Netflix Logo" />
          <select className={styles.dropmenu}>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <button className={styles.signup}>Sign In</button>
        </div>
        <div className={styles.midsection}>
          <h1 className={styles.text}>Unlimited Movies, TV</h1>
          <h1 className={styles.text2}>shows, and more</h1>
          <h1 className={styles.text3}>Starts at EGP 70. Cancel anytime.</h1>
          <h1 className={styles.text4}>
            Ready to watch? Enter your email to create or restart your membership.
          </h1>
        </div>

        <div className={styles.midsection2}>
          <input type="text" id="email-field"placeholder="Email address" className={styles.box} value={email} onChange={validateEmail} style={{ borderColor: isValid ? 'initial' : '#ad5456' }} />
          <button className={styles.getstarted}>Get Started</button>
          {!isValid && (
            <p id="email-error" style={{ color: '#ad5456',display:"block",position:"absolute",marginLeft:'590px',marginTop:'55px' }}>Invalid email address</p>
          )}
        </div>
      </div>
      <div className={styles.container2}>
                  <h1 className={styles.trend}>Trending Now</h1>
                  <div className={styles.dropdown}>
                  <select className={styles.dropmenu1}>
                  <option value="en">Egypt</option>
                  <option value="ar">Global</option>
                  </select>
                  <select className={styles.dropmenu2}>
                  <option value="en">Movies</option>
                  <option value="ar">TV Shows</option>
                  </select>
                  <Card/> <Card/> <Card/>
                  </div>
      </div>
    </div>
  );
}

export default Login;
