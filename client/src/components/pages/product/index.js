import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Confirm } from 'semantic-ui-react'

const Product = ({ entry,mode,lan,open,view }) => {
  const ui = {
    en: ['Orders','MENU >','CLOSED','This Bakery is closed. Try again later...'],
    es: ['Pedidos','CARTA >','CERRADO','La panaderia esta cerrada. Checkea mas tarde...'],
    bg: ['Поръчки','МЕНЮ >','ЗАТВОРЕНО','Пекарната е затворена! Опитай по-късно...'],
  }
  const [confirm, confirmOpen] = useState(false)

  let IMAGE_FOLDER = ['pizza','pi2','drinks','pivo','sauce']
  const style = {
    position: 'relative',
    backgroundImage: `url(img/${IMAGE_FOLDER[entry.category-1]}/${entry.list}.png)`,
    backgroundSize: 'cover'
  }

  let dscr = entry.dscr.split(',').join(', ')

  return (
    <div className={mode==='ver'? 'item' : 'product'} style={style}>
      <span>{entry.name}</span>
        <span
          style={{
              maxWidth: '380px',
              display: 'flex',
              color: 'white',
              overflowX: 'hidden',
              backgroundColor: 'rgba(180,90,0,.5)'
            }}>
          {dscr}
        </span>
      {entry.category<3 && <div className='bottom-div'>
        <Button size='small' color='black' basic
          content={mode==='ver'? ui[lan][0] : ui[lan][1]}
          as={Link} to={mode==='ver'? '/order' : '/catalog'}
          onClick={ e => {
            if(!open && mode==='ver') {
              e.preventDefault()
              confirmOpen(true)
              return
            }
          }}
        />
      </div>}
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
