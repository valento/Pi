import { CART_LIST, CART_CLEAR } from '../types'
import api from '../api'

export const addCart = order => ({
  type: CART_LIST,
  order
})

export const cancelCart = () => ({
  type: CART_CLEAR
})

export const clearCart = () => ({
  type: CART_CLEAR
})

export const makeCart = data => dispatch => {
  return new Promise( (resolve, reject) => {
    api.order.pushOrder(data).then( res => {
      dispatch(clearCart())
      resolve(res.message)
    })
    .catch( err => {
      reject(err.response.statusText)
    })
  })
}
