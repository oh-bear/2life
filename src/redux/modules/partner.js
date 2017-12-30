import {createAction, handleActions} from 'redux-actions'

const FETCH_PARTNER_SUCCESS = 'FETCH_PRATNER_SUCCESS'

const initialState = {}

export const fetchPartnerSuccess = createAction(FETCH_PARTNER_SUCCESS)

export default partnerReducer = handleActions({
  [FETCH_PARTNER_SUCCESS] (state, action) {
    return {
      ...state,
      ...action.payload
    }
  }
}, initialState)
