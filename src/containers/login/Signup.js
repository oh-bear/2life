import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native'
import Toast from 'antd-mobile/lib/toast'

import dismissKeyboard from 'dismissKeyboard'
import { View } from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import TextPingFang from '../../components/TextPingFang'
import NetStatus from '../../components/NetStatus'
import Banner from './Banner'
import Storage from '../../common/storage'
import store from '../../redux/store'
import { fetchProfileSuccess } from '../../redux/modules/user'
import { fetchPartnerSuccess } from '../../redux/modules/partner'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'
import { SCENE_LOGIN_NICKNAME, SCENE_LOGIN_AREA } from '../../constants/scene'

import { USERS } from '../../network/Urls'
import HttpUtils from '../../network/HttpUtils'
import { setToken } from '../../network/HttpUtils'

const URL_code = USERS.code
const URL_register = USERS.register
const URL_login = USERS.login

export default class Signup extends Component {

  state = {
    accountArea: '+86',
    account: '',
    password: '',
    code: '',
    timestamp: null,
    text_code: '获取验证码',
    accountTip: '',
    showAccountTip: false,
    showCodeTip: false,
    showPswTip: false,
    hadSendCode: false
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('select_area', area => {
      this.setState({accountArea: area})
    })
  }

  async getCode() {
    
    let region = 'china'
    let phoneReg = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/
    switch (this.setState.accountArea) {
      case '+1':
        phoneReg = /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/
        region = 'en-US'
        break
      default:
        phoneReg = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/
        region = 'china'
        break
    }
    if (!phoneReg.test(this.state.account))
      return Toast.fail('手机号码格式错误', 1)

    const res = await HttpUtils.post(`${URL_code}?region=${region}`, { account: this.state.accountArea + this.state.account })
    if (res.code === 0) {
      this.setState({
        timestamp: res.data.timestamp,
        hadSendCode: true
      })
      Toast.success('验证码已发送', 1)
    }
    if (res.code === 501) Toast.fail('请求过于频繁，请稍后再试', 1)
  }

