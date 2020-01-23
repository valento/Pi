import React from 'react'
import { Form,Button,Message,Checkbox } from 'semantic-ui-react'

export default class UserDoor extends React.Component {
  state = {
    ui: {
      en: ['floor','door','entry','bell','mobile','myHome, theOffice,...','Name it like:','Primary'],
      es: ['piso','puerta','entrada','timbre','mobile','miCasa, LaOficina,...','Ponle nombre:','Principal'],
      bg: ['етаж','врата','вход','звънец','мобилен','уНас, офиса, приМама,...','Именувай Адреса:','Основен']
    },
    valid: true,
    empty: true,
    data: {},
  }

  componentDidMount() {
    if(this.props.edit){
      this.setState({
      data: {...this.state.data, prime: this.props.loc.prime}
    })}
  }

  onChange = (e,{name,value}) => {
    let v
    if(name === 'entry' || 'bell'){
      v = isNaN(value)? value : Number(value)
    }
    this.setState({
      data: {...this.state.data, [name]: name==='entry'||'bell'? v :  Number(value)}
    })
    if(this.props.edit){
      this.props.onInput(name, name==='entry'||'bell'? v : Number(value))
    } else {
      this.props.addData({[name]: name==='entry'||'bell'? v : Number(value)})
    }
  }

  onCheckBox = (e, {name}) => {
    this.props.onInput(name, this.state.data[name]? Number(!this.state.data[name]) : 1)
    this.setState({
      data: {...this.state.data, [name]: this.state.data[name]? !this.state.data[name] : true}
    })
  }

  onClear = e => {
    e.preventDefault()
    this.setState({
      data: {}
    })
  }

  render() {
    const {lan,edit,loc} = this.props
    const ui = this.state.ui[lan]
    const { valid,empty,data } = this.state
    return (
        <Form>
          <Form.Group>
            <div className='ui grid'>

              <div className="row">
                <div className='eight wide column rect'>
                  <Form.Input onChange={this.onChange}
                    required name='bell' placeholder={edit && loc.bell? ui[3].concat(': ',loc.bell) : ui[3]}
                    value={data.bell || ''}
                  />
                </div>
                <div className='seven wide column rect'>
                  <Form.Input onChange={this.onChange}
                    required name='mobile' placeholder={edit && loc.mobile? loc.mobile : ui[4]}
                    value={data.mobile || ''}
                  />
                </div>
              </div>

              <div className="row">
                <div className='four wide column rect'>
                  <Form.Input onChange={this.onChange}
                    required name='floor' placeholder={edit && loc.floor? loc.floor.toString().concat(' ',ui[0]) : ui[0]}
                    value={data.floor || ''}
                  />
                </div>
                <div className='four wide column rect'>
                  <Form.Input onChange={this.onChange}
                    required name='door' placeholder={edit && loc.door? loc.door.toString().concat(' ',ui[1]) : ui[1]}
                    value={data.door || ''}
                  />
                </div>
                <div className='four wide column rect'>
                  <Form.Input onChange={this.onChange}
                    name='entry' placeholder={edit && loc.entry? loc.entry.toString().concat(' ', ui[2]) : ui[2]}
                    value={data.entry || ''}
                  />
                </div>
                {!edit && <div className='tree wide column'>
                  <Button
                    className='add-but'
                    icon='ban'
                    onClick={this.onClear}
                  />
                </div>}
              </div>

              {edit &&
                  <div className='row'>
                    <div className='eight wide column rect'>
                      <Form.Input onChange={this.onChange}
                        label={ui[6]}
                        name='name' placeholder={loc.name? loc.name : ui[5]}
                        value={data.name || ''}
                      />
                    </div>
                    <div className='seven wide column rect'>
                      <Checkbox
                        label={ui[7]}
                        name='prime'
                        checked={data.prime||loc.prime}
                        onClick={this.onCheckBox}
                      />
                    </div>
                  </div>
              }

            </div>

              { !valid &&
                <div className='margined full-width'>
                  <Message negative>
                    <Message.Header>{ui[3]}</Message.Header>
                    <p>{1}</p>
                  </Message>
                </div>
              }

          </Form.Group>
        </Form>
    )
  }
}
