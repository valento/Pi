import React from 'react'
import { connect } from 'react-redux'
import { Button,Divider,Confirm } from 'semantic-ui-react'

import setLanHeader from '../../utils/setLanHeader'
import SearchSetupForm from '../forms/SearchSetupForm'
import { initialUser } from '../../actions/user'
import { setInterface,setUI,getProductList } from '../../actions/settup'

// First: Set USER: Reg/Log
// Second: Set CITY/Zone
// Then: Load Store for CITY/Zone

class AppSetup extends React.Component {
  state = {
    ui: {
      en: ['Your City/Zone:','ENG','ESP','БГ'],
      es: ['Tu Ciudad/Zona:','ENG','ESP','БГ'],
      bg: ['Избери Град/Зона:','ENG','ESP','БГ']
    },
    errors: {
      en: {
        header: ['Not your City/Zone'],
        message:['Pick a Zone/City closer to you']
      },
      es: {
        header: ['No es tu Zona o Ciudad'],
        message:['Seleccione una Zona/Ciudad mas cercana']
      },
      bg: {
        header: ['Не е твоят Град/Зона'],
        message:['Избери зона или град, близки до теб']
      }
    },
    confirm: false,
    error: 0
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
    const { appsetup,setInterface,initialUser } = this.props
    console.log(data)
// If App Setup:
    if(appsetup){
// Set CITY:
      let c = this.props.list.find( c => c.id === data.city )
      if(c.status !== 1) return this.setState({error: 1, confirm: true})
      setInterface(data)
// API POST FAC Store: get factory+store for location ID
  //  getFacStore('AppSetup',data)
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
{/* === MESSAGES: ===================================== */}
        <div className='eight wide column'>
          <Confirm
            header={this.state.errors[lan].header[this.state.error - 1]}
            content={this.state.errors[lan].message[this.state.error - 1]}
            open={this.state.confirm}
            onCancel={е => this.setState({confirm: false, error: 0})}
            onConfirm={ e => this.setState({confirm: false, error: 0})}
          />
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  lan: state.settings.lan
})
export default connect(mapStateToProps,{initialUser,setInterface,setUI,getProductList})(AppSetup)
