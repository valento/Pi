import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button,Divider,Table } from 'semantic-ui-react'

import { setInterface } from '../../../../actions/settup'
import { getOrders } from '../../../../actions/order'
import { subscribeSocket,fireSocket,initSocket } from '../../../../websocket'

import CollectionTable from '../../../ui/order/CollectionTable'

const BakerHome = ({uid,lan,fac,membership,socket,getOrders}) => {

  const state={
    ui: {
      en:['Bakery: ','Open Session'],
      es:['Panadería: ','Iniciar sesión'],
      bg:['Пекарна: ','Отвори Сесия']
    }
  }

  const [ data, setData ] = useState([])

  const fetchOrders = () => {
    getOrders(fac.id)
    .then( data => setData(data) )
    .catch( err => console.log(err.message) )
  }

  return (
      <div className='init padded oval-but'>
        <Divider horizontal>{`${state.ui[lan][0]}${fac.name}`}</Divider>
      {/* Incoming Orders Table */}
        <CollectionTable data={data} member={membership} lan={lan} />
      {/* =============================================================== */}
        <Button fluid
          color='blue'
          content={state.ui[lan][1]}
          onClick={e => {
            console.log('Baker Call API: fetchOrders')
            fetchOrders()
            //initSocket(uid,membership,fac.id)
            //subscribeSocket(setInterface)
            //fireSocket(null,JSON.stringify({ user: uid, role: membership, fac: fac.id }))
          }} />
      </div>
  )
}

const mapStateToProps = state => ({
  uid: state.user.uid,
  socket: state.settings.socket,
  lan: state.settings.lan,
  membership: state.user.membership,
  fac: state.facs
})

export default connect(mapStateToProps,{ getOrders })(BakerHome)
