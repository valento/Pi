import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import { Button,Divider } from 'semantic-ui-react'
import LogoCircle from '../../pi_circle.svg'
import LogoPie from '../../pi_pie.svg'
import LogoPi from '../../pi_pi.svg'

import Credentials from '../forms/credentials'
import Sign from '../brand/sign'
import MainMenu from './MainMenu'
import AppSetup from '../ui/AppSetup'

import { signUp } from '../../actions/auth'
import { userInit,getLocalFacs } from '../../actions/user'
import { setInterface,getFacStore } from '../../actions/settup'

const HomePage = ({
  isAdmin,isAuthorized,new_user,lan,membership,name,
  city,one_city,cities,signUp,userInit,getLocalFacs,getFacStore
}) => {
  const state = {
    ui: {
      es: ['Bienvenido, ','Hola, ','You\'re in:','Admin','LAB','FAC','PoS','Courier','REP'],
      en: ['Hello, ','Welcome back, ','Estas en:','Admin','LAB','FAC','PoS','Courier','REP'],
      bg: ['Добре дошъл, ','Здравей, ','Намираш се във:','Admin','LAB','FAC','PoS','Куриер','REP']
    }
  }

  let newUser = new_user === undefined || new_user
  console.log('HomePage => New User?: ',newUser)
  let cty = !!one_city? one_city : city
  console.log('No city: ',!!!cty)
  if(!!city){
    let data = {}
    data.city = city
    console.log(data)
    // Set CITY:
          //setInterface(data)
    // API POST FAC Store: get factory+store for location ID
          getFacStore(data)
  }

  return (
    <div className='App-content topped padded'>
      <div className='init central padded'>
        <div className='logo-still'>
          <img src={LogoPie} className='logo' alt='logo' />
          <img src={LogoPi} className='logo-top' alt='logo' />
        </div>


{/* LOG or Register: */}
        {city !== undefined &&
          <p className='vintage no-border'>
            {lan? ( !newUser? state.ui[lan][1]: state.ui[lan][0]) : 'Добре дошъл'}
            {name? name : <Sign size='huge'/>}
          </p>
        }

{/* Find available CITY: !(!!cty) */}
        { city === undefined ?
          <AppSetup lan={lan} list={cities} appsetup='true' name='city' /> :
          !isAuthorized ? <Credentials submit={signUp} getFacs={getLocalFacs} init={userInit} lan={lan} pass={false} /> :
          <MainMenu lan={lan} />
        }

{/* For ADMIN/LAB/FAC/DELIVERY only Interface: */}
        <Divider horizontal />
        {isAuthorized && membership !==64 &&
          <div>
            <Button as={Link} disabled={!city} basic color='blue' to='/admin/home'>Hello, {state.ui[lan][3+Math.log2(membership)]}!</Button>
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
  one_city: state.settings.one_city,
  membership: state.user.membership,
  name: state.user.username,
  isAuthorized: !!state.user.token,
  new_user: state.user.new_user,
  isAdmin: state.user.membership < 32
})

export default connect(mapStateToProps, { signUp,userInit,getLocalFacs,setInterface,getFacStore })(HomePage)
