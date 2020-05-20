import React from 'react'
import _ from 'lodash'
import { Search } from 'semantic-ui-react'

export default class UserLocation extends React.Component {
  state = {
    isLoading: false,
    data: {},
    value: null
  }
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result,name }) => {
    const {title,id} = result
    const { getInput,getNumbers,onNewData } = this.props
    if(name==='street') {getNumbers('location',id)}
    this.setState({
      ...this.state,
      value: title,
      data: {...this.state.data, [name]: id}
    })
    if(name==='location'){onNewData({[name]: id})}
    getInput(title,name)
  }

  handleSearchChange = (e, { value,name }) => {
    this.setState({ isLoading: true, value })
    const { list,getInput } = this.props

    setTimeout(() => {
      if (this.state.value.toString().length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title.toString())

      this.setState({
        isLoading: false,
        results: _.filter(list, isMatch)
      })
    }, 300)

    getInput(value,name)
  }

  render() {
    const { isLoading,value,results } = this.state
    const { name } = this.props
    return (
      <div>
        <div className={name==='street'? 'full-width' : 'short'}>
          <Search
            name={name}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}
            {...this.props}
          />
        </div>
      </div>
    )
  }
}
