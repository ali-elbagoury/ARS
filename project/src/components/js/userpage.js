import React from 'react'
import styles from '../css/user.module.css';
import user1 from '../../assets/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg'
import user2 from '../../assets/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg'
import user3 from '../../assets/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg'



function userpage() {
  return (
    <div className={styles.container}>
        <div className={styles.user}>
        <img src={user1}></img>
        <img src={user2}></img>
        <img src={user3}></img>

        </div>
      
    </div>
  )
}

export default userpage
