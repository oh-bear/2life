import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Alert
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import Popup from '../../components/Popup'
import DiaryBanner from './DiaryBanner'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'
import { getMonth, postImgToQiniu, getLocation } from '../../common/util'
import { SCENE_INDEX } from '../../constants/scene'

import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

const URL_publish = NOTES.publish

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
    content: '',
    latitude: 0,
    longitude: 0,
    location: '',
    showKeyboard: false,
    base64List: [],
    keyboardHeight: 0,
    showPopup: false
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
    this._getLocation()
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

  async saveDiary() {
    Keyboard.dismiss()

    const { title, content, latitude, longitude, location } = this.state

    if (!title && !content) return Actions.pop()
    if (!title) return Alert.alert('', '给日记起个标题吧')
    if (!content) return Alert.alert('', '日记内容不能为空哦')

    const images = await postImgToQiniu(this.state.base64List, {
      type: 'note',
      user_id: this.props.user.id
    })

    const data = { title, content, images, latitude, longitude, location }
    const res = await HttpUtils.post(URL_publish, data)
    if (res.code === 0) {
      this.setState({ showPopup: true })
    }
  }

  getBase64List(base64List) {
    this.setState({ base64List })
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
            getBase64List={this.getBase64List.bind(this)}
            onPressBack={() => this.saveDiary()}
          />

          <View style={styles.date_container}>
            <TextPingFang style={styles.text_date}>{getMonth(this.state.date.getMonth())} </TextPingFang>
            <TextPingFang style={styles.text_date}>{this.state.date.getDate()}，</TextPingFang>
            <TextPingFang style={styles.text_date}>{this.state.date.getFullYear()}</TextPingFang>
          </View>


          <TextInput
            style={styles.text_title}
            onChangeText={title => this.setState({ title })}
            placeholder='标题'
            placeholderTextColor='#aaa'
          />

          <View style={styles.line}></View>

          <TextInput
            style={styles.text_content}
            onChangeText={content => this.setState({ content })}
            placeholder='请输入正文'
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
          content='你的日记已经自动保存并同步，放心退出吧'
          onPressLeft={() => {
            this.setState({ showPopup: false })
            Actions.reset(SCENE_INDEX)
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
    paddingLeft: getResponsiveWidth(24),
    paddingTop: getResponsiveWidth(24),
    paddingBottom: getResponsiveWidth(24),
  },
  scroll_style: {
    // height: HEIGHT,
    // backgroundColor: 'red'
  },
  text_date: {
    color: '#aaa',
    fontSize: 12
  },
  text_title: {
    color: '#000',
    fontSize: 24,
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
