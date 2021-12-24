import React, { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'

// import PatronTierCard from '@components/patron-tier-card'
import DaoTierCard from '@components/dao-tier-card'
import PixelLoader from '@components/pixel-loader'

import digitalaxApi from '@services/api/digitalaxApi.service'
import {
  getDigitalaxMaterialV2s,
  getPayableTokenReport,
  getPatronMarketplaceOffers
} from '@services/api/apiService'
import {
  getGDNTokenAddress
} from '@services/gdn.service'
import {
  getERC20ContractAddressByChainId
} from '@services/network.service'

import useMaticPosClient from '@hooks/useMaticPosClient'

import { getAllResultsFromQueryWithoutOwner } from '@helpers/thegraph.helpers'

import { getSelectedCrypto } from '@selectors/crypto.selectors'
import cryptoActions from '@actions/crypto.actions'

import {
  POLYGON_CHAINID
} from '@constants/global.constants'
import {
  SOCIAL_SUPPORT_LIST
} from '@constants/social.constants'

import daos from 'src/data/daos.json'
import styles from './styles.module.scss'

const getTierName = (strName, designerId, oldDesignerId) => {
  
  let names = strName.toLowerCase().split(designerId.toLowerCase() + ' ')
  if (names.length < 2) {
    names = strName.toLowerCase().split(oldDesignerId.toLowerCase() + ' ')
  }

  if (names[1].length > 1) {
    return names[1][0].toUpperCase() + names[1].slice(1)
  }

  return names[1]
}

const blockedCollections = [
  '653',
  '654',
  '655',
  '656',
  '657',
  '658',
  '673',
  '675',
  '676',
  '677',
  '678',
  '679',
  '680',
  '681',
  '683',
  '684',
  '685',
  '686',
  '687',
  '688',
  '689',
  '690',
  '691',
  '692',
  '693',
  '694',
  '695',
  '696',
  '697',
  '698',

  '702',
  '703',
  '704',
  '705',
  '706',
  '735',
  '736',
  '737',
  '741',
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

  // console.log('result: ', result)
  
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
    link: `https://designers.digitalax.xyz/designers/${designerInfo.designerId}`
  })

  return socialLinks
}

const DaoPage = () => {
  const router = useRouter()
  const { id } = router.query
  const currentDao = daos.find(daoInfo => daoInfo.name.toLowerCase() === id.toLowerCase())
  
  const [loading, setLoading] = useState(false)
  const [currentDeisngerInfo, setCurrentDesignerInfo] = useState(null)
  const [fgoCount, setFgoCount] = useState(0)
  const [gdnBalance, setGDNBalance] = useState(0)
  const [cryptoPrice, setCryptoPrice] = useState(1)
  const [tierOffers, setTierOffers] = useState([])
  const [posClientParent, posClientChild] = useMaticPosClient()

  const dispatch = useDispatch()
  const selectedCrypto = useSelector(getSelectedCrypto)

  // console.log('selectedCrypto: ', selectedCrypto)

  
  useEffect(() => {
    if (window.localStorage.getItem('CRYPTO_OPTION')) {
      dispatch(cryptoActions.setCrypto(window.localStorage.getItem('CRYPTO_OPTION') || ''))
    }
  }, [])

  async function loadDaoInfo() {
    setLoading(true)
  
    const patronMarketplaceOffers = await getAllResultsFromQueryWithoutOwner(
      getPatronMarketplaceOffers, 
      'patronMarketplaceOffers', 
      POLYGON_CHAINID
    )

    console.log('patronMarketplaceOffers: ', patronMarketplaceOffers)

    const currentOffers = patronMarketplaceOffers.filter(offer =>
      !blockedCollections.find(
        blockedCollection => 
          offer.garmentCollection.id == blockedCollection
      ) &&
      (
        (
          offer.garmentCollection.garments && offer.garmentCollection.garments.length > 0 &&
          offer.garmentCollection.garments[0].name.toLowerCase().includes(currentDao.name.toLowerCase())
        )
      )
    )

    if (currentOffers) {
      setTierOffers(currentOffers.sort((a, b) => {
        const aTier = getTierName(a.garmentCollection.garments[0].name, currentDao.name, '').toLowerCase()
        const bTier = getTierName(b.garmentCollection.garments[0].name, currentDao.name, '').toLowerCase()
        if (aTier < bTier) {
          return 1;
        }
        if (aTier > bTier) {
          return -1;
        }
        return 0;  
      }))
    }

    setLoading(false)
  }

  const fetchCryptoPrice = async crypto => {
    const erc20ContractAddress = getERC20ContractAddressByChainId(crypto.toLowerCase(), POLYGON_CHAINID)

    const result = await getPayableTokenReport(
      POLYGON_CHAINID, erc20ContractAddress
    )

    if (!result) return
    const { payableTokenReport } = result

    if (!payableTokenReport) return

    setCryptoPrice(payableTokenReport.payload / 1e18)
  }

  useEffect(() => {
    loadDaoInfo()
  }, [])

  useEffect(() => {
    if (selectedCrypto) { 
      fetchCryptoPrice(selectedCrypto)
    }
  }, [selectedCrypto])

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


  // console.log('cryptoPrice: ', cryptoPrice)
  // const availableSocialLinks = getAvailableSocialLinks(currentDeisngerInfo)
  // console.log('tierOffers: ', tierOffers.map(item => item.primarySalePrice / 1e18))
  // console.log('tierOffers: ', tierOffers)

  if (loading) {
    return (
      <div className={styles.daoPageWrapper}>
        <PixelLoader title={'loading...'} />
      </div>
    )
  }

  return (
    <div className={styles.daoPageWrapper}>
      
      <div className={styles.pageTitle}>
        Collector DAO
      </div>
      <div className={styles.daoName}>
        {
          currentDao.name
        }
      </div>

      <div className={styles.subTitle}>
        DAO NFT Tiers
      </div>
      
      <div className={styles.patronCardsList}>
        {
          tierOffers.map(offer => {
            const garment = offer.garmentCollection.garments[0]
            return (
              <DaoTierCard
                key={garment.id}
                collectionId={offer.garmentCollection.id}
                daoName={currentDao.name}
                tierName={getTierName(garment.name, currentDao.name, '')}
                price={offer.primarySalePrice * cryptoPrice / 1e18}
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

export default memo(DaoPage)
