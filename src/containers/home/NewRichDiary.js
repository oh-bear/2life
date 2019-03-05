
import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  BackHandler,
  Image,
  DatePickerIOS,
  Animated,
  Platform,
  DeviceEventEmitter
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from 'antd-mobile/lib/toast'
import ImagePicker from 'react-native-image-picker'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import Popup from '../../components/Popup'
import DiaryBanner from './DiaryBanner'
import Editor from './Editor'

import {
  WIDTH,
  getResponsiveWidth,
  getResponsiveHeight,
  HEIGHT,
} from '../../common/styles'

import {
  formatDate,
  getLocation,
  updateUser,
  downloadImg,
  updateFile,
  syncFile,
  OCR,
  uuid
} from '../../common/util'

import Storage from '../../common/storage'

import HttpUtils from '../../network/HttpUtils'
import { UTILS, USERS } from '../../network/Urls'

import { VERSION_NUMBER } from '../../constants/config'

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

class DownBox extends Component {
  state = {
    opacity: new Animated.Value(0),
    downBoxY: new Animated.Value(-340)
  }
  easedownBox(show) {
    Animated.parallel([
      Animated.spring(
        this.state.downBoxY,
        {
          toValue: show ? 0 : -340,
          duration: 300
        }
      ).start(),
      Animated.timing(
        this.state.opacity,
        {
          toValue: show ? 0.48 : 0,
          duration: 300
        }
      ).start(() => !show ? this.props.hidedownBox() : null)
    ])
  }
  _hidedownBox = () => {
    this.easedownBox(false)
  }
  componentDidUpdate() {
    this.props.showdownBox ? this.easedownBox(true) : null
  }
  render() {
    return (
      this.props.showdownBox ?
        <Animated.View
          style={{
            width: WIDTH,
            height: HEIGHT,
            zIndex: 100,
            backgroundColor: '#000',
            opacity: this.state.opacity
          }}
        >
          <Animated.View style={{
            zIndex: 120,
            width: WIDTH,
            position: 'absolute',
            bottom: this.state.downBoxY,
            height: getResponsiveHeight(340),
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: getResponsiveWidth(26),
            paddingHorizontal: getResponsiveWidth(24)
          }}>
            <View style={styles.flex_between}>
              <TouchableOpacity onPress={this._hidedownBox}>
                <TextPingFang style={styles.text_cancel}>取消</TextPingFang>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._hidedownBox}>
                <TextPingFang style={styles.text_done}>完成</TextPingFang>
              </TouchableOpacity>
            </View>
            {this.props.children}
          </Animated.View>
        </Animated.View> : null
    )
  }
}

@connect(mapStateToProps)
export default class NewRichDiary extends Component {

  state = {
    date: new Date(),
    type: 'datePicker',
    pubHole: false,
    showdownBox: false,
    startSaveDiary: false,
    firstEntryDiary: false,
    savingDiary: false,
    showPopup: false,
    latitude: 0,
    longitude: 0,
    location: '',
    base64List: [],
    imgPathList: [],
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    this._firstIn()
    this._getLocation()
  }

  onBackAndroid = () => {
    // this.saveDiary()
    Actions.pop()
    return true
  }

  componentWillUnmount() {
    Storage.set('firstEntryDiary', false)
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
    this.saveDiary()
  }

  async _firstIn() {
    const firstEntryDiary = await Storage.get('firstEntryDiary', true)
    this.setState({ firstEntryDiary, showPopup: firstEntryDiary })
  }

  _getLocation() {
    navigator.geolocation.getCurrentPosition(async res => {
      const { longitude, latitude } = res.coords
      const location = await getLocation(longitude, latitude)
      if (location.city instanceof Array) {
        // 无法获取具体位置
        this.setState({ location: '地球的某个角落' })
      } else {
        this.setState({ location: `${location.city}，${location.province}，${location.country}` })
      }
      this.setState({ latitude, longitude })
    }, err => {
      Toast.info('呃哦，获取定位失败了，打开定位再试试吧', 2)
    })
  }

  _updateUser() {
    if (this.props.user.status === 502 && !this.props.user.sex) {
      updateUser(this.props.user, { status: 103 })
    }
    if (this.props.user.status === 502 && this.props.user.sex) {
      updateUser(this.props.user, { status: 113 })
    }
  }

  saveDiary = async ({ title, content }) => {
    // const date = formatDate(this.state.date, 'yyyy') + '-' + formatDate(this.state.date, 'mm') + '-' + formatDate(this.state.date, 'dd')
    if (!title && !content) return
    
    const isLogin = !!this.props.user.id
    const { latitude, longitude, location, imgPathList, date } = this.state

    // 情绪分析
    let mode = 50
    try {
      const res = await HttpUtils.post(UTILS.get_nlp_result, { content })
      mode = res.code === 0 ? Math.floor(res.data * 100) : 50
    } finally {
      const data = {
        title,
        content,
        mode,
        latitude, longitude, location, imgPathList
      }
      
      // 更新配置文件
      await updateFile({
        user_id: this.props.user.id || 0,
        action: 'add',
        data: {
          ...data,
          uuid: uuid(),
          imgPathList: newImgPathList,
          date: date.getTime(),
          images: '',
          user_id: this.props.user.id || 0,
          status: this.props.user.status || null,
          hole_alive: this.state.pubHole ? Date.now() + 48 * 3600000 : -1,
          op: 1,
          v: VERSION_NUMBER
        }
      })

      // 第一次写日记更新用户status
      this._updateUser()

      // 同步
      isLogin && await syncFile(this.props.user.id)

      DeviceEventEmitter.emit('flush_mode_data')

      if (this.state.firstEntryDiary) {
        this.setState({
          showPopup: true,
          popupContent: '你的日记已经自动保存，放心退出吧'
        })
      } else {
        Actions.pop()
      }
    }
  }

