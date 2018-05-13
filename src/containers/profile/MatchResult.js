import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import store from '../../redux/store'
import TextPingFang from '../../components/TextPingFang'
import Popup from '../../components/Popup'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'
import { fetchPartnerSuccess } from '../../redux/modules/partner'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'

import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'
import { updateReduxUser } from '../../common/util'
import { SCENE_INDEX } from '../../constants/scene'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class MatchResult extends Component {

  state = {
    title: '匹配中...',
    content: (
      <View style={styles.container}>
        <ImageBackground style={styles.bg_matching} source={require('../../../res/images/profile/matchAnimation.gif')}>
          <Image style={styles.face_user} source={{ uri: this.props.user.face }} />
        </ImageBackground>
      </View>
    ),
    partner: {},
    showPopup: false,
    faceLeft: new Animated.ValueXY({ x: 0, y: 0 }),
    faceRight: new Animated.ValueXY({ x: 0, y: 0 }),
    matchSucceed: false
  }

  componentDidMount() {
    if (this.props.partner.id) {
      this.setState({ partner: this.props.partner }, () => this.matchSucceed())
    } else {
      setTimeout(this.fetchMatch.bind(this), 3000)
    }
  }

  _codeToMessage(code) {
    let message = ''
    switch (code) {
      case 404:
        message = '找不到合适的用户哦~请再等等吧！'
        break
      case 603:
        message = '你本月已经没有匹配次数了'
        break
      case 604:
        message = '你必要写过日记才能匹配哦'
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
      const res = await HttpUtils.get(USERS.connect_by_id, { code: this.props.matchUserId })
      if (res.code === 0) {
        store.dispatch(fetchPartnerSuccess(res.data))

        updateReduxUser(this.props.user.id)

        this.setState({ partner: res.data })
        this.matchSucceed()
      } else {
        this.matchFailed(this._codeToMessage(res.code))
      }
    } else {
      // 随机匹配
      const res = await HttpUtils.get(USERS.connect_by_random)
      if (res.code === 0) {
        store.dispatch(fetchPartnerSuccess(res.data))

        updateReduxUser(this.props.user.id)

        this.setState({ partner: res.data })
        this.matchSucceed()
      } else {
        this.matchFailed(this._codeToMessage(res.code))
      }
    }
  }

  succeedAnimation() {
    Animated.timing(this.state.faceLeft,{ toValue: { x: -60, y: 0 } }).start()
    Animated.timing(this.state.faceRight,{ toValue: { x: 60, y: 0 } }).start()
  }

  matchSucceed() {
    this.succeedAnimation()
    let content = (
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [
              { translateX: this.state.faceLeft.x },
              { translateY: this.state.faceLeft.y },
            ],
            alignItems: 'center'
          }}
        >
          <View style={styles.face_container}>
            <Image style={styles.face} source={{ uri: this.props.user.face }} />
          </View>
          <TextPingFang style={styles.text_name}>{this.props.user.name}</TextPingFang>
        </Animated.View>
        
        <Image source={require('../../../res/images/profile/icon_link.png')}/>

        <Animated.View
          style={{
            transform: [
              { translateX: this.state.faceRight.x },
              { translateY: this.state.faceRight.y },
            ],
            alignItems: 'center'
          }}
        >
          <View style={styles.face_container}>
            <Image style={styles.face} source={{ uri: this.state.partner.face }} />
          </View>
          <TextPingFang style={styles.text_name}>{this.state.partner.name}</TextPingFang>
        </Animated.View>
      </View>
    )

    this.setState({
      title: '匹配成功',
      content,
      matchSucceed: true
    })
  }

  matchFailed(message) {
    let content = (
      <View style={styles.fail_container}>
        <Image style={styles.img_fail} source={require('../../../res/images/profile/bg_match_fail.png')} />
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

  succeedBack() {
    if (this.state.matchSucceed) {
      Actions.reset(SCENE_INDEX, { tab: 'profile' })
    }
  }

  async disconnect() {
    const res = await HttpUtils.get(USERS.disconnect)
    if (res.code === 0) {
      updateReduxUser(this.props.user.id)
      store.dispatch(fetchPartnerSuccess({ id: 0 }))
      Actions.pop()
    }
  }

  renderRightButton() {
    if (this.props.partner.id) {
      return (
        <TouchableOpacity onPress={() => this.setState({ showPopup: true })}>
          <TextPingFang style={styles.text_nav_right}>解除匹配</TextPingFang>
        </TouchableOpacity>
      )
    }
  }

  render() {
    return (
      <Container>
        <ProfileHeader
          title={this.state.title}
          rightButton={this.renderRightButton()}
          onBack={() => this.succeedBack()}
        />
        {this.state.content}
        <Popup
          showPopup={this.state.showPopup}
          popupBgColor={'#FF5757'}
          icon={require('../../../res/images/profile/icon_remove.png')}
          title={'注意'}
          content={'你与对方的互动信息将永远消失，并且再也匹配不到对方'}
          onPressLeft={() => this.setState({ showPopup: false })}
          onPressRight={() => this.disconnect()}
          textBtnLeft={'再考虑'}
          textBtnRight={'狠心解除'}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: getResponsiveWidth(250),
    marginTop: getResponsiveWidth(40),
    alignItems: 'center',
  },
  fail_container: {
    height: getResponsiveWidth(250),
    marginTop: getResponsiveWidth(40),
    alignItems: 'center',
  },
  bg_matching: {
    width: WIDTH,
    height: WIDTH,
    justifyContent: 'center',
    alignItems: 'center'
  },
  face_user: {
    width: getResponsiveWidth(88),
    height: getResponsiveWidth(88),
    borderRadius: getResponsiveWidth(44)
  },
  text_nav_right: {
    color: '#FF5757',
    fontSize: 16
  },
  face_container: {
    height: getResponsiveWidth(250),
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    width: getResponsiveWidth(88),
    height: getResponsiveWidth(88),
    borderRadius: getResponsiveWidth(44)
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
  },
  text_start_btn: {
    color: '#fff'
  }
})
