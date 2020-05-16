import React from 'react'
import { connect } from 'react-redux'
import { Divider } from 'semantic-ui-react'
import Order from '../ui/order/Order'
import ProductsList from './product/ProductsList'
import MenuList from '../ui/menus/categories'

//import { fireSocket } from '../../websocket'


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
    //this.fire()
  }

  //componentDidMount = () => {
  //  const { uid,membership } = this.props.user
  //  const { facs } = this.props
  //}
  //componentWillUnmount() {
  //  closeSocket()
  //}

  //fire = () => {
  //  const { uid,membership } = this.props.user
  //  const { facs } = this.props
  //  console.log('UTF8: ',uid,membership,facs.id)
    //fireSocket(null,JSON.stringify({ user: uid, role: membership, fac: facs.id, order: true }))
  //}

  render(){
    const { lan,city,products,facs } = this.props
    const { category,item } = this.state

    let l = facs.products
    .map( entry => {
      let p = products.find( i => i.id === entry.product )
      return Object.assign(entry,p)
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
  user: state.user,
  products: state.products
})

export default connect(mapStateToProps)(OrdersPage)
