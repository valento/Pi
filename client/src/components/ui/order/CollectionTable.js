import React, { useState } from 'react'
import { Grid,Icon } from 'semantic-ui-react'
import OrderLine from './OrderLine'
import OrderDetail from './OrderDetail'

const CollectionTable =
({lan,list,data,membership}) => {

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

  const [ detail, detailID ] = useState(null)
// let ui = state.ui[lan]
  return (
        <Grid celled className='nopadd'>
          <Grid.Row>
            <Grid.Column width={8}>{tabs[0]}</Grid.Column>
            <Grid.Column width={4}><Icon name='clock' /></Grid.Column>
            <Grid.Column width={4}><Icon name='clock outline' /></Grid.Column>
          </Grid.Row>
          {list.map( l => {
            let entry = data.filter( e => e.id===l)
            let details = entry.length>1 ? entry.map( d=>d.rest) : entry[0].rest
            const { id,ordered_at,pick_up_time} = entry[0]
            return (
              <Grid celled className='order nopadd'>
                <OrderLine key={id}
                  id={id}
                  onClick={ e => detailID(id)}
                  ordered={new Date(ordered_at)}
                  pickup={new Date(pick_up_time)}
                />
              {detail===id && <OrderDetail data={details} />}
              </Grid>

            )
          })}

        </Grid>
  )
}

export default CollectionTable
