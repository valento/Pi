import React from 'react'

import Credentials from '../../forms/credentials'

const AdminLogin = ({lan,pass,login}) => {
  return (
    <div className='App-content padded Admin-Page'>
      <Credentials submit={login} lan={lan} pass={true} />
    </div>
  )
}

export default AdminLogin
