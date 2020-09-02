import React from 'react'
import { connect } from 'react-redux'
import { Route,Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

const AdminRoute = ({membership,city,lan,component: Component, ...rest}) => {
  console.log('Log Admin as: ', membership)

  return (
    <Route {...rest} render={ props => ((membership<128) && city) ?
        <Component lan={lan} {...props} /> :
        city? <Redirect to='/admin' /> : <Redirect to='/' />
  }/>)
}

AdminRoute.propTypes = {
  component: PropTypes.func.isRequired,
  membership: PropTypes.number.isRequired,
  //user: PropTypes.shape({
  //  membership: PropTypes.number.isRequired
  //}).isRequired
}

const mapStateToProps = state => ({
  lan: state.settings.lan,
  city: state.settings.city,
  membership: state.user.membership
})

export default connect(mapStateToProps)(AdminRoute)
