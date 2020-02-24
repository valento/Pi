import React from 'react'
import { Form,Button,Message } from 'semantic-ui-react'
import SearchSetupForm from '../SearchSetupForm'

/*
# CHECK SETTINGS: ?: if City, ?: if Street
# Then: Add City or Street or Location
*/

export default class AddLocationForm extends React.Component {
  state = {
    data: {},
    bg: '',
    lat: '',
    code: '',
    number: '',
    ui: {
      en: ['Street:lat','City:bg','City:lat','#','Next','Edit','Reset',
        'System message:','Country','post','Street:bg','Add Location','Add New Street'
        ],
      es: ['Calle:lat','Ciudad:bg','City:lat','#','Seguir','Editar',
        'Cancelar','Mensaje del sistema:','Pais','postal','Calle:bg','Add Location','Add New Street'
        ],
      bg: ['Улица:лат','Град:бг','Град:лат','#','Запази','Редактирай',
        'Изчисти','Системно съобщение:','Държава','код','Улица:бг','Прибави Адрес','Прибави Нова Улица'
        ]
    },
    message: '',
    msgClosed: true,
    locate: false
  }

  onReset = e => {
    if(e) {e.preventDefault()}
    this.setState({
      data:{},
      bg:'',
      lat:'',
      code:''
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
    this.setState({
      data: { ...this.state.data, [name]: value},
      [name]: value
    })
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

  onStreet = data => {
    this.setState({data: { ...this.state.data, ...data}})
// add new street
  }

  onSubmit = () => {
    console.log('Post these: ', this.state.data)
    let tp = !this.props.city? 'city' : this.state.locate? 'location' : 'street'
    const { data } = this.state
    if(this.props.city){ data.city = this.props.city }
    this.props.addLocation(data,tp)
    .then(res => {
      this.setState({...this.state, ...res})
    })
    this.onReset()
  }

  render() {
    const { lan,city,cities,streets } = this.props
    const { data,message,msgClosed,locate } = this.state
    const ui = this.state.ui[lan]
    const str = 'street_bg'
    const cty = 'city_bg'
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
          <div className='ui grid' style={{width: '100vw'}}>

{/* ====== MESSAGE: =====================================*/}
            {Object.keys(message).length>0 &&
              <div className='margined full-width'>
                <Message as='div' positive={true} size='tiny'
                onDismiss={this.closeMessage}
                header={ui[6]}
                content={message}
              />
            </div>}
{/* ==== ADD CITY: =====================================*/}
            {!city &&
              <div className='row centered'>
                <div className='twelve wide column' style={{marginBottom: '10px'}}>
                  <Form.Input fluid name='bg' onChange={this.onChange} value={this.state.bg} placeholder={ui[1]} />
                </div>
                <div className='twelve wide column' style={{marginBottom: '10px'}}>
                  <Form.Input fluid name='lat' onChange={this.onChange} value={this.state.lat} placeholder={ui[2]} />
                </div>
                <div className='twelve wide column'>
                  <Form.Input fluid name='code' onChange={this.onChange} value={this.state.code} placeholder={ui[3]} />
                </div>
              </div>
            }
{/* ==== ADD STREET: =====================================*/}
            {!locate && city &&
              <div className='row centered'>
                <div className='twelve wide column' style={{marginBottom: '10px'}}>
                  <Form.Input fluid name='bg' onChange={this.onChange} value={this.state.bg} placeholder={ui[10]} />
                </div>
                <div className='twelve wide column' style={{marginBottom: '10px'}}>
                  <Form.Input fluid name='lat' onChange={this.onChange} value={this.state.lat} placeholder={ui[0]} />
                </div>
                <div className='twelve wide column'>
                  <Button name='locate' onClick={()=>{this.setState({locate: true})}} content={ui[12]} />
                </div>
              </div>
            }
{!streets.length && <SearchSetupForm appsetup={true} name='street' list={streets} lan={lan}/>}

{/* ==== ADD LOCATION: =====================================*/}
            {locate &&
              <div className='row centered'>
                <div className='twelve wide column' style={{marginBottom: '10px'}}>
                  <SearchSetupForm appsetup={false} name='street_id' onStreet={this.onStreet} list={streets} lan={lan}/>
                </div>
                <div className='six wide column' style={{marginBottom: '10px'}}>
                  <Form.Input fluid name='number'
                    onChange={this.onChange}
                    value={this.state.number} placeholder={ui[3]}
                  />
                </div>
              </div>
            }

{/* ==== IF NOTHING: =====================================*/}

              <div className='row centered menu-bar'>
                <Button.Group widths='2'>
                  <Button color='grey' onClick={this.onReset} content={ui[6]} />
                  <Button color='blue' type='submit' content={ui[4]} />
                </Button.Group>
              </div>

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
