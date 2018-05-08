import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'

import { View } from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'

import TextPingFang from '../../components/TextPingFang'
import Banner from './Banner'
import store from '../../redux/store'
import { fetchProfileSuccess } from '../../redux/modules/user'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'
import { SCENE_INDEX } from '../../constants/scene'

import { USERS } from '../../network/Urls'
import HttpUtils from '../../network/HttpUtils'

import JPushModule from 'jpush-react-native'

const URL_update = USERS.update
const URL_user = USERS.user

export default class Gender extends Component {

  state = {
    gender: 0
  }

  async onSubmit() {
    const data = {
      sex: this.state.gender,
      name: this.props.user.name,
      face: this.props.user.face,
      status: 502,
      latitude: 0,
      longitude: 0
    }
    const res = await HttpUtils.post(URL_update, data)

    if (res.code === 0) {
      const res = await HttpUtils.get(URL_user, { user_id: this.props.user.id })

      if (res.code === 0) {

        JPushModule.setAlias(this.props.user.id.toString(), success => {
          console.log(success)
        })

        store.dispatch(fetchProfileSuccess(res.data))
        Actions.reset(SCENE_INDEX, { user: res.data })
      }
    }
  }

  render() {
    return (
      <View style={styles.container} animation='fadeIn'>
        <Banner
          bg={require('../../../res/images/login/bg_gender.png')}
          title={['Hey', '你的性别是？']}
          showNavLeft={false}
          showNavRight={false}
        />

        <View style={styles.inputs_container}>
          <TouchableOpacity onPress={() => this.setState({ gender: 0 })}>
            <View style={styles.gender_item}>
              <TextPingFang
                style={[styles.text_gender, { color: this.state.gender ? '#aaa' : '#2DC3A6' }]}>男</TextPingFang>
              <Image
                style={{ display: this.state.gender ? 'none' : 'flex' }}
                source={require('../../../res/images/login/icon_checked.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ gender: 1 })}>
            <View style={styles.gender_item}>
              <TextPingFang
                style={[styles.text_gender, { color: this.state.gender ? '#2DC3A6' : '#aaa' }]}>女</TextPingFang>
              <Image
                style={{ display: this.state.gender ? 'flex' : 'none' }}
                source={require('../../../res/images/login/icon_checked.png')}
              />
            </View>
          </TouchableOpacity>
          <TextPingFang style={styles.text_tip}>性别仅用于匹配，确定后不能再次修改，请谨慎。</TextPingFang>
          <TouchableOpacity
            style={styles.btn_container}
            onPress={() => this.onSubmit()}
          >
            <TextPingFang style={styles.text_btn}>开启日记本</TextPingFang>
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
  inputs_container: {
    flex: 1,
  },
  gender_item: {
    width: getResponsiveWidth(240),
    height: getResponsiveHeight(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getResponsiveHeight(24),
    borderBottomWidth: .5,
    borderBottomColor: '#2DC3A6',
  },
  text_gender: {
    fontSize: 16
  },
  text_tip: {
    width: getResponsiveWidth(240),
    color: '#000',
    fontSize: 12,
    marginTop: getResponsiveHeight(24)
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
