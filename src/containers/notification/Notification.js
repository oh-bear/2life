import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  DeviceEventEmitter,
  WebView
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import {
  HEIGHT,
  WIDTH,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import NotificationItem from './NotificationItem'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { USERS } from '../../network/Urls'
import HttpUtils from '../../network/HttpUtils'
import store from '../../redux/store'
import { fetchPartnerSuccess, fetchProfileSuccess } from '../../redux/modules/partner'

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

    // 刷新通知、刷新日记、刷新用户
    DeviceEventEmitter.addListener('flush_data', async (v) => {
      // 1. 刷新通知
      const res = await HttpUtils.get(USERS.notification, {})
      if (res.code === 0) {
        this.setState({
          notificationList: res.data
        })
      }

      // 2. 刷新用户
      HttpUtils.get(USERS.user, { user_id: this.props.user.id }).then(res => {
        if (res.code === 0) {
          store.dispatch(fetchProfileSuccess(res.data))
          if (res.data.user_other_id !== -1) {
            HttpUtils.get(USERS.user, { user_id: res.data.user_other_id }).then(res => {
              if (res.code === 0) {
                store.dispatch(fetchPartnerSuccess(res.data))
              }
            })
          } else {
            store.dispatch(fetchPartnerSuccess({}))
          }
        }
      })


      // 3. 刷新日记
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
            showsVerticalScrollIndicator={false}
            style={styles.notification_container}
            data={this.state.notificationList}
            extraData={this.state}
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmpty}
          />
        </View>
        <WebView
          style={{ width: 200, height: 200, backgroundColor: 'red' }}
          source={{ uri: 'https://me.ursb.me' }}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(72),
    ...ifIphoneX({
      paddingTop: getResponsiveHeight(4),
    }, {
      paddingTop: getResponsiveHeight(28),
    }),
    color: '#444',
    fontSize: 34,
    fontWeight: '500',
  },
  notification_container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    marginBottom: getResponsiveHeight(48),
    backgroundColor: '#fff',
  },
  text_empty: {
    paddingLeft: getResponsiveWidth(48),
    color: '#aaa',
    fontSize: 16
  }
})
