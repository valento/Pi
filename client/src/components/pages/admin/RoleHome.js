import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { Route,Switch,Link } from 'react-router-dom'

import { userSignedIn } from '../../../actions/auth'
import { setInterface } from '../../../actions/settup'
import setAuthHeader from '../../../utils/setAuthHeader'

import BakerAdmin from './fac/BakerAdmin'
import TesterPage from './TesterPage'
import AllAdminHome from './AllHome'

import { closeSocket } from '../../../websocket'

const RoleHome = ({uid,lan,membership,userSignedIn,setInterface,dispatch,...rest}) => {

  const state = {
    ui: {
      en:['Bakery: ','Open Session','boss','lab','fac','baker','delivery','tester','logout'],
      es:['Panadería: ','Iniciar sesión','boss','lab','fac','baker','delivery','tester','logout'],
      bg:['Пекарна: ','Отвори Сесия','boss','lab','fac','baker','delivery','tester','logout']
    }
  }

  const logout = () => {
    console.log('Logout this User')
    localStorage.clear()
    setAuthHeader()
    userSignedIn({})
    closeSocket()
    setInterface({socket: false})
  }

  const { url } = rest.match
  //let id = Number(locations[match.params.id].id)
  //let _path = path.split('/').reverse()[0]

  return (
    <div className='App-content topped padded'>
      <div className='menu-bar dobletopped'>
        <Button.Group color='grey'>
          <Button as={Link} to={url} icon='home'/>
          {membership === 1 &&
            <Button as={Link} to={`${url}/${state.ui[lan][2]}`} content={state.ui[lan][3]}/>}
          {membership === 2 &&
            <Button as={Link} to={`${url}/${state.ui[lan][3]}`} content={state.ui[lan][3]}/>}
          {membership === (4 || 12) &&
            <Button as={Link} to={`${url}/${state.ui[lan][4]}`} content={state.ui[lan][4]} />}
          {membership === (8 || 12) &&
            <Button as={Link}
              to={`${url}/${state.ui[lan][5]}`}
              content={state.ui[lan][5]}
              desabled={!rest.fac.open}
            />}
          {membership === 32 &&
            <Button as={Link} to={`${url}/${state.ui[lan][6]}`} content={state.ui[lan][6]} />}
          {membership === 64 &&
            <Button as={Link} to={`${url}/${state.ui[lan][7]}`} icon='eye' content={state.ui[lan][7]} />}
            <Button as={Link} to={url}
              icon='stop circle outline'
              color='blue'
              content={state.ui[lan][8]}
              onClick={e => logout()}
            />
        </Button.Group>
      </div>
      <Switch>
        <Route path={rest.match.url} exact
          render={ () => <AllAdminHome lan={lan} id={rest.fac.id} member={membership} />} />
        <Route path={`${rest.match.url}/${state.ui[lan][2]}`} component={AllAdminHome} />
        <Route path={`${rest.match.url}/${state.ui[lan][3]}`} component={AllAdminHome} />
        <Route path={`${rest.match.url}/${state.ui[lan][4]}`} component={AllAdminHome} />
        <Route path={`${rest.match.url}/${state.ui[lan][5]}`} component={BakerAdmin} />
        <Route path={`${rest.match.url}/${state.ui[lan][6]}`} component={AllAdminHome} />
        <Route path={`${rest.match.url}/${state.ui[lan][7]}`}
          render={ () => <TesterPage lan={lan} member={membership} />} />
      </Switch>
    </div>
  )
}

const mapStateToProps = state => ({
  uid: state.user.uid,
  membership: state.user.membership,
  fac: state.facs
})

export default connect(mapStateToProps, { userSignedIn,setInterface })(RoleHome)
