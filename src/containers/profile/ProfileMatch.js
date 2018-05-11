import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native'

import { Actions } from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'
import TabBar from './components/TabBar'
import MatchTips from './components/MatchTips'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'
import { updateUser } from '../../common/util'
import { SCENE_MATCH_RESULT } from '../../constants/scene'

import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

@connect(mapStateToProps)
export default class ProfileMatch extends Component {

  state = {
    matchType: 0, // 0: 随机, 1: ID
    matchGender: 0, // 0: 男, 1: 女
    beMatched: true, // 是否希望被匹配
    character: 1, // 性格 1: 相同，2: 互补，3: 随意
    matchUserId: null,
    showPopup: true
  }

  componentDidMount() {
    this.setState({ matchGender: !this.props.user.sex })
  }

  // TODO：这个函数貌似写的有问题，status 为 1000 时仍然可以更新，由此可以判断 props/redux 中的 user 在匹配成功之后没有更新
  async updateStatus() {
    const { matchGender, beMatched, character, matchUserId } = this.state
    let { sex, status } = this.props.user

    if (status >= 501 && status <= 504 || status === 1000) {
      return
    }

    if (!beMatched) {
      await updateUser(this.props.user, { status: 999 })
      return
    }

    // 101：未匹配，期待异性，性格相同，主体男
    if (!sex && matchGender && character === 1) status = 101
    // 102：未匹配，期待异性，性格互补，主体男
    if (!sex && matchGender && character === 2) status = 102
    // 103：未匹配，期待异性，性格随意，主体男
    if (!sex && matchGender && character === 3) status = 103
    // 111：未匹配，期待异性，性格相同，主体女
    if (sex && !matchGender && character === 1) status = 111
    // 112：未匹配，期待异性，性格互补，主体女
    if (sex && !matchGender && character === 2) status = 112
    // 113：未匹配，期待异性，性格随意，主体女
    if (sex && !matchGender && character === 3) status = 113
    // 201：未匹配，期待同性，性格相同，主体男
    if (!sex && !matchGender && character === 1) status = 201
    // 202：未匹配，期待同性，性格互补，主体男
    if (!sex && !matchGender && character === 2) status = 202
    // 203：未匹配，期待同性，性格随意，主体男
    if (!sex && !matchGender && character === 3) status = 203
    // 211：未匹配，期待同性，性格相同，主体女
    if (sex && matchGender && character === 1) status = 211
    // 212：未匹配，期待同性，性格互补，主体女
    if (sex && matchGender && character === 2) status = 212
    // 213：未匹配，期待同性，性格随意，主体女
    if (sex && matchGender && character === 3) status = 213

    await updateUser(this.props.user, { status })
    return
  }

  async startMatch() {
    if (this.state.matchType === 0) {
      await this.updateStatus()
      return Actions.jump(SCENE_MATCH_RESULT)
    }
    if (this.state.matchType === 1 && !this.state.matchUserId) {
      return Alert.alert('', '对方ID不能为空哦')
    } else {
      return Actions.jump(SCENE_MATCH_RESULT, { matchUserId: this.state.matchUserId })
    }
  }

