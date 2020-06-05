import React from 'react'
import {connect} from 'react-redux'
import PropType from 'prop-types'
import { Link } from 'react-router-dom'
import { Button,Divider,Confirm } from 'semantic-ui-react'
import LogoPie from '../../pi_pie.svg'
import LogoPi from '../../pi_pi.svg'

import Credentials from '../forms/credentials'
import Sign from '../brand/sign'
import MainMenu from './MainMenu'
import AppSetup from '../ui/AppSetup'

import { signUp } from '../../actions/auth'
import { userInit,getLocalFacs } from '../../actions/user'
import { setInterface,getFacStore,socketCounter } from '../../actions/settup'
import { initSocket,subscribeSocket } from '../../websocket'

const HomePage = ({
  isAuthorized,user,
  lab,
  fac,
  lan,
  city,one_city,cities,socket,
  signUp,userInit,getLocalFacs,getFacStore,setInterface,socketCounter
}) => {
  const state = {
    ui: {
      es: ['Bienvenido, ','Hola, ','Estas en:','Admin','LAB',
      'FAC','PoS','Courier','REP','CERRADO'],
      en: ['Hello, ','Welcome back, ','You\'re in:','Admin','LAB',
      'FAC','PoS','Courier','REP','CLOSED'],
      bg: ['Добре дошъл, ','Здравей, ','Намираш се във:','Admin','LAB',
      'FAC','PoS','Куриер','REP','ЗАТВОРЕНО']
    },
    error: {
      header: 'Not Your Bakery!',
      message: 'Change Zone/City?'
    }
  }

  const { membership,new_user,username,uid } = user

//  const [openConfirm,setConfirm] = useState(false)

  let newUser = new_user === undefined || new_user
//  let cty = !!one_city? one_city : city

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
    initSocket(uid,membership,fac.id,setInterface)
    switch(membership) {
      case 1 :
        //subscribeSocket(socketCounter)
        break
      case 2 :
        //subscribeSocket(socketCounter)
        break
      case 4 :
        //subscribeSocket(socketCounter)
        break
      case 8 :
        subscribeSocket(socketCounter)
        break
      case 12 :
        subscribeSocket(socketCounter)
        break
      default :
        subscribeSocket(socketCounter)
    }
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
{/* ===== NO CITY ====================================== */}
{/* Find available CITY: !(!!cty) */}
        { !city ?
          <AppSetup lan={lan} list={cities} appsetup='true' name='city' /> :
          !isAuthorized ? <Credentials
            submit={signUp}
            getFacs={getLocalFacs}
            init={userInit}
            lan={lan} pass={false}
          /> :
          membership>63? <MainMenu lan={lan} open={fac.open} /> : null
        }

{/* For ADMIN/LAB/FAC/DELIVERY only Interface: */}
        <Divider horizontal />
        {isAuthorized && membership && membership < 128 &&
            <Button basic color='blue'
              as={Link}
              to={
                (membership !== 1 && Object.keys(fac).length>0) ?
                '/admin/home' : '/admin/boss'
              }
              disabled={!city}
              //onClick={ e => setConfirm(fac.uid!==user.uid) }
            >
              Hello, {_mbr[_mbr.length-1]}!
            </Button>
        }
  {/* === Closed FAC */}
        {!!city && !fac.open && user.membership>63 &&
          <div className='fac-lable'>
            <div className='fac-closed'>
              <h3>{state.ui[lan][9]}</h3>
            </div>
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

export default connect(mapStateToProps, {
  signUp,userInit,
  getLocalFacs,
  setInterface,
  getFacStore,
  socketCounter
} )(HomePage)
