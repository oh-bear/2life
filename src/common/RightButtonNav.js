import React, {Component} from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'
import CommonNav from './CommonNav'

export default class RightButtonNav extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    rightOnPress: () => {
    }
  }

  render() {
    return <CommonNav
      title={this.props.title}
      navigator={this.props.navigator}
      rightButton={
        <TouchableOpacity
          onPress={
            () => this.props.rightOnPress()
          }
          style={styles.rightButton}>
          <Text style={styles.rightButton_font}>完成</Text>
        </TouchableOpacity>
      }
    />
  }
}

const styles = StyleSheet.create({
  rightButton: {
    position: 'absolute',
    right: 0,
    width: 56,
    alignItems: 'center'
  },
  rightButton_font: {
    color: '#73C0FF',
    fontSize: 17,
    fontWeight: '500'
  },
})