import React, { useState } from 'react';
import styles from '../css/home.module.css';
import netflix from '../../assets/net.png';
import search from '../../assets/search-icon.png';
import user from '../../assets/user.jpg';

function Home() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const toggle = (index) => {
    setSelectedIndex(index );
  };

  const navItems = ['Home', 'Series', 'Films', 'Recently Added', 'My List'];

  return (
    <div className={styles.page}>
      <div className={styles.container1}>
        <div className={styles.container2}>
          <div className={styles.nav}>
            <img src={netflix} className={styles.logo} alt="Netflix Logo" />
            <ul className={styles.navtext}>
              {navItems.map((text, index) => (
                <li className={styles.text} onClick={() => toggle(index)} style={{ color: selectedIndex == index ? 'red' : 'white' }}>
                  {text}
                </li>
              ))}
            </ul>
            <div className={styles.icons}>
              <img src={search} className={styles.search} alt="Search Icon" />
              <img src={user} className={styles.user} alt="User Icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
