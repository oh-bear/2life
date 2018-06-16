import {createAction, handleActions} from 'redux-actions'

const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'
const CLEAN_USER = 'CLEAN_USER'

const initialState = {}

export const fetchProfileSuccess = createAction(FETCH_PROFILE_SUCCESS)
export const cleanUser = createAction(CLEAN_USER)

export default userReducer = handleActions({
  [FETCH_PROFILE_SUCCESS] (state, action) {
    return {
      ...state,
      ...action.payload
    }
  },
  [CLEAN_USER] () {
    return {}
  }
}, initialState)
