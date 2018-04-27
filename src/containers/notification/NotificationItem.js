import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image
} from 'react-native'
import PropTypes from 'prop-types'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

export default class NotificationItem extends Component {

  static propTypes = {
    notification: PropTypes.object
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
    return (
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={require('../../../res/images/notification/like/female.png')}/>
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
    flexDirection: 'column',
    width: getResponsiveWidth(335),
  },
  content_container: {
    width: getResponsiveWidth(279),
    marginLeft: getResponsiveWidth(48)
  },
  icon: {
    width: 25,
    height: 25,
    top: 44
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
