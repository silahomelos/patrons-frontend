import React, { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import PatronTierCard from '@components/patron-tier-card'
import PixelLoader from '@components/pixel-loader'
import RealmSocialBar from '@components/realm-social-bar'

import digitalaxApi from '@services/api/digitalaxApi.service'
import {
  getDigitalaxMaterialV2s,
  getPayableTokenReport,
  getPatronMarketplaceOffers
} from '@services/api/apiService'
import {
  getGDNTokenAddress
} from '@services/gdn.service'
import { getWEthAddressByChainId } from '@services/network.service'

import useMaticPosClient from '@hooks/useMaticPosClient'

import { getAllResultsFromQueryWithoutOwner } from '@helpers/thegraph.helpers'

import {
  POLYGON_CHAINID
} from '@constants/global.constants'
import {
  SOCIAL_SUPPORT_LIST
} from '@constants/social.constants'

import realms from 'src/data/realms.json'
import styles from './styles.module.scss'

const getTierName = (strName, designerId) => {
  console.log(strName.split(designerId + ' '))
  return strName.split(designerId + ' ')[1]
}

const blockedCollections = [
  '673',
  '675'
]

const getDescriptionList = strDescription => {
  // console.log('encode: ', safe_tags_replace(`["XX $PTH ERC-20.... <a href='https://Twitter.com' />", "XX $W3F Staking ...", "XX Utility Event..."]`))
  // console.log('encode: ', JSON.parse(`["XX $PTH ERC-20.... <a href='https://Twitter.com' />", "XX $W3F Staking ...", "XX Utility Event..."]`))
  // return JSON.parse(`["XX $PTH ERC-20.... <a href='https://Twitter.com' >test</a>", "XX $W3F Staking ...", "XX Utility Event..."]`)
  let result = ''
  const desc = strDescription.replace(/[‘’]/g, '')
  // console.log('desci: ', desc)
  try {
    result = JSON.parse(desc)
  } catch {
    // console.log('a: ', desc.replaceAll(`'`, `"`))

    try {
      result = JSON.parse(desc.replaceAll(`'`, `"`))
    } catch {
      result = [desc]
    }
    
  }
  
  return result
}

const getAvailableSocialLinks = designerInfo => {

  const socialLinks = []
  designerInfo && SOCIAL_SUPPORT_LIST.forEach(socialName => {
    if (designerInfo[socialName] && designerInfo[socialName] != '') {
      socialLinks.push({
        name: socialName,
        link: designerInfo[socialName]
      })
    }
  })

  designerInfo && socialLinks.push({
    name: 'digitalax',
    link: `https://designers.digitalax.xyz/designer/${designerInfo.designerId}`
  })

  return socialLinks
}

const RealmPage = () => {
  const router = useRouter()
  const { id } = router.query
  const currentRealm = realms.find(realm => realm.name.toLowerCase() === id.toLowerCase())
  
  const [loading, setLoading] = useState(false)
  const [currentDeisngerInfo, setCurrentDesignerInfo] = useState(null)
  const [fgoCount, setFgoCount] = useState(0)
  const [gdnBalance, setGDNBalance] = useState(0)
  const [wEthPrice, setWEthPrice] = useState(1)
  const [tierOffers, setTierOffers] = useState([])
  const [posClientParent, posClientChild] = useMaticPosClient()

  async function loadDesignerInfo() {
    setLoading(true)

    let currentDesigner = null

    // get current Designer Information from FaunaDB
    const designers = await digitalaxApi.getDesignerById(currentRealm.designerId) || []

    if (designers.length > 0) {
      currentDesigner = designers[0]
      setCurrentDesignerInfo(currentDesigner)
    }

    if (!currentDesigner) return

       // get Blocked Materials from FaunaDB
    const thumbnails = await digitalaxApi.getThumbnailsByDesigner(currentDesigner.designerId)

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
    setFgoCount(materials.length)
   
    const patronMarketplaceOffers = await getAllResultsFromQueryWithoutOwner(
      getPatronMarketplaceOffers, 
      'patronMarketplaceOffers', 
      POLYGON_CHAINID
    )

    console.log('patronMarketplaceOffers: ', patronMarketplaceOffers)

    const currentOffers = patronMarketplaceOffers.filter(offer =>
      !blockedCollections.find(blockedCollection => offer.garmentCollection.id == blockedCollection) &&
      offer.garmentCollection.designer && offer.garmentCollection.designer.name &&
      offer.garmentCollection.designer.name.toLowerCase() == currentDesigner.designerId.toLowerCase()
      // offer.garmentCollection.garments && offer.garmentCollection.garments.length > 0 &&
      // offer.garmentCollection.garments[0].name.toLowerCase().includes(currentDesigner.designerId.toLowerCase())
    )

    if (currentOffers) {
      setTierOffers(currentOffers)
    }

    console.log('currentOffers: ', currentOffers)
    setLoading(false)
  }

  const fetchWEthPrice = async () => {
    const { payableTokenReport } = await getPayableTokenReport(
      POLYGON_CHAINID, getWEthAddressByChainId(POLYGON_CHAINID)
    )

    setWEthPrice(payableTokenReport.payload / 1e18)
  }

  useEffect(() => {
    fetchWEthPrice()
    loadDesignerInfo()
  }, [])

  const loadGDNBalance = async () => {
    try {
      const maticBalance = await posClientParent.balanceOfERC20(
        currentDeisngerInfo.wallet,
        getGDNTokenAddress(),
        {
          parent: false
        }
      )
      setGDNBalance(maticBalance / 1e18)
    } catch (e) {
      console.log(e)
    }
  }
  
  useEffect(() => {
    if (posClientParent && currentDeisngerInfo) {
      loadGDNBalance()
    }
    
  }, [posClientParent, currentDeisngerInfo])


  console.log('currentDeisngerInfo: ', currentDeisngerInfo)
  const availableSocialLinks = getAvailableSocialLinks(currentDeisngerInfo)
  console.log('availableSocialLinks: ', availableSocialLinks)

  if (loading) {
    return (
      <div className={styles.realmPageWrapper}>
        <PixelLoader title={'loading...'} />
      </div>
    )
  }

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
            {gdnBalance.toFixed(2)}
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

      <div className={styles.socialBar}>
        <RealmSocialBar links={availableSocialLinks}/>
      </div>

      {
        currentRealm?.document &&
        <div className={styles.viewDoc}>
          View the documentation <a href={currentRealm?.document} target='_blank'>here</a> for more details on which each tier includes.
        </div>
      }

      <div className={styles.subTitle}>
        Patron NFT Tiers
      </div>
      
      <div className={styles.patronCardsList}>
        {
          tierOffers.reverse().map(offer => {
            const garment = offer.garmentCollection.garments[0]
            return (
              <PatronTierCard
                key={garment.id}
                collectionId={offer.garmentCollection.id}
                realmName={currentDeisngerInfo.designerId}
                tierName={getTierName(garment.name, currentDeisngerInfo.designerId)}
                price={offer.primarySalePrice * wEthPrice / 1e18}
                primarySalePrice={offer.primarySalePrice}
                description={getDescriptionList(garment.description)}
              />      
            )
          })
        }
      </div>
    </div>
  )
}

export default memo(RealmPage)
