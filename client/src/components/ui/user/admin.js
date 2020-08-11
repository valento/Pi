import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

const UserAdmin = ({disabled,cart}) => {
  return (
    <div>
      {!disabled?
        <div className='user'>
          <Link to='/user'><Icon name='user' /></Link>
          <span>|</span>
        <Link to='/cart'><Icon color={cart>0? 'red' : ''} name='shopping cart' /></Link>
        </div> :
        <div className='user disabled'>
          <Icon inverted={disabled} name='user' />
          <span>|</span>
          <Icon inverted={disabled} name='shopping cart' />
        </div>
      }
    </div>
  )
}

export default UserAdmin
