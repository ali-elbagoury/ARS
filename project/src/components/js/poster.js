import React from 'react';
import styles from '../css/poster.module.css';
import image from '../../assets/money-heist-netflix-144238.jpg';

function Card({ film }) {
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <img src={image} className={styles.img} alt={film.name} />
      </div>
      <h1 className={styles.text}>{film.name}</h1>
    </div>
  );
}

export default Card;
