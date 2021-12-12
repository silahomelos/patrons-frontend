import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import cryptoActions from '@actions/crypto.actions'
import {
  closeCryptoOptionsModal,
  openPurchaseSuccessModal
} from '@actions/modals.actions'

import { 
  getSelectedCrypto
} from '@selectors/crypto.selectors'

import useERC20Approve from '@hooks/useERC20Approve'

import Button from '@components/buttons/button'
import Modal from '@components/modal'

import styles from './styles.module.scss'
import { MaxUint256 } from '@ethersproject/constants'


const ModalCryptoOptions = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { approved, approveFunc, purchaseOffer } = useERC20Approve(MaxUint256)

  const selectedCrypto = useSelector(getSelectedCrypto)

  const handleClose = () => {
    dispatch(closeCryptoOptionsModal())
  }

  useEffect(() => {
    if (window.localStorage.getItem('CRYPTO_OPTION')) {
      dispatch(cryptoActions.setCrypto(window.localStorage.getItem('CRYPTO_OPTION') || ''))
    }
  }, [])

  const onCryptoOptionSelect = option => {
    if (!loading) {
      console.log('option: ', option)
      dispatch(cryptoActions.setCrypto(option))
      window.localStorage.setItem('CRYPTO_OPTION', option.toString())
    }
  }

  const onApprove = async () => {
    if (!approved) {
      try {
        setLoading(true)
        await approveFunc()
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
        throw err
      }
    } else {
      setLoading(true)

      const { promise, unsubscribe } = await purchaseOffer()

      await promise
      .then(async (hash) => {
        console.log('this is after calling buy offer')
        unsubscribe()
        setLoading(false)
        dispatch(closeCryptoOptionsModal())
        dispatch(openPurchaseSuccessModal())
      })
      .catch(async (err) => {
        console.log(err)
        unsubscribe()
        setLoading(false)

        dispatch(closeCryptoOptionsModal())
        toast(err.message)
      })
    }
  }

  console.log('selectedCrypto: ', selectedCrypto)

  return (
    <>
      {createPortal(
        <Modal onClose={() => handleClose()} className={styles.cryptoOptions}>
          <div className={styles.modalItem}>
            <p className={styles.description}> Choose A Token To Patron The Realm. </p>
            <div className={styles.cryptoList}>
              <div
                className={`${styles.cryptoIcon} ${
                  selectedCrypto === 'weth' && styles.selected
                } ${loading && styles.disabled}`}
                onClick={() => onCryptoOptionSelect('weth')}
              >
                <img src='/images/cryptos/options/weth.png' className='m-auto' />
                <span className='text-xs'> wETH </span>
              </div>
              <div
                className={`${styles.cryptoIcon} ${
                  selectedCrypto === 'mona' && styles.selected
                } ${loading && styles.disabled}`}
                onClick={() => onCryptoOptionSelect('mona')}
              >
                <img src='/images/cryptos/options/mona.png' className='m-auto' />
                <span className='text-xs'> MONA </span>
              </div>
            </div>

            <Button
              className={styles.approveButton}
              onClick={onApprove}
              disabled={!crypto.length}
              loading={loading}
            >
              {!approved ? 'Approve Spend' : 'Patron the realm'}
            </Button>
          </div>
        </Modal>,
        document.body
      )}
    </>
  )
}

export default ModalCryptoOptions
