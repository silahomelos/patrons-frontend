import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getAccount } from '@selectors/user.selectors'
import { getChainId } from '@selectors/global.selectors'
import globalActions from '@actions/global.actions'
import { getEnabledNetworkByChainId } from '@services/network.service'
import config from '@utils/config'
import useMaticPosClient from './useMaticPosClient'

export default function useApproveForMatic(amount) {
  const dispatch = useDispatch()
  const [posClient] = useMaticPosClient()
  const account = useSelector(getAccount)
  const chainId = useSelector(getChainId)

  const [approved, setApproved] = useState(false)

  const approveCallback = () => {
    if (posClient && account && chainId) {
      const network = getEnabledNetworkByChainId(chainId)
      dispatch(globalActions.setIsLoading(true))
      return posClient
        .approveMaxERC20ForDeposit(config.MONA_TOKEN_ADDRESSES[network.alias], {
          from: account,
        })
        .then((res) => {
          setApproved(true)
          dispatch(globalActions.setIsLoading(false))
          return res
        })
        .catch((err) => {
          dispatch(globalActions.setIsLoading(false))
          throw err
        })
    }
  }

  return { approved, setApproved, approveCallback }
}
