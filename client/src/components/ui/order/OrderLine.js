import React from 'react'
import { Grid } from 'semantic-ui-react'

const OrderLine = props => {
  return (
    <Grid.Row onClick={ e => {
        console.log('Show this ',props.id)
      }}>
      <Grid.Column width={8}>{props.id}</Grid.Column>
      <Grid.Column width={4}>{props.ordered_at? `${props.ordered.getHours()}:${props.ordered.getMinutes()}`: '--'}</Grid.Column>
      <Grid.Column width={4}>{props.pick_up_time? `${props.pickup.getHours()}:${props.pickup.getMinutes()}`: '--'}</Grid.Column>
    </Grid.Row>
  )
}

export default OrderLine
