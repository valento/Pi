import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button,Divider,Confirm } from 'semantic-ui-react'

import { setInterface } from '../../../actions/settup'
import { userSignedIn } from '../../../actions/auth'
import setAuthHeader from '../../../utils/setAuthHeader'
import { closeSocket } from '../../../websocket'

import BakerHome from './fac/BakerHome'
import AdminDashboard from './AdminDashboard'

const TesterHome = () => {

  return (
    <div className='oval-but'>
      <Divider horizontal>Tester Demo</Divider>
      <p>As a potential partner you can find your-self as a LAB-owner (BOSS),
        a FAC-owner (Baker) or Delivery-courier.<br/>
        Choose a Role to test:
      </p>
      <Button fluid color='black' content='Role: BOSS' /><br/>
      <Button fluid color='orange' content='Role: Baker' /><br/>
      <Button fluid color='grey' content='Role: Courier' /><br/>
      <Divider horizontal> --- </Divider>
    <p>To learn more about business Partner-options:</p>
      <Button color='blue' content='Business Plans'/>
    </div>
  )
}

const AllAdminHome = props => {
  const state = {
    ui: {
      en: ['Unauthorized User!','Not your ','Please, change ','Zone/City','Bakery','LAB','FAC'],
      es: ['Usuario no otorizado!','No es tu ','Porfavor, cambie ','Zone/City','Bakery','LAB','FAC'],
      bg: ['Неуторизиран достъп!','Не си в твоята ','Смени ','Зона/Град','Пекарна','ЛАБ','ФАК']
    }
  }

  const { lan,member,id,fowner,baker,uid,setInterface,userSignedIn } = props
  const { ui } = state

// Check if User UID is Authorized for Zone-Admin:
  let auth
  switch (member) {
    case 1:
      auth = uid===1
      break
    //case 2:
    //  auth = lowner===uid
    //  break
    case 4:
      auth = fowner===uid
      break
    case 8:
    case 12:
      auth = baker===uid
      break
    default:
      auth = true
  }

  return (
    <div className='init top-15 padded oval-but'>
      {member===8 && <BakerHome {...props} />}
      {member===64 && <TesterHome {...props} />}
      <AdminDashboard {...props} />
      <Confirm
        header={`${ui[lan][0]}`}
        content={member === 8?
          `${ui[lan][1]} ${ui[lan][4]}. ${ui[lan][2]} ${ui[lan][4]}` :
          `${ui[lan][1]} ${ui[lan][3]}. ${ui[lan][2]} ${ui[lan][3]}`
        }
        open={!auth}
        onCancel={ e => {
          localStorage.clear()
          setAuthHeader()
          userSignedIn({})
          closeSocket()
          setInterface({socket: false})
        }}
        onConfirm={ e => setInterface({city: null}) }
      />
    </div>
  )
}

export default connect(null,{ setInterface,userSignedIn })(AllAdminHome)
