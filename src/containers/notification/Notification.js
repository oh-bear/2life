import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  DeviceEventEmitter,
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import {
  WIDTH,
  getResponsiveWidth
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

    DeviceEventEmitter.addListener('flash_notification', async (v) => {
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

  _renderEmpty() {
    return (
      <TextPingFang style={styles.text_empty}>哎呀这里怎么空空如也</TextPingFang>
    )
  }

  render() {
    return (
      <Container>
        <View>
          <TextPingFang style={styles.title}>通知</TextPingFang>
          <FlatList
            style={styles.notification_container}
            data={this.state.notificationList}
            extraData={this.state}
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmpty}
          />
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(72),
    ...ifIphoneX({
      paddingTop: getResponsiveWidth(28),
    }, {
      paddingTop: getResponsiveWidth(52),
    }),
    color: '#444',
    fontSize: 34,
    fontWeight: '500',
  },
  notification_container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    backgroundColor: '#fff',
  },
  text_empty: {
    paddingLeft: getResponsiveWidth(48),
    color: '#aaa',
    fontSize: 16
  }
})
