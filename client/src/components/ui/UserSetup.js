import React from 'react'
import { connect } from 'react-redux'
import SearchSetupForm from '../forms/SearchSetupForm'

const UserSetup = ({lan,type,name,cities}) => {
  const ui = {
    en: ['Your City:'],
    es: ['Tu Ciudad:'],
    bg: ['Твоят Град:']
  }
  return (
    <div className='vintage left'>
      <p>{ui[lan][0]}</p>
      <SearchSetupForm name={name} list={cities} lan={lan}/>
    </div>
  )
}
const mapStateToProps = state => ({
  cities: state.settings.cities,
  city: state.user.city
})
export default connect(mapStateToProps)(UserSetup)
