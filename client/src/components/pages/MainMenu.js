import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

class MainMenu extends React.Component {

  state = {
    ui: {
      en: ['Play','Eat','Repeat'],
      es: ['Jugar','Comer','Repetir'],
      bg: ['Играй','Яж','Повтори']
    }
  }

  render(){
    const { lan } = this.props
    const ui = this.state.ui[lan]
    return (
      <div className='menu-bar'>
        <Button.Group color='grey'>
          <Button as={Link} to='/play' icon='play circle' content={ui[0]}/>
          <Button as={Link} to='/order' icon='food' content={ui[1]} />
          <Button as={Link} to='/repeat' icon='undo' content={ui[2]} />
        </Button.Group>
      </div>
    )
  }

}

export default MainMenu
