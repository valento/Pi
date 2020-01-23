import React from 'react'
import { Message,Divider } from 'semantic-ui-react'

export default class RepeatPage extends React.Component {

  state = {
    ui: {
      es: ['Su Pedido','Por ahora no hay juegos','Vuelva pronto...'],
      en: ['Play Home','No Games to play yet','Come back soon...'],
      bg: ['Игри','Няма игри за сега','Провери отново скоро...']
    }
  }

  render(){
    const { lan } = this.props
    const ui = this.state.ui[lan]
    return(
      <div className='App-content central padded'>
        <div className='margined full-width'>
          <Divider horizontal>{ui[0]}</Divider>
          <Message negative>
            <Message.Header>{ui[1]}</Message.Header>
            <p>{ui[2]}</p>
          </Message>
        </div>

      </div>
    )
  }
}
