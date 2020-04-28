import { ORDER_LIST, ORDER_CLEAR } from '../types'
import api from '../api'

export const addOrder = order => ({
  type: ORDER_LIST,
  order
})

export const cancelOrder = () => ({
  type: ORDER_CLEAR
})

export const clearOrderList = () => ({
  type: ORDER_CLEAR
})

export const getOrders = id => dispatch => {
  return new Promise ( (resolve,reject) => {
    api.order.collection(id)
    .then( ({data}) => {
      resolve(data)
    } )
    .catch( err => reject(err) )
  })
}

//export const makeOrder = data => dispatch => {
//  api.order.addOrder(data).then(res => dispatch( clearOrderList()))
//}
