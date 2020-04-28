import React from 'react'
import { connect } from 'react-redux'
import { Route,Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

const AdminRoute = ({isAdmin, membership, lan, component: Component, ...rest}) => {
  console.log('Log Admin as: ', membership)

  return (
    <Route {...rest} render={ props => (isAdmin || membership<128) ?
        <Component lan={lan} {...props} /> :
        <Redirect to='/admin' />
  }/>)
}

AdminRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  //user: PropTypes.shape({
  //  membership: PropTypes.number.isRequired
  //}).isRequired
}

const mapStateToProps = state => ({
  lan: state.settings.lan,
  isAdmin: state.user.membership === 1,
  membership: state.user.membership
})

export default connect(mapStateToProps)(AdminRoute)
