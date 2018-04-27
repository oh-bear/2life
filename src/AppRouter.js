import React, { Component } from 'react'
import Index from './containers/Index'

// login
import Options from './containers/login/Options'
import Signin from './containers/login/Signin'
import Signup from './containers/login/Signup'
import Nickname from './containers/login/Nickname'
import Gender from './containers/login/Gender'

// home
import NewDiary from './containers/home/NewDiary'
import DiaryDetail from './containers/home/DiaryDetail'

import { Scene, Router, ActionConst } from 'react-native-router-flux'
import * as scenes from './constants/scene'
import SplashScreen from './SplashScreen'
import { Provider } from 'react-redux'
import store from './redux/store'

export default class AppRouter extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key='root'>
            <Scene
              key={scenes.SCENE_SPLASH_SCREEN}
              component={SplashScreen}
              initial
              type={ActionConst.RESET}
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_LOGIN_OPTIONS}
              component={Options}
              title='登录选项'
              type={ActionConst.RESET}
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_LOGIN_SIGNIN}
              component={Signin}
              title='手机登录'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_LOGIN_SIGNUP}
              component={Signup}
              title='注册'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_LOGIN_NICKNAME}
              component={Nickname}
              title='设置昵称'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_LOGIN_GENDER}
              component={Gender}
              title='设置性别'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_INDEX}
              component={Index}
              title='首页'
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_NEW_DIARY}
              component={NewDiary}
              title='新建日记'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_DIARY_DETAIL}
              component={DiaryDetail}
              title='日记详情'
              hideNavBar
              duration={0}
            />
          </Scene>
        </Router>
      </Provider>
    )
  }
}
