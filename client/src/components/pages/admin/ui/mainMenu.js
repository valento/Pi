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
<Button.Group color='blue' widths={ui[lan].length}>
  {ui[lan].map( (el,ind) =>
    <Button
      key={ind}
      disabled={disabled}
      name={ind}
      content={el}
      onClick={onMenu}
    />)
  }
</Button.Group>
  )
}

export default MainMenu
