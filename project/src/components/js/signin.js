import React from 'react'

function signin() {
  return (
    <div>
        <div className={styles.midsection2}>
          <input type="text" id="email-field" placeholder="Email address" className={styles.box} value={email} onChange={validateEmail} style={{ borderColor: isValid ? 'initial' : '#ad5456' }} />
          <button className={styles.getstarted}>Get Started</button>
          {!isValid && (
            <p id="email-error" style={{ color: '#ad5456', display: "block", position: "absolute", marginLeft: '590px', marginTop: '55px' }}>Invalid email address</p>
          )}
        </div>
    </div>
  )
}

export default signin
