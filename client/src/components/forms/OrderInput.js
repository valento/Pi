import React from 'react'
import { Form,Button,Select,Message } from 'semantic-ui-react'
import Validator from 'validator'

class OrderInput extends React.Component {

  state = {
    item: {
      id: null,
      units: null
    },
    ui: {
      en: ['Choose a ','+','Order','Invalid data','Qauntity should be a number','pizza','pi2','drink','beer','sauce'],
      es: ['Selecione ','+','Pedir','Datos invalidos','La Cantidad es numero','pizza','pi2','gaseosa','cerveza','salsa'],
      bg: ['Избери ','+','Поръчай','Невалидни данни','Броят пици трябва да е число','пица','п2','безалкохолно','бира','сос']
    },
    errors: {}
  }

  onChange = (e,{name,value}) => {
    if(name !== 'id' && value !== '' && !Validator.isNumeric(value)) {
      this.setState({
        errors: {code: 4}
      })
    } else (
      //value = Number(value)
      this.setState({
        errors: {}
      })
    )
    if(name==='units' && value>5) { value = 5 }
    if(name==='id'){
      this.props.onItemSelect(value)
    }
    this.setState({
      item: {
        ...this.state.item, [name]: Math.abs(value)
      }
    })
  }

  onAdd = () => {
    const { item } = this.state
    this.props.onAddItem(item.id,item.units)
    this.setState({
      item: { id:null, units:null }
    })
  }

  render() {
    const { lan,onAdd,items,category } = this.props
    const { errors,item } = this.state
    const ui = this.state.ui[lan]
    //const _items = items.map( (itm,indx) => ({
    //  key:itm,
    //  name:itm,
    //  value:indx+1,
    //  text:itm,
    //  price:indx+2.5
    //}))
    const _invalid = Object.keys(errors).length > 0
    const _empty = (item.id === null || item.units === null)
    return(
      <Form onSubmit={this.onAdd}>
        <Form.Group>
          <div className='ui grid'>
            <div className='ten wide column'>
              <Form.Select onChange={this.onChange} key={213}
                name='id' placeholder={ui[0].concat(ui[4+category])} options={items}
                value={item.id}
              />
            </div>
            <div className='three wide column'>
              <Form.Input onChange={this.onChange} type='number'
                required name='units' placeholder={1}
                value={item.units || ''}
              />
            </div>
            <div className='three wide column'>
              <Button disabled={_invalid || _empty}
                color='blue'
                className='add-but'
                type='submit' content={ui[1]}
              />
            </div>
          </div>

            { _invalid &&
              <div className='margined full-width'>
                <Message negative>
                  <Message.Header>{ui[3]}</Message.Header>
                  <p>{ui[errors.code]}</p>
                </Message>
              </div>
            }

        </Form.Group>
      </Form>
    )
  }

}

export default OrderInput
