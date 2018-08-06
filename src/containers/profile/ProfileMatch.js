import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform
} from 'react-native'

import { Actions } from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'
import TabBar from './components/TabBar'
import MatchTips from './components/MatchTips'
import Popup from '../../components/Popup'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
} from '../../common/styles'
import { updateUser, updateReduxUser } from '../../common/util'
import Storage from '../../common/storage'
import { SCENE_MATCH_RESULT } from '../../constants/scene'

import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'
import * as RNIap from 'react-native-iap'

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

const itemSkus = Platform.select({
  ios: [
    'times_1'
  ],
  android: [],
})

@connect(mapStateToProps)
export default class ProfileMatch extends Component {

  state = {
    matchType: 0, // 0: 随机, 1: ID
    matchGender: !this.props.user.sex, // 0: 男, 1: 女
    beMatched: this.props.user.status !== 999, // 是否希望被匹配
    character: 1, // 性格 1: 相同，2: 互补，3: 随意
    matchUserId: null,
    showTips: false,
    showPopup: false,
    productList: []
  }

  async componentDidMount() {
    this.showTips()

    switch (this.props.user.status) {
    case 999:
      this.setState({ beMatched: false })
      break
    case 101:
      this.setState({ sex: false, matchGender: true, character: 1, beMatched: true })
      break
    case 102:
      this.setState({ sex: false, matchGender: true, character: 2, beMatched: true })
      break
    case 103:
      this.setState({ sex: false, matchGender: true, character: 3, beMatched: true })
      break
    case 111:
      this.setState({ sex: true, matchGender: false, character: 1, beMatched: true })
      break
    case 112:
      this.setState({ sex: true, matchGender: false, character: 2, beMatched: true })
      break
    case 113:
      this.setState({ sex: true, matchGender: false, character: 3, beMatched: true })
      break
    case 201:
      this.setState({ sex: false, matchGender: false, character: 1, beMatched: true })
      break
    case 202:
      this.setState({ sex: false, matchGender: false, character: 2, beMatched: true })
      break
    case 203:
      this.setState({ sex: false, matchGender: false, character: 3, beMatched: true })
      break
    case 211:
      this.setState({ sex: true, matchGender: true, character: 1, beMatched: true })
      break
    case 212:
      this.setState({ sex: true, matchGender: true, character: 2, beMatched: true })
      break
    case 213:
      this.setState({ sex: true, matchGender: true, character: 3, beMatched: true })
      break
    default:
      break
    }
    try {
      await RNIap.prepare()
      const products = await RNIap.getProducts(itemSkus)
      this.setState({ productList: products })
    }
    catch (err) {
      console.warn(err.code, err.message)
    }
  }

  componentWillUnmount() {
    Storage.set('firstMatch', false)
  }

  async showTips() {
    const showTips = await Storage.get('firstMatch', true)
    this.setState({ showTips })
  }

  buyItem = async (product) => {
    RNIap.buyProduct(product.productId).then(purchase => {
      HttpUtils.post(USERS.add_last_times).then(res => {
        updateReduxUser(this.props.user.id)
        this.setState({
          showPopup: true,
          popupBgColor: '#2DC3A6',
          pupupIcon: require('../../../res/images/home/icon_happy.png'),
          popupTitle: '购买成功',
          popupContent: '您已成功购买额外的匹配次数，感谢您对作者的支持，我们一定会更用心做好产品😊',
        })
      })
    }).catch(err => {
      console.warn(err) // standardized err.code and err.message available
    })
  }

  async updateStatus() {
    const { matchGender, beMatched, character, matchUserId } = this.state
    let { sex, status, user_other_id } = this.props.user

    if (status === 1000 || user_other_id !== -1) {
      return
    }

    if (!beMatched) {
      if (status === 999) return

      await updateUser(this.props.user, { status: 999 })
      await updateReduxUser(this.props.user.id)
      return
    }

    if ((status >= 501 && status <= 504)) return

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

    if (this.props.user.status === status) return
    await updateUser(this.props.user, { status })
    await updateReduxUser(this.props.user.id)
    return
  }

  async startMatch() {
    // 若未开启同步，需要提醒开启
    const isSync = await Storage.get('isSync', true)
    if (!isSync) {
      return Alert.alert('匹配需要开启同步功能', '')
    }
    // 若用户没有匹配次数，则提示购买
    if (this.props.user.last_times <= 0) {
      return this.setState({ showPopup: true })
    }
    if (this.state.matchType === 0) {
      await this.updateStatus()
      return Actions.jump(SCENE_MATCH_RESULT)
    }
    if (this.state.matchType === 1 && !this.state.matchUserId) {
      return Alert.alert('对方ID不能为空哦', '')
    } else {
      return Actions.jump(SCENE_MATCH_RESULT, { matchUserId: this.state.matchUserId })
    }
  }

  async _back() {
    Actions.pop()
    await this.updateStatus()
  }

