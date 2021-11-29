/* eslint-disable max-len */
import { createModule } from 'redux-modules'
import cloneDeep from 'lodash.clonedeep'
import { Map, List } from 'immutable'
import TransformModules from '../utils/transform-modules'
import designerList from 'src/data/designers.json'

const DEFAULT_FIELDS = Map({
  designersById: Map({}),
  designerGarmentIds: List([]),
  designerIDs: List(designerList),
})

export default createModule({
  name: 'designer',
  initialState: cloneDeep(DEFAULT_FIELDS),
  transformations: cloneDeep(TransformModules(DEFAULT_FIELDS)),
})
