import React from 'react'
import Link from 'next/link'
import GrayButton from '@components/buttons/gray-button'
import Image from 'next/image'
import styles from './styles.module.scss'

const DAOCard = ({
  daoName,
  image,
  tags,
  borderColor,
  linkName
}) => {
  
  return (
    <div className={styles.realmInfoCardwrapper}>
      <div className={styles.title}>
        { daoName } DAO
      </div>
      <div className={styles.tagsWrapper}>
      { 
        tags && tags.map(item => {
          return (
            <div className={styles.tag} key={item}>
              {
                item
              }
            </div>
          )
        })
      }
      </div>
      <div className={styles.imageWrapper} style={{
        background: `${borderColor}`
      }}>
        <Image
          className={styles.imageContent}
          src={image}
          width={580}
          height={580}
        />
      </div>
      <div className={styles.buttonWrapper}>
        <Link
          href={`/dao/${linkName}`}
        >
          <a>
            <GrayButton text={'Join'} />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default DAOCard
