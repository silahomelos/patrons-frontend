import modalsReducer from '../reducers/modals.reducer'

const { actions } = modalsReducer

const hideScroll = (scroll) => {
  const widthScroll = window.innerWidth - document.documentElement.clientWidth
  if (scroll === 'hideScroll') {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${widthScroll}px`
  }
}

const showScroll = (scroll) => {
  if (scroll === 'addScroll') {
    document.body.style.overflow = 'initial'
    document.body.style.paddingRight = '0px'
  }
}

export const openModal = (modalNameInReducer, statusScroll, params) => (dispatch) => {
  dispatch(actions.setValue({ field: 'params', value: params }))
  dispatch(actions.setValue({ field: modalNameInReducer, value: true }))
  hideScroll(statusScroll)
}

export const closeModal = (modalNameInReducer, statusScroll) => (dispatch) => {
  dispatch(actions.setValue({ field: modalNameInReducer, value: false }))
  dispatch(actions.setValue({ field: 'params', value: null }))
  showScroll(statusScroll)
}

export const openConnectMetamaskModal = () => (dispatch) => dispatch(openModal('isShowModalConnectMetamask', 'hideScroll'))
export const closeConnectMetamaskModal = () => (dispatch) => dispatch(closeModal('isShowModalConnectMetamask', 'addScroll'))

export const openNotInstalledMetamask = () => (dispatch) => dispatch(openModal('isShowNotificationConnectMetamask'))
export const closeNotInstalledMetamask = () => (dispatch) => dispatch(closeModal('isShowNotificationConnectMetamask'))

export const openPlaceBidModal = (params) => (dispatch) => dispatch(openModal('isShowModalPlaceBid', 'hideScroll', params))
export const closePlaceBidModal = () => (dispatch) => dispatch(closeModal('isShowModalPlaceBid', 'addScroll'))


export const openWithdrawModal = (params) => (dispatch) => dispatch(openModal('isShowModalWithdrawBid', 'hideScroll', params))
export const closeWithdrawModal = () => (dispatch) => dispatch(closeModal('isShowModalWithdrawBid', 'addScroll'))

export const openBuynowModal = (params) => (dispatch) => dispatch(openModal('isShowBuyNow', 'hideScroll', params))
export const closeBuynowModal = () => (dispatch) => dispatch(closeModal('isShowBuyNow', 'addScroll'))

export const openPreviewMaterialModal = (params) => (dispatch) => dispatch(openModal('isShowPreviewMaterial', 'hideScroll', params))
export const closePreviewMaterialModal = () => (dispatch) => dispatch(closeModal('isShowPreviewMaterial', 'addScroll'))

export const openRaiseModal = (params) => (dispatch) => dispatch(openModal('isShowModalRaiseBid', 'hideScroll', params))
export const closeRaiseModal = () => (dispatch) => dispatch(closeModal('isShowModalRaiseBid', 'addScroll'))

export const openSignupModal = (params) => (dispatch) => dispatch(openModal('isShowModalSignup', 'hideScroll', params))
export const closeSignupModal = () => (dispatch) => dispatch(closeModal('isShowModalSignup', 'addScroll'))

export const openConnectMaticModal = (params) => (dispatch) => dispatch(openModal('isShowModalConnectMatic', 'hideScroll', params))
export const closeConnectMaticModal = () => (dispatch) => dispatch(closeModal('isShowModalConnectMatic', 'addScroll'))

export const openBuyNowCoolDownModal = (params) => (dispatch) => dispatch(openModal('isCoolDown', 'hideScroll', params))
export const closeBuyNowCooldownModal = () => (dispatch) => dispatch(closeModal('isCoolDown', 'addScroll'))

export const openBuyNowLimitModal = (params) => (dispatch) => dispatch(openModal('isLimit', 'hideScroll', params))
export const closeBuyNowLimitModal = () => (dispatch) => dispatch(closeModal('isLimit', 'addScroll'))

export const openBidHistoryModal = (params) => (dispatch) => dispatch(openModal('isBidHistory', 'hideScroll', params))
export const closeBidHistoryModal = () => (dispatch) => dispatch(closeModal('isBidHistory', 'addScroll'))

export const openPurchaseHistoryModal = (params) => (dispatch) => dispatch(openModal('isPurchaseHistory', 'hideScroll', params))
export const closePurchaseHistoryModal = () => (dispatch) => dispatch(closeModal('isPurchaseHistory', 'addScroll'))

export const openSwitchNetworkModal = (params) => (dispatch) => dispatch(openModal('isSwitchNetwork', 'hideScroll', params))
export const closeSwitchNetworkModal = () => (dispatch) => dispatch(closeModal('isSwitchNetwork', 'addScroll'))

export const openPurchaseSuccessModal = (params) => (dispatch) => dispatch(openModal('isPurchaseSuccess', 'hideScroll', params))
export const closePurchaseSuccessModal = () => (dispatch) => dispatch(closeModal('isPurchaseSuccess', 'addScroll'))

export const openBespokeModal = (params) => (dispatch) => dispatch(openModal('isShowModalBespoke', 'hideScroll', params))
export const closeBespokeModal = () => (dispatch) => dispatch(closeModal('isShowModalBespoke', 'addScroll'))

export const openCurrentWearersModal = (params) => (dispatch) => dispatch(openModal('isShowModalCurrentWearers', 'hideScroll', params))
export const closeCurrentWearersModal = () => (dispatch) => dispatch(closeModal('isShowModalCurrentWearers', 'addScroll'))

export const openCryptoOptionsModal = (params) => (dispatch) => dispatch(openModal('isShowModalCryptoOptions', 'hideScroll', params))
export const closeCryptoOptionsModal = () => (dispatch) => dispatch(closeModal('isShowModalCryptoOptions', 'addScroll'))

