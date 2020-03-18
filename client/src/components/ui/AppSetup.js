import React from 'react'
import { connect } from 'react-redux'
import { Button,Divider } from 'semantic-ui-react'

import setLanHeader from '../../utils/setLanHeader'
import SearchSetupForm from '../forms/SearchSetupForm'
import { initialUser } from '../../actions/user'
import { setInterface,setUI,getProductList,getFacStore } from '../../actions/settup'

// First: Set USER: Reg/Log
// Second: Set CITY/Zone
// Then: Load Store for CITY/Zone

class AppSetup extends React.Component {
  state = {
    ui: {
      en: ['Your City/Zone:','ENG','ESP','БГ'],
      es: ['Tu Ciudad/Zona:','ENG','ESP','БГ'],
      bg: ['Избери Град/Зона:','ENG','ESP','БГ']
    }
  }

  onLanguage = (e, {name}) => {
    const { setInterface,setUI,getProductList } = this.props
// Set Client Language:
    setInterface({lan: name})
    setLanHeader(name)
// API GET for Language/City
    setUI(name)
// API GET all Products List by Language
    getProductList(name)
  }

// FORM SUBMIT:
  onSubmit = data => {
    const { appsetup,setInterface,initialUser,getFacStore } = this.props
    console.log(data)
// If App Setup:
    if(appsetup){
// Set CITY:
      setInterface(data)
// API POST FAC Store: get factory+store for location ID
      getFacStore(data)
    } else {
// If User Setup:
      initialUser(data)
    }
  }

  render() {
    const { lan,appsetup,name,list,setup } = this.props
    const ui = this.state.ui[lan]
    return (
      <div className='vintage left'>
        {name==='city' && <p>{ui[0]}</p>}
        <SearchSetupForm
          lan={lan}
          appsetup={appsetup}
          onSubmit={this.onSubmit}
          setup={setup}
          name={name}
          list={list}
        />
        <Divider horizontal />
        <div className='menu-bar'>
          <Button.Group color='grey' size='mini'>
            <Button onClick={this.onLanguage} disabled={lan==='en'} name='en' content={ui[1]}/>
            <Button onClick={this.onLanguage} disabled={lan==='es'} name='es' content={ui[2]} />
            <Button onClick={this.onLanguage} disabled={lan==='bg'} name='bg' content={ui[3]} />
          </Button.Group>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  lan: state.settings.lan
})
export default connect(mapStateToProps,{initialUser,setInterface,setUI,getProductList,getFacStore})(AppSetup)
