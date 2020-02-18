import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import { Button,Divider } from 'semantic-ui-react'
import Logo from '../../pi_badge.svg'

import Credentials from '../forms/credentials'
import Sign from '../brand/sign'
import MainMenu from './MainMenu'
import AppSetup from '../ui/AppSetup'

import { signUp } from '../../actions/auth'
import { userInit,getLocalFacs } from '../../actions/user'

const HomePage = ({
  isAdmin,isAuthorized,new_user,lan,membership,name,
  city,cities,signUp,userInit,getLocalFacs
}) => {
  const state = {
    ui: {
      es: ['Bienvenido, ','Hola, ','You\'re in:'],
      en: ['Hello, ','Welcome back, ','Estas en:'],
      bg: ['Добре дошъл, ','Здравей, ','Намираш се във:']
    }
  }

  let newUser = new_user === undefined || new_user
  console.log('HomePage => New User?: ',newUser)

  return (
    <div className='App-content topped padded'>
      <div className='init central padded'>
        <img src={Logo} className="logo" alt="logo" />

{/* LOG or Register: */}
        {city !== undefined &&
          <p className='vintage no-border'>
            {lan? ( !newUser? state.ui[lan][1]: state.ui[lan][0]) : 'Добре дошъл'}
            {name? name : <Sign size='huge'/>}
          </p>
        }

{/* Find available CITY: */}
        {city === undefined ?
          <AppSetup lan={lan} list={cities} appsetup='true' name='city' /> :
          !isAuthorized ? <Credentials submit={signUp} getFacs={getLocalFacs} init={userInit} lan={lan} pass={false} /> :
          <MainMenu lan={lan} />
        }

{/* For ADMIN/LAB/FAC/DELIVERY only Interface: */}
        <Divider horizontal />
        {isAuthorized && isAdmin &&
          <div>
            <Button as={Link} basic color='blue' to='/admin/home'>Hello, Admin!</Button>
          </div>
        }
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  lan: state.settings.lan,
  cities: state.settings.cities,
  city: state.settings.city,
  membership: state.user.membership,
  name: state.user.username,
  isAuthorized: !!state.user.token,
  new_user: state.user.new_user,
  isAdmin: state.user.membership === 1
})

export default connect(mapStateToProps, { signUp,userInit,getLocalFacs })(HomePage)
