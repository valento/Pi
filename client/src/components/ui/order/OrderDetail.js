import React from 'react'
import { connect } from 'react-redux'
import { Grid,Button,Icon } from 'semantic-ui-react'

const OrderDetail = ({data,products}) => {

  const items = data.length>1 ? data.map( d => {
    return { p: products.find( p => p.id===d.item ), q: d.quant, opt: d.options }
  } ) : { p: products.find( p => p.id===data.item ), q: data.quant, opt: data.options }

  return (
    items.length > 1 ?
    items.map( i => {
      return (
        <Grid.Row className='detail nopadd'>
          <Grid.Column width={8}>{i.p.name}</Grid.Column>
          <Grid.Column width={4}>{i.q}</Grid.Column>
          <Grid.Column width={4}><Button size='small' icon='eye' /></Grid.Column>
        </Grid.Row>
      )
    }) :
    <Grid.Row className='detail nopadd'>
      <Grid.Column width={8}>{items.p.name}</Grid.Column>
      <Grid.Column width={4}>{items.q}</Grid.Column>
      <Grid.Column width={4}><Button size='small' icon='eye' /></Grid.Column>
    </Grid.Row>
  )
}


const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps)(OrderDetail)
