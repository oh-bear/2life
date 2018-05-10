import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image
} from 'react-native'
import PropTypes from 'prop-types'

import {
  getResponsiveWidth,
  getResponsiveHeight,
  WIDTH
} from '../../common/styles'

export default class NotificationItem extends Component {

  static propTypes = {
    data: PropTypes.object
  }

  _convertTime = (ts) => {
    const date = new Date(ts)
    Y = date.getFullYear() + '-'
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    D = date.getDate() + ' '
    h = date.getHours() + ':'
    m = date.getMinutes() + ':'
    s = date.getSeconds()
    return Y + M + D + h + m + s
  }

  render() {
    let source
    switch(this.props.data.type) {
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
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={source}/>
        <View style={styles.content_container}>
          <Text style={styles.title}>{this.props.data.title}</Text>
          <Text style={styles.date}>{this._convertTime(this.props.data.date)}</Text>
          <View style={styles.line}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    color: '#444',
  },
  date: {
    fontFamily: 'PingFang SC',
    fontSize: 10,
    color: '#AAA',
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
