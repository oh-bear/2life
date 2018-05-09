import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'
import { Actions } from 'react-native-router-flux'

import store from '../../redux/store'
import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'
import { fetchPartnerSuccess } from '../../redux/modules/partner'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'

import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

export default class MatchResult extends Component {

  state = {
    title: '匹配中...',
    content: null,
    partner: {}
  }

  componentDidMount() {
    setTimeout(this.fetchMatch.bind(this), 500)
  }

  codeToMessage(code) {
    let message = ''
    switch(code) {
      case 404: 
        message = '找不到该用户'
        break
      case 603: 
        message = '你本月已经没有匹配次数了'
        break
      case 604: 
        message = '要写过日记才能匹配哦'
        break
      case 602: 
        message = '你目前没有匹配权限'
        break
      case 600: 
        message = '要开启匹配功能才能进行匹配哦'
        break
      case 601: 
        message = '你已经有匹配对象了哦'
        break
    }
    return message
  }

  async fetchMatch() {
    if (this.props.matchUserId) {
      // ID匹配
      const res = await HttpUtils.get(USERS.connect_by_id, {code: this.props.matchUserId})
      if (res.code === 0) {
        store.dispatch(fetchPartnerSuccess(res.data))
        this.setState({partner: res.data})
        this.matchSucceed()
      } else {        
        this.matchFailed(this.codeToMessage(res.code))
      }
    } else {
      // 随机匹配
      const res = await HttpUtils.get(USERS.connect_by_random)
      if (res.code === 0) {
        store.dispatch(fetchPartnerSuccess(res.data))
        this.setState({partner: res.data})
        this.matchSucceed()
      } else {
        this.matchFailed(this.codeToMessage(res.code))
      }
    }
  }

  matchSucceed() {
    let content = (
      <View style={styles.container}>
        <View style={styles.face_container}>
          <Image style={styles.face} source={{ uri: this.state.partner.face }}/>
        </View>
        <TextPingFang style={styles.text_name}>{this.state.partner.name}</TextPingFang>
      </View>
    )

    this.setState({
      title: '匹配成功',
      content
    })
  }

  matchFailed(message) {
    let content = (
      <View style={styles.container}>
        <Image style={styles.img_fail} source={require('../../../res/images/profile/bg_match_fail.png')}/>
        {/* <TextPingFang style={styles.text_fail}>没有找到符合条件的人，或许你可以继续写日记，稍后再来匹配，成功率更高哦</TextPingFang> */}
        <TextPingFang style={styles.text_fail}>{message}</TextPingFang>
        <TouchableOpacity
          style={styles.start_btn}
          onPress={() => Actions.pop()}
        >
          <TextPingFang style={styles.text_start_btn}>我明白了</TextPingFang>
        </TouchableOpacity>
      </View>
    )

    this.setState({
      title: '匹配失败',
      content
    })
  }

  render() {
    return (
      <Container>
        <ScrollView>
          <ProfileHeader
            title={this.state.title}
          />
          {this.state.content}
        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: getResponsiveWidth(250),
    alignItems: 'center',
  },
  face_container: {
    height: getResponsiveWidth(250),
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    width: getResponsiveWidth(88),
    height: getResponsiveWidth(88),
  },
  img_fail: {
    width: WIDTH
  },
  text_name: {
    color: '#444',
    fontSize: 24
  },
  text_fail: {
    marginTop: getResponsiveWidth(8),
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    color: '#000',
    fontSize: 16
  },
  start_btn: {
    width: getResponsiveWidth(112),
    height: getResponsiveWidth(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveWidth(50),
    marginLeft: WIDTH - getResponsiveWidth(136),
    backgroundColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(24)
  }
})
