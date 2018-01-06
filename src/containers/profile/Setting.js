import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image
} from 'react-native'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

import { View } from 'react-native-animatable'
import TextPingFang from '../../components/TextPingFang'
import CommonNav from '../../components/CommonNav'
import { connect } from 'react-redux'

// TODO: 图片加载指示器
// import Image from 'react-native-image-progress'
// import * as Progress from 'react-native-progress'

import { USERS, UTIL } from '../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class Setting extends Component {

  state = {
    data: {},
    file: {},
    upload: 0
  }

  onSubmit = async () => {

  }

  faceHandler = async () => {

  }

  nameHandler = async () => {

  }

  sexHandler = async () => {

  }

  connectionHandler = async () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.bg}
          source={this.props.user.user_sex === 0
            ? require('../../../res/images/profile/about_bg.png')
            : require('../../../res/images/profile/about_bg_female.png')}>
          <CommonNav
            title={this.props.title}
            rightButton={
              <TouchableOpacity
                onPress={this.onSubmit}
                style={styles.rightButton}
              >
                <Text style={styles.rightButton_font}>完成</Text>
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            onPress={this.faceHandler}>
            <ImageBackground
              style={styles.avatar_round}
              source={require('../../../res/images/profile/avatar_round.png')}>
              <Image
                style={styles.avatar}
                source={{uri: this.props.user.user_face}}/>
            </ImageBackground>
          </TouchableOpacity>

          <TextPingFang style={styles.avatar_font}>{this.props.user.user_code}</TextPingFang>
        </ImageBackground>
        <TouchableOpacity
          onPress={this.nameHandler}>
          <View style={styles.online_name} delay={100} animation='bounceInRight'>
            <Text
              style={styles.online_font}>
              {this.props.user.user_name}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.sexHandler}>
          <View style={styles.online_sex} delay={150} animation='bounceInRight'>
            <Text
              style={styles.online_font}>
              {this.props.user.user_sex === 0 ? '男' : '女'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.connectionHandler}>
          <View style={styles.online_state} delay={200} animation='bounceInRight'>
            <Text
              style={styles.online_font}>
              {this.props.user.user_state === -404 ? '拒绝任何匹配' : '开放匹配'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: 'rgb(242,246,250)'
  },
  bg: {
    width: WIDTH,
    alignItems: 'center',
    height: getResponsiveHeight(240)
  },
  rightButton: {
    position: 'absolute',
    right: 0,
    width: 56,
    alignItems: 'center'
  },
  rightButton_font: {
    fontSize: 17,
    fontWeight: '500'
  },
  opacity0: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  avatar_round: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48
  },
  avatar: {
    width: getResponsiveWidth(55),
    height: getResponsiveWidth(55),
    borderRadius: getResponsiveHeight(27.5)
  },
  avatar_font: {
    color: '#666666',
    fontSize: 17,
    backgroundColor: 'rgba(0,0,0,0)',
    marginTop: 15,
    fontWeight: '600'
  },
  online_name: {
    marginTop: 52,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_sex: {
    marginTop: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_state: {
    marginTop: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_font: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  }
})
