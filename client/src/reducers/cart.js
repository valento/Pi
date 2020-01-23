import { CART_LIST,CART_CLEAR } from '../types'

export const cart = (state=[],action) => {
  switch (action.type) {
    case CART_LIST:
      return action.order
    case CART_CLEAR:
      return []
    default:
      return state

  }
}
