import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Divider,Button,Message } from 'semantic-ui-react'
import PropType from 'prop-types'

import { getLocations,checkReference } from '../../actions/settup'
import { addUserLocation,userAddLocation } from '../../actions/user'

import UserLocation from '../forms/ulocation'
import UserLocationList from '../forms/LocationNumbersList'
import UserDoor from '../forms/userDoor'
import LocationRow from '../ui/user/LocRow'
import ReferenceInput from '../forms/RefInput'

class UserLocationsPage extends React.Component {
  state = {
    ui: {
en: ['Delivery Location','Your Street in, ','Your Number:','Save','No service on that location',
    'We\'ve got you! Just open the... which door:','Have a reference..?','No ref','No such reference'
    ],
es: ['Direccion de entrega','Calle-о-Carrera en, ','Tu Numero:','Guardar','No hay servicio en esta direccion',
    'Lo ubicamos! Solo abrenos la... que puerta:','Tienes referencia..?','No tengo','No such reference'
    ],
bg: ['Адрес за доставка','Твоята улица във, ','Номер:', 'Запази','Не обслужваме този адрес',
    'Тук сме! Само отвори вратата... коя врата? :','Имаш референция..?','Нямам','Няма такава референция'
    ]
    },
    data: {},
    input: {},
    errors: {},
    message: false,
    location: false,
    locate: false,
    loc_id: '',
    rep: true
  }
  componentDidMount() {
    if(this.props.city){ this.props.getLocations('street',this.props.city) }
  }

  addData = data => {
    console.log('Add in Locations: ',data)
    this.setState({
      ...this.state,
      data: {...this.state.data, ...data}
    })
  }

  getInput = (value,name) => {
    this.setState({
      input: {...this.state.input, [name]: value}
    })
    let nm = name.concat('s')
    let verified = _.filter(this.props[nm], entry => {
      if(name==='street'){
        return entry.title === value
      } else {
        return Number(entry.title) === value
      }
    })
    if(name!=='location' && verified.length === 0){
      this.setState({
        errors: {[name]: name},
        [name]: false
      })
    } else {
      this.setState({
        errors: _.omit(this.state.errors, [name]),
        [name]: true
      })
    }

  }

// on Reference: CHECK REFERENCE in DB ==============================
  checkReference = ref => {
    this.props.checkReference(ref).then( res => {
      if(res.error){
        this.setState({
          message: true,
          errors: res.error
        })
      } else {
        console.log(res)
        this.setState({
          input: {...this.state.input, ...res},
          data: {...this.state.data, location: res.id, ref: 1},
          loc_id: res.id,
          message: false,
          errors: ''
        })
      }
    })
    .catch( err => {} )
  }

// Don't have a Reference: input Location manualy - street,number =====
  noRef = e => {
    this.setState({
      rep: false,
      loc_id: '',
      message: false,
      errors: ''
    })
  }

// =====================================================================
// =====================================================================
// ======= SUBMIT BUTTONS ==============================================
  onSubmit = e => {
    if(!this.state.locate || this.state.rep ){
      e.preventDefault()
      this.saveLocation()
    } else {
      this.submitLocation()
      // navigate to /user
    }
  }

// Save Street-Number in Local State
  saveLocation = () => {
    if(Object.keys(this.state.errors).length === 0){
      const {rep,loc_id,data} = this.state
      //this.props.addUserLocation({location: rep? loc_id : data.location})
      this.setState({
        rep: false,
        locate: true,
        errors: {},
        message: false
      })
    } else {
      this.setState({
        message: true,
        errors: 4
      })
    }
  }

// Save Full Location into user_location and Global Store
  submitLocation = () => {
    this.props.userAddLocation(this.state.data)
  }

// =====================================================================
// =====================================================================
  render() {
    const { streets,lan,city,cities,locations } = this.props
    const ui = this.state.ui[lan]
    const { street,location,locate,message,input,rep,loc_id } = this.state
    let cty = ''
    if(cities){
      cities.forEach( entry => {
        if(entry.id === city) cty=entry.title
      })
    }
    return (
      <div className='App-content topped padded'>
        <Divider horizontal>{ui[0]}</Divider>
        {!locate?
          <p className={street !== undefined && !street? 'left warent' : 'left'}>
            {rep? ui[6] : ui[1] + cty +':'}
          </p> :
          <LocationRow onClick={checkReference} row={input} stat={true} lan={lan} />
        }
        {rep && <ReferenceInput lan={lan} onRef={this.checkReference} />}
{/* =====  Street First  ===============*/}
        {!locate && !rep &&
          <UserLocation lan={lan}
            name='street'
            getInput={this.getInput}
            onNewData={this.addData}
            list={streets}
            getNumbers={this.props.getLocations}
        />}
{/* =====  User is Locate: get Address details and phone  ===============*/}
        {locations && locations.length > 0 && street && !locate && !rep &&
          <p className={location !== undefined && !location? 'left short warent' : 'left short'}>{ui[2]}
            <UserLocationList
              name='location'
              getInput={this.getInput}
              onNewData={this.addData}
              list={locations}
            />
          </p>
        }
{/* =====  User is Locate: display form from Location details  ===============*/}
        {locate &&
          <div className='custom-form'>
            <Divider horizontal></Divider>
            <p className='vintage left'>{ui[5]}</p>
            <UserDoor lan={lan} addData={this.addData}/>
          </div>
        }
        <Divider horizontal></Divider>
        {message && <Message positive={this.state.errors<3} negative={this.state.errors>2} content={ui[this.state.errors]} />}
        <div className='column sixteen wide oval-but extra-padded'>
{/* =====  Check if User has Reference  =================================*/}
          {rep &&
            <div className='row centered menu-bar'>
              <Button.Group widths='2'>
                <Button color='grey' disabled={!loc_id || loc_id===''}
                  icon='thumbs up'
                  content='OK'
                  onClick={this.onSubmit}
                />
                <Button
                  disabled={loc_id || loc_id!==''}
                  icon='exclamation circle' color='blue' content={ui[7]}
                  onClick={this.noRef}
                />
              </Button.Group>
            </div>
          }
          {!rep &&
            <div className='row centered menu-bar'>
              <Button.Group widths='2'>
                <Button color='grey' content='Clear' />
                <Button
                  as={Link} to='/user'
                  disabled={!location}
                  basic={!location}
                  color='black'
                  content={ui[3]}
                  onClick={this.onSubmit}
                />
              </Button.Group>
            </div>
          }
        </div>
      </div>
    )
  }
}

UserLocationsPage.propType = {
  lan: PropType.string.isRequired,
  city: PropType.number.isRequired
}

const mapStateToProps = state => ({
  city: state.settings.city,
  street: state.settings.street,
  cities: state.settings.cities,
  streets: state.settings.streets,
  locations: state.settings.locations,
  lan: state.settings.lan
})

export default connect( mapStateToProps,
  {
    getLocations,
    addUserLocation,
    userAddLocation,
    checkReference
  }
)(UserLocationsPage)

//<AppSetup lan={lan} list={streets} setup='user_loc' usersetup={true} name='street' />

/* ------- Locations Search List -------------
<UserLocation lan={lan}
  name='location'
  getInput={this.getInput}
  onNewData={this.addData}
  list={locations}
/>
*/
