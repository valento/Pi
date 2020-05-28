import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const MainMenu = ({ lan,open }) => {

  const state = {
    ui: {
      en: ['Play','Eat','Repeat','See'],
      es: ['Jugar','Comer','Repetir','Ver'],
      bg: ['Играй','Яж','Повтори','Виж']
    }
  }

    const ui = state.ui[lan]
    return (
      <div className='menu-bar'>
        <Button.Group color='grey'>
          <Button as={Link} to='/play' icon='play circle' content={ui[0]}/>
          <Button as={Link}
            to={open? '/order' : '/catalog'}
            icon={open? 'food' : 'eye'}
            content={open? ui[1]:ui[3]}
          />
          <Button as={Link} to='/repeat' icon='undo' content={ui[2]} />
        </Button.Group>
      </div>
    )

}

export default MainMenu
