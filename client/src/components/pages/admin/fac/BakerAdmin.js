import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button,Divider,Confirm,Icon } from 'semantic-ui-react'

import { setInterface } from '../../../../actions/settup'
import { getOrders } from '../../../../actions/order'

import CollectionTable from '../../../ui/order/CollectionTable'

const BakerAdmin = ({uid,lan,fac,membership,order_counter,socket,getOrders,setInterface}) => {

  const state={
    ui: {
      en:['Bakery: ','Open Session','New Orders: '],
      es:['Panadería: ','Iniciar sesión','Nueva Orden: '],
      bg:['Пекарна: ','Отвори Сесия','Нови поръчки: ']
    },
    error: {
      header: 'Not Your Bakery!',
      message: 'Change Zone/City?'
    }
  }

  const [ data, setData ] = useState([])
  const [ openConfirmation, setConfirmationOpen ] = useState(false)

  const fetchOrders = () => {
    if(fac.uid === uid) {
      getOrders(fac.id)
      .then( data => {
          setData(data)
          setInterface({order_counter: 0})
        } )
      .catch( err => console.log(err.message) )
    } else {
      setConfirmationOpen(true)
    }
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
          <div className='eight wide column'>
            <Confirm
              header={state.error.header}
              content={state.error.message}
              open={openConfirmation}
              onCancel={е => setConfirmationOpen(false)}
              onConfirm={ e => {
                setInterface({
                  city: null,
                  socket: false,
                  order_counter: 0
                })
              }}
            />
          </div>
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
