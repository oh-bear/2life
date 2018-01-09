import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image
} from 'react-native'

import {
  WIDTH,
  INNERWIDTH,
  HEIGHT,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

import TextPingFang from '../../components/TextPingFang'
import { Actions } from 'react-native-router-flux'
import * as scenes from '../../constants/scene'
import { connect } from 'react-redux'

// TODO: 图片加载指示器
// import Image from 'react-native-image-progress'
// import * as Progress from 'react-native-progress'
import { View } from 'react-native-animatable'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class Profile extends Component {

  onJump = (page, title) => {
    Actions[page]({title})
  }

  componentWillMount() {

    if (this.props.user.user_other_id !== -1 && this.props.user.user_other_id !== -404) {
      LinkImage =
        <View style={styles.link_round}>
          <Image
            style={styles.link}
            source={require('../../../res/images/profile/link.png')}/>
        </View>
      PartnerView =
        <View style={styles.avatar_content}>
          <Image
            style={styles.avatar_face}
            source={{uri: this.props.partner.user_face}}/>
          <TextPingFang style={styles.avatar_font}>
            {this.props.partner.user_name}
          </TextPingFang>
        </View>
    }
  }

  render() {
    const list = require('../../../res/images/profile/icon_list.png')
    const connect = require('../../../res/images/profile/icon_connect.png')
    const setting = require('../../../res/images/profile/icon_setting.png')
    const feedback = require('../../../res/images/profile/icon_feedback.png')
    const about_us = require('../../../res/images/profile/icon_about_us.png')

    const texts = ['创建日记', '匹配', '设置', '意见反馈', '关于我们']
    const images = [list, connect, setting, feedback, about_us]

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{alignItems: 'center'}}
      >
        <View style={styles.info_container} animation='fadeIn'>
          <ImageBackground
            style={styles.avatar}
            source={require('../../../res/images/profile/avatar_bg.png')}
          >
            <View style={styles.avatar_container}>
              <View style={styles.avatar_content}>
                <Image
                  style={styles.avatar_face}
                  source={{uri: this.props.user.user_face}}/>
                <TextPingFang style={styles.avatar_font}>
                  {this.props.user.user_name}
                </TextPingFang>
              </View>
              {LinkImage}
              {PartnerView}
            </View>

            <TextPingFang style={styles.avatar_font}>
              {this.props.user.username}
            </TextPingFang>
          </ImageBackground>
        </View>
        <View style={styles.items1}>
          {texts.map((pageName, i) => {
            if (i >= 3) return
            return (
              <View key={i} delay={100 + i * 50} animation='bounceInRight'>
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    switch (pageName) {
                    case '创建日记':
                      this.onJump(scenes.SCENE_NOTEEDITOR, pageName)
                      break
                    case '匹配':
                      this.onJump(scenes.SCENE_CONNECTION, pageName)
                      break
                    case '设置':
                      this.onJump(scenes.SCENE_SETTING, pageName)
                      break
                    }
                  }}
                  style={styles.item}
                >
                  <Image source={images[i]}/>
                  <TextPingFang style={styles.item_font}>
                    {pageName}
                  </TextPingFang>
                  <Image
                    style={styles.item_arrow}
                    source={require('../../../res/images/profile/right_arrow.png')}
                  />
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
        <View style={styles.items2}>
          {texts.map((pageName, i) => {
            if (i < 3) return
            return (
              <View key={i} delay={100 + i * 50} animation='bounceInRight'>
                <TouchableOpacity
                  onPress={() => {
                    switch (pageName) {
                    case '意见反馈':
                      this.onJump(scenes.SCENE_FEEDBACK, pageName)
                      break
                    case '关于我们':
                      this.onJump(scenes.SCENE_ABOUT_US, pageName)
                    }
                  }}
                  key={i}
                  style={styles.item}
                >
                  <Image source={images[i]}/>
                  <TextPingFang style={styles.item_font}>
                    {pageName}
                  </TextPingFang>
                  <Image
                    style={styles.item_arrow}
                    source={require('../../../res/images/profile/right_arrow.png')}
                  />
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
        <View style={{height: 50}}/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: HEIGHT
  },
  info_container: {
    alignItems: 'center',
    width: INNERWIDTH
  },
  avatar_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar_content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  avatar_face: {
    marginTop: getResponsiveHeight(62),
    width: 55,
    height: 55,
    borderRadius: 27.5
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 52,
    width: INNERWIDTH,
    height: getResponsiveHeight(135)
  },
  avatar_round: {
    justifyContent: 'center',
    alignItems: 'center',
    width: getResponsiveWidth(60),
    height: getResponsiveHeight(60),
  },
  link_round: {
    marginTop: getResponsiveHeight(20),
  },
  item: {
    width: WIDTH - getResponsiveWidth(30),
    flexDirection: 'row',
    marginLeft: getResponsiveWidth(30),
    alignItems: 'center',
    height: getResponsiveHeight(56)
  },
  item_font: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginLeft: 16,
    width: 56
  },
  item_arrow: {
    position: 'absolute',
    right: getResponsiveWidth(30)
  },
  items1: {
    marginTop: 24
  },
  items2: {
    marginTop: 40
  },
  avatar_font: {
    color: '#666666',
    fontSize: 17,
    backgroundColor: 'rgba(0,0,0,0)',
    marginTop: 15,
    fontWeight: '600'
  }
})
