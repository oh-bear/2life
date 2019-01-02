import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import PrivacyAgreement from '../../components/PrivacyAgreement'
import Row from './components/Row'

import {
  WIDTH,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'
import { readFile } from '../../common/util'
import Storage from '../../common/storage'
import {
  SCENE_PROFILE_EDIT,
  SCENE_PROFILE_BADGE,
  SCENE_PROFILE_MATCH,
  SCENE_PROFILE_SYNC,
  SCENE_PROFILE_NOTE,
  SCENE_PROFILE_REWARD,
  SCENE_MATCH_RESULT,
  SCENE_LOGIN_OPTIONS,
  SCENE_PROFILE_TEST,
  SCENE_PROFILE_SETTING,
  SCENE_WEB,
  SCENE_PROFILE_VIP,
  SCENE_PROFILE_NOTIFICATION
} from '../../constants/scene'
import HttpUtils from '../../network/HttpUtils'
import { UTILS } from '../../network/Urls'
import JPushModule from 'jpush-react-native'


function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class Profile extends Component {

  state = {
    is_scroll: true,
    showPrivacy: false,
    myAverageMode: 0,
    otherAverageMode: 0,
    myDiaryCount: 0,
    otherDiaryCount: 0,
    showActEntry: false,
    actUrl: '',
    shareUrl: '',
    isVip: false,
    unread: this.props.user.unread
  }

  async componentDidMount() {
    // const res = await HttpUtils.get(UTILS.show_act)
    // let showActEntry = false, actUrl = 'https://2life.act.ursb.me/#/', shareUrl = 'https://2life.act.ursb.me/#/invitation/'
    // if (res.code === 0) {
    //   showActEntry = res.show
    //   actUrl = res.url
    //   shareUrl = res.shareUrl
    // }

    const isVip = await Storage.get('isVip', false)

    // 获得日记数量和情绪值
    const diaryList = await readFile(this.props.user.id)
    let myDiaryList = diaryList.filter(diary => diary.user_id === this.props.user.id)
    let otherDiaryList = diaryList.filter(diary => diary.user_id !== this.props.user.id)

    let myTotalMode = 0, otherTotalMode = 0
    for (let diary of myDiaryList) {
      myTotalMode += diary.mode
    }
    for (let diary of otherDiaryList) {
      otherTotalMode += diary.mode
    }

    // 平均情绪值和日记数量
    this.setState({
      myAverageMode: Math.floor(myTotalMode / myDiaryList.length) || 0,
      otherAverageMode: Math.floor(otherTotalMode / otherDiaryList.length) || 0,
      myDiaryCount: myDiaryList.length || 0,
      otherDiaryCount: otherDiaryList.length || 0,
      isVip
      // showActEntry,
      // actUrl,
      // shareUrl
    })
  }

  renderUnlogin() {
    return (
      <Container showNetStatus={true}>
        <PrivacyAgreement
          showPopup={this.state.showPrivacy}
          onAgree={() => Actions.jump(SCENE_LOGIN_OPTIONS)}
          onCancel={() => this.setState({ showPrivacy: false })}
        />

        <View>
          <TextPingFang style={styles.title}>未登录</TextPingFang>
          <TextPingFang style={styles.text_login}>登录后可享受情绪管理、匹配日记对象等更多好玩功能！赶紧登录吧</TextPingFang>
        </View>

        <TouchableOpacity
          style={styles.login_btn}
          onPress={() => this.setState({ showPrivacy: true })}
        >
          <TextPingFang style={styles.text_login_btn}>现在登录</TextPingFang>
        </TouchableOpacity>
      </Container>
    )
  }

  renderPartner() {
    if (!this.props.partner.id) return
    return (
      <View>
        <View style={styles.head_container}>
          <View style={styles.head_left}>
            <View style={styles.head_left_top}>
              <TextPingFang style={styles.text_name}>{this.props.partner.name}</TextPingFang>
            </View>
            <View style={styles.head_left_bottom}>
              <Image source={require('../../../res/images/profile/icon_link.png')} />
              <TextPingFang style={styles.text_link}>你的匹配对象</TextPingFang>
            </View>
          </View>
          <View style={styles.head_right}>
            <Image style={styles.img_head} source={{ uri: this.props.partner.face }} />
            {
              (() => {
                if (this.props.partner.sex === 0) {
                  return <Image
                    style={styles.img_gender}
                    source={require('../../../res/images/profile/icon_male.png')} />
                } else {
                  return <Image
                    style={styles.img_gender}
                    source={require('../../../res/images/profile/icon_female.png')} />
                }
              })()
            }
          </View>
        </View>

        <TouchableOpacity style={styles.row} activeOpacity={1}>
          {
            (() => {
              if (this.props.partner.sex === 0) {
                return <Image source={require('../../../res/images/profile/icon_mode_male.png')} />
              } else {
                return <Image source={require('../../../res/images/profile/icon_mode_female.png')} />
              }
            })()
          }
          <TextPingFang style={styles.text_row_left}>{this.state.otherAverageMode}</TextPingFang>
          <TextPingFang style={styles.text_row_desc}>平均情绪值</TextPingFang>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row]}
          onPress={() => {
            Actions.jump(SCENE_PROFILE_NOTE, { isMe: false })
          }}>
          {
            (() => {
              if (this.props.partner.sex === 0) {
                return <Image source={require('../../../res/images/profile/icon_diary_male.png')} />
              } else {
                return <Image source={require('../../../res/images/profile/icon_diary_female.png')} />
              }
            })()
          }
          <TextPingFang style={styles.text_row_left}>{this.state.otherDiaryCount}</TextPingFang>
          <TextPingFang style={styles.text_row_desc}>日记数量</TextPingFang>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (!this.props.user.id) {
      return this.renderUnlogin()
    }

    let NotificationRow
    if (this.state.unread !== 0) {
      NotificationRow = 
      <Row
        imageLeft={<Image source={require('../../../res/images/profile/icon_profile_notification.png')} />}
        title='通知'
        iconRight={require('../../../res/images/common/oval.png')}
        onPress={() => {
          JPushModule.clearAllNotifications()
          this.setState({ unread: 0 })
          Actions.jump(SCENE_PROFILE_NOTIFICATION, { user: this.props.user })
        }}
      />
    } else {
      NotificationRow = <Row
        imageLeft={<Image source={require('../../../res/images/profile/icon_profile_notification.png')} />}
        title='通知'
        onPress={() => {
          Actions.jump(SCENE_PROFILE_NOTIFICATION, { user: this.props.user })
        }}
      />
    }

    return (
      <Container showNetStatus={true}>
        <View>
          <TextPingFang style={styles.title}>关于我</TextPingFang>
          <ScrollView scrollEnabled={this.state.is_scroll} contentContainerStyle={styles.profile_container}>
            <View style={styles.head_container}>
              <TouchableOpacity
                style={styles.head_left}
                activeOpacity={1}
                onPress={() => Actions.jump(SCENE_PROFILE_EDIT, { user: this.props.user })}
              >
                <View style={styles.head_left_top}>
                  <TextPingFang style={styles.text_name}>{this.props.user.name}</TextPingFang>
                  <Image style={{display: this.state.isVip ? 'flex' : 'none'}} source={require('../../../res/images/profile/vip/icon-profile-vip-2.png')}/>
                </View>
                <View style={styles.head_left_bottom}>
                  <TextPingFang style={styles.text_check}>查看资料</TextPingFang>
                </View>
              </TouchableOpacity>
              <View style={styles.head_right}>
                <Image style={styles.img_head} source={{ uri: this.props.user.face }} />
                {
                  (() => {
                    if (this.props.user.sex === 0) {
                      return <Image
                        style={styles.img_gender}
                        source={require('../../../res/images/profile/icon_male.png')} />
                    } else {
                      return <Image
                        style={styles.img_gender}
                        source={require('../../../res/images/profile/icon_female.png')} />
                    }
                  })()
                }
              </View>
            </View>

            <TouchableOpacity
              style={styles.row}
              // onPress={() => Actions.jump(SCENE_PROFILE_MODE, {user: this.props.user})}
              activeOpacity={1}
            >
              {
                (() => {
                  if (this.props.user.sex === 0) {
                    return <Image source={require('../../../res/images/profile/icon_mode_male.png')} />
                  } else {
                    return <Image source={require('../../../res/images/profile/icon_mode_female.png')} />
                  }
                })()
              }
              <TextPingFang style={styles.text_row_left}>{this.state.myAverageMode}</TextPingFang>
              <TextPingFang style={styles.text_row_desc}>平均情绪值</TextPingFang>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                Actions.jump(SCENE_PROFILE_NOTE, { isMe: true })
              }}
            >
              {
                (() => {
                  if (this.props.user.sex === 0) {
                    return <Image source={require('../../../res/images/profile/icon_diary_male.png')} />
                  } else {
                    return <Image source={require('../../../res/images/profile/icon_diary_female.png')} />
                  }
                })()
              }
              <TextPingFang style={styles.text_row_left}>{this.state.myDiaryCount}</TextPingFang>
              <TextPingFang style={styles.text_row_desc}>日记数量</TextPingFang>
            </TouchableOpacity>

            {/* <TouchableOpacity
             style={[styles.row, styles.row_border_bottom]}
             onPress={() => Actions.jump(SCENE_PROFILE_BADGE, {user: this.props.user})}
             >
             {
             (() => {
             if (this.props.user.sex === 0) {
             return <Image source={require('../../../res/images/profile/icon_badge_male.png')}/>
             } else {
             return <Image source={require('../../../res/images/profile/icon_badge_female.png')}/>
             }
             })()
             }
             <TextPingFang
             style={styles.text_row_left}>{this.props.user.mode ? this.props.user.mode : '暂无'}</TextPingFang>
             <TextPingFang style={styles.text_row_desc}>我的徽章</TextPingFang>
             <Image style={styles.row_indicator} source={require('../../../res/images/common/icon_indicator.png')}/>
             </TouchableOpacity> */}

            {this.renderPartner()}

            <View style={styles.margin}></View>
            {/*
            <View style={{display: this.state.showActEntry ? 'flex' : 'none'}}>
              <Row
                imageLeft={<Image source={require('../../../res/images/profile/icon-profile-event.png')} />}
                title='七夕活动'
                showRedPoint={true}
                onPress={() => Actions.jump(SCENE_WEB, { user: this.props.user, url: this.state.actUrl, shareUrl: this.state.shareUrl})}
              />
            </View> */}

            
            {
              NotificationRow
            }

            <Row
              imageLeft={<Image source={require('../../../res/images/profile/icon_match.png')} />}
              title='匹配'
              onPress={() => {
                if (this.props.user.user_other_id === -1) {
                  Actions.jump(SCENE_PROFILE_MATCH, { user: this.props.user })
                } else {
                  Actions.jump(SCENE_MATCH_RESULT, { user: this.props.user })
                }
              }}
            />

            <Row
              imageLeft={<Image source={require('../../../res/images/profile/vip/icon-profile-vip.png')} />}
              title='高级会员'
              iconRight={require('../../../res/images/profile/vip/icon-profile-pro.png')}
              onPress={() => Actions.jump(SCENE_PROFILE_VIP)}
            />

            <Row
              imageLeft={<Image source={require('../../../res/images/profile/icon_profile_scale.png')} />}
              title='性格测试'
              onPress={() => Actions.jump(SCENE_PROFILE_TEST)}
            />

            <Row
              imageLeft={<Image source={require('../../../res/images/profile/icon_sync.png')} />}
              title='同步'
              onPress={() => Actions.jump(SCENE_PROFILE_SYNC, { user: this.props.user })}
            />

            {Platform.OS === 'ios'?
              <Row
                imageLeft={<Image source={require('../../../res/images/profile/icon_reward.png')} />}
                title='打赏'
                onPress={() => Actions.jump(SCENE_PROFILE_REWARD)}
              />:<View />}

            <Row
              imageLeft={<Image source={require('../../../res/images/profile/icon_setting.png')} />}
              title='设置'
              onPress={() => Actions.jump(SCENE_PROFILE_SETTING, {user: this.props.user})}
            />
          </ScrollView>

        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  margin: {
    marginBottom: getResponsiveWidth(12)
  },
  title: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(70),
    ...ifIphoneX({
      paddingTop: getResponsiveHeight(4),
    }, 
    {
      paddingTop: getResponsiveHeight(28),
    }),
    color: '#000',
    fontSize: 34,
    fontWeight: '500',
  },
  text_login: {
    marginTop: getResponsiveWidth(16),
    paddingLeft: getResponsiveWidth(70),
    paddingRight: getResponsiveWidth(32),
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
  },
  login_btn: {
    position: 'absolute',
    right: getResponsiveWidth(32),
    ...ifIphoneX({
      bottom: getResponsiveWidth(120),
    }, 
    {
      bottom: getResponsiveWidth(80),
    }),

    width: getResponsiveWidth(112),
    height: getResponsiveWidth(48),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(24)
  },
  text_login_btn: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300'
  },
  profile_container: {
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    ...ifIphoneX({
      paddingBottom: 84,
    }, 
    {
      paddingBottom: 50,
    }),
  },
  head_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: getResponsiveWidth(24),
    marginTop: getResponsiveHeight(24),
    marginBottom: getResponsiveHeight(8),
  },
  head_left: {
    paddingLeft: getResponsiveWidth(24),
  },
  head_left_top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_name: {
    color: '#444',
    fontSize: 24,
    marginRight: 4
  },
  head_left_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text_check: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '300'
  },
  head_right: {
    justifyContent: 'center',
  },
  img_head: {
    width: getResponsiveWidth(48),
    height: getResponsiveWidth(48),
    borderRadius: getResponsiveWidth(24)
  },
  img_gender: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  row: {
    height: getResponsiveWidth(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_row_left: {
    marginLeft: getResponsiveWidth(24),
    color: '#444',
    fontSize: 16,
    fontWeight: '500'
  },
  text_row_desc: {
    position: 'absolute',
    left: getResponsiveWidth(85),
    color: '#aaa',
    fontSize: 16,
    fontWeight: '300'
  },
  row_match: {
    height: getResponsiveHeight(100),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  row_match_top: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_match_left: {
    marginLeft: getResponsiveWidth(24),
    color: '#000',
    fontSize: 20,
    fontWeight: '400'
  },
  row_match_bottom: {
    height: getResponsiveWidth(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_match_desc: {
    marginLeft: getResponsiveWidth(48),
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500'
  },
  text_row_right: {
    position: 'absolute',
    right: getResponsiveWidth(16),
    color: '#000',
    fontSize: 16,
  },
  text_link: {
    marginLeft: getResponsiveWidth(8),
    color: '#000',
    fontSize: 12
  }
})
