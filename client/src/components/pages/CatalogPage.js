import React from 'react'
import { connect } from 'react-redux'
import PropType from 'prop-types'

import ProductsList from './product/ProductsList'
import Cart from '../ui/cart/Cart'
import { addCart } from '../../actions/cart'

class Catalog extends React.Component {
  state = {
    category: 1,
    order:[]
  }

  onOrder = item => {
    console.log(item)
  }

  addItem = (i) => {
    const { order,q } = this.state
    const { products,addCart } = this.props
    let ind = order.findIndex( o => (o.product === i.product && !o.hasOwnProperty('promo')) )
    //let inx = products.findIndex( ent => ent.id === i.product )
    //console.log(i);
    if( ind > -1 ) {
      this.setState({
        order: [...order.slice(0,ind),
          {...order[ind], quant: i.quant},
          ...order.slice(ind+1)
        ]
      }, ()=>addCart(this.state.order))
    } else {
      this.setState({
        order: [...order, i]
      }, ()=>addCart(this.state.order))
    }
  }

  componentDidMount() {
    const { cart } = this.props
    console.log('OrderComponent Mount: ', cart.length)
    if(cart.length > 0){
      this.setState({
        order: cart
      })
    }
  }

  render() {
    const { lan,products,facs,addCart } = this.props
    const { category,order } = this.state

    let l = facs.products.map( p => {
        let prod = products.find( i => i.id === p.product )
        return Object.assign(p,prod)
      })
    let list = l.filter( p => p.category === category )


    return (
      <div className='App-content topped padded'>
        <ProductsList view='ver' lan={lan}
          open={facs.open}
          onOrder={this.onOrder}
          addItem={this.addItem}
          products={list}
          orders={order.length}
        />
      <Cart lan={lan} />
      </div>
    )
  }
}

Catalog.propType = {
  products: PropType.array.isRequired,
  facs: PropType.array.isRequired,
  cart: PropType.array.isRequired
}

const mapStateToProps = state => ({
  products: state.products,
  facs: state.facs,
  lan: state.settings.lan,
  cart: state.cart
})

export default connect(mapStateToProps, { addCart })(Catalog)
