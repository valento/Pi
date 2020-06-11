import React from 'react'
import { Grid } from 'semantic-ui-react'

const OrderLine = ({ ordered,pickup,id,data,products,onClick }) => {
  let oh,om,ph,pm
  if(ordered) {
    oh = ordered.getHours()
    om = ordered.getMinutes()>9? ordered.getMinutes() :
      `0${ordered.getMinutes()}`
  }

  if(pickup) {
    ph = pickup.getHours()
    pm = pickup.getMinutes()>9? pickup.getMinutes() :
    `0${pickup.getMinutes()}`
  }

  return (
      <Grid.Row onClick={ e => onClick(id)}>
        <Grid.Column width={8}>{id}</Grid.Column>
        <Grid.Column width={4}>{ordered? `${oh}:${om}`: '--'}</Grid.Column>
        <Grid.Column width={4}>{pickup? `${ph}:${pm}`: '--'}</Grid.Column>
      </Grid.Row>
  )
}

export default OrderLine
