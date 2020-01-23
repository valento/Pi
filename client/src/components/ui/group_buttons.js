import React from 'react'
import { Botton,Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const GroupBut = ({buts}) => {
  return (
    <div className='menu-bar'>
      <Button.Group color='grey'>
        {buts.map( (but,inf) => {
          return <Button key={ind} content='Button' />
        })}
      </Button.Group>
    </div>
  )
}

export default GroupBut
