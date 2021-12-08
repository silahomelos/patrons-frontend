import React from 'react'
import { SocialIcon } from '@components/icons'
import styles from './styles.module.scss'

const RealmSocialBar = props => {
  const { links } = props
  return (
    <div className={styles.realmSocialBarWrapper}>
    {
      links && links.map(link => {
        return (
          <a href={link.link} key={link.name} id={link.name} target='_blank'>
            <SocialIcon name={link.name}/>
          </a>
        )
      })      
    }
    </div>
  )
}

export default RealmSocialBar