  async register() {
    if (!this.state.timestamp) return Toast.fail('请先获取验证码', 1)
    if (/^[^\s]{6,16}$/.test(this.state.password)) {
      this.setState({ showPswTip: false })
    } else {
      return this.setState({ showPswTip: true })
    }

    const data = {
      account: this.state.account,
      password: this.state.password,
      code: this.state.code,
      timestamp: this.state.timestamp
    }
    const res = await HttpUtils.post(URL_register, data)

    if (res.code === 302) return this.setState({ showAccountTip: true, accountTip: '该号码已被注册' })
    if (res.code === 405) return this.setState({ showCodeTip: true })
    if (res.code === 0) {
      const data = {
        account: this.state.account,
        password: this.state.password
      }
      const res = await HttpUtils.post(URL_login, data)
      if (res.code === 0) {
        Storage.set('user', {
          account: this.state.account,
          password: this.state.password
        })
        const { uid, token, timestamp } = res.data.key
        setToken({ uid, token, timestamp })

        store.dispatch(fetchProfileSuccess(res.data.user))
        store.dispatch(fetchPartnerSuccess(res.data.partner))

        Actions.reset(SCENE_LOGIN_NICKNAME, { user: res.data.user })
      }
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container} animation='fadeIn'>
          <NetStatus showNetStatus={true}/>
          <Banner
            bg={require('../../../res/images/login/bg_signup.png')}
            title={['Wow', '欢迎成为新成员']}
            showNavLeft={true}
            onNavLeftPress={() => Actions.pop()}
            showNavRight={false}
          />

          <KeyboardAwareScrollView>
            <View style={styles.inputs_container}>
              <View style={styles.account_container}>
                <TouchableOpacity
                  style={styles.account_area}
                  onPress={() => Actions.jump(SCENE_LOGIN_AREA, {area: this.state.accountArea})}
                >
                  <TextPingFang style={styles.text_area}>{this.state.accountArea}</TextPingFang>
                </TouchableOpacity>
                <TextInput
                  style={styles.input_phone}
                  onChangeText={account => this.setState({ account, showAccountTip: false })}
                  value={this.state.account}
                  keyboardType='numeric'
                  maxLength={11}
                  underlineColorAndroid='transparent'
                  clearButtonMode='while-editing'
                  placeholder='请输入手机号码'
                  placeholderTextColor='#aaa'
                />
              </View>
              <TextPingFang style={[styles.text_tip, { color: this.state.showAccountTip ? '#F43C56' : 'transparent' }]}>{this.state.accountTip}</TextPingFang>

              <View style={styles.code_container}>
                <TextInput
                  style={[styles.input, styles.input_code]}
                  onChangeText={code => this.setState({ code, showCodeTip: false })}
                  value={this.state.code}
                  keyboardType='numeric'
                  underlineColorAndroid='transparent'
                  placeholder='请输入验证码'
                  placeholderTextColor='#aaa'
                  multiline={false}
                />
                <TouchableOpacity
                  style={styles.text_code_container}
                  onPress={() => { this.getCode() }}
                >
                  <TextPingFang style={[styles.text_code, {color: this.state.hadSendCode ? '#aaa' : '#2DC3A6'}]}>{this.state.text_code}</TextPingFang>
                </TouchableOpacity>
              </View>
              <TextPingFang style={[styles.text_tip, { color: this.state.showCodeTip ? '#F43C56' : 'transparent' }]}>验证码错误</TextPingFang>

              <TextInput
                style={styles.input}
                onChangeText={password => this.setState({ password, showPswTip: false })}
                value={this.state.password}
                clearButtonMode='while-editing'
                underlineColorAndroid='transparent'
                placeholder='请输入密码'
                placeholderTextColor='#aaa'
                multiline={false}
                secureTextEntry
              />
              <TextPingFang style={[styles.text_tip, { color: this.state.showPswTip ? '#F43C56' : 'transparent' }]}>6-16位密码</TextPingFang>
            </View>
          </KeyboardAwareScrollView>

          <TouchableOpacity
            style={styles.btn_container}
            onPress={() => this.register()}
          >
            <TextPingFang style={styles.text_btn}>注册</TextPingFang>
          </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: WIDTH,
    alignItems: 'center',
    flex: 1
  },
  inputs_container: {
    flex: 1,
  },
  account_container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: getResponsiveWidth(240),
    borderBottomWidth: .5,
    borderBottomColor: '#2DC3A6',
  },
  account_area: {
    width: getResponsiveWidth(40),
    height: getResponsiveWidth(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getResponsiveHeight(24),
    marginRight: getResponsiveWidth(10),
    marginLeft: getResponsiveWidth(2),
    borderWidth: 1,
    borderColor: '#2DC3A6',
    borderRadius: 4
  },
  text_area: {
    color: '#2DC3A6',
    textAlign: 'center',
  },
  input: {
    width: getResponsiveWidth(240),
    height: getResponsiveHeight(50),
    marginTop: getResponsiveHeight(24),
    color: '#444',
    fontSize: 16,
    borderBottomWidth: .5,
    borderBottomColor: '#2DC3A6',
  },
  input_phone: {
    width: getResponsiveWidth(240),
    height: getResponsiveHeight(50),
    marginTop: getResponsiveHeight(24),
    color: '#444',
    fontSize: 16,
  },
  code_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getResponsiveHeight(16),
  },
  input_code: {
    marginTop: 0,
  },
  text_code_container: {
    position: 'absolute',
    right: 0,
  },
  text_code: {
    color: '#2DC3A6',
    fontSize: 16,
  },
  text_tip: {
    fontSize: 12,
    marginTop: 4
  },
  btn_container: {
    position: 'absolute',
    left: getResponsiveWidth(68),
    bottom: getResponsiveHeight(100)
  },
  text_btn: {
    color: '#2DC3A6',
    fontSize: 24,
    fontWeight: '300'
  }
})
