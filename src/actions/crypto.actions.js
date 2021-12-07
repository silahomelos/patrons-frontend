// import cryptoReducer from '../reducers/crypto.reducer'

// const { actions } = cryptoReducer

// export const setCrypto = (crypto) => (dispatch) => dispatch(actions.setValue({ field: 'selectedCrypto', value: crypto }))

import BaseActions from '@actions/base-actions'
import cryptoReducer from '@reducers/crypto.reducer'

class CryptoActions extends BaseActions {
  setCrypto(crypto) {
    return async (dispatch) => {
      dispatch(this.setValue('selectedCrypto', crypto))
    }
  }
  
  setSelectedCollectionId(collectionId) {
    return async (dispatch) => {
      dispatch(this.setValue('selectedCollectionId', collectionId))
    }
  }
  
  setPrice(price) {
    return async (dispatch) => {
      dispatch(this.setValue('selectedRealmPrice', price))
    }
  }
}

export default new CryptoActions(cryptoReducer)