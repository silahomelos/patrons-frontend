import React, { memo } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import realms from 'src/data/realms.json'
import styles from './styles.module.scss'

const RealmPage = () => {
  const router = useRouter()
  const { id } = router.query
  const currentRealm = realms.find(realm => realm.name.toLowerCase() === id.toLowerCase())
  console.log('realms: ', realms)
  console.log('id: ', id)
  console.log('currentRealm: ', currentRealm)
  return (
    <div className={styles.realmPageWrapper}>
      
      <div className={styles.pageTitle}>
        Designer Realm
      </div>
      <div className={styles.designerName}>
        {
          currentRealm.name
        }
      </div>
      <div className={styles.designerPhotoWrapper}>
        <Image
          src={currentRealm.image}
          width={580}
          height={580}
        />
      </div>
      <div className={styles.description}>
        Phoebe Heess is a hi-tech fashion lab working with innovative materials and wearables. Think James Bond’s Q, but for all black sportswear. You might have read about them developing the blackest t-shirt in the world. Or when they did a black shirt that doesn’t heat up under the sun. 
        <br /><br />
        Phoebe is a seasoned sportswear designer that has previously collaborated with startups, and also large corps like Adidas. Gabriel is the former Head of Digital at Vice, and has also worked for digital innovation business consultancies.
      </div>
      <div className={styles.subTitle}>
        Key Insights
      </div>

      <div className={styles.keyInsights}>
        <div className={styles.item}>
          <div className={styles.itemName}>
            $GDN Count:
          </div>
          <div className={styles.itemValue}>
            303.27
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemName}>
            FGO Count:
          </div>
          <div className={styles.itemValue}>
            5
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemName}>
            Fashion NFT Mints:
          </div>
          <div className={styles.itemValue}>
            4
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemName}>
            Meta Source Contributions:
          </div>
          <div className={styles.itemValue}>
            10
          </div>
        </div>
      </div>

      <div className={styles.subTitle}>
        Patron NFT Tiers
      </div>
    </div>
  )
}

export default memo(RealmPage)
