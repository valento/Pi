import { USER_SIGNED, USER_LOGGED, USER_INIT } from '../types'
import api from '../api'
import setAuthHeader from '../utils/setAuthHeader'

export const userSignedIn = user => ({
  type: USER_SIGNED,
  user
})
export const initialUser = user => ({
  type: USER_INIT,
  user
})

// ===== Action Creators: =========================================
export const signUp = (credentials,pass) => dispatch => {
  if(pass){
    // credentials.password = pass
    // api.login(credentials).then(...)
  } else {
    return new Promise( (resolve,reject) => {
      api.user.signup(credentials).then( user => {
        console.log('Actions: ',user)
        localStorage.valePizzaJWT = user.token
        setAuthHeader(user.token)
        dispatch(userSignedIn(user))
        //if(user.new_user) {
        console.log('Call userInit()')
        api.user.initUser().then( user => {
          dispatch(initialUser(user))
          resolve(user.locations)
        })
        //}
      })
    })
  }
}
