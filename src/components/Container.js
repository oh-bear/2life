import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Keyboard
} from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import PropTypes from 'prop-types'

import NetStatus from './NetStatus'

import {
  WIDTH,
  HEIGHT,
} from '../common/styles'

export default class Container extends Component {
  static propTypes = {
    hidePadding: PropTypes.bool,
    showNetStatus: PropTypes.bool,
    style: PropTypes.any
  }

  render() {
    let padding_top = isIphoneX() ? 44 : 20

    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: this.props.hidePadding ? 0 : padding_top
          },
          this.props.style
        ]}
      >
        <NetStatus showNetStatus={this.props.showNetStatus}/>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: WIDTH,
    // height: HEIGHT,
    flex: 1,
  }
})
