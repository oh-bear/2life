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

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'

import JPushModule from 'jpush-react-native'

export default class Notification extends Component {

  componentDidMount() {
    JPushModule.clearAllNotifications()
  }

  render() {
    return (
      <Container>
        <TextPingFang>通知</TextPingFang>
      </Container>
    )
  }
}

const styles = StyleSheet.create({})
