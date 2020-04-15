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
  console.log('Cart Action: ',data)
  return new Promise( (resolve, reject) => {
    api.order.pushOrder(data).then( res => {
      dispatch(clearCart())
      console.log(res)
      resolve(res.message)
    })
    .catch( err => {
      reject(err.response.statusText)
    })
  })
}
