import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  Platform,
  DeviceEventEmitter,
  Animated,
  Text
} from 'react-native'
import { View } from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import PropTypes from 'prop-types'

import Container from '../../../components/Container'

import Storage from '../../../common/storage'
import {
  WIDTH,
  getResponsiveWidth,
  font
} from '../../../common/styles'

import {
  formatDate,
  getLocation,
  getWeather,
  diaryClassify,
  getWeatherDesc,
  updateUser,
  updateReduxUser,
  downloadImg,
  updateFile,
  readFile,
  readFullFile,
  uuid,
  SYNC_TIMEOUT_ID
} from '../../../common/util'
import store from '../../../redux/store'
import { cleanPartner } from '../../../redux/modules/partner'
import { SCENE_NEW_DIARY } from '../../../constants/scene'
import Toast from 'antd-mobile/lib/toast'

import HttpUtils from '../../../network/HttpUtils'
import { NOTES } from '../../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class NoteCard extends Component {

  static propTypes = {
    diary: PropTypes.object
  }

  getModeImg = (mode) => {
    if (mode < 20) return <Image source={require('../../../../res/images/hole/icon_mood_verySad.png')} />
    if (mode >= 20 && mode < 40) return <Image source={require('../../../../res/images/hole/icon_mood_sad.png')} />
    if (mode >= 40 && mode < 60) return <Image source={require('../../../../res/images/hole/icon_mood_normal.png')} />
    if (mode >= 60 && mode < 80) return <Image source={require('../../../../res/images/hole/icon_mood_happy.png')} />
    if (mode >= 80) return <Image source={require('../../../../res/images/hole/icon_mood_veryHappy.png')} />
  }

  render() {
    const { diary } = this.props
    return (
      <View style={styles.ctn}>
        <Text style={styles.text_title}>{diary.title}</Text>
        <Text style={styles.text_content} numberOfLines={2}>{diary.content}</Text>
        <View style={styles.bottom_ctn}>
          <View style={styles.bottm_left_ctn}>
            <Image style={styles.img_face} source={{uri: diary.face}} />
            <Text style={styles.text_name}>{diary.name}</Text>
          </View>
          {this.getModeImg(diary.mode)}
        </View>
      </View>
    )
  }
}

const getWidth = getResponsiveWidth
const styles = StyleSheet.create({
  ctn: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: getWidth(24),
    paddingVertical: getWidth(24),
    borderRadius: getWidth(8)
  },
  text_title: {
    ...font('#333', 16)
  },
  text_content: {
    ...font('#666', 12),
    marginTop: getWidth(12),
  },
  bottom_ctn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: getWidth(18),
  },
  bottm_left_ctn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  img_face: {
    width: getWidth(24),
    height: getWidth(24),
    borderRadius: getWidth(12),
    marginRight: getWidth(8),
  },
  text_name: {
    ...font('#aaa', 14),
  }
})
