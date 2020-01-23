import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button,Icon } from 'semantic-ui-react'
import PropType from 'prop-types'

import Sign from '../brand/sign'

import UserAdmin from '../ui/user/admin'

const Top = ({city,facs,cities,lan,isAuthorized}) => {
  const state = {
    ui: {
      en: ['No City'],
      es: ['Ciudad'],
      bg: ['Град']
    }
  }

  let cty = state.ui[lan][0], fli
  if(cities){
    cities.forEach( c => {
      if( c.id === city ) {
        cty = c.alt? c.alt : c.title
        fli = facs.findIndex( f => f[city].city === city )
      }
    })
  }

  return (
    <div className='ui grid Top'>
      <div className='four wide column'>
        <Link to='/'><Icon name='home' /></Link>
          {city &&
            <Icon.Group>
              <Icon color={ fli > -1 && facs[fli][city].open ? 'blue' : 'grey'} name='clock' />
            </Icon.Group>
          }
      </div>
      <div className='eight wide column'><Icon color={city? 'blue' : 'grey'} name='map marker' />{cty}</div>
      <div className='four wide column'>
        <UserAdmin lan={lan} disabled={(isAuthorized && city)? false : true} />
      </div>
    </div>
  )
}

Top.propType = {
  facs: PropType.array.isRequired
}
const mapStateToProps = state => ({
  lan: state.settings.lan,
  city: state.settings.city,
  facs: state.facs,
  cities: state.settings.cities,
  isAuthorized: !!state.user.token
})
export default connect(mapStateToProps)(Top)
