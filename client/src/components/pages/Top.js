import React, {useState} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button,Icon,Confirm } from 'semantic-ui-react'
import PropType from 'prop-types'

import { setInterface,setLocationFactory,cancelCart } from '../../actions/settup'
import { closeSocket } from '../../websocket'
import { clearCart } from '../../actions/cart'
import Sign from '../brand/sign'
import UserAdmin from '../ui/user/admin'

const Top = ({
    city,fac,cities,lan,isAuthorized,socket,
    user,
    setInterface,setLocationFactory,clearCart
  }) => {
  const state = {
    ui: {
      en: ['No City','? Change City','You are about to change city/zone'],
      es: ['Ciudad','? Cambiar Ciudad','Estas por cambiar la zona/ciuda de tu orden'],
      bg: ['Град','? Смени Зона/Град','При потвърждение ще смениш града/зоната']
    }
  }
  const [openConfirmation,setConfirmationOpen] = useState(false)

  let cty = state.ui[lan][0]
  if(cities){
    cities.forEach( c => {
      if( c.id === city ) {
        cty = c.alt? c.alt : c.title
      }
    })
  }

  return (
    <div className='ui grid Top'>
      <div className='four wide column'>
        <Link to={ location => {
          if((!fac.checkin && user.membership < 128) || user.membership > 128) {
            return {...location, pathname: '/'}
          }
        }}>
          <Icon name='home' color = {!fac.checkin? 'black' : 'grey'} />
        </Link>
          {city &&
            <Icon.Group>
              <Icon color={fac.open ? 'blue' : 'grey'} name='clock' />
            </Icon.Group>
          }
      </div>
      <div className='eight wide column'>
        <Confirm
          header={state.ui[lan][1]}
          content={state.ui[lan][2]}
          open={openConfirmation}
          onCancel={е => setConfirmationOpen(false)}
          onConfirm={ e => {
            setConfirmationOpen(false)
            setLocationFactory({})
            clearCart()
            if (socket) closeSocket()
            setInterface({city: null, socket: false})
          }}
        />
        <Link to='/'  onClick={ e => setConfirmationOpen(true) }>
          <Icon color={city? 'blue' : 'grey'} name='map marker' />{cty}
        </Link>
      </div>
      <div className='four wide column'>
        <UserAdmin lan={lan} disabled={( isAuthorized && city && user.membership>64 )? false : true} />
      </div>
    </div>
  )
}

Top.propType = {
  fac: PropType.shape({
    id: PropType.number.isRequired
  }).isRequired
}
const mapStateToProps = state => ({
  lan: state.settings.lan,
  socket: state.settings.socket,
  city: state.settings.city,
  fac: state.facs,
  cities: state.settings.cities,
  isAuthorized: !!state.user.token,
  user: state.user
})
export default connect(mapStateToProps, { setInterface,setLocationFactory,clearCart })(Top)
