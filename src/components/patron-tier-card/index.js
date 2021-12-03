import React from 'react'
import { useSelector } from 'react-redux'

import { getExchangeRateETH } from '@selectors/global.selectors'

import GrayButton from '@components/buttons/gray-button'
import PriceCard from '@components/price-card'
import styles from './styles.module.scss'

const PatronTierCard = props => {
  const {
    realmName,
    tierName,
    price,
    description
  } = props

  const exchangeRate = useSelector(getExchangeRateETH)

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