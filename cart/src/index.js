import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import RootReducer from './rootReducer'
import App from './App'
//import * as serviceWorker from './serviceWorker'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore (
  RootReducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
)

window.updateCart = context => {
  console.log('Main updated Cart: ', context)
}

window.renderCart = ( containerId, history, name ) => {
  const Root = (
    <Provider store={store}>
      <Router>
        <Route component={() => <App name={name} />}/>
      </Router>
    </Provider>
  )
  ReactDOM.render(Root, document.getElementById(containerId))
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister()
