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

import {
  WIDTH,
  getResponsiveWidth,
  HEIGHT,
} from '../../common/styles'

import {
  getMonth,
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

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

@connect(mapStateToProps)
export default class NewDiary extends Component {

  state = {
    date: new Date(),
    title: '',
    title_2: '', // 解决TextInput 无法输入中文
    content: '',
    content_2: '',
    latitude: 0,
    longitude: 0,
    location: '',
    base64List: [],
    imgPathList: [],
    savingDiary: false,
    showPopup: false,
    firstEntryDiary: false,
    popupContent: '写完日记点击返回键就能自动保存哦',
    leftButton: null,
    rightButton: null,
    datePickerY: new Animated.Value(-220),
    showDatePicker: false
  }

  componentWillMount() {
    this._renderLeftButton()
    this._renderRightButton()
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

  async saveDiary() {
    const isLogin = !!this.props.user.id

    // if (this.state.savingDiary) return

    // this.setState({ savingDiary: true })

    const { title_2, content_2, latitude, longitude, location, imgPathList, date } = this.state
    let title = title_2, content = content_2
    if (!title && !content) return

    let images = ''

    // 复制图片文件
    let newPathListPromises = imgPathList.map(async path => {
      return await downloadImg(path, this.props.user.id)
    })
    let newImgPathList = []
    for (let newPathListPromise of newPathListPromises) {
      newImgPathList.push(await newPathListPromise)
    }

    // 情绪分析
    let mode = 50
    try {
      const res = await HttpUtils.post(UTILS.get_nlp_result, { content })
      mode = res.code === 0 ? Math.floor(res.data * 100) : 50
    } finally {
      const data = { title, content, mode, images, latitude, longitude, location, imgPathList }
      // 更新配置文件
      await updateFile({
        user_id: this.props.user.id || 0,
        action: 'add',
        data: {
          ...data,
          uuid: uuid(),
          imgPathList: newImgPathList,
          date: date.getTime(),
          user_id: this.props.user.id || 0,
          status: this.props.user.status || null,
          op: 1
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

  getImgPathList(imgPathList) {
    this.setState({ imgPathList })
    this._renderLeftButton()
    this._renderRightButton()
  }

  _callImgPicker() {
    const options = {
      title: '手写日记识别',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍摄',
      chooseFromLibraryButtonTitle: '从相册选择',
      cameraType: 'back',
      mediaType: 'photo',
      quality: 1,
      allowsEditing: true,
      storageOptions: {
        skipBackup: true,
        cameraRoll: false,
        waitUntilSaved: false
      }
    }
    ImagePicker.showImagePicker(options, async res => {
      if (!res.didCancel) {
        Toast.loading('正在识别', 0)

        const { title, content, message } = await OCR(res.data)

        Toast.hide()

        if (!message) {
          this.setState({
            title,
            content,
            title_2: title,
            content_2: content
          })
        } else {
          Toast.fail(message, 1.5)
        }
      }
    })
  }

  _selectDate() {
    this.setState({ showDatePicker: !this.state.showDatePicker }, () => {
      Animated.spring(
        this.state.datePickerY,
        {
          toValue: this.state.showDatePicker ? 0 : -220,
          duration: 300
        }
      ).start()
    })
  }

  _renderLeftButton() {
    let source = this.state.imgPathList.length ?
      require('../../../res/images/home/diary/icon_back_white.png') :
      require('../../../res/images/home/diary/icon_back_black.png')

    const leftButton = (
      <TouchableOpacity onPress={() => Actions.pop()}>
        <Image source={source}/>
      </TouchableOpacity>
    )

    this.setState({ leftButton })
  }

  _renderRightButton() {
    let source = this.state.imgPathList.length ?
      require('../../../res/images/home/diary/icon_ocr_white.png') :
      require('../../../res/images/home/diary/icon_ocr_black.png')

    const rightButton = (
      <TouchableOpacity onPress={this._callImgPicker.bind(this)}>
        <Image source={source}/>
      </TouchableOpacity>
    )

    this.setState({ rightButton })
  }

  render() {
    return (
      <Container hidePadding={true}>
        {
          Platform.OS == 'ios' ?
            <Animated.View
              style={{
                position: 'absolute',
                bottom: this.state.datePickerY,
                backgroundColor: '#fff',
                zIndex: 100
              }}
            >
              <DatePickerIOS
                locale={'zh-Hans'}
                style={styles.date_picker}
                date={this.state.date}
                maximumDate={new Date()}
                mode={'datetime'}
                onDateChange={date => this.setState({ date })}
              />
            </Animated.View>
            : null
        }

        {
          Platform.OS == 'ios' ?
            <TouchableOpacity
              style={[styles.mask, { display: this.state.showDatePicker ? 'flex' : 'none' }]}
              onPress={() => this._selectDate()}
            >
            </TouchableOpacity>
            : null
        }

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scroll_style}
          extraScrollHeight={0}
          enableResetScrollToCoords
        >
          <DiaryBanner
            showBanner={true}
            showNav={true}
            showBottomBar={true}
            imgPathList={this.state.imgPathList}
            getImgPathList={this.getImgPathList.bind(this)}
            leftButton={this.state.leftButton}
            rightButton={this.state.rightButton}
          />

          {
            Platform.OS == 'ios' ?
              <View style={styles.date_container}>
                <TextPingFang style={styles.text_date}>{getMonth(this.state.date.getMonth())} </TextPingFang>
                <TextPingFang style={styles.text_date}>{this.state.date.getDate()}，</TextPingFang>
                <TextPingFang style={styles.text_date}>{this.state.date.getFullYear()}</TextPingFang>
                <TouchableOpacity
                  style={styles.small_calendar}
                  onPress={this._selectDate.bind(this)}
                >
                  <Image source={require('../../../res/images/home/diary/icon_calendar_small.png')}/>
                </TouchableOpacity>
              </View>
              : <View style={styles.date_container}>
                <DatePicker
                  style={{ width: 200 }}
                  date={this.state.date}
                  mode="date"
                  format="MM-DD，YYYY"
                  maxDate={new Date()}
                  confirmBtnText="确定"
                  cancelBtnText="取消"
                  iconSource={require('../../../res/images/home/diary/icon_calendar_small.png')}
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      right: getResponsiveWidth(100),
                      top: 10,
                      bottom: 10,
                      marginLeft: 0,
                      width: getResponsiveWidth(20),
                      height: getResponsiveWidth(20)
                    },
                    dateInput: {
                      marginLeft: 0,
                      borderWidth: 0,
                      alignItems: 'flex-start',
                      justifyContent: 'center'
                    }
                  }}
                  onDateChange={(date, date1) => {
                    this.setState({ date: date1 })
                  }
                  }
                />
              </View>
          }


          <TextInput
            style={styles.text_title}
            value={this.state.title}
            onChangeText={title => this.setState({ title_2: title })}
            onBlur={() => this.setState({ title: this.state.title_2 })}
            placeholder='标题'
            underlineColorAndroid='transparent'
            placeholderTextColor='#aaa'
          />

          <TextInput
            style={styles.text_content}
            value={this.state.content}
            onChangeText={content => this.setState({ content_2: content })}
            onBlur={() => this.setState({ content: this.state.content_2 })}
            placeholder='请输入正文'
            underlineColorAndroid='transparent'
            placeholderTextColor='#aaa'
            multiline
          />
        </KeyboardAwareScrollView>

        <Popup
          showPopup={this.state.showPopup}
          popupBgColor='#2DC3A6'
          icon={require('../../../res/images/home/icon_save.png')}
          content={this.state.popupContent}
          onPressLeft={() => {

            this.setState({ showPopup: false })
            if (this.state.content) Actions.pop()
          }}
          textBtnLeft='我明白了'
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
    zIndex: 10
  },
  date_picker: {
    width: WIDTH,
  },
  date_container: {
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: getResponsiveWidth(24),
    marginTop: getResponsiveWidth(24),
    marginBottom: getResponsiveWidth(24),
  },
  scroll_style: {
    // height: HEIGHT,
    // backgroundColor: 'red'
  },
  text_date: {
    color: '#aaa',
    fontSize: 12
  },
  small_calendar: {
    marginLeft: getResponsiveWidth(8)
  },
  text_title: {
    color: '#333',
    fontSize: 20,
    fontWeight: '500',
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    paddingTop: getResponsiveWidth(48),
  },
  text_content: {
    color: '#666',
    fontSize: 16,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    marginTop: getResponsiveWidth(12),
    maxHeight: getResponsiveWidth(120),
  }
})
