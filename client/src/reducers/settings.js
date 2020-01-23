import { SETUP_CHANGED } from '../types'

export const settings = (state={},action) => {
  switch (action.type) {
    case SETUP_CHANGED:
      return {...state, ...action.data}
    default:
      return state

  }
}
