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
import JPushModule from 'jpush-react-native'


import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'

export default class Notification extends Component {
  state = { pushMsg: '' }

  componentDidMount() {
    console.log('2222')
    JPushModule.setAlias('1', success => {
      console.log(success)
    })
    // JPushModule.addReceiveCustomMsgListener((message) => {
    //   this.setState({ pushMsg: message })
    // })
    // JPushModule.addReceiveNotificationListener((message) => {
    //   console.log('receive notification: ' + message)
    // })
  }


  render() {
    return (
      <Container>
        <TextPingFang>通知</TextPingFang>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  
})
