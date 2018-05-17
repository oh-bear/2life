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

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'
import { SCENE_LOGIN_GENDER } from '../../constants/scene'

export default class Nickname extends Component {

  state = {
    nickname: '',
    showNameTip: false
  }

  async setNickname() {
    if (this.state.nickname) {
      this.setState({ showNameTip: false })
    } else {
      return this.setState({ showNameTip: true })
    }
    Actions.reset(SCENE_LOGIN_GENDER, { user: Object.assign(this.props.user, { name: this.state.nickname }) })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container} animation='fadeIn'>
          <Banner
            bg={require('../../../res/images/login/bg_nickname.png')}
            title={['注册成功', '取个好听的昵称吧']}
            showNavLeft={false}
            showNavRight={false}
          />

          <View style={styles.inputs_container}>
            <TextInput
              style={styles.input}
              onChangeText={nickname => this.setState({ nickname })}
              clearButtonMode='while-editing'
              placeholder='输入昵称'
              placeholderTextColor='#aaa'
            />
            <TextPingFang style={[styles.text_tip, { color: this.state.showNameTip ? '#F43C56' : 'transparent' }]}>昵称不能为空</TextPingFang>
            <TouchableOpacity
              style={styles.btn_container}
              onPress={() => this.setNickname()}
            >
              <TextPingFang style={styles.text_btn}>下一步</TextPingFang>
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
    marginTop: getResponsiveHeight(24),
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
