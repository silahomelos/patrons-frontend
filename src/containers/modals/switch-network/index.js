import React from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'

import Modal from '@components/modal'
import Button from '@components/buttons/button'

import { closeSwitchNetworkModal } from '@actions/modals.actions'
import { requestSwitchNetwork } from '@services/network.service'

import styles from './styles.module.scss'

const SwitchNetworkModal = () => {
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(closeSwitchNetworkModal())
  }

  const handleClick = async () => {
    const res = await requestSwitchNetwork()
    dispatch(closeSwitchNetworkModal())
  }

  return (
    <>
      {createPortal(
        <Modal
          onClose={() => handleClose()}
          title={'SWITCH TO POLYGON'}
          titleStyle={styles.textCenter}
        >
          <div className={styles.footer}>
            <p className={styles.footerCaption}>
              <span>
              You need to connect to Polygon Network to champion a Realm!<br/>
              Need to top up on tokens? You can get them from <a href="https://uniswap.org/" target="_blank">Uniswap</a>{' '}
              and bridge to Polygon with our custom <a href="https://skins.digitalax.xyz/bridge/" target="_blank">Multi-Token Bridge</a>. 
              Or, purchase directly from <a href="https://quickswap.exchange/" target="_blank">Quickswap</a>.
              </span>
            </p>
            <div className={styles.selectWrapper}>
              <Button
                background="black"
                onClick={() => handleClick()}
                className={styles.button}
              >
                SWITCH NETWORK
              </Button>
            </div>
          </div>
        </Modal>,
        document.body,
      )}
    </>
  )
}

export default SwitchNetworkModal
