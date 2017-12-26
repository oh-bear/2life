import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import NavigationBar from './NavigationBar'

export default class CommonNav extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    title: '详情',
    rightButton: <View/>
  }

  render() {
    return <View>
      <NavigationBar
        navBarStyle={this.props.navBarStyle}
        navStyle={this.props.navStyle}
        title={this.props.title}
        titleStyle={
          this.props.titleStyle
        }
        leftButton={
          <TouchableOpacity
            onPress={
              () => {
                this.props.navigator.pop()
              }
            }
            style={styles.container}>
            <Image
              source={require('../../res/images/BackArrow.png')}/>

          </TouchableOpacity>
        }
        rightButton={
          this.props.rightButton
        }
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 44,
    height: 24,
    alignItems: 'center',
    left: 0
  },
})