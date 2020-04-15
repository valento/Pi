import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button,Divider } from 'semantic-ui-react'
import PropType from 'prop-types'

import OrderInput from '../../forms/OrderInput'
import OrderList from './OrderList'

import { addCart } from '../../../actions/cart'

class Order extends React.Component {
  state = {
    ui: {
      en: ['pizza order', 'Order', 'Pizza', 'P2', 'Drink', 'Beer', 'Sauce'],
      es: ['pedido', 'Pedido', 'Pizza', 'P2', 'Gaseosa', 'Serveza', 'Salsa'],
      bg: ['поръчка','Поръчай', 'Пица', 'П2', 'Напитка', 'Бира', 'Сос']
    },
    order: []
  }

  onDeleteItem = ind => {
    this.setState({
      order: [
        ...this.state.order.slice(0,ind),
        ...this.state.order.slice(ind+1)
      ]
    })
  }

  onAddItem = (item,units) => {
    console.log(Number(units)+ ' of ' +item)
    let ind = this.state.order.findIndex( o => {
      return o.product === item
    })
    let inx = this.props.products.findIndex( ent => {
      return ent.id === item
    })
    if( ind > -1 ) {
      this.setState({
        order: [...this.state.order.slice(0,ind),
          {...this.state.order[ind], quant: this.state.order[ind].quant + Number(units)},
          ...this.state.order.slice(ind+1)
        ]
      })
    } else {
      this.setState({
        order: this.state.order.concat({
          product: item,
          quant: Number(units),
          name: this.props.products[inx].name,
          price: this.props.products[inx].price
        })
      })
    }
  }

  onOrder = e => {
    this.props.addCart(this.state.order)
  }

  componentDidMount() {
    const { cart } = this.props
    console.log('OrderComponent Mount: ', cart.length);
    if(cart.length > 0){
      this.setState({
        order: this.props.cart
      })
    }
  }

  render() {
    let total = 0, primary_loc_id = 0, primary_loc_fac_open = 0, items, product_index
    const { lan,products,facs,user,cart,category,itemSelected } = this.props

    if(user.locations) {
      user.locations.forEach( loc => {
        if(loc.prime) {
          primary_loc_fac_open = facs[loc.location].open
          primary_loc_id = loc.location
        }
      })
    }

    console.log('List Products for FAC on: ', primary_loc_id, primary_loc_fac_open)
    if(primary_loc_id>0 && primary_loc_fac_open) {
      items = facs[primary_loc_id].products.map( (item,ind) => {
        let i = products.findIndex( it => {
          return it.id === item.product
        })
        return {
          value: item.product,
          text: products[i].name,
          key: ind
        }
      })
    } else {
      items = products.map( (item,ind) => {
        return {
          value: item.product,
          text: item.name,
          key: ind
        }
      })
    }

    const ui = this.state.ui[lan]
    const { order } = this.state

    let sum = order.map( o => {
      return (parseFloat(o.price)*parseFloat(o.quant)).toFixed(2)
    })

    if(sum.length > 0) {
      total = sum.reduce((acc, cv) => (parseFloat(acc) + parseFloat(cv)).toFixed(2))
    }

    let ttl = ui[1].concat(' ',ui[category+1])

    return (
      <div className='custom-form'>
        <Divider horizontal>{ttl}</Divider>
        <OrderInput lan={lan} category={category} items={items} onAddItem={this.onAddItem} onItemSelect={itemSelected} />
        <OrderList stat={false} lan={lan} cart={order} onDelete={this.onDeleteItem} />
        <Divider horizontal>&#9675;</Divider>
        <Button
          as={Link} to='/cart'
          width={8}
          disabled={this.state.order.length === 0}
          color='orange'
          className='submit-but'
          content={ui[1].concat(': ', total.toString())}
          onClick={this.onOrder}
        />
      </div>
    )
  }
}

Order.propTypes = {
  cart: PropType.array.isRequired
}

const mapStateToProps = state => ({
  facs: state.facs,
  cart: state.cart,
  order: state.order,
  user: state.user
})
export default connect(mapStateToProps, {addCart})(Order)
