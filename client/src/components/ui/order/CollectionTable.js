import React from 'react'
import { Grid,Icon } from 'semantic-ui-react'

const CollectionTable =
({lan,data,membership}) => {
  const state = {
    table: {
      en: ['order #','at','door','for'],
      es: ['order #','de','domic.','para'],
      bg: ['поръчка #','от','дост.','за']
    },
    ui: {
      en: ['no','yes'],
      es: ['no','si'],
      bg: ['не','да']
    }
  }
  let tabs = state.table[lan]
// let ui = state.ui[lan]
  return (
        <Grid celled>
          <Grid.Row>
            <Grid.Column width={8}>{tabs[0]}</Grid.Column>
            <Grid.Column width={4}><Icon name='clock' /></Grid.Column>
            <Grid.Column width={4}><Icon name='clock outline' /></Grid.Column>
          </Grid.Row>
          {data.map( e => {
            let ordered = new Date(e.ordered_at)
            let pickup = new Date(e.pick_up_time)
            return (
              <Grid.Row>
                <Grid.Column width={8}>{e.id}</Grid.Column>
                <Grid.Column width={4}>{e.ordered_at? `${ordered.getHours()}:${ordered.getMinutes()}`: '--'}</Grid.Column>
                <Grid.Column width={4}>{e.pick_up_time? `${pickup.getHours()}:${pickup.getMinutes()}`: '--'}</Grid.Column>
              </Grid.Row>
            )
          })}

        </Grid>
  )
}

export default CollectionTable
