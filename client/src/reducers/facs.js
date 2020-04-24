import { SET_FAC } from '../types'

export const facs = (state={},action) => {

  switch (action.type) {
    case SET_FAC:
    console.log('New fac?: ',action.facs)
      return action.fac
    default:
      return state
  }
}
