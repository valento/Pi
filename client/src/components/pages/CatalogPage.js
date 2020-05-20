import React from 'react'
import { connect } from 'react-redux'
import PropType from 'prop-types'

import ProductsList from './product/ProductsList'

class Catalog extends React.Component {
  state = {
    q: 0,
    category: 1
  }

  onOrder = item => {
    console.log(item)
  }

  render() {
    const { lan,city,products,facs } = this.props
    const { category } = this.state
    const fli = facs.findIndex( f => f[city].city === city )

    let l = facs[fli][city].products
    .map( p => {
      let prod = products.find( i => i.id === p.product )
      return Object.assign(p,prod)
    })
    let list = l.filter( p => p.category === category )


    return (
      <div className='App-content topped padded'>
        <ProductsList view='ver' lan={lan} onOrder={this.onOrder} products={list} />
      </div>
    )
  }
}

Catalog.propType = {
  products: PropType.array.isRequired,
  city: PropType.number.isRequired,
  facs: PropType.array.isRequired
}

const mapStateToProps = state => ({
  products: state.products,
  facs: state.facs,
  city: state.settings.city,
  lan: state.settings.lan
})

export default connect(mapStateToProps)(Catalog)
