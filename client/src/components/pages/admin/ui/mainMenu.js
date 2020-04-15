import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const MainMenu = ({lan,member,onMenu}) => {
  const ui = {
    // 'PRO' for 'products'
    en: ['USER','LOC','PRO','LAB','FAC'],
    es: ['USER','LOC','PRO','LAB','FAC'],
    bg: ['USER','LOC','PRO','LAB','FAC']
  }
console.log(Math.log2(member)+2)
  return (
    <Button.Group color='blue' widths={ui[lan].length}>
      {ui[lan].map( (el,ind) =>
        <Button
          key={ind}
          disabled={member>1 && Math.log2(member)+2 !== ind}
          name={ind}
          content={el}
          onClick={onMenu}
        />)
      }
    </Button.Group>
  )
}

export default MainMenu
