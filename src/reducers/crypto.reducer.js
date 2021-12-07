import { createModule } from 'redux-modules'
import cloneDeep from 'lodash.clonedeep'
import { List, Map } from 'immutable'
import TransformModules from '../utils/transform-modules'

const DEFAULT_FIELDS = Map({
  selectedCrypto: '',
  selectedCollectionId: '',
  selectedRealmPrice: 0,
})

export default createModule({
  name: 'crypto',
  initialState: cloneDeep(DEFAULT_FIELDS),
  transformations: cloneDeep(TransformModules(DEFAULT_FIELDS)),
})
