import {AsyncStorage} from 'react-native'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {autoRehydrate, persistStore} from 'redux-persist'
import rootReducer from './reducers'
import thunk from 'redux-thunk'

const enhancer = composeWithDevTools({})(
  autoRehydrate(),
  applyMiddleware(thunk)
)

const store = createStore(rootReducer, enhancer)

persistStore(store, {
  storage: AsyncStorage,
  blacklist: ['routes']
})

export default store
