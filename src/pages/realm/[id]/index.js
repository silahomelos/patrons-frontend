import React, { memo } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
// import Container from '@components/container'
import styles from './styles.module.scss'

const RealmPage = () => {
  const router = useRouter()
  const { id } = router.query
  console.log('id: ', id)
  return (
    <div className={styles.realmPageWrapper}>
      
      <div className={styles.pageTitle}>
        Designer Realm
      </div>
      <div className={styles.designerName}>
        Designer Name
      </div>
      <div className={styles.designerPhotoWrapper}>
        <Image
          src='/images/realm-avatars/realm_alana.png'
          width={580}
          height={580}
        />
      </div>
      <div className={styles.description}>
        Phoebe Heess is a hi-tech fashion lab working with innovative materials and wearables. Think James Bond’s Q, but for all black sportswear. You might have read about them developing the blackest t-shirt in the world. Or when they did a black shirt that doesn’t heat up under the sun. 

        Phoebe is a seasoned sportswear designer that has previously collaborated with startups, and also large corps like Adidas. Gabriel is the former Head of Digital at Vice, and has also worked for digital innovation business consultancies.
      </div>
      <div className={styles.subTitle}>
        Key Insights
      </div>
    </div>
  )
}

export default memo(RealmPage)
