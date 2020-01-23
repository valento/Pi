import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const MainMenu = ({disabled,lan,onMenu}) => {
  const ui = {
    en: ['USER','LOC','PRO','FAC','LAB'],
    es: ['USER','LOC','PRO','FAC','LAB'],
    bg: ['USER','LOC','PRO','FAC','LAB']
  }

  return (
    <Button.Group color='blue' widths='5'>
      <Button disabled={disabled} onClick={onMenu} name='USER' content={ui[lan][0]} />
      <Button disabled={disabled} onClick={onMenu} name='LOC' content={ui[lan][1]} />
      <Button disabled={disabled} onClick={onMenu} name='PRO' content={ui[lan][2]} />
      <Button disabled={disabled} onClick={onMenu} name='FAC' content={ui[lan][3]} />
      <Button disabled={disabled} onClick={onMenu} name='LAB' content={ui[lan][4]} />
    </Button.Group>
  )
}

export default MainMenu
