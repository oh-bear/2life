import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import { HEIGHT, getResponsiveHeight } from '../common/styles'

export default class Calendar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Calendar</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'rgb(242,246,250)',
    alignItems: 'center',
    height: HEIGHT
  }
})
