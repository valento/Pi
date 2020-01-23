import React from 'react'
import { connect } from 'react-redux'
import { Divider,Button } from 'semantic-ui-react'

import AddLocationForm from '../../forms/admin/addLocation'
import AddRep from './addRep'
import AdminMenu from './ui/menu'
import { addLocation } from '../../../actions/admin/'

class Locations extends React.Component {
  state = {
    view: '',
    ui: {
      en:['Location in:'],
      es:['Localidad en:'],
      bg:['Адрес в:']
    }
  }

  render() {
    const { addLocation,lan,city,cities,streets,isAdmin,view } = this.props
    const ui = this.state.ui[lan]
    return (
      <div className='topped padded'>
        <h3>{ui[0].concat(city? cities[Number(city)-1].title : 'Add City')}</h3>
        <Divider horizontal />
        {view === 'add' &&
          <div className='custom-form'>
            <AddLocationForm lan={lan} city={city} streets={streets} addLocation={addLocation}/>
          </div>
        }
        <Divider horizontal />
        {view === 'rep' && <AddRep admin={true} lan={lan} loc='bg' addLocation={addLocation}/>}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  cities: state.settings.cities,
  streets: state.settings.streets,
  isAdmin: state.user.membership === 1
})
export default connect(mapStateToProps,{ addLocation })(Locations)
