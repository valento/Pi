import { SETUP_CHANGED,ORDER_COUNTER } from '../types'

export const settings = (state={},action) => {
  switch (action.type) {
    case SETUP_CHANGED:
      return {...state, ...action.data}
    case ORDER_COUNTER:
      return {...state, order_counter: state.order_counter + 1}
    default:
      return state

  }
}
