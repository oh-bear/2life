import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  WebView,
  Image,
  ActionSheetIOS,
  Alert
} from 'react-native'
import { ActionSheet, Button } from 'antd-mobile'
import * as WeChat from 'react-native-wechat'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import {
  WIDTH,
} from '../../common/styles'
import Storage from '../../common/storage'
import Container from '../../components/Container'
import CommonNav from '../../components/CommonNav'
import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

export default class Web extends Component {

  state = {
    rightButton: null,
    url: ''
  }

  async componentWillMount() {
    // this._renderRightButton()
    // console.log({ shareUrl: `${this.props.shareUrl}?name=${this.props.user.name}` })
    // let key = await Storage.get('key', {})
    // let url = `${this.props.url}?uid=${key.uid}&token=${key.token}&timestamp=${key.timestamp}&user_other_id=${this.props.user.user_other_id}`
    // this.setState({url}, () => console.log(this.state.url))
  }

  _showOptions() {
    const BUTTONS = [
      '分享给微信好友',
      '分享到微信朋友圈',
      '取消',
    ]
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: 2,
        destructiveButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) this._shareToWeChat(0)
        if (buttonIndex === 1) this._shareToWeChat(1)
        if (buttonIndex === 2) return
      }
    )

    // const options = {
    //   options: ['分享给微信好友', '分享到微信朋友圈','取消'],
    //   cancelButtonIndex: 2,
    // }
    // ActionSheetIOS.showActionSheetWithOptions(options, index => {
    //   if (index === 0) this._shareToWeChat(0)
    //   if (index === 1) this._shareToWeChat(1)
    //   if (index === 2) return
    // })
  }

  async _shareToWeChat(mode) {
    const isWXInstalled = await WeChat.isWXAppInstalled()
    if (!isWXInstalled) return Alert.alert('您尚未安装微信', '')

    const data = {
      type: 'news',  //news|text|imageUrl|imageFile|imageResource|video|audio|file
      title: `${this.props.user.name}邀请你一起参加双生日记七夕节活动！`,
      description: '完成活动即可获得年费会员大奖哦，快来参加吧！',
      thumbImage: 'http://p3nr2tlc4.bkt.clouddn.com/logo.png',
      // 这里是分享页面的URL
      webpageUrl: `${this.props.shareUrl}?name=${this.props.user.name}`
    }
    
    if (mode === 0) WeChat.shareToSession(data)
    if (mode === 1) WeChat.shareToTimeline(data)
    
  }

  _renderRightButton() {
    const rightButton = (
      <TouchableOpacity
        style={styles.nav_right}
        onPress={() => this._showOptions()}
      >
        <Image source={require('../../../res/images/common/icon_more_black.png')} />
      </TouchableOpacity>
    )
    this.setState({ rightButton })
  }

  // 监听h5消息
  _onMessage(event) {
    const data = event.nativeEvent.data
    
    if (data === 'WXshare') {
      this._showOptions()
    }
  }

  // 向h5传递消息
  async _onLoadEnd() {
    let key = await Storage.get('key', {})
    let obj = {
      ...this.props.user,
      ...key
    }
    this.web.postMessage(JSON.stringify(obj))
  }

  _onNavigationStateChange = (navState) => {
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      title: navState.title,
      loading: navState.loading,
    })
  }
  
  render() {
    return (
      <Container>
        <CommonNav
          title={this.state.title}
          rightButton={this.state.rightButton}
        />
        <WebView
          ref={ref => this.web = ref}
          style={styles.web_container}
          source={{ uri: this.props.url }}
          onMessage={this._onMessage.bind(this)}
          onLoadEnd={this._onLoadEnd.bind(this)}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  web_container: {
    width: WIDTH,
    ...ifIphoneX({
      marginBottom: 44
    }, {
      marginBottom: 0
    })
  }
})
