import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button,Divider,Message } from 'semantic-ui-react'
import PropType from 'prop-types'
import OrderList from '../ui/order/OrderList'
import UserLocations from '../ui/user/UserLocationsList'
import { getLocationData } from '../../actions/user'
import { cancelCart,makeCart } from '../../actions/cart'
import socket from '../../websocket'

class CartPage extends React.Component {
  state = {
    ui: {
      en:['Order','Where to:','Order:','Cancel','Add','You must give us a location!','Oreder recieved','Tu Pick up', 'Or'],
      es:['Orden','Para donde:','Pedir','Cancelar','Más','Necesitamos dirección de entrega!','Pedido recibido','Para recojer', 'O'],
      bg:['Поръчка','За къде:','Поръчай','Откажи','Още','Трябва ни адрес на доставка!','Поръчката е приета','За Вземане', 'Или']
    },
    currentLocation: 0,
    error: {}
  }

  onLocationSlected = id => {
    this.setState({
      currentLocation: id,
      error: {}
    })
  }

  componentDidMount() {
    const { locations } = this.props.user
    if(!locations || locations.length === 0) return
    locations.forEach( (entry,ind) => {
      this.props.getLocationData(entry.location,ind)
    })
    socket.send('Cart Component did mount')
  }

  onOrder = e => {
    let prime = 0
    const {user,cart,lan} = this.props
    const {currentLocation,error} = this.state
    user.locations.forEach( l => {
      if(l.prime && l.prime !== 0){
        prime = l.id
        console.log('Deliver ',prime)
      }
    })
    if(!prime&&!currentLocation){
      this.setState({
        error: {message: this.state.ui[lan][5]}
      })
      return
    }
    let defLoc = currentLocation!==0? currentLocation : prime
    this.props.makeCart({location: defLoc, cart: cart})
    //.catch(err => console.log(err))
    //console.log('Deliver this: ' + order.length + ', there:' + delLoc)
  }

  render() {
    let prime = 0, total = 0
    const {user,cart,lan} = this.props
    const { currentLocation,error } = this.state
    const ui = this.state.ui[lan]
    if(user.locations){
      user.locations.forEach( l => {
        if(l.prime !== 0){
          prime = l.id
        }
      })
    }

    let sum = cart.map( o => {
      return (parseFloat(o.price)*parseFloat(o.q)).toFixed(2)
    })

    if(sum.length > 0) {
      total = sum.reduce((acc, cv) => (parseFloat(acc) + parseFloat(cv)).toFixed(2))
    }

    console.log(sum,cart)

    return (
      <div className='App-content topped padded'>
        <Divider horizontal>{ui[1]}</Divider>
        {user.locations?
          <UserLocations
            view='select'
            stat={true}
            current={currentLocation}
            onLocationClick={this.onLocationSlected}
            list={user.locations}
            lan={lan}
          /> :
          <div><Button as={Link} to='../user/locations' color='red' icon='warning sign' content={ui[1]} /></div>
        }
        {Object.keys(error).length>0 && <Message negative content={error.message} />}
        <Divider horizontal>{ui[8]}</Divider>
        <div className='oval-but'>
          <Button fluid content={ui[7]} icon='hand paper' color='blue'/>
        </div>
        <Divider horizontal>{ui[0]}</Divider>
        <OrderList stat={true} cart={cart} onOrder={()=>{}} lan={lan} />
        <Divider horizontal>&#9675;</Divider>
        {<div className='menu-bar'>
          <Button.Group>
            <Button color='grey' onClick={this.props.cancelCart} as={Link} to='/' content={ui[3]}/>
            <Button
              name='submit'
              disabled={total===0 || !user.locations}
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
  cart: PropType.array.isRequired
}

const mapStateToProps = state => ({
  lan: state.settings.lan,
  user: state.user,
  cart: state.cart
})
export default connect(mapStateToProps,{ getLocationData,cancelCart,makeCart })(CartPage)
