import React from 'react'
import { Divider } from 'semantic-ui-react'

import Product from './'

const ProductsList = ({orders,products,lan,category,view,onOrder,item,facs,open,addItem}) => {
  let ui = {
    en: ['MENU PIZZA'],
    es: ['MENU PIZZA'],
    bg: ['МЕНЮ ПИЦИ']
  }
  let l = view==='hor'? (products.length + 1)*100 : 100
  let i = products.findIndex( p => p.id === item)
  let style = view==='hor'?
    {
      minWidth: `${l}vw`,
      left: `-${(i+1)*97.5}vw`
    } :
    {}

  let icons = ['pi','pi2','soft','pivo','sauce','premium']

    return (
      <div className={view==='hor'? 'product-wraper' : null}>
        <div className={view==='hor'? 'product-list' : 'catalog'} style={style}>
          <ul>
            { view==='hor'? <li>
                <div className={('product').concat(' ', icons[category-1])}></div>
              </li> : <li>
                <Divider horizontal>{ui[lan][0]}</Divider>
              </li>
            }
            { products.map(
              entry => {
                return <li>
                        <Product lan={lan}
                          open={facs? facs.open : open}
                          mode={view}
                          entry={entry}
                          onOrder={onOrder}
                          onAddItem={addItem}
                        />
                      </li>
              })
            }
            <li className='empty' style={{minHeight: (orders*28+74).toString().concat('px')}}></li>
          </ul>
        </div>
      </div>
    )

}

export default ProductsList
