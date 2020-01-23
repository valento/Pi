import React from 'react'
import { Input } from 'semantic-ui-react'

class ReferenceInput extends React.Component {
  state = {
    ui: {
      en: ['8 string reference...','Reference:'],
      es: ['8 signos...','Referencia:'],
      bg: ['8 знака код...','Референция:']
    },
    uid: ''
  }

  onChange = e => {
    this.setState({
      uid: e.target.value
    })
  }

  onClick = () => {
    if(this.state.uid !== ''){ this.props.onRef(this.state.uid) }
  }

  render() {
    let ui = this.state.ui[this.props.lan]
    return (
      <Input
        action={{
          color: 'teal',
          labelPosition: 'left',
          icon: 'key',
          content: `${ui[1]}`,
          onClick: this.onClick
        }}
        name='uid'
        onChange={this.onChange}
        actionPosition='left'
        placeholder={ui[0]}
      />
    )
  }
}

export default ReferenceInput
