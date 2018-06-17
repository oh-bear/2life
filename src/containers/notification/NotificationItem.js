import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  WebView,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Swipeout from 'react-native-swipeout'

import {
  getResponsiveWidth,
  getResponsiveHeight,
  WIDTH
} from '../../common/styles'
import { SCENE_WEB } from '../../constants/scene'

import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

export default class NotificationItem extends Component {

  static propTypes = {
    data: PropTypes.object
  }

  state = {
    closeSwiper: false
  }

  _convertTime = (ts) => {
    const date = new Date(ts)
    Y = date.getFullYear() + '-'
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    D = (date.getDate() < 10 ? '0' + date.getDate(): date.getDate()) + ' '
    h = (date.getHours() < 10 ? '0' + date.getHours(): date.getHours()) + ':'
    m = (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes())
    s = ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds(): date.getSeconds())
    return Y + M + D + h + m
  }

  _jumpWeb() {
    if (this.props.data.url) {
      Actions.jump(SCENE_WEB, { url: this.props.data.url })
    }
  }

  async _delete() {
    const res = await HttpUtils.get(USERS.delete_notification, { message_id: this.props.data.id })
    if (res.code === 0) {
      DeviceEventEmitter.emit('flush_notification', {})
      this.setState({closeSwiper: true})
    }
  }

  render() {
    let source
    switch (this.props.data.type) {
    case 0:
      source = require('../../../res/images/notification/icon_system.png')
      break
    case 101:
      source = require('../../../res/images/notification/icon_system.png')
      break
    case 102:
      source = require('../../../res/images/notification/icon_system.png')
      break
    case 201:
      source = require('../../../res/images/notification/icon_connect.png')
      break
    case 202:
      source = require('../../../res/images/notification/icon_disconnect.png')
      break
    case 203:
      source = require('../../../res/images/notification/icon_like.png')
      break
      // 0：系统消息（被ban、无次数等）
      // 101：通知（无url，有content）
      // 102：活动、宣传等（有url，有content）
      // 201：被匹配（无url，无content）
      // 202：被解除匹配（无url，无content）
      // 203：被喜欢（无url，无content） 
    }

    return (
      <Swipeout
        style={styles.swipeout}
        close={this.state.closeSwiper}
        disabled={this.props.data.type === 0 || this.props.data.type === 101 || this.props.data.type === 102}
        right={[
          {
            text: '删除',
            backgroundColor: '#FF5757',
            autoClose: true,
            onPress: () => this._delete()
          }
        ]}
      >
        <View style={styles.container}>
          <Image
            style={styles.icon}
            source={source}/>
          <TouchableOpacity
            style={styles.content_container}
            activeOpacity={1}
            onPress={() => this._jumpWeb()}
          >
            <Text style={styles.title}>{this.props.data.title}</Text>
            <Text style={styles.date}>{this._convertTime(this.props.data.date)}</Text>
            <View style={styles.line}/>
          </TouchableOpacity>
        </View>
      </Swipeout>
    )
  }
}

const styles = StyleSheet.create({
  swipeout: {
    backgroundColor: '#fff'
  },
  container: {
    width: WIDTH,
    flexDirection: 'row',
    marginTop: getResponsiveHeight(20),
  },
  content_container: {
    width: getResponsiveWidth(279),
    marginLeft: getResponsiveWidth(30),
  },
  icon: {
  },
  title: {
    fontFamily: 'PingFang SC',
    fontSize: 20,
    color: '#000',
  },
  date: {
    fontFamily: 'PingFang SC',
    fontSize: 10,
    color: '#aaa',
    marginTop: getResponsiveHeight(16),
  },
  line: {
    width: getResponsiveWidth(279),
    height: 1,
    marginTop: getResponsiveHeight(16),
    borderBottomColor: '#F1F1F1',
    borderBottomWidth: 1
  },
})
