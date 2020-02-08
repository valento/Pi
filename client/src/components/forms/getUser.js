import React from 'react'
import Validator from 'validator'
import { Icon,Message,Button,Form } from 'semantic-ui-react'

export default class GetUser extends React.Component {
  state = {
    data: {},
    logging: false,
    errors: {},
    ui: {
      en: ['Check','example@mail.com','my-secret-password','Save'],
      es: ['Consulta','ejemplo@mail.com','mi-contrasena-secreta','Guardar'],
      bg: ['Провери','example@mail.com','секретната-ми-парола','Запази']
    }
  }

  onSubmit = () => {
    const {data, errors} = this.state
    const { submit,login,init,pass } = this.props
    const err = this.validate(data)
    this.setState({ errors: err })
    if(!pass && Object.keys(err).length === 0) {
      submit(data,false)
    } else if(Object.keys(err).length === 0) {
      login(data,true)
      init()
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
          <Button type='submit' color='grey' fluid={pass}>{pass? lan[3] : lan[0]}</Button>
        </Form>
      </div>
    )
  }
}
