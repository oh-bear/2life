import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
} from 'react-native'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'

export default class Notification extends Component {
  render() {
    return (
      <View style={styles.container}>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    width: WIDTH,
    height: HEIGHT
  }
})
