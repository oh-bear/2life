import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'

import dismissKeyboard from 'dismissKeyboard'
import { View, Text } from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import TextPingFang from '../../components/TextPingFang'
import Banner from './Banner'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'
import { SCENE_LOGIN_NICKNAME } from '../../constants/scene'

import { USERS } from '../../network/Urls'
import HttpUtils from '../../network/HttpUtils'

const URL_code = USERS.code
const URL_register = USERS.register

export default class Signup extends Component {

  state = {
    account: '',
    password: '',
    code: '',
    timestamp: null,
    text_code: '获取验证码',
    accountTip: '',
    showAccountTip: false,
    showCodeTip: false,
    showPswTip: false,
  }

  async getCode () {
    if (/^1(3|4|5|7|8)\d{9}$/.test(this.state.account)) {
      this.setState({showAccountTip: false})
    } else {
      return this.setState({showAccountTip: true, accountTip: '手机格式错误'})
    }

    const res = await HttpUtils.post(URL_code, {account: this.state.account})
    if (res.code === 0) {
      console.log(res)
      this.setState({timestamp: res.data.timestamp})
      Alert.alert('', '验证码已发送')
    }
    if (res.code === 501) Alert.alert('', '请求过于频繁，请稍后再试')
  }

  async register () {
    if (!this.state.timestamp) return Alert.alert('', '请先获取验证码')
    if (/^[^\s]{6,16}$/.test(this.state.password)) {
      this.setState({showPswTip: false})
    } else {
      return this.setState({showPswTip: true})
    }

    const data = {
      account: this.state.account,
      password: this.state.password,
      code: this.state.code,
      timestamp: this.state.timestamp
    }
    const res = await HttpUtils.post(URL_register, data)

    if (res.code === 302) return this.setState({showAccountTip: true, accountTip: '该号码已被注册'})
    if (res.code === 405) return this.setState({showCodeTip: true})
    if (res.code === 0) {
      Storage.set('user', {
        account: this.state.account,
        password: this.state.password
      })

      const {uid, token, timestamp} = res.data
      setToken({uid, token, timestamp})
      
      Actions.jump(SCENE_LOGIN_NICKNAME, {user: res.user})
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container} animation='fadeIn'>
					<Banner
            bg={require('../../../res/images/login/bg_signup.png')}
            title={['Wow', '欢迎成为新成员！']}
            showNavLeft={true}
            onNavLeftPress={() => Actions.pop()}
            showNavRight={false}
          />

          <KeyboardAwareScrollView>
            <View style={styles.inputs_container}>
              <TextInput
                style={styles.input}
                onChangeText={account => this.setState({account})}
                value={this.state.account}
                keyboardType='numeric'
                maxLength={11}
                clearButtonMode='while-editing'
                placeholder='请输入手机号码'
                placeholderTextColor='#aaa'
              />
              <TextPingFang style={[styles.text_tip, {color: this.state.showAccountTip ? '#F43C56' : 'transparent'}]}>{this.state.accountTip}</TextPingFang>

              <View style={styles.code_container}>
                <TextInput
                  style={[styles.input, styles.input_code]}
                  onChangeText={code => this.setState({code})}
                  value={this.state.code}
                  keyboardType='numeric'
                  clearButtonMode='while-editing'
                  placeholder='请输入验证码'
                  placeholderTextColor='#aaa'
                  multiline={false}
                />
                <TouchableOpacity
                  style={styles.text_code_container}
                  onPress={() => {this.getCode()}}
                >
                  <TextPingFang style={styles.text_code}>{this.state.text_code}</TextPingFang>
                </TouchableOpacity>
              </View>
              <TextPingFang style={[styles.text_tip, {color: this.state.showCodeTip ? '#F43C56' : 'transparent'}]}>验证码错误</TextPingFang>

              <TextInput
                style={styles.input}
                onChangeText={password => this.setState({password})}
                value={this.state.password}
                clearButtonMode='while-editing'
                placeholder='请输入密码'
                placeholderTextColor='#aaa'
                multiline={false}
                secureTextEntry
              />
              <TextPingFang style={[styles.text_tip, {color: this.state.showPswTip ? '#F43C56' : 'transparent'}]}>6-16位密码</TextPingFang>
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
    height: HEIGHT,
    alignItems: 'center',
  },
  inputs_container: {
    flex: 1,
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
