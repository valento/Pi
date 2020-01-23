import { PRODUCT_LIST } from '../types'

export const products = (state=[],action) => {
  switch (action.type) {
    case PRODUCT_LIST:
      return action.data
    default:
      return state

  }
}
