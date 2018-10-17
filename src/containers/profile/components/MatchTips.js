import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import { View } from 'react-native-animatable'
import Swiper from 'react-native-swiper'

import TextPingFang from '../../../components/TextPingFang'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth
} from '../../../common/styles'

export default class MatchTips extends Component {
  static propTypes = {}

  state = {
    showBtn: false
  }

  renderPopup() {
    return this.props.tips.map((tip, i) => {
      return (
        <ImageBackground
          key={i}
          source={tip.bg}
          style={[styles.popup_container, { backgroundColor: this.props.popupBgColor }]}
        >
          <TextPingFang style={styles.text_title}>{tip.title}</TextPingFang>
          <TextPingFang style={styles.text_stitle}>{tip.sTitle}</TextPingFang>
        </ImageBackground>
      )
    })
  }

  swiperChange(index) {
    if (index === 2) return this.setState({ showBtn: true })
    this.setState({ showBtn: false })
  }

  render() {
    return (
      <View style={[styles.container, { display: this.props.showPopup ? 'flex' : 'none'}]}>
        <View style={styles.swiper_container} animation='bounceIn'>
          <Swiper
            style={styles.swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={index => this.swiperChange(index)}
          >
            {this.renderPopup()}
          </Swiper>
        </View>

        <TouchableOpacity
          style={[styles.btn, { display: this.state.showBtn ? 'flex' : 'none' }]}
          onPress={this.props.onClose}
        >
          <TextPingFang style={styles.text_btn}>我明白了</TextPingFang>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  swiper_container: {
    width: WIDTH,
    height: getResponsiveWidth(415),
    alignItems: 'center',
  },
  swiper: {
    paddingLeft: (WIDTH - getResponsiveWidth(311)) / 2,
  },
  popup_container: {
    width: getResponsiveWidth(311),
    height: getResponsiveWidth(415),
    paddingLeft: getResponsiveWidth(40),
    paddingRight: getResponsiveWidth(24),
    backgroundColor: '#fff',
    borderRadius: getResponsiveWidth(8),
  },
  text_title: {
    marginTop: getResponsiveWidth(215),
    color: '#000',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center'
  },
  text_stitle: {
    marginTop: getResponsiveWidth(8),
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center'
  },
  btn: {
    width: getResponsiveWidth(112),
    height: getResponsiveWidth(48),
    position: 'absolute',
    bottom: getResponsiveWidth(54),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveWidth(24),
    backgroundColor: '#fff',
    borderRadius: getResponsiveWidth(24)
  },
  text_btn: {
    color: '#000',
    fontSize: 20,
    fontWeight: '300'
  }
})
