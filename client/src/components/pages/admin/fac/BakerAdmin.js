import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button,Divider } from 'semantic-ui-react'

import { setInterface } from '../../../../actions/settup'
import { getOrders } from '../../../../actions/order'

import CollectionTable from '../../../ui/order/CollectionTable'

const BakerAdmin = ({uid,lan,fac,membership,order_counter,socket,getOrders,setInterface}) => {

  const state={
    ui: {
      en:['Bakery: ','Open Session','New Orders: '],
      es:['Panadería: ','Iniciar sesión','Nueva Orden: '],
      bg:['Пекарна: ','Отвори Сесия','Нови поръчки: ']
    }
  }

  const [ data, setData ] = useState([])

  const fetchOrders = () => {
    getOrders(fac.id)
    .then( data => {
        setData(data)
        setInterface({order_counter: 0})
      } )
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
          content={`${state.ui[lan][2]}: ${order_counter}`}
          onClick={e => {
            fetchOrders()
          }} />
      </div>
  )
}

const mapStateToProps = state => ({
  uid: state.user.uid,
  socket: state.settings.socket,
  order_counter: state.settings.order_counter,
  lan: state.settings.lan,
  membership: state.user.membership,
  fac: state.facs
})

export default connect(mapStateToProps,{ getOrders,setInterface })(BakerAdmin)
