import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropType from 'prop-types'
import { Divider,Button,Icon } from 'semantic-ui-react'
import UserLocations from '../ui/user/UserLocationsList'
import { getLocationData } from '../../actions/user'

class UserPage extends React.Component {

  state = {
    ui: {
      en: ['Your Locations:','New','Edit'],
      es: ['Tus direciones:','Nueva','Editar'],
      bg: ['Твоите Адреси:','Адрес','Промени']
    }
  }

  componentDidMount() {
    const { locations } = this.props
    if(!locations || locations.length === 0) return
    //this.props.getLocationData(3)
    this.getLocData(locations)
  }

  componentDidUpdate(prevProps) {
    const { locations } = this.props
    if(!locations) return
    //this.props.getLocationData(3)
    if(!prevProps.locations || prevProps.locations.length !== locations.length){
      this.getLocData(locations)
    }
  }

  getLocData = l => {
    l.forEach( (entry,ind) => {
      this.props.getLocationData(entry.location,ind)
    })
  }

  render() {
    const {lan,locations} = this.props
    const ui = this.state.ui[lan]
    return (
      <div className='App-content topped padded'>
        <Divider horizontal>{ui[0]}</Divider>
        <UserLocations view='list' stat={false} list={locations} lan={lan} />
        <Divider horizontal>&#9675;</Divider>
        <div className='row centered menu-bar'>
          <Button.Group color='grey' widths='2'>
            <Button as={Link} to='/' icon='home' />
            <Button as={Link} to='/user/locations' icon='plus' content={ui[1]} />
          </Button.Group>
        </div>
      </div>
    )
  }
}

UserPage.propType = {
  lan: PropType.number.isRequired
}

const mapStateToProps = state => ({
  locations: state.user.locations
})

export default connect(mapStateToProps,{ getLocationData })(UserPage)
