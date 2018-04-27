import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  DeviceEventEmitter
} from 'react-native'
import Home from './home/Home'
import Notification from './notification/Notification'
import Profile from './profile/Profile'
import { WIDTH, HEIGHT, getResponsiveHeight } from '../common/styles'
import TabNavigator from 'react-native-tab-navigator'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import JPushModule from 'jpush-react-native'

export default class Index extends Component {

  componentDidMount() {

    JPushModule.addReceiveCustomMsgListener((message) => {
      console.log(message)
      JPushModule.setBadge(1, success => {
      })
      DeviceEventEmitter.emit('flash_notification', {})
    })

    JPushModule.addReceiveNotificationListener(message => {
      console.log(message)
    })
  }

  state = {
    selectedTab: 'home',
    unread: this.props.user.unread
  }

  icons = {
    home: {
      default: (
        <Image source={require('../../res/images/tab/icon_home_inactive.png')}/>
      ),
      selected: <Image source={require('../../res/images/tab/icon_home_active.png')}/>
    },
    notification: {
      default: (
        <Image source={require('../../res/images/tab/icon_notification_inactive.png')}/>
      ),
      selected: (
        <Image source={require('../../res/images/tab/icon_notification_active.png')}/>
      )
    },
    profile: {
      default: (
        <Image source={require('../../res/images/tab/icon_profile_inactive.png')}/>
      ),
      selected: <Image source={require('../../res/images/tab/icon_profile_active.png')}/>
    }
  }

  render() {
    return (
      <View style={styles.tabs_container}>
        <TabNavigator tabBarStyle={styles.tabbar}>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'home'}
            title='主页'
            titleStyle={styles.text_title}
            selectedTitleStyle={styles.text_title_selected}
            renderIcon={() => this.icons.home.default}
            renderSelectedIcon={() => this.icons.home.selected}
            onPress={() => this.setState({ selectedTab: 'home' })}
          >
            <Home />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'notification'}
            title='通知'
            titleStyle={styles.text_title}
            badgeText={this.state.unread}
            selectedTitleStyle={styles.text_title_selected}
            renderIcon={() => this.icons.notification.default}
            renderSelectedIcon={() => this.icons.notification.selected}
            onPress={() => this.setState({ selectedTab: 'notification', unread: 0 })}
          >
            <Notification />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'profile'}
            title='我的'
            titleStyle={styles.text_title}
            selectedTitleStyle={styles.text_title_selected}
            renderIcon={() => this.icons.profile.default}
            renderSelectedIcon={() => this.icons.profile.selected}
            onPress={() => this.setState({ selectedTab: 'profile' })}
          >
            <Profile />
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabs_container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: 'rgba(255,255,255,.9)',
    ...ifIphoneX({
      height: 84,
      paddingBottom: 34
    })
  },
  text_title: {
    color: '#aaa',
    fontSize: 10
  },
  text_title_selected: {
    color: '#444',
    fontSize: 10
  },
})
