import React from 'react'
import { connect } from 'react-redux'
import { Button,Divider } from 'semantic-ui-react'
import { Route,Switch,Link } from 'react-router-dom'

import BakerHome from './fac/BakerHome'
import AllAdminHome from './AllHome'

import { subscribeSocket,fireSocket,initSocket } from '../../../websocket'

const RoleHome = ({uid,lan,fac,membership,...rest}) => {
  //initSocket(uid,membership,fac.id)
  //subscribeSocket()
  const state={
    ui: {
      en:['Bakery: ','Open Session','home','lab','fac','baker','delivery','logout'],
      es:['Panadería: ','Iniciar sesión','home','lab','fac','baker','delivery','logout'],
      bg:['Пекарна: ','Отвори Сесия','home','lab','fac','baker','delivery','logout']
    }
  }

  const { url,path } = rest.match
  //let id = Number(locations[match.params.id].id)
  let _path = path.split('/').reverse()[0]
console.log('Role: ', _path, membership)
  return (
    <div className='App-content topped padded'>
      <div className='menu-bar dobletopped'>
        <Button.Group color='grey'>
          <Button as={Link} to={url} icon='home'/>
          {membership === 2 &&
            <Button as={Link} to={`${url}/${state.ui[lan][3]}`} content={state.ui[lan][3]}/>}
          {membership === (4 || 12) &&
            <Button as={Link} to={`${url}/${state.ui[lan][4]}`} content={state.ui[lan][4]} />}
          {membership === (8 || 12) &&
            <Button as={Link} to={`${url}/${state.ui[lan][5]}`} content={state.ui[lan][5]} />}
          {membership === 32 &&
            <Button as={Link} to={`${url}/${state.ui[lan][6]}`} content={state.ui[lan][6]} />}
          <Button as={Link} to={rest.match.url} icon='undo' content={state.ui[lan][7]} />
        </Button.Group>
      </div>
      <Switch>
        <Route path={`${rest.match.url}/baker`} component={BakerHome}/>
        <Route path={`${rest.match.url}/fac`} component={AllAdminHome}/>
        <Route path={`${rest.match.url}/lab`} component={AllAdminHome}/>
        <Route path={`${rest.match.url}/dlvr`} component={AllAdminHome}/>

      </Switch>

    </div>
  )
}

const mapStateToProps = state => ({
  uid: state.user.uid,
  membership: state.user.membership,
  fac: state.facs
})

export default connect(mapStateToProps)(RoleHome)
