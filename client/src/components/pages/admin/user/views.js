import React from 'react'
import UserForm from '../../../forms/user/userForm'

const User = ({view,lan}) => {
  return (
    <div className='topped padded'>
      {view==='email' && <UserForm view={view} />}
      {view==='list' && <div>List Users</div>}
    </div>
  )
}

export default User
