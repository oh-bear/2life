import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  DeviceEventEmitter,
} from 'react-native'

import {
  WIDTH,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import ProfileHeader from '../../containers/profile/components/ProfileHeader'
import NotificationItem from './NotificationItem'
import { connect } from 'react-redux'
import { USERS } from '../../network/Urls'
import HttpUtils from '../../network/HttpUtils'

import JPushModule from 'jpush-react-native'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
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

    DeviceEventEmitter.addListener('flush_notification', async (v) => {
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
      <Container showNetStatus={true}>
        <ProfileHeader title='通知' />

        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.notification_container}
          data={this.state.notificationList}
          extraData={this.state}
          renderItem={this._renderItem}
          ListEmptyComponent={this._renderEmpty}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  notification_container: {
    width: WIDTH,
    marginBottom: getResponsiveHeight(48),
    backgroundColor: '#fff',
  },
  text_empty: {
    paddingLeft: getResponsiveWidth(48),
    color: '#aaa',
    fontSize: 16
  }
})
