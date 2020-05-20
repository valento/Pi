import React from 'react'
import { Button } from 'semantic-ui-react'

const SubMenu = ({lan,onMenu,subset}) => {
  const ui = {
    en: {
      user: ['home','email','list','order'],
      pro: ['home','add','edit','rep'],
      loc: ['home','add','edit','rep'],
      fac: ['home','add','edit','rep'],
      lab: ['home','add','edit','rep']
    },
    es: {
      user: ['home','email','list','order'],
      pro: ['home','add','edit','rep'],
      loc: ['home','add','edit','rep'],
      fac: ['home','add','edit','rep'],
      lab: ['home','add','edit','rep']
    },
    bg: {
      user: ['home','email','list','order'],
      pro: ['home','add','edit','rep'],
      loc: ['home','add','edit','rep'],
      fac: ['home','add','edit','rep'],
      lab: ['home','add','edit','rep']
    }
  }
  return (
    <Button.Group color='blue' className='submenu'>
      {ui[lan][subset].map( (itm,indx) => {
        return <Button onClick={onMenu} name={itm} content={!!indx? itm : ''}  icon={!indx? 'home' : ''} />
      })}
    </Button.Group>
  )
}

export default SubMenu