  render() {
    return (
      <Container>

        <ProfileHeader
          headerStyle={styles.header_style}
          title='选择你的匹配项'
          desc={`本月还能匹配 ${this.props.user.last_times ? this.props.user.last_times : 0} 次`}
          onBack={() => this._back()}
        />
        <ScrollView scrollEnabled={true}>
          <ScrollableTabView
            style={styles.tabview}
            renderTabBar={() => <TabBar tabNames={['随机匹配', 'ID匹配']}/>}
            onChangeTab={({ i, from }) => this.setState({ matchType: i })}
          >
            <View style={styles.tab_container}>

              <View style={styles.question_container}>
                <TextPingFang style={styles.text_question}>你是否想开启匹配功能</TextPingFang>
                <View style={styles.option_container}>
                  <TouchableOpacity
                    style={[styles.btn, this.state.beMatched ? styles.active_btn : null]}
                    onPress={() => this.setState({ beMatched: true })}
                  >
                    <TextPingFang style={[styles.text_btn, this.state.beMatched ? styles.active_text : null]}>开启</TextPingFang>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, !this.state.beMatched ? styles.active_btn : null]}
                    onPress={() => this.setState({ beMatched: false })}
                  >
                    <TextPingFang style={[styles.text_btn, !this.state.beMatched ? styles.active_text : null]}>关闭</TextPingFang>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.question_container, this.state.beMatched ? null : styles.no_show]}>
                <TextPingFang style={styles.text_question}>你希望匹配到</TextPingFang>
                <View style={styles.option_container}>
                  <TouchableOpacity
                    style={[styles.btn, this.state.matchGender !== this.props.user.sex ? styles.active_btn : null]}
                    onPress={() => this.setState({ matchGender: !this.props.user.sex })}
                  >
                    <TextPingFang style={[styles.text_btn, this.state.matchGender !== this.props.user.sex ? styles.active_text : null]}>异性</TextPingFang>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, this.state.matchGender === this.props.user.sex ? styles.active_btn : null]}
                    onPress={() => this.setState({ matchGender: this.props.user.sex })}
                  >
                    <TextPingFang style={[styles.text_btn, this.state.matchGender === this.props.user.sex ? styles.active_text : null]}>同性</TextPingFang>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.question_container, this.state.beMatched ? null : styles.no_show]}>
                <TextPingFang style={styles.text_question}>匹配者的性格</TextPingFang>
                <View style={styles.option_container}>
                  <TouchableOpacity
                    style={[styles.btn, this.state.character === 1 ? styles.active_btn : null]}
                    onPress={() => this.setState({ character: 1 })}
                  >
                    <TextPingFang style={[styles.text_btn, this.state.character === 1 ? styles.active_text : null]}>相同</TextPingFang>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, this.state.character === 2 ? styles.active_btn : null]}
                    onPress={() => this.setState({ character: 2 })}
                  >
                    <TextPingFang style={[styles.text_btn, this.state.character === 2 ? styles.active_text : null]}>互补</TextPingFang>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, this.state.character === 3 ? styles.active_btn : null]}
                    onPress={() => this.setState({ character: 3 })}
                  >
                    <TextPingFang style={[styles.text_btn, this.state.character === 3 ? styles.active_text : null]}>随意</TextPingFang>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

            <View style={styles.tab_container}>
              <TextPingFang>请输入对方ID</TextPingFang>
              <TextInput
                style={styles.input}
                value={this.state.matchUserId}
                placeholder='Example: 071512'
                keyboardType='numeric'
                onChangeText={id => this.setState({ matchUserId: id })}
              />
            </View>
          </ScrollableTabView>

        </ScrollView>

        <TouchableOpacity
          style={[styles.start_btn, this.state.beMatched ? null : styles.no_show]}
          onPress={() => this.startMatch()}
        >
          <TextPingFang style={styles.text_start_btn}>开始匹配</TextPingFang>
        </TouchableOpacity>

        <MatchTips
          showPopup={this.state.showTips}
          onClose={() => this.setState({ showTips: false })}
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
        />

        <Popup
          showPopup={this.state.showPopup}
          popupBgColor={'#2DC3A6'}
          icon={require('../../../res/images/profile/icon_remove.png')}
          title={'注意'}
          content={'你这个月已无匹配次数，若想匹配，可以选择花费 1 元购买额外的匹配机会。'}
          onPressLeft={() => this.setState({ showPopup: false })}
          onPressRight={() => this.buyItem(this.state.productList[0])}
          textBtnLeft={'再考虑'}
          textBtnRight={'购买1次匹配机会'}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  header_style: {
    paddingBottom: getResponsiveWidth(24),
  },
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
    marginBottom: getResponsiveWidth(24)
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
    borderColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(4)
  },
  active_btn: {
    backgroundColor: '#2DC3A6'
  },
  no_show: {
    display: 'none'
  },
  text_btn: {
    color: '#000',
    fontSize: 16,
    fontWeight: '300'
  },
  active_text: {
    color: '#fff'
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
    position: 'absolute',
    right: getResponsiveWidth(24),
    bottom: getResponsiveWidth(80),
    backgroundColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(30)
  },
  text_start_btn: {
    paddingVertical: getResponsiveWidth(10),
    paddingHorizontal: getResponsiveWidth(16),
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  }
})
