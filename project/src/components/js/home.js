import React, { useState } from 'react';
import styles from '../css/home.module.css';
import netflix from '../../assets/net.png';
import search from '../../assets/search-icon.png';
import user from '../../assets/user.jpg';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Card from '../js/poster';

const CustomLeftArrow = ({ onClick }) => (
  <button className={styles.customLeftArrow} onClick={onClick}>
    &#8249; {/* Left arrow symbol */}
  </button>
);

const CustomRightArrow = ({ onClick }) => (
  <button className={styles.customRightArrow} onClick={onClick}>
    &#8250; {/* Right arrow symbol */}
  </button>
);

function Home() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const toggle = (index) => {
    setSelectedIndex(index);
  };

  const navItems = ['Home', 'Series', 'Films', 'Recently Added', 'My List'];
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container1}>
        <div className={styles.container2}>
          <div className={styles.nav}>
            <img src={netflix} className={styles.logo} alt="Netflix Logo" />
            <ul className={styles.navtext}>
              {navItems.map((text, index) => (
                <li
                  key={index}
                  className={styles.text}
                  onClick={() => toggle(index)}
                  style={{ color: selectedIndex == index ? '#e50913' : 'white' }}
                >
                  {text}
                </li>
              ))}
                <div className={styles.icons}>
              <img src={search} className={styles.search} alt="Search Icon" />
              <img src={user} className={styles.user} alt="User Icon" />
            </div>
            </ul>
          
          </div>

          <h1 className={styles.title}>La Casa De Papel</h1>
          <h1 className={styles.desc}>
            "La Casa De Papel," also known as "Money Heist," is a Spanish television series that follows a criminal mastermind known as "The Professor." He plans meticulously executed heists on the Royal Mint of Spain and the Bank of Spain, recruiting a group of eight skilled criminals to help him. Each member of the team adopts a city name as an alias, such as Tokyo and Berlin.
          </h1>
          <div className={styles.buttons}>
            <button className={styles.play}>Play</button>
            <button className={styles.more}>More Info</button>
          </div>
        </div>
      </div>
      <div className={styles.list}>
        <h1 className={styles.listTitle}>Now Playing Movies</h1>

        <Carousel
          responsive={responsive}
          className={styles.caro}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          slidesToSlide={5}
        >
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
