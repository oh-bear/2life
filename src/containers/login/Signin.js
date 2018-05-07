import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native'

import dismissKeyboard from 'dismissKeyboard'
import { View } from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'

import TextPingFang from '../../components/TextPingFang'
import Banner from './Banner'
import store from '../../redux/store'
import { fetchProfileSuccess } from '../../redux/modules/user'
import { fetchPartnerSuccess } from '../../redux/modules/partner'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'
import Storage from '../../common/storage'
import { SCENE_INDEX } from '../../constants/scene'

import { USERS } from '../../network/Urls'
import HttpUtils from '../../network/HttpUtils'
import { setToken } from '../../network/HttpUtils'

import JPushModule from 'jpush-react-native'

const URL_login = USERS.login

export default class Signin extends Component {

  state = {
    account: '',
    password: '',
    showAccountTip: false,
    showPswTip: false
  }

  async login() {
    const data = {
      account: this.state.account,
      password: this.state.password
    }
    const res = await HttpUtils.post(URL_login, data)

    if (res.code === 404) this.setState({ showAccountTip: true })
    if (res.code === 300) this.setState({ showPswTip: true })
    if (res.code === 0) {
      Storage.set('user', {
        account: this.state.account,
        password: this.state.password
      })

      const { uid, token, timestamp } = res.data.key
      setToken({ uid, token, timestamp })

      store.dispatch(fetchProfileSuccess(res.data.user))
      store.dispatch(fetchPartnerSuccess(res.data.partner))

      JPushModule.setAlias(res.data.user.id.toString(), success => {
        console.log(success)
      })

      Actions[SCENE_INDEX]({ user: res.data.user, partner: res.data.partner })
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container} animation='fadeIn'>
          <Banner
            bg={require('../../../res/images/login/bg_signin.png')}
            title={['Hi', '欢迎来到双生！']}
            showNavLeft={true}
            onNavLeftPress={() => Actions.pop()}
            showNavRight={false}
          />

          <View style={styles.inputs_container}>
            <TextInput
              style={styles.input}
              onChangeText={account => this.setState({ account, showAccountTip: false })}
              value={this.state.account}
              keyboardType='numeric'
              maxLength={11}
              clearButtonMode='while-editing'
              placeholder='请输入手机号码'
              placeholderTextColor='#aaa'
            />
            <TextPingFang style={[styles.text_tip, { color: this.state.showAccountTip ? '#F43C56' : 'transparent' }]}>用户不存在</TextPingFang>
            <TextInput
              style={styles.input}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              clearButtonMode='while-editing'
              placeholder='请输入密码'
              placeholderTextColor='#aaa'
              multiline={false}
              secureTextEntry
            />
            <TextPingFang
              style={[styles.text_tip, { color: this.state.showPswTip ? '#F43C56' : 'transparent' }]}>密码不正确</TextPingFang>

            <TouchableOpacity
              style={styles.btn_container}
              onPress={() => {
                this.login()
              }}
            >
              <TextPingFang style={styles.text_btn}>登录</TextPingFang>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
  },
  inputs_container: {
    flex: 1,
  },
  input: {
    width: getResponsiveWidth(240),
    height: getResponsiveHeight(50),
    marginTop: getResponsiveHeight(16),
    color: '#444',
    fontSize: 16,
    borderBottomWidth: .5,
    borderBottomColor: '#2DC3A6',
  },
  text_tip: {
    fontSize: 12,
    marginTop: 4
  },
  btn_container: {
    position: 'absolute',
    bottom: getResponsiveHeight(100)
  },
  text_btn: {
    color: '#2DC3A6',
    fontSize: 24,
    fontWeight: '300'
  }
})
