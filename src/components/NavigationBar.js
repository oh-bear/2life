import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { PropTypes } from 'prop-types'
import { WIDTH, getResponsiveWidth } from '../common/styles'
const NAVBAR_HEIGHT = 44
const STATUS_BAR_HEIGHT = 20

const StatusBarShape = {
  backgroundColor: PropTypes.string,
  barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
  hidden: PropTypes.bool
}

export default class Navigator extends Component {

  static propTypes = {
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
    let titleView = this.props.titleView
      ? this.props.titleView
      : <Text style={styles.title}>
        {this.props.title}
      </Text>

    return (
      <View style={[styles.container, this.props.navStyle]}>
        <View style={[styles.navBar, this.props.navBarStyle]}>
          {this.props.leftButton}
          <View style={[styles.titleViewContainer, this.props.titleStyle]}>
            {titleView}
          </View>
          {this.props.rightButton}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  navBar: {
    flexDirection: 'row',
    width: WIDTH,
    height: 44,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    backgroundColor: '#fff'
  },
  titleViewContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: WIDTH - 100
  },
  title: {
    fontSize: 17,
    color: '#000',
    textAlign: 'center'
  },
})
