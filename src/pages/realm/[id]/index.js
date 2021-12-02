import React, { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import api from '@services/api/espa/api.service'
import {
  getDigitalaxMaterialV2s
} from '@services/api/apiService'
import { getAllResultsFromQueryWithoutOwner } from '@helpers/thegraph.helpers'

import {
  POLYGON_CHAINID
} from '@constants/global.constants'
import realms from 'src/data/realms.json'
import styles from './styles.module.scss'

const RealmPage = () => {
  const router = useRouter()
  const { id } = router.query
  const currentRealm = realms.find(realm => realm.name.toLowerCase() === id.toLowerCase())
  console.log('realms: ', realms)
  console.log('id: ', id)
  console.log('currentRealm: ', currentRealm)

  const [currentDeisngerInfo, setCurrentDesignerInfo] = useState(null)
  const [fgoCount, setFgoCount] = useState(0)

  async function loadDesignerInfo() {   
    let currentDesigner = null

    // get current Designer Information from FaunaDB
    const designers = await api.getDesignerById(currentRealm.designerId) || []

    if (designers.length > 0) {
      currentDesigner = designers[0]
      setCurrentDesignerInfo(currentDesigner)

    }

    if (!currentDesigner) return

    // get Blocked Materials from FaunaDB
    const thumbnails = await api.getThumbnailsByDesigner(currentDesigner.designerId)

    const blockedList = []
    for (const thumbnail in thumbnails.data) {
      const thumbItem = thumbnails.data[thumbnail]
      if (thumbItem.blocked) {
        blockedList.push(thumbItem.image_url)
      }
    }

    // Get all materials from theGraph
    const digitalaxMaterialV2S = await getAllResultsFromQueryWithoutOwner(
      getDigitalaxMaterialV2s, 
      'digitalaxMaterialV2S', 
      POLYGON_CHAINID
    )
    console.log('materials: ', digitalaxMaterialV2S)
    const materials = []
    if (digitalaxMaterialV2S) {
      for (const item of digitalaxMaterialV2S) {
        if (item.attributes.length <= 0) continue
        try {
          const designerId = item['name']
          if (!designerId || designerId === undefined || designerId === '' || !item['image']) continue

          if (
            currentDesigner['designerId'].toLowerCase() !== designerId.toLowerCase() &&
            (!currentDesigner['newDesignerID'] ||
            currentDesigner['newDesignerID'] === '' ||
            currentDesigner['newDesignerID'].toLowerCase() !== designerId.toLowerCase())
          )
            continue

          if (blockedList.findIndex((blockedItem) => blockedItem === item['image']) >= 0) continue
          if (materials.findIndex((findItem) => findItem.image === item['image']) >= 0) continue
          
          materials.push({
            image: item['image'],
            name: item['name']
          })
        } catch (exception) {
          console.log('exception: ', exception)
        }
      }
    }
    console.log('materials: ', materials)
    setFgoCount(materials.length)
    // const { digitalaxCollectionGroups } = await getCollectionGroups(POLYGON_CHAINID)
    // console.log('digitalaxCollectionGroups: ', digitalaxCollectionGroups)

    // digitalaxCollectionGroups.forEach((group, index) => {
    //   const designerAuctions = group.auctions.filter(
    //     auction => auction.designer.name.toLowerCase() === currentDesigner.designerId.toLowerCase()
    //   )
    //   console.log('designerAuctions: ', designerAuctions)
      
    //   const designerCollections = group.collections.filter(
    //     collection => collection.designer.name.toLowerCase() === currentDesigner.designerId.toLowerCase()
    //   )
    //   console.log('designerCollections: ', designerCollections)
    // })
  }

  useEffect(() => {
    loadDesignerInfo()
  }, [])

  console.log('currentDeisngerInfo: ', currentDeisngerInfo)

  return (
    <div className={styles.realmPageWrapper}>
      
      <div className={styles.pageTitle}>
        Designer Realm
      </div>
      <div className={styles.designerName}>
        {
          currentRealm.designerId
        }
      </div>
      <div className={styles.designerPhotoWrapper}>
        {
          currentDeisngerInfo && <Image
            src={currentDeisngerInfo.image_url}
            width={580}
            height={580}
          />
        }
      </div>
      <div className={styles.description}>
        {currentDeisngerInfo?.realmDescription}
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
          {fgoCount}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemName}>
            Fashion NFT Mints:
          </div>
          <div className={styles.itemValue}>
          {currentDeisngerInfo?.fashionMints || 0}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemName}>
            Meta Source Contributions:
          </div>
          <div className={styles.itemValue}>
          {currentDeisngerInfo?.metaSourceContribution || 0}
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
