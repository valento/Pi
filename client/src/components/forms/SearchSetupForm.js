import React from 'react'
import _ from 'lodash'
import { Form,Button,Search,Message } from 'semantic-ui-react'

class SearchSetupForm extends React.Component {
  state = {
    value: '',
    results: [],
    isLoading: false,
    data: {},
    ui: {
      en: ['Cancel','Submit','No service in that City', 'Sorry:'],
      es: ['Cancelar','Guardar','Sin servicio en esta Ciudad', 'Perdona, pero:'],
      bg: ['Изтрий','Запази','Не обслужваме този град все още...', 'Съжаляваме, но:']
    }
  }

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result,name }) => {
    this.setState({
      ...this.state,
      value: result.title,
      data: {...this.state.data, [name]: result.id},
      message: null
    })
    if(!this.props.appsetup){this.props.onStreet({[name]: result.id})}
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(this.props.list, isMatch),
      })
    }, 300)
  }

  onSubmit = e => {
    e.preventDefault()
    const { appsetup,onSubmit } = this.props
    const { data } = this.state
    if(appsetup){onSubmit(data)}
  }

  render() {
    const {value,results,isLoading,data,message} = this.state
    const ui = this.state.ui[this.props.lan]
    const { name,appsetup } = this.props
    return (
      <div className='custom-form padded'>
        <Form.Group onSubmit={this.onSubmit}>
          <Form>
            <div className='ui grid'>
              <div className='grid column sixteen wide'>
                <Search
                  fluid
                  name={name}
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                  results={results}
                  value={value}
                  {...this.props}
                />
              </div>
              {message && message !== '0' && <Message negative size='mini'>
                <Message.Header>{ui[3]}</Message.Header>
                  <p>{ui[2]}</p>
                </Message>
              }
              {appsetup &&
                <div className='grid column sixteen wide oval-but extra-padded'>
                  <Button type='submit'
                    basic={Object.keys(data).length===0}
                    disabled={Object.keys(data).length===0}
                    name={name}
                    color='grey'
                    content={ui[1]}
                  />
                </div>
              }
            </div>

          </Form>
        </Form.Group>
      </div>
    )
  }
}

export default SearchSetupForm
