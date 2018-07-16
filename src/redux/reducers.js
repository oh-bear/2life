import {combineReducers} from 'redux'
import userReducer from './modules/user'
import partnerReducer from './modules/partner'
import diaryReducer from './modules/diary'

const rootReducer = combineReducers({
  user: userReducer,
  partner: partnerReducer,
  diary: diaryReducer
})

export default rootReducer
