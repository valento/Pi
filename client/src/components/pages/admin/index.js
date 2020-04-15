import React from 'react'
import { connect } from 'react-redux'
import { Divider } from 'semantic-ui-react'
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
    ui: {
      en: ['Admin Home','LAB Admin.','FAC Admin.'],
      es: ['Admin Home','LAB Admin.','FAC Admin.'],
      bg: ['Администрация','LAB Админ.','FAC Админ.'],
    }
  }

  onSubMenu = (e,{name}) => {
    this.setState({
      main: name==='home',
      sView: name
    })
  }

  onMainMenu = (e,{content,name}) => {
    console.log('MainMenu: ',content,name)
    this.setState({
      main: false,
      mView: content.toLowerCase(),
      indx: name
    })
  }

  componentDidMount() {
    const {city,getLocations} = this.props
    if(city){ getLocations('street',city) }
  }

  render() {
    const {lan,city,membership} = this.props
    const { main,indx,sView,mView } = this.state
    const ui = this.state.ui[lan]
// translation props:
    const trans = main? { left: 0 } : {
      left: `-${window.screen.width}px`
    }

    return (
      <div className='App-content padded Admin-Page'>
        <h2>{ui[0]}</h2>
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
  membership: state.user.membership
})

export default connect(mapStateToProps,{ getLocations })(AdminHome)
