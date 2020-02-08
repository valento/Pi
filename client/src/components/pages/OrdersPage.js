import React from 'react'
import { connect } from 'react-redux'
import { Divider } from 'semantic-ui-react'
import Order from '../ui/order/Order'
import ProductsList from './product/ProductsList'
import MenuList from '../ui/menus/categories'


class OrdersPage extends React.Component {
  state = {
    category: 1,
    item: 0
  }

  onCategory = cat => {
    this.setState({
      category: cat,
      item: 0
    })
  }

  onItemSelected = value => {
    this.setState({
      item: value
    })
  }

  render(){
    const { lan,city,products,facs } = this.props
    const { category,item } = this.state

    let l = facs.products
    .map( p => {
      let prod = products.find( i => i.id === p.product )
      return Object.assign(p,prod)
    })

    let cat_list = l.map( i => i.category)

    let list = l.filter( p => p.category === category )

// ProductList.view - hor, ver
    return(
      <div className='App-content topped padded'>
        <ProductsList view='hor' products={list} category={category} item={item} facs={facs} />
        <MenuList lan={lan} cats={cat_list} category={category} onCategory={this.onCategory} />
        <Order products={list} category={category} stat={false} itemSelected={this.onItemSelected} lan={lan} />
      </div>
    )
  }
}



const mapStateToProps = state => ({
  lan: state.settings.lan,
  facs: state.facs,
  city: state.settings.city,
  products: state.products
})

export default connect(mapStateToProps)(OrdersPage)
