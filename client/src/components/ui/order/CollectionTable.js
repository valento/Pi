import React from 'react'
import { Grid,Icon } from 'semantic-ui-react'
import OrderLine from './OrderLine'

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
          {data.map( entry => {
            const { id,ordered_at,pick_up_time,...rest} = entry
            return (
              <OrderLine key={entry.id} id={entry.id}
                data={rest}
                ordered={new Date(entry.ordered_at)}
                pickup={new Date(entry.pick_up_time)}
              />
            )
          })}

        </Grid>
  )
}

export default CollectionTable
