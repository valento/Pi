import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Confirm } from 'semantic-ui-react'
import OrderBar from './orderBar'

const Product = ({ entry,mode,lan,open,view,onAddItem }) => {
  const ui = {
    en: ['Orders','MENU >','CLOSED','This Bakery is closed. Try again later...'],
    es: ['Pedidos','CARTA >','CERRADO','La panaderia esta cerrada. Checkea mas tarde...'],
    bg: ['Поръчки','МЕНЮ >','ЗАТВОРЕНО','Пекарната е затворена! Опитай по-късно...'],
  }
  const [confirm, confirmOpen] = useState(false)
  const [count, countItem] = useState(0)
  const [item, setItem] = useState(0)

  let IMAGE_FOLDER = ['pizza','pi2','drinks','pivo','sauce']
  const style = {
    position: 'relative',
    backgroundImage: `url(img/${IMAGE_FOLDER[entry.category-1]}/${entry.list}.png)`,
    backgroundSize: 'cover'
  }

  let dscr = entry.dscr.split(',').join(', ')
  const { product,name,price } = entry

  const addItem = q => {
    if(q>0) {
      onAddItem({product: product, quant: q, price:price, name:name})
  }}

  return (
      <div className={mode==='ver'? 'item' : 'product'} style={style}>
        <span className='ttl'>{entry.name}</span>
        <span className={mode==='ver'? 'dscr' : ''}>{dscr}</span>
        {entry.category<3 && <OrderBar open={!!open} mode={mode} lan={lan} onAddItem={addItem} />}
        <Confirm
          header={open? ui[lan][4] : ui[lan][2]}
          content={open? ui[lan][4] : ui[lan][3]}
          open={confirm}
          onConfirm={ e => confirmOpen(false) }
          onCancel={ e => confirmOpen(false) }
        />
      </div>
  )
}

export default Product
