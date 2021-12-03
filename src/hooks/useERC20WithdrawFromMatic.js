import { useDispatch, useSelector } from 'react-redux'

import { getAccount } from '@selectors/user.selectors'
import { getChainId } from '@selectors/global.selectors'

import userActions from '@actions/user.actions'
import globalActions from '@actions/global.actions'

import { convertToWei } from '@helpers/price.helpers'
import { getUser } from '@helpers/user.helpers'

import config from '@utils/config'

import useMaticPosClient from './useMaticPosClient'
import { useIsMainnet } from './useIsMainnet'

export default function useWithdrawFromMatic() {
  const [_, posClient] = useMaticPosClient()
  const account = useSelector(getAccount)
  const chainId = useSelector(getChainId)
  const isMainnet = useIsMainnet()
  const dispatch = useDispatch()
  const profile = useSelector(getUser)
  const existingTxs = profile?.withdrawalTxs || []

  const withdrawCallback = (amount) => {
    if (posClient && account && chainId) {
      dispatch(globalActions.setIsLoading(true))
      return posClient
        .burnERC20(
          config.MONA_TOKEN_ADDRESSES[isMainnet ? 'matic' : 'mumbai'],
          convertToWei(amount),
          {
            from: account
          }
        )
        .then((res) => {
          dispatch(
            userActions.updateProfile({
              withdrawalTxs: [
                ...existingTxs,
                {
                  txHash: res.transactionHash,
                  amount: parseFloat(amount),
                  tokenType: 'ERC-20',
                  status: 'pending',
                  created: new Date()
                }
              ]
            })
          )
          return res
        })
        .catch((err) => {
          dispatch(globalActions.setIsLoading(false))
          throw err
        })
    }
  }

  return withdrawCallback
}