  render() {
    return (
      <Container>

        <ProfileHeader
          title='选择你的匹配项'
          desc={`本月还能匹配${this.props.user.last_times ? this.props.user.last_times : 0}次`}
        />
        <ScrollView>
          <ScrollableTabView
            style={styles.tabview}
            renderTabBar={() => <TabBar tabNames={['随机匹配', 'ID匹配']}/>}
            onChangeTab={({ i, from }) => this.setState({ matchType: i })}
          >
            <View style={styles.tab_container}>

              <View style={styles.question_container}>
                <TextPingFang style={styles.text_question}>你希望匹配到</TextPingFang>
                <View style={styles.option_container}>
                  <TouchableOpacity
                    style={[styles.btn, this.state.matchGender !== this.props.user.sex ? styles.active_btn : null]}
                    onPress={() => this.setState({ matchGender: !this.props.user.sex })}
                  >
                    <TextPingFang
                      style={[styles.text_btn, this.state.matchGender !== this.props.user.sex ? styles.active_text : null]}>异性</TextPingFang>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, this.state.matchGender === this.props.user.sex ? styles.active_btn : null]}
                    onPress={() => this.setState({ matchGender: this.props.user.sex })}
                  >
                    <TextPingFang
                      style={[styles.text_btn, this.state.matchGender === this.props.user.sex ? styles.active_text : null]}>同性</TextPingFang>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.question_container}>
                <TextPingFang style={styles.text_question}>你是否希望被匹配</TextPingFang>
                <View style={styles.option_container}>
                  <TouchableOpacity
                    style={[styles.btn, this.state.beMatched ? styles.active_btn : null]}
                    onPress={() => this.setState({ beMatched: true })}
                  >
                    <TextPingFang
                      style={[styles.text_btn, this.state.beMatched ? styles.active_text : null]}>希望</TextPingFang>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, !this.state.beMatched ? styles.active_btn : null]}
                    onPress={() => this.setState({ beMatched: false })}
                  >
                    <TextPingFang
                      style={[styles.text_btn, !this.state.beMatched ? styles.active_text : null]}>不希望</TextPingFang>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.question_container}>
                <TextPingFang style={styles.text_question}>匹配者的性格</TextPingFang>
                <View style={styles.option_container}>
                  <TouchableOpacity
                    style={[styles.btn, this.state.character === 1 ? styles.active_btn : null]}
                    onPress={() => this.setState({ character: 1 })}
                  >
                    <TextPingFang
                      style={[styles.text_btn, this.state.character === 1 ? styles.active_text : null]}>相同</TextPingFang>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, this.state.character === 2 ? styles.active_btn : null]}
                    onPress={() => this.setState({ character: 2 })}
                  >
                    <TextPingFang
                      style={[styles.text_btn, this.state.character === 2 ? styles.active_text : null]}>互补</TextPingFang>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, this.state.character === 3 ? styles.active_btn : null]}
                    onPress={() => this.setState({ character: 3 })}
                  >
                    <TextPingFang
                      style={[styles.text_btn, this.state.character === 3 ? styles.active_text : null]}>随意</TextPingFang>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

            <View style={styles.tab_container}>
              <TextPingFang>请输入对方ID</TextPingFang>
              <TextInput
                style={styles.input}
                value={this.state.matchUserId}
                placeholder='Example: 123456'
                keyboardType='numeric'
                onChangeText={id => this.setState({ matchUserId: id })}
              />
            </View>
          </ScrollableTabView>

          <TouchableOpacity
            style={styles.start_btn}
            onPress={() => this.startMatch()}
          >
            <TextPingFang style={styles.text_start_btn}>开始匹配</TextPingFang>
          </TouchableOpacity>

        </ScrollView>

        // TODO：记得发布时取消注释
        {/* <MatchTips
         showPopup={this.state.showPopup}
         onClose={() => this.setState({ showPopup: false })}
         tips={[
         {
         bg: require('../../../res/images/profile/bg_match_tips_1.png'),
         title: '每个月只有 3 次宝贵的匹配机会',
         sTitle: '',
         },
         {
         bg: require('../../../res/images/profile/bg_match_tips_2.png'),
         title: '解除匹配关系将失去所有互动信息',
         sTitle: '并且无法再次匹配到 ta',
         },
         {
         bg: require('../../../res/images/profile/bg_match_tips_3.png'),
         title: '多写日记更容易匹配成功哦',
         sTitle: '至少要写 1 篇日记才能匹配',
         }
         ]}
         /> */}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  tabview: {
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24),
  },
  tab_container: {
    marginTop: getResponsiveWidth(32),
  },
  question_container: {
    height: getResponsiveWidth(63),
    justifyContent: 'space-between',
    marginTop: getResponsiveWidth(24)
  },
  text_question: {
    color: '#444',
    fontSize: 14
  },
  option_container: {
    flexDirection: 'row',
  },
  btn: {
    width: getResponsiveWidth(56),
    height: getResponsiveWidth(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveWidth(24),
    borderWidth: getResponsiveWidth(1.3),
    borderColor: 'transparent',
    borderRadius: getResponsiveWidth(8)
  },
  active_btn: {
    borderColor: '#2DC3A6',
  },
  text_btn: {
    color: '#aaa',
    fontSize: 16
  },
  active_text: {
    color: '#2DC3A6'
  },
  input: {
    height: getResponsiveWidth(44),
    marginTop: getResponsiveWidth(8),
    color: '#000',
    fontSize: 14,
    borderBottomWidth: getResponsiveWidth(1),
    borderBottomColor: '#2DC3A6'
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
