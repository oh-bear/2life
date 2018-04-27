import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  DeviceEventEmitter,
} from 'react-native'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import NotificationItem from './NotificationItem'

import { USERS } from '../../network/Urls'
import HttpUtils from '../../network/HttpUtils'
import JPushModule from 'jpush-react-native'

export default class Notification extends Component {

  state = {
    notificationList: []
  }

  async componentDidMount() {

    const res = await HttpUtils.get(USERS.notification, {})
    if (res.code === 0) {
      this.setState({
        notificationList: res.data
      })
    }

    JPushModule.clearAllNotifications()

    DeviceEventEmitter.addListener('flash_notification', async (v) =>{
      const res = await HttpUtils.get(USERS.notification, {})
      if (res.code === 0) {
        this.setState({
          notificationList: res.data
        })
      }
    })

  }

  _renderItem({ item }) {
    return (
      <NotificationItem
        data={item}
      />
    )
  }

  render() {
    return (
      <Container>
        <TextPingFang>通知</TextPingFang>
        <FlatList
          style={styles.notification_container}
          data={this.state.notificationList}
          extraData={this.state}
          renderItem={this._renderItem}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  notification_container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    backgroundColor: '#fff',
  },
})
