import { USER_SIGNED,USER_INIT,USER_LOCATION,USER_UPDATE_LOCATION,USER_ADD_LOCATION } from '../types'
export const user = (state={},action) => {
  switch (action.type) {
    case USER_SIGNED:
      //window.Store.notify(action.type)
      return action.user
    case USER_LOCATION:
      return {...state, ...action.user}
    case USER_UPDATE_LOCATION:
      return {
        ...state,
        locations: state.locations.map( (item,ind) => {
          if(ind === action.ind) {
            return {...item, ...action.data}
          } else {
            return item
          }
        })
      }
    case USER_ADD_LOCATION:
      return {
        ...state,
        locations: state.locations? [...state.locations, action.data] : [action.data]
      }
    case USER_INIT:
      return {...state, ...action.user}
    default:
      return state

  }
}
