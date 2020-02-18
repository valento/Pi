import { ADD_LOCATION } from '../../types'
import api from '../../api/admin'

export const addLocation = (data,type) => dispatch => {
  return api.locations.addLocation(data,type).then( res => res )
}

export const getList = type => dispatch => {
  return api.getList(type).then()
}
