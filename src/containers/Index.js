import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  DeviceEventEmitter,
  Alert,
  AppState
} from 'react-native'
import Home from './home/Home'
import ProfileMode from './profile/ProfileMode'
import Profile from './profile/Profile'
import TabNavigator from 'react-native-tab-navigator'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import JPushModule from 'jpush-react-native'

import Storage from '../common/storage'
import { createFile, readFile, updateFile, deleteFile, syncFile, getPath } from '../common/util'
import { USERS, UTILS } from '../network/Urls'
import HttpUtils from '../network/HttpUtils'
import store from '../redux/store'
import { fetchPartnerSuccess } from '../redux/modules/partner'
import { fetchProfileSuccess } from '../redux/modules/user'
import { SCENE_APP_AUTH } from '../constants/scene'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class Index extends Component {

  state = {
    selectedTab: 'home',
    unread: this.props.user.unread
  }

  async componentWillMount() {
    await this._initFile()
    await this._setVip()
    this._showAppAuth()

    if (this.props.tab) this.setState({ selectedTab: this.props.tab })
  }

  async componentDidMount() {
    this._mergeData()

    // 极光推送：添加事件角标，并触发强制刷新通知和用户、日记数据
    JPushModule.addReceiveCustomMsgListener(async (message) => {
      console.log(message)
      JPushModule.setBadge(1, success => {
      })
      // 刷新通知、刷新日记、刷新用户
      DeviceEventEmitter.emit('flush_notification', {})
      const res = await HttpUtils.get(USERS.user, { user_id: this.props.user.id })
      if (res.code === 0) {
        store.dispatch(fetchProfileSuccess(res.data))
        store.dispatch(fetchPartnerSuccess(res.partner))
        DeviceEventEmitter.emit('flush_note', {})
      }
    })

    JPushModule.addReceiveNotificationListener(message => {
      console.log(message)
    })
  }

  async _showAppAuth() {
    AppState.addEventListener('change', async state => {
      const openAppAuth = await Storage.get('openAppAuth', false)
      if (openAppAuth && state === 'background')
        Actions.jump(SCENE_APP_AUTH, { gotoApp: true })

      if (openAppAuth && state === 'active' && Actions.currentScene === 'APP_AUTH')
        DeviceEventEmitter.emit('validateId')
    })
  }

  async _setVip() {
    const user = this.props.user
    if (!user.vip)
      return await Storage.set('isVip', false)

    if (user.vip_expires && Date.now() > user.vip_expires)
      return await Storage.set('isVip', false)

    return await Storage.set('isVip', true)
  }

  // 日记配置文件初始化
  async _initFile() {
    const data = {
      user_id: this.props.user.id || 0,
      lastModified: Date.now(),
      diaryList: []
    }
    await createFile({
      user_id: this.props.user.id || 0,
      data
    })
  }

  // 本地日记文件数据，询问是否进行合并
  async _mergeData() {
    // 询问周期一天一次
    const lastAskMergeTime = await Storage.get('lastAskMergeTime')
    const now = Date.now()
    if (now - lastAskMergeTime < 86400000) return

    if (this.props.user.id) {
      const diaryList = await readFile()
      if (diaryList.length) {
        Storage.set('lastAskMergeTime', now)

        Alert.alert(
          '数据合并',
          '是否将未登录的日记数据合并到此账号上',
          [
            {
              text: '不合并',
            },
            {
              text: '合并',
              onPress: async () => {
                // 更改日记user_id, op, status, mode
                for (let diary of diaryList) {
                  const res = await HttpUtils.post(UTILS.get_nlp_result, {content: diary.content})
                  let mode = res.code === 0 ? Math.floor(res.data * 100) : 50

                  diary.user_id = this.props.user.id
                  diary.status = this.props.status
                  diary.mode = mode
                  diary.op = 1
                }

                await updateFile({
                  user_id: this.props.user.id,
                  action: 'add',
                  data: diaryList,
                })
                syncFile(this.props.user.id)
                // 删除未登录配置文件
                deleteFile(getPath('user_0_config.json'))
              }
            }
          ]
        )
      }
    }
  }

  icons = {
    home: {
      default: (
        <Image source={require('../../res/images/tab/icon_home_inactive.png')}/>
      ),
      selected: <Image source={require('../../res/images/tab/icon_home_active.png')}/>
    },
    mode: {
      default: (
        <Image source={require('../../res/images/tab/icon_tab_bar_mood_analysisinactive.png')}/>
      ),
      selected: (
        <Image source={require('../../res/images/tab/icon_tab_bar_mood_analysisactive.png')}/>
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
            selected={this.state.selectedTab === 'mode'}
            title='情绪'
            titleStyle={styles.text_title}
            selectedTitleStyle={styles.text_title_selected}
            renderIcon={() => this.icons.mode.default}
            renderSelectedIcon={() => this.icons.mode.selected}
            onPress={() => {
              this.setState({ selectedTab: 'mode' })
            }}
          >
            <ProfileMode />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'profile'}
            title='我的'
            titleStyle={styles.text_title}
            badgeText={this.state.unread}
            selectedTitleStyle={styles.text_title_selected}
            renderIcon={() => this.icons.profile.default}
            renderSelectedIcon={() => this.icons.profile.selected}
            onPress={() => {
              JPushModule.clearAllNotifications()
              this.setState({ selectedTab: 'profile', unread: 0 })
            }}
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
    height: 56,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.95)',
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