  _renderPrivacy() {
    const items = [
      {
        icon: 'friends',
        text_p1: '好友可见',
        text_p2: '只有你和匹配对象能够看到'
      },
      {
        icon: 'treehole',
        text_p1: '发布到树洞',
        text_p2: '匿名发到树洞并在树洞广场保留 48 小时'
      }
    ]
    return (
      items.map((item, i) => (
        <View
          key={i}
          style={[
            styles.flex_between,
            { marginBottom: item.icon === 'friends' ? getResponsiveWidth(35) : 0 }
          ]}
        >
          <View style={styles.flex_start}>
            <View>
              <Image
                style={{
                  width: getResponsiveWidth(28),
                  height: getResponsiveWidth(28)
                }}
                resizeMode="contain"
                source={item.icon === 'friends' ?
                  require('./images/icon-editor-state.png') : require('./images/icon-treehole.png')}
              />
            </View>
            <View style={[
              styles.flex_column_start,
              { marginLeft: getResponsiveWidth(30) }
            ]}>
              <TextPingFang style={styles.text_p1}>{item.text_p1}</TextPingFang>
              <TextPingFang style={styles.text_p2}>{item.text_p2}</TextPingFang>
            </View>
          </View>
          <TouchableOpacity onPress={() => {
            item.icon === 'treehole' ?
              this.setState({
                pubHole: !this.state.pubHole
              }) : null
          }}>
            <Image
              source={item.icon === 'friends' ?
                require('./images/oval-h.png') : this.state.pubHole ?
                  require('./images/oval-h.png') : require('./images/oval.png')}
            />
          </TouchableOpacity>
        </View>
      ))
    )
  }

  render() {
    return (
      <Container>
        <DownBox
          showdownBox={this.state.showdownBox}
          hidedownBox={() => {
            this.setState({
              showdownBox: false
            })
          }}
        >
          <View style={styles.date_picker}>
            {
              this.state.type === 'datePicker' ?
                <DatePickerIOS
                  locale={'zh-Hans'}
                  style={styles.date_picker}
                  date={this.state.date}
                  maximumDate={new Date()}
                  mode={'date'}
                  onDateChange={date => this.setState({ date })}
                /> :
                <View style={styles.privacy}>
                  {this._renderPrivacy()}
                </View>
            }
          </View>
        </DownBox>
        <View style={styles.header}>
          <View style={styles.flex_start}>
            <TouchableOpacity onPress={() => {
              this.setState({
                type: 'datePicker',
                showdownBox: true
              })
            }}>
              <View style={styles.flex_start}>
                <View>
                  <Image source={require('./images/bge.png')} />
                  <TextPingFang style={styles.text_day}>{formatDate(this.state.date, 'dd')}</TextPingFang>
                </View>
                <TextPingFang style={styles.text_week}>{'周' + formatDate(this.state.date, 'W')}</TextPingFang>
                <View style={styles.check}>
                  <Image source={require('./images/icon-more.png')} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.setState({
                type: 'privacy',
                showdownBox: true
              })
            }}>
              <View style={styles.middle}>
                <View>
                  <Image source={require('./images/icon-editor-state.png')} />
                </View>
                <TextPingFang style={styles.mate_visible}>好友可见</TextPingFang>
                <View style={styles.check}>
                  <Image source={require('./images/icon-more.png')} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                startSaveDiary: true
              })
            }}
          >
            <View>
              <Image source={require('./images/done.png')} />
            </View>
          </TouchableOpacity>
        </View>
        <Editor
          saveDiary={this.saveDiary}
          startSaveDiary={this.state.startSaveDiary}
          user={this.props.user}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  flex_start: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  flex_between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flex_column_start: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  header: {
    width: WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getResponsiveWidth(24),
    marginTop: getResponsiveWidth(24),
    marginBottom: getResponsiveWidth(24)
  },
  check: {
    marginLeft: getResponsiveWidth(6)
  },
  privacy: {
    marginTop: getResponsiveWidth(45)
  },
  text_p1: {
    fontSize: 17,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: getResponsiveWidth(3)
  },
  text_p2: {
    fontSize: 12,
    color: '#666'
  },
  text_cancel: {
    color: '#aaa',
    fontSize: 17
  },
  text_done: {
    color: '#00B377',
    fontSize: 17,
    fontWeight: 'bold'
  },
  text_day: {
    color: '#aaa',
    fontSize: 11,
    position: 'absolute',
    top: getResponsiveWidth(5),
    left: getResponsiveWidth(5.5)
  },
  text_week: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: getResponsiveWidth(5)
  },
  date_picker: {
    marginTop: getResponsiveWidth(15)
  },
  middle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: getResponsiveWidth(45)
  },
  mate_visible: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: getResponsiveWidth(5)
  }
})
