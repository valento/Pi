import React from 'react'
import PropType from 'prop-types'
import {Icon} from 'semantic-ui-react'

const MenuList = ({lan,category,onCategory,cats}) => {
  const ui = {
    bg: ['пица','π²','напитка','бира','сос'],
    en:['pizza','π²','drinks','beer','sauce'],
    es:['pizza','π²','drinks','beer','salsa'],
    icon:['π','π²','tint','beer','fire']
  }

  let c = []

  for(let i=1; i<6; i++) {
    if(cats.includes( i )){ c.push(i) }
  }

  return (
    <div>
      <ul className="menu-prod">
        {
          c.map( itm => {
            let cl = ( itm === category )? 'active' : ''
            return (
              <li className={ (itm < 3)? cl.concat(' ','pee') : cl }
                onClick={ e => {
                    if(itm !== category){
                      onCategory(itm)
                    }
                  }}>
                {(itm < 3)? ui.icon[itm-1] :
                  <Icon name={ui.icon[itm-1]} size='large' />
                }
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default MenuList
