import {combineReducers} from 'redux'
import userReducer from './modules/user'
import partnerReducer from './modules/partner'

const rootReducer = combineReducers({
  user: userReducer,
  partner: partnerReducer
})

export default rootReducer
