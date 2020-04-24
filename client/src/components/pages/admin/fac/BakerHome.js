import React from 'react'
import { connect } from 'react-redux'
import { Button,Divider } from 'semantic-ui-react'

import { subscribeSocket,fireSocket,initSocket } from '../../../../websocket'

const BakerHome = ({uid,lan,fac,membership}) => {
  initSocket(uid,membership,fac.id)
  subscribeSocket()
  const state={
    ui: {
      en:['Bakery: ','Open Session'],
      es:['Panadería: ','Iniciar sesión'],
      bg:['Пекарна: ','Отвори Сесия']
    }
  }
  return (
    <div className='App-content topped padded'>
      <div className='init padded oval-but'>
        <Divider horizontal>{`${state.ui[lan][0]}${fac.name}`}</Divider>
        <Button fluid
          color='blue'
          content={state.ui[lan][1]}
          onClick={e => {
            fireSocket(null,JSON.stringify({ user: uid, role: membership, fac: fac.id }))

          }} />
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  uid: state.user.uid,
  membership: state.user.membership,
  fac: state.facs
})

export default connect(mapStateToProps)(BakerHome)
