import React from 'react'
import { Button,Icon } from 'semantic-ui-react'

const OrderRow = ({stat,empty,row,onDelete,ind,lan}) => {
  const state = {
    list: [],
    ui: {
      en: ['Nothing to order yet....'],
      es: ['Nada de ordenar....'],
      bg: ['Нищо за поръчване за сега...']
    }
  }

  return (
    <div>
      {empty? state.ui[lan][0] :
        (
          <div className='ui grid item'>
            <div className='two wide column nopad items'>
              {!stat && <Icon name='eye' />}
            </div>
            <div className='six wide column nopad'>{row.name}</div>
            <div className='three wide column nopad items'><Icon name='x' size='tiny' />{row.q}</div>
            <div className='three wide column nopad'>{(parseFloat(row.price)*parseFloat(row.q)).toFixed(2)}</div>
            <div className='two wide column nopad'>
              {!stat && <span className='' basic onClick={() => onDelete(ind)}><Icon name='minus circle' /></span>}
            </div>
          </div>
        )
      }
    </div>
  )

}

export default OrderRow
