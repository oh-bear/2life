import React, { Component } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'

import TextPingFang from '../../../components/TextPingFang'
import CommonNav from '../../../components/CommonNav'

import {
  getResponsiveWidth
} from '../../../common/styles'

export default class ProfileHeader extends Component {

  static propTypes = {}

  render() {
    return (
      <View style={styles.container}>
        <CommonNav
          navBarStyle={styles.navbar}
          rightButton={this.props.rightButton}
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
