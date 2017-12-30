import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../common/styles'

import { SCENE_LOGIN } from '../constants/scene'
import { Actions } from 'react-native-router-flux'
import { USERS } from '../network/Urls'
import HttpUtils from '../network/HttpUtils'
import TextPingFang from '../components/TextPingFang'

import dismissKeyboard from 'dismissKeyboard'
import { View, Text } from 'react-native-animatable'

const URL_REGISTER = USERS.register
const URL_CODE = USERS.code

export default class Register extends Component {

  state = {
    user_account: '',
    user_password: '',
    user_name: '',
    code: '',
    lastTime: 0
  }

  getCode = async () => {

    const {user_account, lastTime} = this.state
    const nowTime = Date.now()

    if (nowTime - lastTime < 600000) {
      Alert.alert('小提示', '请等待十分钟才可以获取哦~')
      return
    }
    if (!user_account.trim()) {
      Alert.alert('小提示', '请输入手机号哦~')
      return
    }
    HttpUtils.post(URL_CODE, {
      user_account,
      timestamp: nowTime
    }).then(res => {
      switch (res.code) {
      case 0:
        this.setState({
          lastTime: Date.now()
        })
        break
      case 5000:
        Alert.alert('小提示', '请等待十分钟才可以获取哦~')
        break
      default:
        Alert.alert('小提示', '获取验证码失败！')
        break
      }
    })
  }

  onSubmit = async () => {

    const {user_account, code, user_password, user_name} = this.state

    if (!user_account.trim()) {
      Alert.alert('小提示', '请输入手机号哦~')
      return
    }
    if (!code.trim()) {
      Alert.alert('小提示', '请输入验证码哦~')
      return
    }
    if (!user_password.trim()) {
      Alert.alert('小提示', '请输入密码哦~')
      return
    }
    if (!user_name.trim()) {
      Alert.alert('小提示', '请输入昵称哦~')
      return
    }

    HttpUtils.post(URL_REGISTER, {
      user_account,
      user_password,
      user_name,
      code,
      timestamp: Date.now()
    }).then(res => {
      switch (res.code) {
      case 0:
        Alert.alert('小提示', '注册成功！')
        Actions[SCENE_LOGIN]()
        break
      case 1003:
        Alert.alert('小提示', '验证码错误！')
        break
      case 1004:
        Alert.alert('小提示', '该手机号已被注册！')
        break
      default:
        Alert.alert('小提示', '注册失败！')
        break
      }
    })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container} animation='fadeIn'>
          <ImageBackground style={styles.bg} source={require('../../res/images/login/welcome_bg.png')}>
            <View style={styles.text}>
              <TextPingFang style={styles.title}>双生</TextPingFang>
              <TextPingFang style={styles.e_title}>今夕何夕 见此良人</TextPingFang>
            </View>
            <View style={styles.form} animation='zoomIn' delay={100}>
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请输入您的手机号'}
                placeholderTextColor={'white'}
                style={styles.text_input}
                keyboardType='numeric'
                onChangeText={(text) => {
                  this.setState({user_account: text})
                }}
              />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请先获取验证码再输入哦'}
                placeholderTextColor={'white'}
                keyboardType='numeric'
                style={styles.text_input}
                onChangeText={(text) => {
                  this.setState({code: text})
                }}
              />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请输入密码'}
                placeholderTextColor={'white'}
                style={styles.text_input}
                password={true}
                onChangeText={(text) => {
                  this.setState({user_password: text})
                }}
              />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请输入您的昵称'}
                placeholderTextColor={'white'}
                style={styles.text_input}
                onChangeText={(text) => {
                  this.setState({user_name: text})
                }}
              />
              <Text style={styles.remind}>很高兴 遇见你 ：）</Text>
            </View>
            <TouchableOpacity
              style={styles.online_code}
              onPress={this.getCode()}>
              <View animation='zoomIn' delay={100}>
                <Text
                  style={styles.online_font}>
                  获取验证码
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.online_login}
              onPress={this.onSubmit()}>
              <View animation='zoomIn' delay={100}>
                <Text
                  style={styles.online_font}>
                  注册
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.online_register}
              onPress={() => {
                Actions[SCENE_LOGIN]()
              }}>
              <View animation='zoomIn' delay={100}>
                <Text
                  style={styles.online_font}>
                  返回
                </Text>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#73C0FF',
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
  },
  bg: {
    alignItems: 'center',
    width: WIDTH,
    height: HEIGHT
  },
  logo: {
    marginTop: getResponsiveHeight(60),
  },
  text: {
    alignItems: 'center',
  },
  title: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    height: 33 / 667 * HEIGHT,
    marginTop: HEIGHT * 0.0419
  },
  e_title: {
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 12,
    color: 'white'
  },
  form: {
    marginTop: HEIGHT * 0.0479,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text_input: {
    height: getResponsiveHeight(44),
    width: getResponsiveWidth(240),
    color: 'white',
    backgroundColor: 'rgb(139,203,255)',
    borderRadius: getResponsiveHeight(22),
    marginBottom: getResponsiveHeight(14),
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: getResponsiveWidth(10),
    flexDirection: 'row'
  },
  remind: {
    fontSize: 10,
    color: 'white',
    marginTop: HEIGHT * 0.037,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  online_code: {
    position: 'absolute',
    bottom: HEIGHT * 0.245,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_login: {
    position: 'absolute',
    bottom: HEIGHT * 0.155,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_register: {
    position: 'absolute',
    bottom: HEIGHT * 0.065,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_font: {
    fontSize: 14
  }
})
