import user from './user.reducer'
import modals from './modals.reducer'
import global from './global.reducer'
import history from './history.reducer'
import collection from './collection.reducer'
import garment from './garment.reducer'
import garmentPage from './garment.page.reducer'
import tokenURIInfo from './token.uri.info.reducer'

export default {
  user: user.reducer,
  modals: modals.reducer,
  global: global.reducer,
  collection: collection.reducer,
  history: history.reducer,
  garment: garment.reducer,
  garmentPage: garmentPage.reducer,
  tokenURIInfo: tokenURIInfo.reducer,
}
