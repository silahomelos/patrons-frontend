import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import ModalConnectWallet from '@containers/modals/modal-connect-wallet'
import ModalSignup from '@containers/modals/modal-sign-up'
import PreviewMaterial from '@containers/modals/preview-material'
import ModalConnectMatic from './modal-connect-matic'
import BuyNowCooldown from './modal-cooldown'
import BuyNowLimit from './modal-limit'
import History from './history'
import SwitchNetworkModal from './switch-network'
import PurchaseSuccess from './purchase-success'
import ModalBespoke from './modal-bespoke'
import ModalCurrentWearers from './modal-current-wearers'

const Modals = () => {
  const modals = useSelector((state) => state.modals.toJS())
  const {
    isShowModalConnectMetamask,
    isShowModalSignup,
    isShowModalConnectMatic,
    isShowPreviewMaterial,
    isLimit,
    isCoolDown,
    isBidHistory,
    isPurchaseHistory,
    isSwitchNetwork,
    isPurchaseSuccess,
    isShowModalBespoke,
    isShowModalCurrentWearers,
  } = modals

  return (
    <>
      {isShowModalConnectMetamask && <ModalConnectWallet />}
      {isShowModalSignup && <ModalSignup />}
      {isShowModalConnectMatic && <ModalConnectMatic />}
      {isShowPreviewMaterial && <PreviewMaterial />}
      {isCoolDown && <BuyNowCooldown />}
      {isLimit && <BuyNowLimit />}
      {isBidHistory && <History type={1} />}
      {isPurchaseHistory && <History type={2} />}
      {isSwitchNetwork && <SwitchNetworkModal />}
      {isPurchaseSuccess && <PurchaseSuccess />}
      {isShowModalBespoke && <ModalBespoke />}
      {isShowModalCurrentWearers && <ModalCurrentWearers />}
    </>
  )
}

export default memo(Modals)
