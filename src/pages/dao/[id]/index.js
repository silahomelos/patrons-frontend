import React, { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'

import DaoTierCard from '@components/dao-tier-card'
import PixelLoader from '@components/pixel-loader'

import {
  getPayableTokenReport,
  getPatronMarketplaceOffers
} from '@services/api/apiService'
import {
  getERC20ContractAddressByChainId
} from '@services/network.service'

import { getAllResultsFromQueryWithoutOwner } from '@helpers/thegraph.helpers'

import { getSelectedCrypto } from '@selectors/crypto.selectors'
import cryptoActions from '@actions/crypto.actions'

import {
  POLYGON_CHAINID
} from '@constants/global.constants'

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
  '749',
  '755',
]

const getDescriptionList = strDescription => {
  let result = ''
  const desc = strDescription.replace(/[‘’]/g, '')
    try {
    result = JSON.parse(desc)
  } catch {
    try {
      result = JSON.parse(desc.replaceAll(`'`, `"`))
    } catch {
      result = [desc]
    }  
  }

  return result
}

const DaoPage = () => {
  const router = useRouter()
  const { id } = router.query
  const currentDao = daos.find(daoInfo => daoInfo.name.toLowerCase() === id.toLowerCase())
  
  const [loading, setLoading] = useState(false)
  const [cryptoPrice, setCryptoPrice] = useState(1)
  const [tierOffers, setTierOffers] = useState([])

  const dispatch = useDispatch()
  const selectedCrypto = useSelector(getSelectedCrypto)

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

      <div className={styles.description}>
        {currentDao?.description}
      </div>

      <div className={styles.subTitle}>
        DAO NFT Tiers
      </div>

      {
        currentDao?.document &&
        <div className={styles.viewDoc}>
          View the documentation <a href={currentDao?.document} target='_blank'>here</a> for more details on what each tier includes.
        </div>
      }
      
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
