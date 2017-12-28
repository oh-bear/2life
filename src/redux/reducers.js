import {combineReducers} from 'redux'
import userReducer from './modules/user'

const rootReducer = combineReducers({
  user: userReducer
})

export default rootReducer
