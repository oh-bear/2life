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

export default class Notification extends Component {
  render() {
    return (
      <Container>
        <TextPingFang>???</TextPingFang>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  
})
