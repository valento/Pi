import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import 'semantic-ui-css/semantic.min.css'

import './App.css'
import RootReducer from './RootReducer'
import { setUI,getProductList } from './actions/settup'
import { userSignedIn } from './actions/auth'
import { userInit } from './actions/user'
import setAuthHeader from './utils/setAuthHeader'
import setLanHeader from './utils/setLanHeader'
import App from './App'
//import { subscribeSocket,fireSocket } from './websocket'
//import * as serviceWorker from './serviceWorker'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const initState = {
  user: {},
  settings: {
    lan: 'bg',
    socket: false,
    one_city: 0,
    banner: false,
    order_counter: 0,
    customer_counter: 0
  },
  products: [],
  order: [],
  cart: []
}

const store = createStore(
  RootReducer,
  initState,
  composeEnhancers(applyMiddleware(thunk))
)

window.GS = store

if(localStorage.valePizzaJWT){

  let user = {}
  user.new_user = false
  user.token = localStorage.valePizzaJWT
  setAuthHeader(user.token)
// Check if User Exist:
  //store.dispatch(checkUserToken(localStorage.valePizzaJWT))
// If Credentials OK:
  store.dispatch(userSignedIn(user))
// If Credentials OK:
  store.dispatch(userInit())
    .then( user => {
      const { locations } = user

      if(!locations) return
// get all user saved locations
      //let loc = locations.map( l => {
      //  return l.city
      //})
      //let l = [...new Set(loc)]
// get all facs for each unique user.location.city
      //store.dispatch(getLocalFacs(l))
    })
    .catch( err => {
      setAuthHeader()
      user.token = ''
      user.new_user = true
      store.dispatch(userSignedIn(user))
      console.log('initialUser: ', err.response.data.error)
    })
}

setLanHeader('bg')
// set Global UI: language, one_city-, banner- mode
store.dispatch(setUI())
// get full Global Products List from products
store.dispatch(getProductList('bg'))

const Root = (
  <Provider store={store}>
    <Router>
      <Route component={App} />
    </Router>
  </Provider>
)

ReactDOM.render(
  Root,
  document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister()
