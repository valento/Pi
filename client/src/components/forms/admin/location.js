import React from 'react'
import { Form,Button,Message } from 'semantic-ui-react'
import SearchSetupForm from '../SearchSetupForm'

export default class LocationForm extends React.Component {
  state = {
    data: {},
    ui: {
      en: ['Street','City','#','Save','Edit','Reset','System message:','Country'],
      es: ['Calle','Ciudad','#','Guardar','Editar','Cancelar','Mensaje del sistema:','Pais'],
      bg: ['Улица','Град','#','Запази','Редактирай','Изчисти','Системно съобщение:','Държава']
    },
    message: '',
    msgClosed: true
  }

  onReset = e => {
    if(e) {e.preventDefault()}
    this.setState({
      data:{}
    })
  }

  closeMessage = e => {
    e.preventDefault()
    this.setState({
      message: {}
    })
  }

  onChange = (e, {name,value}) => {
    value = (name === 'number')? Number(value) : value
    this.setState({data: { ...this.state.data, [name]: value}})
  }
  onCity = (e, {name,value}) => {
    const {city} = this.state
    const {loc} = this.props
    const ind = city[loc].findIndex( e => {
      return e.c === value
    })
    const { code } = city[loc][ind]
    this.setState({data: { ...this.state.data, ...{[name]: value, post: code}}})
  }

  onSubmit = () => {
    this.props.addLocation(this.state.data)
    .then(res => {
      this.setState({...this.state, ...res})
    })
    this.onReset()
  }

  render() {
    const { lan,cities,streets } = this.props
    const {data,message,msgClosed} = this.state
    const ui = this.state.ui[lan]
    const street = 'street_bg'
    const city = 'city_bg'
    let _options= [],
        opts = []
    if(cities && !streets){
      opts = cities['bg'].map( e => {
        return e.c
      })
      opts = opts.sort()
      _options = opts.map( (entr,ind) => ({
        key:ind+1,
        value:entr.id,
        text:entr.ttl
      }))
    } else if(streets) {
      _options = streets.map( (entr,ind) => ({
        key:ind+1,
        value:entr.id,
        text:entr.ttl
      }))
    }
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group>
          <div className='ui grid'>
            {Object.keys(message).length>0 &&
              <div className='margined full-width'>
                <Message as='div' positive={true} size='tiny'
                  onDismiss={this.closeMessage}
                  header={ui[6]}
                  content={message}
                />
            </div>}
            {cities && <div className='row'>
              <div className='column'>
                <Form.Select onChange={this.onCity}
                  name={city} placeholder={ui[1]} options={_options}
                  value={data[city] || ''}
                />
              </div>
            </div>}
            {streets && <SearchSetupForm appsetup={true} name='street' list={streets} lan={lan}/>}

            {!streets && !cities &&
              <div className='row centered menu-bar'>
                <Button.Group color='grey' widths='2'>
                  <Button onClick={this.onReset} content={ui[5]} />
                  <Button color='blue' type='submit' color='blue' content={ui[3]} />
                </Button.Group>
              </div>
            }
          </div>

        </Form.Group>
      </Form>
    )
  }
}

/*
<div className='row'>
  <div className='twelve wide column'>
    <Form.Input onChange={this.onChange} value={data[street] || ''} name={street} placeholder={ui[0]} />
  </div>
  <div className="four wide column">
    <Form.Input onChange={this.onChange} value={data.number || ''} name='number' type='number' placeholder={ui[2]} />
  </div>
</div>
*/
