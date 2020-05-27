import React from 'react'
import { Grid } from 'semantic-ui-react'

const OrderLine = ({ ordered,pickup,id,data,products,onClick }) => {

  return (
      <Grid.Row onClick={ e => onClick(id)}>
        <Grid.Column width={8}>{id}</Grid.Column>
        <Grid.Column width={4}>{ordered? `${ordered.getHours()}:${ordered.getMinutes()}`: '--'}</Grid.Column>
        <Grid.Column width={4}>{pickup? `${pickup.getHours()}:${pickup.getMinutes()}`: '--'}</Grid.Column>
      </Grid.Row>
  )
}

export default OrderLine
