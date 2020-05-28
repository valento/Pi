import React from 'react'
import { Message,Divider } from 'semantic-ui-react'

export default class RepeatPage extends React.Component {

  state = {
    ui: {
      es: ['Su Pedido','No haz jugado hoy!','No haz comido hoy!','Coma mas...'],
      en: ['Repeat this:','You\'ve played 0 Games today!','You haven\'t eaten today!','Start now...'],
      bg: [ 'Повтори: ','Не си играл днес!','Не си ял днес!','Започни сега...']
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
            <Message.Header>{ui[2]}</Message.Header>
            <p>{ui[3]}</p>
          </Message>
        </div>

      </div>
    )
  }
}
