import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import Toast from 'antd-mobile/lib/toast'
import * as WeChat from 'react-native-wechat'
import { Actions } from 'react-native-router-flux'
import RNSplashScreen from 'react-native-splash-screen'

import { SCENE_INDEX, SCENE_LOGIN_OPTIONS } from './constants/scene'
import Storage from './common/storage'
import { isDev } from './common/util'

import store from './redux/store'
import { fetchProfileSuccess } from './redux/modules/user'
import { fetchPartnerSuccess } from './redux/modules/partner'

import HttpUtils from './network/HttpUtils'
import { setToken } from './network/HttpUtils'
import { USERS } from './network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
class SplashScreen extends Component {
  async componentDidMount() {

    WeChat.registerApp('wxbf371b0ab61d3873')
    this._autoLogin()
  }

  async _autoLogin() {
    const key = await Storage.get('key', {})
    if (!key.uid || !key.token || !key.timestamp) {
      Actions[SCENE_LOGIN_OPTIONS]()
      RNSplashScreen.hide()
      return
    }

    try {
      const { uid, token, timestamp } = key

      const res = await HttpUtils.get(USERS.check_token, key)

      if (res.code === 0) {
        setToken({uid, token, timestamp})

        const res = await HttpUtils.get(USERS.user, { user_id: uid })

        if (res.code === 0) {
          store.dispatch(fetchProfileSuccess(res.data))

          if (res.partner.id) {
            store.dispatch(fetchPartnerSuccess(res.partner))
          }
          Actions[SCENE_INDEX]()
        }
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
