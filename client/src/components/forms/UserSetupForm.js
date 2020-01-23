import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Form,Button,Icon,Search } from 'semantic-ui-react'

import { initialUser } from '../../actions/user'

class UserSetupForm extends React.Component {
  state = {
    value: '',
    results: [],
    isLoading: false,
    data: {},
    ui: {
      en: ['Cancel','Submit'],
      es: ['Cancelar','Guardar'],
      bg: ['Изтрий','Запази']
    }
  }

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => this.setState({
    value: result.title,
    city: result.id
  })

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
    const {city} = this.state
    this.props.initialUser({city})
  }

  render() {
    const {value,results,isLoading} = this.state
    const ui = this.state.ui[this.props.lan]
    const source = this.props.list
    return (
      <div className='custom-form padded'>
        <Form onSubmit={this.onSubmit}>
          <Form.Group>
            <div className='ui grid'>
              <div className='grid column sixteen wide'>
                <Search
                  fluid
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                  results={results}
                  value={value}
                  {...this.props}
                />
              </div>
              <div className='grid column sixteen wide oval-but extra-padded'>
                  <Button type='submit' color='grey' content={ui[1]} />
              </div>
            </div>

          </Form.Group>
        </Form>
      </div>
    )
  }
}

export default connect(null, {initialUser} )(UserSetupForm)
