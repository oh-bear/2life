import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import { View } from 'react-native-animatable'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'

import { SCENE_DIARY_DETAIL } from '../../../constants/scene'

import {
  WIDTH,
  getResponsiveWidth,
  font
} from '../../../common/styles'

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
    const name = diary.user.emotions_type && diary.user.emotions_type || '匿名'
    return (
      <TouchableOpacity
        style={styles.ctn}
        onPress={() => Actions.jump(SCENE_DIARY_DETAIL, { diary, from: 'hole' })}
      >
        <View style={styles.content_ctn}>
          <View style={styles.content_left_ctn}>
            <Text style={styles.text_title}>{diary.title}</Text>
            <Text style={styles.text_content} numberOfLines={2}>{diary.content}</Text>
          </View>
          <Image style={styles.img_content_right} source={{uri: diary.images.split(',')[0] || ''}} />
        </View>
        <View style={styles.bottom_ctn}>
          <View style={styles.bottm_left_ctn}>
            <Image style={styles.img_face} source={{uri: !diary.user.sex && 'https://airing.ursb.me/image/twolife/male.png' || 'https://airing.ursb.me/image/twolife/female.png' }} />
            <Text style={styles.text_name}>{name + ' ' + diary.user.code.toString().substr(diary.user.code.toString().length - 4, 4)}</Text>
          </View>
          {this.getModeImg(diary.mode)}
        </View>
      </TouchableOpacity>
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
    marginTop: getWidth(18),
    borderRadius: getWidth(8)
  },
  content_ctn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content_left_ctn: {
    flex: 1,
  },
  img_content_right: {
    width: getWidth(72),
    height: getWidth(72),
    borderRadius: getWidth(12)
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
