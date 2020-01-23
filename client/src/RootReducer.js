import { combineReducers } from 'redux'

import { settings } from './reducers/settings'
import { user } from './reducers/user'
import { products } from './reducers/products'
import { order } from './reducers/order'
import { cart } from './reducers/cart'
import { facs } from './reducers/facs'

export default combineReducers({
  settings,
  user,
  products,
  order,
  cart,
  facs
})
