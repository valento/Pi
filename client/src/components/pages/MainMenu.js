import React from 'react'
import { connect } from 'react-redux'
import PropType from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

import { getProductList } from '../../actions/settup'

class MainMenu extends React.Component {

  state = {
    ui: {
      en: ['Play','Eat','Repeat'],
      es: ['Jugar','Comer','Repetir'],
      bg: ['Играй','Яж','Повтори']
    }
  }

  componentDidMount() {
    const { city, getProductList } = this.props
    //getProductList(city)
  }

  render(){
    const { lan,city } = this.props
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

MainMenu.propType = {
  city: PropType.number.isRequired
}

const mapStateToProps = state => ({
  city: state.settings.city
})

export default connect(mapStateToProps, { getProductList })(MainMenu)
