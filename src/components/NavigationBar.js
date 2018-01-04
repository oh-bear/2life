import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar
} from 'react-native'
import { PropTypes } from 'prop-types'
import { WIDTH } from '../common/styles'
const NAVBAR_HEIGHT = 44
const STATUS_BAR_HEIGHT = 20

const StatusBarShape = {
  backgroundColor: PropTypes.string,
  barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
  hidden: PropTypes.bool
}

export default class Navigator extends Component {

  static propTypes = {
    style: View.propTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    hide: PropTypes.bool,
    leftButton: PropTypes.element,
    rightButton: PropTypes.element,
    statusBar: PropTypes.shape(StatusBarShape)
  }

  static defaultProps = {
    statusBar: {
      hidden: false
    }
  }

  state = {
    title: '',
    hide: false
  }

  render() {
    let status = (
      <View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar} />
      </View>
    )
    let titleView = this.props.titleView
      ? this.props.titleView
      : <Text style={styles.title}>
        {this.props.title}
      </Text>
    let content = (
      <View style={[styles.navBar, this.props.navBarStyle]}>
        {this.props.leftButton}
        <View style={[styles.titleViewContainer, this.props.titleStyle]}>
          {titleView}
        </View>
        {this.props.rightButton}
      </View>
    )
    return (
      <View style={[styles.container, this.props.navStyle]}>
        {status}
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navBar: {
    alignItems: 'center',
    height: NAVBAR_HEIGHT,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: WIDTH,
    justifyContent: 'center'
  },
  titleViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH - 100
  },
  title: {
    fontSize: 17,
    color: 'black',
    alignItems: 'center'
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT
  }
})
