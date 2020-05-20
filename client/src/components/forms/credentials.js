import React from 'react'
import Validator from 'validator'
import { Message,Button,Form } from 'semantic-ui-react'

export default class Credentials extends React.Component {
  state = {
    data: {},
    logging: false,
    errors: {},
    ui: {
      en: ['register','example@mail.com','my-secret-password','Save'],
      es: ['registro','micorreo@mail.com','mi-contrasena-secreta','Gurdar'],
      bg: ['влез','example@mail.com','парола','Влез']
    }
  }

  onSubmit = () => {
    const { data } = this.state
    const { pass,submit,login } = this.props
    const err = this.validate(data)
    this.setState({ errors: err })
    if(Object.keys(err).length !== 0) return
    if(!pass) {
      submit(data,false).then( user => {
        //const { locations } = user

// get all user saved locations:
        //if(!locations) return
        //let loc = locations.map( l => {
        //  return l.location
        //})
        //getFacs(loc)
      })
      //init()
    } else {
      login(data,true)
      //console.log(err.password, data)
    }
  }

  validate = data => {
    const errors = {}
    if ( this.props.pass ) {
      if (data.password.length < 8) {
        errors.password = 'Minimum password length must be 8 digits!'
      }
    } else {
      if(!Validator.isEmail(data.email)) {
        errors.email = 'Invalid email address! Try again...'
      }
    }
    return errors
  }

  onInput = (e,{name}) => {
    this.setState({
      data: {...this.state.data, [name]: e.target.value}
    })
  }

  render(){
    const lan = this.state.ui[this.props.lan]
    const {pass} = this.props
    const {errors} = this.state
    return(
      <div className={pass? 'custom-form oval-but alert' : 'custom-form oval-but'}>
        <Form onSubmit={this.onSubmit}>
          <Form.Input fluid required inline centered focus
            onChange={this.onInput}
            name={pass ? 'password' : 'email'}
            type={pass ? 'password' : 'email'}
            placeholder={pass ? lan[2] : lan[1]}
          />
          {Object.keys(errors).length>0 && <Message negative>
              <Message.Header>{pass? 'Incomplete password:' : 'Incorrect email:'}</Message.Header>
              <p>{pass? errors.password : errors.email}</p>
            </Message>
          }
          <Button type='submit' fluid={pass} color={pass ? 'red' : 'black'}>{pass? lan[3] : lan[0]}</Button>
        </Form>
      </div>
    )
  }
}
