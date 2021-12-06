import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  openBuynowModal,
  openConnectMetamaskModal,
  openCryptoOptionsModal,
  openPlaceBidModal,
  openPurchaseSuccessModal,
  openSwitchNetworkModal,
} from '@actions/modals.actions'

import { getExchangeRateETH, getChainId } from '@selectors/global.selectors'
import { getAccount } from '@selectors/user.selectors'

import GrayButton from '@components/buttons/gray-button'
import PriceCard from '@components/price-card'

import { POLYGON_CHAINID } from '@constants/global.constants'

import styles from './styles.module.scss'

const PatronTierCard = props => {
  const {
    collectionId,
    realmName,
    tierName,
    price,
    description
  } = props

  const exchangeRate = useSelector(getExchangeRateETH)
  const chainId = useSelector(getChainId)
  const account = useSelector(getAccount)
  const dispatch = useDispatch()

  const getPrice = () => {
    return (
      <>
        {parseFloat(price).toFixed(2)} $ETH
        <span>
          {` `}(${(parseFloat(price) * exchangeRate).toFixed(2)})
        </span>
      </>
    )
  }

  const onClickPatronRealmButton = () => {
    console.log('click patron realm button: ', account)
    if (account) {
      console.log('chainId: ', chainId)
      if (chainId == POLYGON_CHAINID) {
        dispatch(openCryptoOptionsModal())
        // if (!isAuction) {
        //   dispatch(
        //     openBuynowModal({
        //       id: data.id,
        //       priceEth: price,
        //     }),
        //   )
        // } else {
        //   dispatch(
        //     openPlaceBidModal({
        //       id: data.id,
        //       priceEth: price,
        //     }),
        //   );
        // }
      } else {
        dispatch(openSwitchNetworkModal())
      }
    } else {
      dispatch(openConnectMetamaskModal())
    }
  }

  return (
    <div className={styles.patronTierCardWrapper}>
      <div className={styles.thumbnailBorderWrapper}>
        <div className={styles.thumbnailWrapper}>
          <div className={styles.thumbnailContent}>
            <h1>
              {`${realmName} Realm`}
            </h1>
            <h2>
              {tierName}
            </h2>
          </div>
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <GrayButton
          text={'Patron Realm'}
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
              return (
                <li key={index}>
                  { descItem }
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default PatronTierCard