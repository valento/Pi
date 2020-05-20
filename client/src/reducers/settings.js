import { SETUP_CHANGED,ORDER_COUNTER,CUSTOMER_COUNTER } from '../types'

export const settings = (state={},action) => {
  switch (action.type) {
    case SETUP_CHANGED:
      return {...state, ...action.data}
    case ORDER_COUNTER:
      return {...state, order_counter: state.order_counter + 1}
    case CUSTOMER_COUNTER:
      return {...state, ...action.data}
    default:
      return state

  }
}
