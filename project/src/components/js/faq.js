import React, { useState } from 'react';
import styles from '../css/faq.module.css';

const FAQ = () => {
  const [isHidden, setIsHidden] = useState(true);

  const handleClick = () => {
    
    setIsHidden(!isHidden);
  };

  return (
    <div className={styles.container1}>
    <div className={styles.container2} onClick={handleClick}>
      <h1 className={styles.text} >Frequently Asked Questions</h1>
 
    </div>
    <div className={styles.container3} style={{ display: isHidden ? 'none' : 'block' }}>

    <h1>ysg</h1>

</div>
    </div>
  );
};

export default FAQ;
