import React from 'react'
import { connect } from 'react-redux'
import { Divider } from 'semantic-ui-react'

import AddLocationForm from '../../forms/admin/addLocation'
import AddRep from './addRep'
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
    const { addLocation,lan,city,cities,streets,view } = this.props
    const ui = this.state.ui[lan]
    let cty = cities.length>0? cities.find(element => {
      console.log(element.id)
      return element.id === city
    }) : ''
    console.log('city?: ', cities.length, cty.title)
    return (
      <div className='topped padded'>
        <h3>{ui[0].concat(' ',city? cty.alt : 'Add City')}</h3>
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
  streets: state.settings.streets
})
export default connect(mapStateToProps,{ addLocation })(Locations)
