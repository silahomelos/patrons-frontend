import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { formatEther } from '@ethersproject/units'

import { getAccount } from '@selectors/user.selectors'
import { getChainId } from '@selectors/global.selectors'
import {
  getSelectedCrypto,
  getSelectedCollectionId,
  getSelectedRealmPrice
} from '@selectors/crypto.selectors'

import {
  getMonaTokenContract,
  getWEthContract,
  getPatronMarketplaceContract
} from '@services/contract.service'

import config from '@utils/config'
import { POLYGON_CHAINID } from '@constants/global.constants'

import { useIsMainnet } from './useIsMainnet'
import usePollar from './usePollar'

export function useTokenAllowance() {
  const [allowance, setAllowance] = useState('0')
  const account = useSelector(getAccount)
  const isMainnet = useIsMainnet()
  const chainId = useSelector(getChainId)
  const selectedCrypto = useSelector(getSelectedCrypto)

  const selectedCryptoRef = useRef(selectedCrypto)
  selectedCryptoRef.current = selectedCrypto

  const fetchAllowance = useCallback(async () => {
    // Only Polygon is acceptable
    // Currently we support only Mona and wEth tokens
    if (account && chainId && chainId == POLYGON_CHAINID) {
      // get ERC20 Token address
      const contract = 
      selectedCryptoRef.current == 'mona'
        ? await getMonaTokenContract(config.MONA_TOKEN_ADDRESSES[isMainnet ? 'matic' : 'mumbai'])
        : 
        selectedCryptoRef.current == 'weth'
            ? await getWEthContract(chainId)
            : null

      contract && setAllowance(
        formatEther(
          await contract.methods.allowance(account, config.PATRONS_MARKETPLACE_ADDRESS['matic']).call({ from: account })
        )
      )
    }
  }, [account, chainId])

  fetchAllowance()
  usePollar(fetchAllowance)

  return allowance
}

export default function useERC20Approve(amount) {
  const account = useSelector(getAccount)
  const chainId = useSelector(getChainId)
  const selectedCrypto = useSelector(getSelectedCrypto)
  const selectedCollectionId = useSelector(getSelectedCollectionId)
  const selectedRealmPrice = useSelector(getSelectedRealmPrice)

  const [approved, setApproved] = useState(false)

  const allowance = useTokenAllowance()

  useEffect(() => {
    console.log('allowance: ', parseFloat(allowance) - parseFloat(amount))
    console.log('amount: ', parseFloat(amount))

    if (selectedCrypto && parseFloat(allowance) >= 10000000000) {
      setApproved(true)
    } else {
      setApproved(false)
    }
  }, [amount, allowance, selectedCrypto])

  const isMainnet = useIsMainnet()

  const selectedCryptoRef = useRef(selectedCrypto)
  selectedCryptoRef.current = selectedCrypto

  const approveFunc = async () => {
    if (account && chainId) {
      const contract = 
      selectedCryptoRef.current == 'mona'
        ? await getMonaTokenContract(config.MONA_TOKEN_ADDRESSES[isMainnet ? 'matic' : 'mumbai'])
        : 
        selectedCryptoRef.current == 'weth'
          ? await getWEthContract(chainId)
          : null

      contract && contract.methods.approve(config.PATRONS_MARKETPLACE_ADDRESS['matic'], amount).send({ from: account })
    }
  }

  const purchaseOffer = async () => {
    if (selectedCrypto != 'mona' && selectedCrypto != 'weth') return
    // get Patron Marketplace Contract
    const contract = await getPatronMarketplaceContract(POLYGON_CHAINID)
    try {
      console.log('this is before calling batchBuyoffer: ', selectedRealmPrice)
      // console.log({ collectionIds })
      const listener = contract.methods
        .batchBuyOffer(
          [selectedCollectionId],
          selectedCrypto == 'mona' ?
            config.MONA_TOKEN_ADDRESSES[isMainnet ? 'matic' : 'mumbai'] :
            config.WETH_ADDRESS[isMainnet ? 'matic' : 'mumbai'],
          0,
          0
        )
        .send({
          from: account,
          value: 0,
        })
  
      const promise = new Promise((resolve, reject) => {
        listener.on('error', (error) => reject(error))
        listener.on('confirmation', (transactionHash) => resolve(transactionHash))
      })
  
      return {
        promise,
        unsubscribe: () => {
          listener.off('error')
          listener.off('confirmation')
        },
      }
    } catch (err) {
      console.log(err)
      throw err
    }    
  }

  console.log('selectedCrypto: ', selectedCrypto)
  console.log('approved: ', approved)
  return { approved, approveFunc, purchaseOffer }
}
