import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { View, Text } from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'

import TextPingFang from '../../components/TextPingFang'
import Banner from './Banner'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'
import { SCENE_LOGIN_SIGNIN, SCENE_LOGIN_SIGNUP } from '../../constants/scene'

export default class Options extends Component {

  render() {
    return (
      <View style={styles.container} animation='fadeIn'>
        <Banner
          bg={require('../../../res/images/login/bg_signin.png')}
          title={['Hi', '欢迎来到双生！']}
          showNavLeft={false}
          showNavRight={true}
        />

        <View style={styles.options_container}>
          <TouchableOpacity
            style={styles.option}
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
    height: HEIGHT,
    alignItems: 'center',
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
