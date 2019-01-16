import React, { Component } from 'react'
import {
  StyleSheet,
  Keyboard,
  Animated,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'

import { getResponsiveWidth } from '../common/styles'

export default class KeyboardStickeyBar extends Component {
  static propTypes = {
    hide: PropTypes.bool,
    ctnStyle: PropTypes.any,
    keyboardWillShow: PropTypes.func,
    keyboardWillHide: PropTypes.func
  }

  static defaultProps = {
    hide: false,
    keyboardWillShow: () => {},
    keyboardWillHide: () => {},
  }

  state = {
    offsetBottom: new Animated.Value(0)
  }

  componentDidMount () {
    if (Platform.OS === 'android') {
      this.keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      this.keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    } else {
      this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    }
  }

  componentWillUnmount () {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  keyboardWillShow = (event) => {
    this.animToggle(event.endCoordinates.height)
    this.props.keyboardWillShow()
  }

  keyboardWillHide = () => {
    this.animToggle(0)
    this.props.keyboardWillHide()
  }

  animToggle = (value) => {
    Animated.timing(this.state.offsetBottom, {
      toValue: value,
      duration: 250
    }).start()
  }

  render() {
    const { hide, ctnStyle, children } = this.props

    return (
      <Animated.View
        style={[
          styles.ctn,
          ctnStyle,
          {
            display: hide ? 'none' : 'flex',
            bottom: this.state.offsetBottom
          }
      ]}>
        {children}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  ctn: {
    width: '100%',
    minHeight: getResponsiveWidth(56),
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  }
})
