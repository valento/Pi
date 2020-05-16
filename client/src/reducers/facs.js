import { SET_FAC,FAC_STATE } from '../types'

export const facs = (state={},action) => {

  switch (action.type) {
    case SET_FAC:
    console.log('New fac?: ',action.facs)
      return action.fac
    case FAC_STATE:
      return {...state, ...action.data}
    default:
      return state
  }
}
