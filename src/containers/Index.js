import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import Home from './Home'
import Calendar from './Calendar'
import Notification from './Notification'
import Profile from './Profile'
import { HEIGHT, getResponsiveHeight } from '../common/styles'
import TabNavigator from 'react-native-tab-navigator'

export default class Index extends Component {

  state = {
    selectedTab: 'home'
  }

  icons = {
    home: {
      default: (
        <Image
          style={styles.image}
          source={require('../../res/images/tab/icon_home_def.png')}
        />
      ),
      selected: <Image source={require('../../res/images/tab/icon_home_sel.png')} />
    },
    calendar: {
      default: (
        <Image
          style={styles.image}
          source={require('../../res/images/tab/icon_calendar_def.png')}
        />
      ),
      selected: <Image source={require('../../res/images/tab/icon_calendar_sel.png')} />
    },
    notification: {
      default: (
        <Image
          style={styles.image}
          source={require('../../res/images/tab/icon_notification_def.png')}
        />
      ),
      selected: (
        <Image
          style={styles.image}
          source={require('../../res/images/tab/icon_notification_sel.png')}
        />
      )
    },
    profile: {
      default: (
        <Image
          style={styles.image}
          source={require('../../res/images/tab/icon_profile_def.png')}
        />
      ),
      selected: <Image source={require('../../res/images/tab/icon_profile_sel.png')} />
    }
  }

  render() {
    return (
      <View style={styles.tabs_container}>
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'home'}
            title="主页"
            renderIcon={() => this.icons.home.default}
            renderSelectedIcon={() => this.icons.home.selected}
            onPress={() => this.setState({ selectedTab: 'home' })}
          >
            <Home />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'calendar'}
            title="日历"
            renderIcon={() => this.icons.calendar.default}
            renderSelectedIcon={() => this.icons.calendar.selected}
            onPress={() => this.setState({ selectedTab: 'calendar' })}
          >
            <Calendar />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'notification'}
            title="通知"
            renderIcon={() => this.icons.notification.default}
            renderSelectedIcon={() => this.icons.notification.selected}
            onPress={() => this.setState({ selectedTab: 'notification' })}
          >
            <Notification />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'profile'}
            title="我的"
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
  container: {
    // flex:1,
    flexDirection: 'column',
    backgroundColor: 'rgb(242,246,250)',
    alignItems: 'center',
    height: HEIGHT
  },
  top: {
    height: 28,
    backgroundColor: 'white',
    marginTop: -28,
    width: 375
  },
  book_list: {
    // 一半的输入框高度加上maginBottom
    paddingTop: getResponsiveHeight(10)
  },
  search_result_bar: {
    backgroundColor: 'white'
  },
  tabs_container: {
    flex: 1,
    backgroundColor: 'white'
  },
  page1: {
    flex: 1,
    backgroundColor: 'yellow'
  },
  page2: {
    flex: 1,
    backgroundColor: 'blue'
  },
  image: {
    // tintColor: '#929292'
  },
  active: {
    tintColor: '#607D8B'
  }
})
