import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button,Divider,Message } from 'semantic-ui-react'
import PropType from 'prop-types'
import OrderList from '../ui/order/OrderList'
import UserLocations from '../ui/user/UserLocationsList'
import { getLocationData } from '../../actions/user'
import { cancelCart,makeCart } from '../../actions/cart'
//import socket from '../../websocket'

class CartPage extends React.Component {
  state = {
    ui: {
      en:['Order','Where to:','Order:','Cancel','Add','You must give us a location!',
      'Oreder recieved','Tu Pick up', 'Or', 'Success', 'Error'],
      es:['Orden','Para donde:','Pedir','Cancelar','Más','Necesitamos dirección de entrega!',
      'Pedido recibido','Para recojer', 'O', 'Exitoso', 'Error'],
      bg:['Поръчка','За къде:','Поръчай','Откажи','Още','Трябва ни адрес на доставка!',
      'Поръчката е приета','За Вземане', 'Или', 'Честито!', '!Грешка!']
    },
    currentLocation: 0,
    delivery: 1,
    message: {}
  }

  onLocationSlected = l => {
    console.log(l)
    this.setState({
      currentLocation: l,
      message: {}
    })
  }

  componentDidMount() {
    const { locations } = this.props.user
    const { fac,getLocationData } = this.props
    if(fac.delivery === 4) {this.setState({delivery: 0})}
    if(!locations || locations.length === 0) return
    locations.forEach( (entry,ind) => {
      getLocationData(entry.location,ind)
    })
    //socket.send('Cart Component did mount')
  }

  onOrder = e => {
    let prime = 0, defLoc
    const {user,cart,lan,fac} = this.props
    const {currentLocation,message,delivery} = this.state
// Sum Total to Pay:
    let sum = cart.map( o => {
      return (parseFloat(o.price)*parseFloat(o.quant)).toFixed(2)
    })
    let total = sum.reduce((acc, cv) => (parseFloat(acc) + parseFloat(cv)).toFixed(2))

    if(!delivery){
      this.props.makeCart({user_location: null, cart: cart, delivery: delivery, fac_id:fac.id, total: total})
        .then( msg => this.setState({ message: {stat: msg} }) )
        .catch( err => this.setState({ message: {err} }) )
    } else {
      user.locations.forEach( l => {
        if(l.prime && l.prime !== 0){
          prime = l.id
          console.log('Deliver ',prime)
        }
      })
      if(!prime&&!currentLocation){
        this.setState({
          message: {stat: this.state.ui[lan][5]}
        })
        return
      }
      defLoc = currentLocation!==0? currentLocation : prime
      this.props.makeCart({user_location: defLoc, cart: cart, delivery: delivery, fac_id: fac.id, total: total})
        .then( msg => this.setState({ message: {stat: msg} }) )
        .catch( err => this.setState({ message: {err} }) )
    }


    //.catch(err => console.log(err))
    //console.log('Deliver this: ' + order.length + ', there:' + delLoc)
  }

  render() {
    let prime = 0, total = 0
    const { user,cart,lan,city,fac } = this.props
    const { currentLocation,message,delivery } = this.state
    const ui = this.state.ui[lan]
    if(user.locations){
      user.locations.forEach( l => {
        if(l.prime !== 0){
          prime = l.id
        }
      })
    }

    let sum = cart.map( o => {
      return (parseFloat(o.price)*parseFloat(o.quant)).toFixed(2)
    })

    if(sum.length > 0) {
      total = sum.reduce((acc, cv) => (parseFloat(acc) + parseFloat(cv)).toFixed(2))
    }

    console.log(sum,cart)

    return (
      <div className='App-content topped padded'>
        <Divider horizontal>{ui[1]}</Divider>
    {/*Check if No Delivery of User has Locations:*/}
        {(user.locations || fac.delivery === 4 )?
          <UserLocations
            view='select'
            stat={true}
            disabled={fac.delivery === 4}
            current={currentLocation}
            onLocation={this.onLocationSlected}
            list={user.locations? user.locations.filter( l => l.city === city) : []}
            city={city}
            lan={lan}
          /> :
          <div><Button as={Link} to='../user/locations' color='red' icon='warning sign' content={ui[1]} /></div>
        }
        {Object.keys(message).length>0 && !!delivery && <Message negative content={message.stat} />}
        {fac.delivery !== 4 && <Divider horizontal>{ui[8]}</Divider>}
        {fac.delivery !== 4 && <div className='oval-but'>
          <Button fluid content={ui[7]} icon='hand paper' color='blue'/>
        </div>}
        <Divider horizontal>{ui[0]}</Divider>
        {Object.keys(message).length>0?
          <Message positive={message.stat} negative={message.error}>
            <Message.Header>{message.stat? ui[9] : ui[10]}</Message.Header>
              <p>{message.stat? message.stat : message.err}</p>
          </Message> :
          <OrderList stat={true} cart={cart} lan={lan} />
        }
        <Divider horizontal>&#9675;</Divider>
        {<div className='menu-bar'>
          <Button.Group>
            <Button color='grey' onClick={this.props.cancelCart} as={Link} to='/' content={ui[3]}/>
            <Button
              name='submit'
              disabled={total===0 || (!user.locations && fac.delivery !== 4)}
              color='orange'
              onClick={this.onOrder}
              content={ui[2].concat(' ',total.toString())}
            />
            <Button color='grey' as={Link} to='/order' icon='plus' content={ui[4]} />
          </Button.Group>
        </div>}
      </div>
    )
  }
}

CartPage.propType = {
  lan: PropType.string.isRequired,
  user: PropType.shape({
    uid: PropType.number.isRequired
  }),
  cart: PropType.array.isRequired,
  city: PropType.number.isRequired
}

const mapStateToProps = state => ({
  lan: state.settings.lan,
  user: state.user,
  fac: state.facs,
  cart: state.cart,
  city: state.settings.city
})
export default connect(mapStateToProps,{ getLocationData,cancelCart,makeCart })(CartPage)
