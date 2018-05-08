import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'
import {
  getResponsiveWidth,
} from '../common/styles'
import NavigationBar from './NavigationBar'
import { Actions } from 'react-native-router-flux'

export default class CommonNav extends Component {

  render() {
    return (
      <NavigationBar
        navBarStyle={this.props.navBarStyle}
        navStyle={this.props.navStyle}
        title={this.props.title}
        titleStyle={this.props.titleStyle}
        leftButton={
          <TouchableOpacity
            style={styles.left_btn}
            onPress={this.props.onPressBack ? this.props.onPressBack : () => Actions.pop()}
          >
            <Image source={require('../../res/images/common/icon_back_black.png')}/>
          </TouchableOpacity>
        }
        rightButton={this.props.rightButton}
      />
    )
  }
}

const styles = StyleSheet.create({
  left_btn: {
    width: getResponsiveWidth(24),
  }
})
