import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { MaxUint256 } from '@ethersproject/constants'
import { formatEther } from '@ethersproject/units'

import { getAccount } from '@selectors/user.selectors'
import { getChainId } from '@selectors/global.selectors'
import { getSelectedCrypto } from '@selectors/crypto.selectors'

import { getMonaTokenContract, getWEthContract } from '@services/contract.service'

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
      const contract = 
      selectedCryptoRef.current == 'mona'
        ? await getMonaTokenContract(config.MONA_TOKEN_ADDRESSES[isMainnet ? 'matic' : 'mumbai'])
        : 
        selectedCryptoRef.current == 'weth'
            ? await getWEthContract(chainId)
            : null

      contract && setAllowance(
        formatEther(
          await contract.methods.allowance(account, config.QUICKSWAP_ROUTER).call({ from: account })
        )
      )
    }
  }, [account, chainId])

  usePollar(fetchAllowance)

  return allowance
}

export default function useERC20Approve(amount) {
  const account = useSelector(getAccount)
  const chainId = useSelector(getChainId)
  const selectedCrypto = useSelector(getSelectedCrypto)

  const [approved, setApproved] = useState(false)

  const allowance = useTokenAllowance()

  useEffect(() => {
    if (selectedCrypto && parseFloat(allowance) > parseFloat(amount)) {
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

      contract && contract.methods.approve(config.PATRONS_MARKETPLACE_ADDRESS['matic'], MaxUint256).send({ from: account })
    }
  }

  const purchaseOffer = async () => {
    
  }

  console.log('selectedCrypto: ', selectedCrypto)
  return { approved, approveFunc, purchaseOffer }
}
