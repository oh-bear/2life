import React, { Component } from 'react'
import {
  StyleSheet,
  Text
} from 'react-native'
import PropTypes from 'prop-types'

export default class TextPingFang extends Component {

  static propTypes = {
    onPress: PropTypes.func
  }

  static defaultProps = {
    onPress: () => {},
  }

  render() {
    return (
      <Text
        style={[styles.font, this.props.style]}
        numberOfLines={this.props.numberOfLines}
        onPress={this.props.onPress}
      >
        {this.props.children}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'PingFang SC'
  }
})