import React, { Component } from 'react'
import Login from './containers/Login'
import Register from './containers/Register'
import Index from './containers/Index'
import NoteEditor from './containers/NoteEditor'
import Home from './containers/Home'
import Feedback from './containers/profile/Feedback'
import AboutUs from './containers/profile/AboutUs'
import AboutUsWeb from './containers/profile/AboutUsWeb'
import Setting from './containers/profile/Setting'
import Connection from './containers/profile/Connection'

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
              key={scenes.SCENE_LOGIN}
              component={Login}
              title='登录'
              type={ActionConst.RESET}
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_REGISTER}
              component={Register}
              title='注册'
              type={ActionConst.REPLACE}
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
              key={scenes.SCENE_HOME}
              component={Home}
              title='主页'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_NOTEEDITOR}
              component={NoteEditor}
              title='创建日记'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_CONNECTION}
              component={Connection}
              title='匹配'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_SETTING}
              component={Setting}
              title='设置'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_FEEDBACK}
              component={Feedback}
              title='意见反馈'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_ABOUT_US}
              component={AboutUs}
              title='关于我们'
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_ABOUT_US_WEB}
              component={AboutUsWeb}
              title='联系我们'
              duration={0}
              hideNavBar
            />
          </Scene>
        </Router>
      </Provider>
    )
  }
}
