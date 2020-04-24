import React, {useState} from 'react'
import {connect} from 'react-redux'
import PropType from 'prop-types'
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
import { initSocket,subscribeSocket } from '../../websocket'

const HomePage = ({
  isAuthorized,user,
  fac,
  lan,
  city,one_city,cities,socket,
  signUp,userInit,getLocalFacs,getFacStore,setInterface
}) => {
  const state = {
    ui: {
      es: ['Bienvenido, ','Hola, ','You\'re in:','Admin','LAB','FAC','PoS','Courier','REP'],
      en: ['Hello, ','Welcome back, ','Estas en:','Admin','LAB','FAC','PoS','Courier','REP'],
      bg: ['Добре дошъл, ','Здравей, ','Намираш се във:','Admin','LAB','FAC','PoS','Куриер','REP']
    }
  }

  const { membership,new_user,username,uid } = user

  let newUser = new_user === undefined || new_user
  console.log('HomePage-New User?: ', newUser)
  let cty = !!one_city? one_city : city

// Check User Role:
  const mbr = ['boss','lab','fac','baker','pos','dlv', 'tester','rep','customer']
  let adm = membership ? (membership).toString(2).split('').reverse() : 0
  let _mbr=[], member
  mbr.forEach( (m,i) => {
    if (Number(adm[i])) { _mbr.push(mbr[i]) }
  })
  if(_mbr.length === 0) {
    member = 'home'
  } else {
    member = _mbr.length > 1 ? _mbr.join('/') : _mbr[0]
  }
  console.log(member)

// Get FAC's Store when City's set
  if(!!city && !Object.keys(fac).length>0){
    let data = {}
    data.city = city
// Set CITY:
      //setInterface(data)
// API:POST FAC Store: get factory+store for location ID
    getFacStore(data)
  }

  if(isAuthorized && Object.keys(fac).length>0 && !socket) {
    setInterface({socket: true})
    initSocket(uid,membership,fac.id)
    subscribeSocket()
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
            {username? username : <Sign size='huge'/>}
          </p>
        }

{/* Find available CITY: !(!!cty) */}
        { !city ?
          <AppSetup lan={lan} list={cities} appsetup='true' name='city' /> :
          !isAuthorized ? <Credentials submit={signUp} getFacs={getLocalFacs} init={userInit} lan={lan} pass={false} /> :
          <MainMenu lan={lan} />
        }

{/* For ADMIN/LAB/FAC/DELIVERY only Interface: */}
        <Divider horizontal />
      {isAuthorized && membership && membership < 128 &&
          <div>
            <Button as={Link} disabled={!city} basic color='blue' to={'/admin/'+member}>Hello, {_mbr[_mbr.length-1]}!</Button>
          </div>
        }
      </div>
    </div>
  )
}

HomePage.propType = {
  lan: PropType.number.isRequired
}

const mapStateToProps = state => ({
  lan: state.settings.lan,
  socket: state.settings.socket,
  cities: state.settings.cities,
  city: state.settings.city,
  one_city: state.settings.one_city,
  isAuthorized: !!state.user.token,
  fac: state.facs,
  user: state.user
})

export default connect(mapStateToProps, { signUp,userInit,getLocalFacs,setInterface,getFacStore })(HomePage)
