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
                <li className={styles.text} onClick={() => toggle(index)} style={{ color: selectedIndex == index ? '#e50913' : 'white' }}>
                  {text}
                </li>
              ))}
            </ul>
            <div className={styles.icons}>
              <img src={search} className={styles.search} alt="Search Icon" />
              <img src={user} className={styles.user} alt="User Icon" />
            </div>
          </div>

          <h1 className={styles.title}>La Casa De Papel</h1>
          <h1 className={styles.desc}>
          "La Casa De Papel," also known as "Money Heist," is a Spanish television series that follows a criminal mastermind known as "The Professor." He plans meticulously executed heists on the Royal Mint of Spain and the Bank of Spain, recruiting a group of eight skilled criminals to help him. Each member of the team adopts a city name as an alias, such as Tokyo and Berlin.</h1>
          <div className={styles.buttons}>
              <button className={styles.play}>Play</button>
              <button className={styles.more}>More Info</button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
