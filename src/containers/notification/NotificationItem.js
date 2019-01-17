import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Swipeout from 'react-native-swipeout'

import TextPingFang from '../../components/TextPingFang'
import {
  getResponsiveWidth,
  getResponsiveHeight,
  WIDTH,
  Colors
} from '../../common/styles'
import { SCENE_WEB } from '../../constants/scene'

import { formatDate } from '../../common/util'

import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

export default class NotificationItem extends Component {

  static propTypes = {
    data: PropTypes.object
  }

  state = {
    closeSwiper: false
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
            backgroundColor: Colors.Secondary.DANGER,
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
            <TextPingFang style={styles.title}>{this.props.data.title}</TextPingFang>
            <TextPingFang style={styles.date}>{formatDate(this.props.data.date, 'yyyy-mm-dd hh:ii')}</TextPingFang>
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
    paddingHorizontal: getResponsiveWidth(24),
    paddingTop: getResponsiveWidth(8),
    flexDirection: 'row'
  },
  content_container: {
    width: getResponsiveWidth(279),
    marginLeft: getResponsiveWidth(23),
    paddingBottom: getResponsiveWidth(8),
    borderBottomColor: Colors.Netural.LINE,
    borderBottomWidth: 1
  },
  icon: {
  },
  title: {
    color: '#444',
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
    marginTop: getResponsiveHeight(8),
  }
})
