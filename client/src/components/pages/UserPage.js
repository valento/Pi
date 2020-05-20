import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropType from 'prop-types'
import { Divider,Button } from 'semantic-ui-react'
import UserLocationsList from '../ui/user/UserLocationsList'
import UserPerksList from '../ui/user/UserPerksList'

import { userSignedIn } from '../../actions/auth'
import setAuthHeader from '../../utils/setAuthHeader'
import { getLocationData } from '../../actions/user'
import { setInterface } from '../../actions/settup'
import { closeSocket } from '../../websocket'

class UserPage extends React.Component {

  state = {
    ui: {
      en: ['Your Locations:','New','Edit','Dashboard:','Your Perks:'],
      es: ['Tus direciones:','Nueva','Editar','Controles:','Tus obsequios:'],
      bg: ['Твоите Адреси:','Адрес','Промени','Контроли:','Твоите награди:']
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

  logout = () => {
    console.log('Logout this User')
    localStorage.clear()
    setAuthHeader()
    this.props.userSignedIn({})
    closeSocket()
    this.props.setInterface({socket: false})
  }

  render() {
    const {lan,user,locations,free_pizza,city,fac} = this.props
    const ui = this.state.ui[lan]
    let listLocations = locations ? locations.filter( l => l.city===city ) : []
    return (
      <div className='App-content topped padded oval-but'>
        <Divider horizontal>{ui[0]}</Divider>
      <UserLocationsList disabled={fac.delivery === 4} view='list' stat={false} fac={fac} list={listLocations} lan={lan} />
        {(fac.delivery !== 4 || listLocations.length !== 0) && <Divider horizontal>&#9675;</Divider>}
        {(fac.delivery !== 4 || listLocations.length !== 0) && <div className='row centered menu-bar'>
          <Button.Group color='grey' widths='2'>
            <Button as={Link} to='/' icon='home' />
            <Button disabled={fac.delivery === 4} as={Link} to='/user/locations' icon='plus' content={ui[1]} />
          </Button.Group>
        </div>}
        <Divider horizontal>{ui[3]}</Divider>
        <Divider horizontal>{ui[4]}</Divider>
        <UserPerksList has_perks={free_pizza} new_user={user.new_user} />
        <Divider horizontal />
        <Button fluid color='red'
          content='LOGOUT'
          as={Link} to={'/'}
          onClick={e => {
            this.logout()
          }}
        />
      </div>
    )
  }
}

UserPage.propType = {
  lan: PropType.number.isRequired,
  city: PropType.number.isRequired,
  facs: PropType.shape({
    delivery: PropType.number.isRequired
  }).isRequired,
  user: PropType.shape({
    locations: PropType.array.isRequired,
    free_pizza: PropType.bool.isRequired
  }).isRequired
}

const mapStateToProps = state => ({
  city: state.settings.city,
  fac: state.facs,
  user: state.user
})

export default connect(mapStateToProps,{ getLocationData,userSignedIn,setInterface })(UserPage)
