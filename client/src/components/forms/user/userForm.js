import React from 'react'
import { Form,Button } from 'semantic-ui-react'

export default class UserForm extends React.Component {
  render() {
    return (

        <Form>
          {this.props.view==='email' &&
            <Form.Group inline>
              <Form.Input width={10} label='email: ' placeholder='user@mail.com' />
            </Form.Group>
          }
          <Button content='Submit' />
        </Form>

    )
  }
}
