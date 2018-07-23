import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Alert,
  TouchableOpacity,
    BackHandler,
  Image
} from 'react-native'
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
} from '../../common/styles'

import {
  getMonth,
  postImgToQiniu,
  getLocation,
  updateUser,
  updateReduxUser,
  sleep,
  downloadImg,
  updateFile,
  OCR
} from '../../common/util'

import Storage from '../../common/storage'
import { SCENE_INDEX } from '../../constants/scene'

import store from '../../redux/store'
import { saveDiaryToLocal } from '../../redux/modules/diary'
import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

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
    title_2: '', //解决TextInput 无法输入中文
    content: '',
    content_2: '',
    latitude: 0,
    longitude: 0,
    location: '',
    showKeyboard: false,
    base64List: [],
    imgPathList: [],
    keyboardHeight: 0,
    savingDiary: false,
    showPopup: false,
    firstEntryDiary: false,
    popupContent: '写完日记点击返回键就能自动保存哦',
    leftButton: null,
    rightButton: null,
  }

  componentWillMount() {
    this._renderLeftButton()
    this._renderRightButton()
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', (e) => {
      this.setState({
        showKeyboard: true,
        keyboardHeight: e.endCoordinates.height
      })
    })
    Keyboard.addListener('keyboardDidHide', () => {
      this.setState({
        showKeyboard: false,
        keyboardHeight: 0
      })
    })
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);

    this._firstIn()
    this._getLocation()
  }

  onBackAndroid = () => {
    this.saveDiary()
    return true;
   };

  componentWillUnmount() {
    Storage.set('firstEntryDiary', false)
    BackHandler.removeEventListener('hardwareBackPress',this.onBackAndroid);
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

  //  if (this.state.savingDiary) return

    this.setState({ savingDiary: true })

    const { title, content, latitude, longitude, location, imgPathList } = this.state

    if (!title && !content) return Actions.pop()
    if (!title) {
      this.setState({savingDiary: false})
      return Alert.alert('', '给日记起个标题吧')
    }
    if (!content) {
      this.setState({savingDiary: false})
      return Alert.alert('', '日记内容不能为空哦')
    }

    Toast.loading('正在保存', 0)

    await sleep(100)

    try {
      let images = ''
      // TODO: VIP
      const vip = 0
      if (vip) {
        images = await postImgToQiniu(imgPathList, {
          type: 'note',
          user_id: this.props.user.id
        })
      }

      const data = { title, content, images, latitude, longitude, location, imgPathList }

      // 复制图片文件
      let newPathListPromises = imgPathList.map(async path => {
        return await downloadImg(path, this.props.user.id)
      })
      let newImgPathList = []
      for (let newPathListPromise of newPathListPromises) {
        newImgPathList.push(await newPathListPromise)
      }

      // 更新配置文件
      await updateFile({
        user_id: this.props.user.id || 0,
        action: 'add',
        data: {
          ...data,
          imgPathList: newImgPathList,
          date: Date.now(),
          user_id: this.props.user.id || 0
        }
      })

      // 将日记保存到本地redux
      // store.dispatch(saveDiaryToLocal({
      //   ...data,
      //   imgPathList: newImgPathList,
      //   date: Date.now(),
      //   user_id: this.props.user.id || 0
      // }))

      if (this.state.firstEntryDiary) {
        this.setState({
          showPopup: true,
          popupContent: '你的日记已经自动保存，放心退出吧'
        })
      } else {
        Actions.reset(SCENE_INDEX)
      }

      // TODO: 是否为付费VIP用户
      if (vip) {
        const res = await HttpUtils.post(NOTES.publish, data)

        if (res.code === 0) {
          this._updateUser()
          updateReduxUser(this.props.user.id)
        }
      }

      Toast.hide()
    } catch(e) {
      Toast.fail('保存失败，请稍后再试', 2)
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

        if(!message) {
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

  _selectDate() {}

  _renderLeftButton() {
    let source = this.state.imgPathList.length ?
      require('../../../res/images/home/diary/icon_back_white.png') :
      require('../../../res/images/home/diary/icon_back_black.png')

    const leftButton = (
      <TouchableOpacity onPress={this.saveDiary.bind(this)}>
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

          <TextInput
            style={styles.text_title}
            value={this.state.title}
            onChangeText={title => this.setState({ title_2: title })}
            onBlur={() => this.setState({ title: this.state.title_2 })}
            placeholder='标题'
            underlineColorAndroid='transparent'
            placeholderTextColor='#aaa'
          />

          <View style={styles.line}/>

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

          {/* <TouchableOpacity
           // style={[styles.hide_keyboard, {display: this.state.showKeyboard ? 'flex' : 'none'}]}
           style={[styles.hide_keyboard]}
           onPress={() => this.saveDiary()}
           >
           <TextPingFang style={styles.text_hide}>保存</TextPingFang>
           </TouchableOpacity> */}

        </KeyboardAwareScrollView>

        <Popup
          showPopup={this.state.showPopup}
          popupBgColor='#2DC3A6'
          icon={require('../../../res/images/home/icon_save.png')}
          content={this.state.popupContent}
          onPressLeft={() => {

            this.setState({ showPopup: false })
            if (this.state.content) Actions.reset(SCENE_INDEX)
          }}
          textBtnLeft='我明白了'
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
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
    color: '#000',
    fontSize: 24,
    fontWeight: '500',
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    paddingTop: getResponsiveWidth(48),
    paddingBottom: getResponsiveWidth(48),
  },
  line: {
    width: getResponsiveWidth(40),
    height: getResponsiveWidth(1),
    marginLeft: getResponsiveWidth(24),
    backgroundColor: '#aaa'
  },
  text_content: {
    color: '#444',
    fontSize: 16,
    height: getResponsiveWidth(100),
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    marginTop: getResponsiveWidth(24),
    paddingBottom: getResponsiveWidth(24),
  },
  hide_keyboard: {
    // position: 'absolute',
    width: getResponsiveWidth(50),
    height: getResponsiveWidth(20),
    // justifyContent: 'center',
    // bottom: 0,
    // right: 2,
    backgroundColor: '#eee',
    borderRadius: getResponsiveWidth(10)
  },
  text_hide: {
    color: '#bbb',
    fontSize: 12,
    textAlign: 'center'
  }
})
