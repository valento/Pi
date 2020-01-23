import React from 'react'
import { Link } from 'react-router-dom'
import { Button,Icon } from 'semantic-ui-react'

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
    <Button.Group color='blue' widths='5'>
      <Button onClick={onMenu} name={ui[lan][subset][0]} icon='home' />
      <Button onClick={onMenu} name={ui[lan][subset][1]} content={ui[lan][subset][1]} />
      <Button onClick={onMenu} name={ui[lan][subset][2]} content={ui[lan][subset][2]} />
      <Button onClick={onMenu} name={ui[lan][subset][3]} content={ui[lan][subset][3]} />
    </Button.Group>
  )
}

export default SubMenu
