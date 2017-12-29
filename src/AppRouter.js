import React, {Component} from 'react'
import Login from './containers/Login'
import Register from './containers/Register'
import Index from './containers/Index'

import {Scene, Router, ActionConst} from 'react-native-router-flux'
import * as scenes from './constants/scene'
import SplashScreen from './SplashScreen'
import {Provider} from 'react-redux'
import store from './redux/store'

export default class AppRouter extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key="root">
            <Scene
              key={scenes.SCENE_LOGIN}
              component={Login}
              title="登录"
              type={ActionConst.RESET}
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_REGISTER}
              component={Register}
              title="登录"
              type={ActionConst.REPLACE}
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_INDEX}
              component={Index}
              title="首页"
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
          </Scene>
        </Router>
      </Provider>
    )
  }
}
