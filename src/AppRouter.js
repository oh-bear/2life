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
import UpdateDiary from './containers/home/UpdateDiary'

import Web from './containers/notification/Web'

// profile
import Profile from './containers/profile/Profile'
import ProfileBadge from './containers/profile/ProfileBadge'
import ProfileEdit from './containers/profile/ProfileEdit'
import ProfileMatch from './containers/profile/ProfileMatch'
import ProfileMode from './containers/profile/ProfileMode'
import ProfileSync from './containers/profile/ProfileSync'
import ProfileReward from './containers/profile/ProfileReward'
import MatchResult from './containers/profile/MatchResult'

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
            <Scene
              key={scenes.SCENE_UPDATE_DIARY}
              component={UpdateDiary}
              title='修改日记'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_PROFILE}
              component={Profile}
              title='个人'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_PROFILE_BADGE}
              component={ProfileBadge}
              title='个人徽章'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_PROFILE_EDIT}
              component={ProfileEdit}
              title='编辑个人信息'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_PROFILE_MATCH}
              component={ProfileMatch}
              title='匹配'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_MATCH_RESULT}
              component={MatchResult}
              title='匹配结果'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_PROFILE_MODE}
              component={ProfileMode}
              title='个人情绪'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_PROFILE_SYNC}
              component={ProfileSync}
              title='同步'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_PROFILE_REWARD}
              component={ProfileReward}
              title='打赏'
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_WEB}
              component={Web}
              title='web'
              hideNavBar
              duration={0}
            />
          </Scene>
        </Router>
      </Provider>
    )
  }
}
