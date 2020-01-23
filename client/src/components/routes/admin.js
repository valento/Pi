import React from 'react'
import { connect } from 'react-redux'
import { Route,Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

const AdminRoute = ({isAdmin, lan, component: Component, ...rest}) => {
  console.log('?Admin: ',isAdmin)
  return (
    <Route {...rest} render={props => isAdmin? <Component lan={lan} {...props} /> : <Redirect to='/admin' />} />
  )
}

AdminRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  lan: state.settings.lan,
  isAdmin: state.user.membership === 1
})

export default connect(mapStateToProps)(AdminRoute)
