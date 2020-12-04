import React from 'react'

import OrderRow from './OrderRow'

const OrderList = ({stat,cart,lan,member,onDelete}) => {

  return (
    <div className={cart.length===0? 'order-list empty' : 'order-list'}>
      {cart.map( (item,ind) => {
        return(<OrderRow stat={stat} lan={lan} key={ind} member={member} onDelete={onDelete} row={item} ind={ind} />)
      })}
      {cart.length === 0 && <OrderRow empty={true} lan={lan} />}
    </div>
  )
}

export default OrderList
