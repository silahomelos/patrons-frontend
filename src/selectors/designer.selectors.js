export const getAllDesignersById = (state) => state.designer.get('designersById')
export const getDesignerById = (id) => (state) =>
  state.designer.getIn(['designersById', id]) || null
export const getDesignerGarmentIds = () => (state) => state.designer.get('designerGarmentIds')
export const getAllDesigners = () => (state) => state.designer.get('infoByDesignerId')
export const getAllDesignerIDs = () => (state) => state.designer.get('designerIDs')
