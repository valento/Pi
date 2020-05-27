import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button,Divider,Icon } from 'semantic-ui-react'

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
  const [ list, setList ] = useState([])


  const fetchOrders = () => {
    if(fac.uid === uid) {
      getOrders(fac.id)
      .then( data => {
        let l = data.map( d => d.id )
          setData(data)
          setList(Array.from(new Set(l)))
          setInterface({order_counter: 0})
        } )
      .catch( err => console.log(err.message) )
    }
  }

  return (
      <div className='init padded oval-but'>
        <Divider horizontal>{`${state.ui[lan][0]}${fac.name}`}</Divider>
      {/* Incoming Orders Table */}
        <CollectionTable data={data} list={list} member={membership} lan={lan} />
      {/* =============================================================== */}
        <br/>
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
