import React from 'react'
//import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import HomePage from './components/pages/HomePage'
import Top from './components/pages/Top'
import OrdersPage from './components/pages/OrdersPage'
import CatalogPage from './components/pages/CatalogPage'
import UserRoute from './components/routes/user'
import AdminRoute from './components/routes/admin'
import RoleHome from './components/pages/admin/RoleHome'
import RepeatPage from './components/pages/RepeatPage'
import AdminLogin from './components/pages/admin/AdminLogin'
import PlayPage from './components/pages/PlayPage'
import CartPage from './components/pages/CartPage'
import UserPage from './components/pages/UserPage'
import UserLocationsPage from './components/pages/UserLocationsPage'
import UserLocationEdit from './components/pages/UserLocationEdit'
//import MicroFront from './Microfront'
// Admin Routes:
import Locations from './components/pages/admin/Locations'
import AdminHome from './components/pages/admin/'

// MicroFrontEnds: -----------------------------------------
//const {
//  REACT_APP_CART_HOST: cartHost
//} = process.env
// console.log(process.env)
// expose window global ------------------------------------

//const Cart = ({history}) => (
//  <MicroFront history={history} host={cartHost} name='Cart'/>
//)
// ---------------------------------------------------------

const App = ({location}) => {
  return (
    <div className='App'>
      <Route location={location} path='/' exact component={HomePage}/>
      <Route location={location} path='/' component={Top}/>
{/* ========= ADMIN ================== */}
      <AdminRoute location={location} path='/admin/location' exact component={Locations}/>
      <AdminRoute location={location} path='/admin/home' component={RoleHome}/>
    {/*<AdminRoute location={location} path='/admin/:role' exact component={RoleHome}/>*/}
{/* !!!! MAKE THIS ADMIN ROUTE !!!!! -------------------------------------------------------------------*/}
      {/*<AdminRoute location={location} path='/admin/home' exact component={AdminHome}/>*/}
      <AdminRoute location={location} path='/admin/boss' exact component={AdminHome}/>
{/* ------------ ----------- ---------- ---------- ---------- ---------- ----------- ----------- -------*/}
      <UserRoute location={location} path='/admin' exact component={AdminLogin}/>
{/* ========= USER ================== */}
      <UserRoute location={location} path='/order' exact component={OrdersPage}/>
      <UserRoute location={location} path='/catalog' exact component={CatalogPage}/>
      <UserRoute location={location} path='/repeat' exact component={RepeatPage}/>
      <UserRoute location={location} path='/play' exact component={PlayPage}/>
{/* Switch this for mmicrofrontend CART-route */}
{/*<Route location={location} path='/cart' exact component={Cart} />*/}
      <UserRoute location={location} path='/cart' exact component={CartPage}/>
      <UserRoute location={location} path='/user' exact component={UserPage}/>
      <UserRoute location={location} path='/user/locations' exact component={UserLocationsPage}/>
      <UserRoute location={location} path='/user/location/:id' exact component={UserLocationEdit}/>
    </div>
  )
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
}

//const mapStateToProps = state => ({
//  lan: state.settings.lan
//})

export default App//connect(mapStateToProps)
