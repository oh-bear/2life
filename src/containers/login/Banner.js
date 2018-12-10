import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { View } from 'react-native-animatable'

import TextPingFang from '../../components/TextPingFang'

import {
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'

export default class Banner extends Component {
  static propTypes = {
    bg: PropTypes.number.isRequired,
    title: PropTypes.arrayOf(PropTypes.string).isRequired,
    showNavLeft: PropTypes.bool.isRequired,
    showNavRight: PropTypes.bool.isRequired,
    onNavLeftPress: PropTypes.func,
    onNavRightPress: PropTypes.func
  }

  render() {
    return (
      <View style={styles.container} animation='fadeIn'>
        <ImageBackground style={styles.banner} source={this.props.bg}>
          <View style={styles.nav_bar}>
            <TouchableOpacity style={styles.nav_left_container} onPress={this.props.onNavLeftPress}>
              <Image
                style={{ display: this.props.showNavLeft ? 'flex' : 'none' }}
                source={require('../../../res/images/common/icon_back_white.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={{display: Date.now() > new Date('2018-12-25').getTime() ? 'flex' : 'none'}} onPress={this.props.onNavRightPress}>
              <TextPingFang style={[styles.text_nav_right, { display: this.props.showNavRight ? 'flex' : 'none' }]}>直接使用</TextPingFang>
            </TouchableOpacity>
          </View>
          <View style={styles.title_container}>
            <TextPingFang style={styles.text_title}>{this.props.title[0]}</TextPingFang>
            <TextPingFang style={styles.text_title}>{this.props.title[1]}</TextPingFang>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  banner: {
    width: WIDTH,
    height: getResponsiveHeight(224),
    ...ifIphoneX({
      paddingTop: 44
    }, {
      paddingTop: 20
    })
  },
  nav_bar: {
    width: WIDTH,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: getResponsiveWidth(18),
    paddingRight: getResponsiveWidth(18)
  },
  nav_left_container: {
    width: getResponsiveWidth(25)
  },
  text_nav_right: {
    color: '#000',
    fontSize: 16,
    fontWeight: '300',
  },
  title_container: {
    marginLeft: getResponsiveWidth(72),
    marginTop: getResponsiveHeight(18)
  },
  text_title: {
    color: '#000',
    fontSize: 34,
    fontWeight: 'bold',
  }
})
