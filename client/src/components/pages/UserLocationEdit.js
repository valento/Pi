import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button,Divider } from 'semantic-ui-react'

import { userUpdateLocation } from '../../actions/user'
import UserDoor from '../forms/userDoor'

class UserLocationEdit extends React.Component {
  state = {
    ui: {
      en: ['Edit this Location:','Save','Cancel','Reset'],
      es: ['Editar Direccion:','Guardar','Cancelar','Omitir'],
      bg: ['Редактирай Адрес:','Запази','Назад','Откажи']
    },
    input: {}
  }

  onInput = (name,value) => {
    console.log(name,value)
    this.setState({
      input: {...this.state.input, [name]:value}
    })
  }

  onSubmit = e => {
    const { locations,match } = this.props
    let id = Number(locations[match.params.id].id)
    e.preventDefault()
    this.props.userUpdateLocation(match.params.id, id, this.state.input)
  }

  render() {
    const ui = this.state.ui[this.props.lan]
    return (
      <div className='App-content topped padded'>
        <Divider horizontal>{ui[0]}</Divider>
        <div className='custom-form'>
          <UserDoor
            edit={true}
            lan={this.props.lan}
            loc={this.props.locations[this.props.match.params.id]}
            onInput={this.onInput}
          />
        </div>
        <Divider horizontal />
        <div className='row centered menu-bar'>
          <Button.Group widths='3'>
            <Button as={Link} to='/user' content={ui[2]} />
            <Button color='grey' content={ui[3]} />
            <Button color='blue' icon='thumbs up' content={ui[1]} onClick={this.onSubmit} />
          </Button.Group>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  locations: state.user.locations
})
export default connect(mapStateToProps, {userUpdateLocation})(UserLocationEdit)
