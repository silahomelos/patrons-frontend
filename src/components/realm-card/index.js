import React from 'react'
import Link from 'next/link'
import GrayButton from '@components/buttons/gray-button'
import Image from 'next/image'
import styles from './styles.module.scss'

const RealmCard = ({
  realmName,
  image,
  borderColor,
  linkName
}) => {
  
  return (
    <div className={styles.realmInfoCardwrapper}>
      <div className={styles.title}>
        { realmName } Realm
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
          href={`/realm/${linkName}`}
        >
          <a>
            <GrayButton text={'Patron Realm'} />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default RealmCard
