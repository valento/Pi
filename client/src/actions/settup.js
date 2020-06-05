import { SETUP_CHANGED,PRODUCT_LIST,
  SET_FAC,ORDER_COUNTER,CUSTOMER_COUNTER,FAC_STATE
} from '../types.js'
import api from '../api'

export const setInterface = data => ({type: SETUP_CHANGED, data})

export const countOrders = () => ({type: ORDER_COUNTER})
export const countCustomers = data => ({type: CUSTOMER_COUNTER, data})

export const facSetup = data => ({type: FAC_STATE, data})

export const setLocationFactory = fac => ({type: SET_FAC, fac})

export const setUI = ui => dispatch =>
api.settup.setUI(ui).then( data => {
  dispatch(setInterface(data))
})

export const setProductsList = data => ({type: PRODUCT_LIST, data})

export const getLocations = (itm,id) => dispatch =>
api.settup.getLocationList(itm,id).then( data => {
  console.log('getLocationsList: ', data);
  dispatch(setInterface(data))
})

export const getProductList = lan => dispatch =>
api.settup.getProductList(lan).then( data => {
  dispatch(setProductsList(data))
})

export const getFacStore = ({city}) => dispatch =>
api.settup.getLocationFac(city).then( fac => {
  dispatch(setLocationFactory(fac))
})

export const setFac = settings => dispatch =>
api.settup.setupFac(settings).then( () => {
  const { data } = settings
  dispatch(facSetup(data))
})

export const socketCounter = data => dispatch => {
  console.log('Socket Action: ',data)
  if(data.order) {
    return dispatch(countOrders())
  }
  else if (data.hasOwnProperty('open')) {
    return dispatch(facSetup({open: data.open}))
  }
  else {
    return dispatch(countCustomers(data))
  }
}

export const checkReference = ref => dispatch =>
api.settup.getLocation(ref).then( data => {
  if(data){
    return data
  }
})
.catch(err => ({error:8}))
