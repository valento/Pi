import { ORDER_LIST,ORDER_CLEAR } from '../types'

export const order = (state=[],action) => {
  switch (action.type) {
    case ORDER_LIST:
      return action.order
    case ORDER_CLEAR:
      return []
    default:
      return state

  }
}
