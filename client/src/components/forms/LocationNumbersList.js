import React from 'react'
import { Form } from 'semantic-ui-react'

export default class UserLocationList extends React.Component {
  state = {
    data: {},
    ui: {
      en: ['number'],
      es: ['numero'],
      bg: ['номер']
    }
  }

  onChange = (e, {name,value,key}) => {
   this.setState({
     data: {...this.state.data, [name]: Number(value)}
   })
   const {list} = this.props
   this.props.onNewData({[name]: Number(value)})
   const ind = list.findIndex( e => {
     return e.id === value
   })
   this.props.getInput(list[ind].title,name)
  }

  render() {
    const { value,ui } = this.state
    const { name,list,lan } = this.props
    let options
    if(list){
      options = list.map( (entry,ind) => ({
          key: ind+1,
          value: entry.id,
          text: entry.title
        })
      )
    }

    return (
      <div className='short'>
        <Form.Select onChange={this.onChange}
          name={name} placeholder={ui[0]} options={options}
          value={this.state.data[name] || ''}
        />
      </div>
    )
  }
}
