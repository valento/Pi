import {
  USER_INIT, USER_LOCATION, USER_UPDATE_LOCATION, USER_ADD_LOCATION,
  SET_FAC
} from '../types'
import api from '../api'

export const initialUser = user => ({
  type: USER_INIT,
  user
})

export const addUserLocation = data => ({
  type: USER_ADD_LOCATION,
  data
})

export const setLocationFactories = facs => ({
  type: SET_FAC,
  facs
})

export const updateUserLocation = (ind,data) => ({
  type: USER_UPDATE_LOCATION,
  ind: ind,
  data
})

export const userInit = () => dispatch => {
  return new Promise( (resolve,reject) => {
    api.user.initUser().then( user => {
      dispatch(initialUser(user))
// Get all FACs for user.locations list
      resolve(user.locations)
    })
    .catch(error => {
      reject(error)
    })
  })
}

// Get List of all FACs for each user.city
export const getLocalFacs = loc => dispatch => {
  api.user.locationFac(loc).then( facs => {
    console.log('Action locationFac: ',facs)
    let FACs = Object.keys(facs).map( k => ({[k]: facs[k]}))
    //dispatch(setLocationFactories(FACs))
  })
}

export const userAddLocation = data => dispatch => {
  api.user.addLocation(data).then( id => {
    data.id = id
    dispatch(addUserLocation(data))
  })
}

export const userUpdateLocation = (ind,id,data) => dispatch => {
  api.user.updateLocation(data,id).then( res => {
    console.log(res)
    dispatch(updateUserLocation(ind,data))
  })
}

export const getLocationData = (ref,ind) => dispatch => {
  api.settup.getLocation(ref).then( response => {
    dispatch(updateUserLocation(ind,response))
  })
}
