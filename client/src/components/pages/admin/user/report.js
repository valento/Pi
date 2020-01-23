import React from 'react'

const User = ({view,lan}) => {
  return (
    <div className='topped padded'>
      {view==='id' && <div>Find User by ID</div>}
      {view==='list' && <div>List Users</div>}
    </div>
  )
}

export default User
