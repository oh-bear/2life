import {createAction, handleActions} from 'redux-actions'

const FETCH_PARTNER_SUCCESS = 'FETCH_PARTNER_SUCCESS'
const CLEAN_PARTNER = 'CLEAN_PARTNER'

const initialState = {}

export const fetchPartnerSuccess = createAction(FETCH_PARTNER_SUCCESS)
export const cleanPartner = createAction(CLEAN_PARTNER)

export default partnerReducer = handleActions({
  [FETCH_PARTNER_SUCCESS] (state, action) {
    return {
      ...state,
      ...action.payload
    }
  },
  [CLEAN_PARTNER] () {
    return {}
  }
}, initialState)
