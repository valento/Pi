import { SET_FAC } from '../types'

export const facs = (state={},action) => {

  switch (action.type) {
    case SET_FAC:
      return action.facs
    default:
      return state
  }
}
