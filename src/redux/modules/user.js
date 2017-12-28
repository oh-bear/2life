import {createAction, handleActions} from 'redux-actions'

const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'

const initialState = {}

export const fetchProfileSuccess = createAction(FETCH_PROFILE_SUCCESS)

export default userReducer = handleActions({
  [FETCH_PROFILE_SUCCESS] (state, action) {
    return {
      ...state,
      ...action.payload
    }
  }
}, initialState)
