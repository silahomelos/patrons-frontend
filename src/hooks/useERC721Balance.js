import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import { getAccount } from '@selectors/user.selectors'
import config from '@utils/config'
import useMaticPosClient from './useMaticPosClient'
import { useIsMainnet } from './useIsMainnet'
import usePollar from './usePollar'

export function useDTXBalance() {
  const [garmentETHBalance, setGarmentETHBalance] = useState('0')

  const account = useSelector(getAccount)
  const isMainnet = useIsMainnet()

  const [posClientParent, posClientChild] = useMaticPosClient()

  const fetchMonaETHBalance = useCallback(async () => {
    if (posClientChild) {
      const ethBalance = await posClientChild.balanceOfERC721(
        account,
        config.DTX_ADDRESSES[isMainnet ? 'mainnet' : 'goerli'],
        {
          parent: true
        }
      )
      setGarmentETHBalance(() => ethBalance)
    }
  }, [isMainnet, posClientChild])

  usePollar(fetchMonaETHBalance)

  return [garmentETHBalance]
}
