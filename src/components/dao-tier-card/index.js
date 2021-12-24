import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  openConnectMetamaskModal,
  openCryptoOptionsModal,
  openPurchaseSuccessModal,
  openSwitchNetworkModal,
} from '@actions/modals.actions'

import cryptoActions from '@actions/crypto.actions'

import { getExchangeRateETH, getChainId } from '@selectors/global.selectors'
import { getSelectedCrypto } from '@selectors/crypto.selectors'
import { getAccount } from '@selectors/user.selectors'

import GrayButton from '@components/buttons/gray-button'
import PriceCard from '@components/price-card'

import { POLYGON_CHAINID } from '@constants/global.constants'

import styles from './styles.module.scss'

const insertTarget = desc => {
  // console.log('desc: ', desc.replaceAll(/(<a[^>]*)(>)/ig, '$1 target=_blank$2'))
  return desc.replaceAll(/(<a[^>]*)(>)/ig, '$1 target=_blank$2')
  // return Regex.Replace(desc, '(<a[^>]*>)(</a>)', 'target=_blank', RegexOptions.IgnoreCase)
}

const DaoTierCard = props => {
  const {
    collectionId,
    daoName,
    tierName,
    price,
    primarySalePrice,
    description
  } = props

  const chainId = useSelector(getChainId)
  const account = useSelector(getAccount)

  const dispatch = useDispatch()
  const selectedCrypto = useSelector(getSelectedCrypto)

  const getPrice = () => {
    const ethVal = Number(parseFloat(price).toFixed(2))
    console.log(`${collectionId}: ${ ethVal } $${selectedCrypto}`)
    return (
      <>
        { ethVal } ${selectedCrypto == 'weth' ? 'eth' : selectedCrypto}
        <span>
          {` `}(${Number((parseFloat(primarySalePrice) / 1e18).toFixed(2))})
        </span>
      </>
    )
  }

  const onClickPatronRealmButton = () => {
    console.log('click patron realm button: ', account)
    if (account) {
      // console.log('chainId: ', chainId)
      // console.log('collectionId: ', collectionId)

      dispatch(cryptoActions.setSelectedCollectionId(collectionId))
      dispatch(cryptoActions.setPrice(primarySalePrice))

      if (chainId == POLYGON_CHAINID) {
        dispatch(openCryptoOptionsModal())
      } else {
        dispatch(openSwitchNetworkModal())
      }
    } else {
      dispatch(openConnectMetamaskModal())
    }
  }

  return (
    <div className={styles.daoTierCardWrapper}>
      <div className={styles.thumbnailBorderWrapper}>
        <div className={styles.thumbnailWrapper}>
          <div className={styles.thumbnailContent}>
            <h1>
              {`${daoName} DAO`}
            </h1>
            <h2>
              {tierName}
            </h2>
          </div>
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <GrayButton
          text={'Join DAO'}
          onClick={onClickPatronRealmButton}
        />
      </div>
      <div className={styles.priceWrapper}>
        <PriceCard
          mode={0}
          mainText={getPrice()}
          subText={tierName}
        />
      </div>
      <div className={styles.descriptionWrapper}>
        <h1>
          {`${tierName} Includes:`}
        </h1>
        <ul>
          {
            description && description.map((descItem, index) => {
              console.log('descItem: ', insertTarget(descItem))
              return (
                <li key={index} dangerouslySetInnerHTML={{__html: insertTarget(descItem) }}>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default DaoTierCard