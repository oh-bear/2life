import  React, {Component} from 'react'
import {
  StyleSheet,
  Text
} from 'react-native'

export default class TextPingFang extends Component {
  render() {
    return (
      <Text style={[styles.font, this.props.style]}>
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