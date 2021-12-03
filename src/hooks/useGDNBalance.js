import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { formatEther } from '@ethersproject/units'
import { getAccount } from '@selectors/user.selectors'
import config from '@utils/config'
import useMaticPosClient from './useMaticPosClient'
import { useIsMainnet } from './useIsMainnet'
import globalActions from '@actions/global.actions'
import { getMonaMaticBalance } from '@selectors/global.selectors'
import { getUser } from '@helpers/user.helpers'

export function useGDNBalance() {
  const dispatch = useDispatch()
  const monaMaticBalance = useSelector(getMonaMaticBalance)
  const user = useSelector(getUser)

  const account = useSelector(getAccount)
  const isMainnet = useIsMainnet()

  const [posClientParent, posClientChild] = useMaticPosClient()

  const fetchGDNBalance = async () => {
    try {
      const maticBalance = await posClientParent.balanceOfERC20(
        account,
        config.MONA_TOKEN_ADDRESSES[isMainnet ? 'matic' : 'mumbai'],
        {
          parent: false,
        },
      )
      if (monaMaticBalance !== formatEther(maticBalance)) {
        dispatch(globalActions.setMonaMaticBalance(formatEther(maticBalance)))
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (account && posClientParent && posClientChild) {
      fetchGDNBalance()
    }
  }, [isMainnet, posClientChild, posClientParent, user])

  return [monaMaticBalance]
}
