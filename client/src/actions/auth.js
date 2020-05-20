import { USER_SIGNED, USER_INIT } from '../types'
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
// SignUp/LogIn User with email/pass
export const signUp = (credentials,pass) => dispatch => {
  if(pass){
    // credentials.password = pass
    // api.login(credentials).then(...)
  } else {
    return new Promise( (resolve,reject) => {
      api.user.signup(credentials).then( user => {
        localStorage.valePizzaJWT = user.token
        setAuthHeader(user.token)
        dispatch(userSignedIn(user))
        //if(user.new_user) {
        //console.log('Call userInit()')
        //api.user.initUser().then( user => {
          dispatch(initialUser(user))
          resolve(user)
        //})
        //}
      })
    })
  }
}

// Check User Token/Credentials
export const checkUserToken = user => dispatch => {
  console.log('Check this one:',user)
  return new Promise( (resolve,reject) => {
    api.user.checkOne().then( (result,user) => {
      if(!result) reject({ err: { message: 'User doesn\'t exist' }})
      //dispatch(userSignedIn(user))
      resolve()
    })
  })
}
