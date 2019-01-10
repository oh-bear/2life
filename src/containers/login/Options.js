import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import * as WeChat from 'react-native-wechat'
import JPushModule from 'jpush-react-native'

import { View } from 'react-native-animatable'
import { Actions, Scene } from 'react-native-router-flux'

import TextPingFang from '../../components/TextPingFang'
import NetStatus from '../../components/NetStatus'
import Banner from './Banner'
import store from '../../redux/store'
import { fetchProfileSuccess } from '../../redux/modules/user'
import { fetchPartnerSuccess } from '../../redux/modules/partner'
import Toast from 'antd-mobile/lib/toast'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
} from '../../common/styles'
import { SCENE_LOGIN_SIGNIN, SCENE_LOGIN_SIGNUP, SCENE_LOGIN_NICKNAME, SCENE_INDEX } from '../../constants/scene'
import Storage from '../../common/storage'

import HttpUtils from '../../network/HttpUtils'
import { setToken } from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

export default class Options extends Component {

  state = {
    isWXAppInstalled: false
  }

  componentDidMount() {
    WeChat.isWXAppInstalled().then(isWXAppInstalled => this.setState({ isWXAppInstalled }))
  }

  wechat_login() {
    const scope = 'snsapi_userinfo'
    WeChat.sendAuthRequest(scope).then(res => {
      if (res.errCode === 0) {
        const { code } = res
        HttpUtils.post(USERS.oauth_login, { code, type: 'app' }).then(res => {
          // 用户已绑定，直接登陆
          if (res.code === 0) {
            const { uid, token, timestamp } = res.data.key
            setToken({ uid, token, timestamp })

            Storage.set('key', { uid, token, timestamp })

            store.dispatch(fetchProfileSuccess(res.data.user))
            store.dispatch(fetchPartnerSuccess(res.data.partner))

            JPushModule.setAlias(res.data.user.id.toString(), success => {
              console.log(success)
            })

            Actions.reset(SCENE_INDEX, { user: res.data.user, partner: res.data.partner })
          }

          // 用户未绑定
          if (res.code === 404) {
            const openid = res.data
            //如果未获取openid，提示重新登录
            if(!openid){
              Toast.info('微信登陆失败，请重新登录', 2)
              return
            }
            HttpUtils.post(USERS.bind_account, { account: openid, openid }).then(res => {
              const { uid, token, timestamp } = res.key
              setToken({ uid, token, timestamp })
              Actions.reset(SCENE_LOGIN_NICKNAME, { user: res.data })
            })
          }
        })
      }
    }).catch((error)=>{
    })
  }

  render() {
    return (
      <View style={styles.container} animation='fadeIn'>
        <NetStatus showNetStatus={true}/>
        <Banner
          bg={require('../../../res/images/login/bg_signin.png')}
          title={['Hi', '欢迎来到双生！']}
          showNavLeft={false}
          showNavRight={true}
          onNavRightPress={() => Actions.reset(SCENE_INDEX)}
        />

        <View style={styles.options_container}>
          <TouchableOpacity
            style={[styles.option, { display: this.state.isWXAppInstalled ? 'flex' : 'none' }]}
            onPress={() => this.wechat_login()}
          >
            <TextPingFang style={styles.text_option}>微信注册并登录</TextPingFang>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => Actions[SCENE_LOGIN_SIGNIN]()}
          >
            <TextPingFang style={styles.text_option}>使用手机登录</TextPingFang>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option_last}
            onPress={() => Actions[SCENE_LOGIN_SIGNUP]()}
          >
            <TextPingFang style={styles.text_option}>还没注册？</TextPingFang>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: WIDTH,
    //height: HEIGHT,
    alignItems: 'center',
    flex:1
  },
  options_container: {
    alignItems: 'center',
    marginTop: getResponsiveHeight(100)
  },
  option: {
    marginBottom: getResponsiveHeight(25),
  },
  option_last: {
    marginTop: getResponsiveHeight(160)
  },
  text_option: {
    color: '#000',
    fontSize: 24,
    fontWeight: '300',
  }
})
