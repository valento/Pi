import React from 'react'
import { connect } from 'react-redux'
import { Divider,Checkbox,Grid } from 'semantic-ui-react'

import { userSignedIn } from '../../../actions/auth'
import setAuthHeader from '../../../utils/setAuthHeader'

import Locations from './Locations'
import User from './user/views'
import MainMenu from './ui/mainMenu'
import SubMenu from './ui/subMenu'

import { getLocations } from '../../../actions/settup'

class AdminHome extends React.Component {
  state = {
    main: true,
    mView: '',
    sView: '',
    logged: false,
    checkin: false,
    ui: {
      en: ['Admin','LAB Admin.','FAC Admin.'],
      es: ['Admin','LAB Admin.','FAC Admin.'],
      bg: ['Админ','LAB Админ.','FAC Админ.'],
    }
  }

  onSubMenu = (e,{name}) => {
    this.setState({
      main: name==='home',
      sView: name
    })
  }

  onMainMenu = (e,{content,name}) => {
    this.setState({
      main: false,
      mView: content.toLowerCase(),
      indx: name
    })
  }

  onCheck = (e,{name}) => {
    this.setState(prevState => ({[name]: !prevState[name]}))
    switch(name) {
      case 'checkin' :
        if( !this.state.checkin ) {
          console.log('Check Boss In-Out')
        }
      break
      case 'logged' :
        if ( this.state.logged ) this.closeSession()
      break
    }
  }

  closeSession = id => {
    localStorage.clear()
    setAuthHeader()
    this.props.userSignedIn({})
  }

  componentDidMount() {
    const {city,getLocations,user,logedin} = this.props
    if(city){
      getLocations('street',city)
      this.setState({
        logged: logedin
      })
    }
  }

  render() {
    const {lan,city,membership} = this.props
    const { main,sView,mView } = this.state
    const ui = this.state.ui[lan]
// translation props:
    const trans = main? { left: 0 } : {
      left: `-${window.screen.width}px`
    }

    return (
      <div className='App-content padded Admin-Page'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <Checkbox name='logged'
                checked={this.state.logged}
                disabled={this.state.checkin}
                label={<label>{this.state.login? 'Login' : 'Logout'}</label>}
                onChange={this.onCheck} toggle
              />
            </Grid.Column>
            <Grid.Column width={4} />
            <Grid.Column width={6}>
              <Checkbox name='checkin'
                checked={this.state.checkin}
                disabled={!this.state.logged}
                label={<label>{this.state.checkin? 'Close' : 'Open'}</label>}
                onChange={this.onCheck} toggle
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <br/>
      <div className='menu-bar carrousel move' style={trans}>
        <MainMenu lan={lan} member={membership} onMenu={this.onMainMenu} />
        <Divider horizontal />
        {!main && <SubMenu member={membership} subset={mView} lan={lan} onMenu={this.onSubMenu} />}
      </div>
      {/*
=========================
  Use A Switch instead
=========================
      */}

        {sView === 'email' && <User view={sView} lan={lan} />}
        {sView === 'list' && <User view={sView} lan={lan} />}
        {sView === 'add' && <Locations city={city? city : false} view={sView} lan={lan} />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  city: state.settings.city,
  cities: state.settings.cities,
  membership: state.user.membership,
  logedin: !!state.user.token
})

export default connect(mapStateToProps,{ getLocations,userSignedIn })(AdminHome)
