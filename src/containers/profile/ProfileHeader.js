import React, { Component } from 'react'
import {
	View,
	StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import TextPingFang from '../../components/TextPingFang'
import CommonNav from '../../components/CommonNav'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'

export default class ProfileHeader extends Component {

  static propTypes = {
  }

  render() {
    return (
      <View style={styles.container}>
				<CommonNav
          navBarStyle={styles.navbar}
        />

        <TextPingFang style={styles.text_title}>{this.props.title}</TextPingFang>
        <TextPingFang style={styles.text_desc}>{this.props.desc}</TextPingFang>
			</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: getResponsiveWidth(24),
  },
  navbar: {
    backgroundColor: 'transparent'
  },
  text_title: {
    marginLeft: getResponsiveWidth(24),
    color: '#000',
    fontSize: 34,
    fontWeight: 'bold'
  },
  text_desc: {
    marginLeft: getResponsiveWidth(24),
    marginTop: getResponsiveWidth(8),
    color: '#000',
    fontSize: 16,
    fontWeight: '300'
  }
})
