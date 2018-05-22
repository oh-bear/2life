import React, { Component } from 'react'
import { View } from 'react-native'
import RNSplashScreen from 'react-native-splash-screen'
import { Actions } from 'react-native-router-flux'
import { SCENE_INDEX, SCENE_LOGIN_OPTIONS } from './constants/scene'
import Storage from './common/storage'
import { setApiBaseUrl, setToken } from './network/HttpUtils'
import Toast from 'antd-mobile/lib/toast'
import { connect } from 'react-redux'
import store from './redux/store'
import { delay } from 'redux-saga'
import initApp from './redux/modules/init'
import { isDev } from './common/util'
import { USERS } from './network/Urls'
import HttpUtils from './network/HttpUtils'
import { fetchProfileSuccess } from './redux/modules/user'
import { fetchPartnerSuccess } from './redux/modules/partner'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
class SplashScreen extends Component {
  async componentDidMount() {
    const user = await Storage.get('user', {})

    if (!user.account || !user.password) {
      Actions[SCENE_LOGIN_OPTIONS]()
      RNSplashScreen.hide()
      return
    }

    try {
      const data = {
        account: user.account,
        password: user.password
      }

      const res = await HttpUtils.post(USERS.login, data)
      if (res.code === 0) {
        const {uid, token, timestamp} = res.data.key
        setToken({uid, token, timestamp})

        store.dispatch(fetchProfileSuccess(res.data.user))

        if (res.data.partner.id) {
          store.dispatch(fetchPartnerSuccess(res.data.partner))
        } else {
          store.dispatch(fetchPartnerSuccess({id: null}))
        }
        Actions[SCENE_INDEX]({user: res.data.user, partner: res.data.partner})
      } else {
        Toast.fail('自动登录失败', 1.5)
        Actions[SCENE_LOGIN_OPTIONS]()
      }
    } catch (e) {
      console.log(e)
      Toast.fail('自动登录失败', 1.5)
      Actions[SCENE_LOGIN_OPTIONS]()
    }

    RNSplashScreen.hide()
  }

  render() {
    return <View />
  }
}

export default SplashScreen

if (isDev) {
  global.XMLHttpRequest = global.originalXMLHttpRequest
    ? global.originalXMLHttpRequest
    : global.XMLHttpRequest
  global.FormData = global.originalFormData
    ? global.originalFormData
    : global.FormData
}

console.disableYellowBox = true

/**
 * RN-BUGS
 * 在Debug环境下console.dir有效，
 * 生产环境下console.dir为undefined。所以需要打个补丁
 * 以下补丁同理
 */
if (!(console.dir instanceof Function)) {
  console.dir = console.log
}

if (!(console.time instanceof Function)) {
  console.time = console.log
}

if (!(console.timeEnd instanceof Function)) {
  console.timeEnd = console.log
}

if (!global.URL) {
  global.URL = function() {}
}
