import React from 'react'
import { Divider } from 'semantic-ui-react'
import Order from '../ui/order/Order'

const ProductPage = props => {

  const { lan } = props
  return(
    <div className='App-content central padded'>
      <Order lan={lan} />
    </div>
  )
}

export default ProductPage
