import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from 'antd-mobile/lib/toast'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import DiaryBanner from './DiaryBanner'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'
import {
  getMonth,
  postImgToQiniu,
  sleep,
  downloadImg,
  updateFile
} from '../../common/util'
import { SCENE_INDEX } from '../../constants/scene'

import store from '../../redux/store'
import { saveDiaryToLocal, deleteDiaryToLocal } from '../../redux/modules/diary'
import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

@connect(mapStateToProps)
export default class UpdateDiary extends Component {

  state = {
    date: new Date(),
    title: '',
    content: '',
    base64List: [],
    showPopup: false,
    // imageList: [],
    imgPathList: [],
    oldImgPathList: [],
    savingDiary: false,
    leftButton: null
  }

  componentWillMount() {
    const diary = this.props.diary
    this.setState({
      title: diary.title,
      content: diary.content,
      // imageList: diary.images ? diary.images.split(',') : [],
      imgPathList: diary.imgPathList,
      oldImgPathList : [...diary.imgPathList],
      base64List: diary.base64List
    }, () => this._renderLeftButton())
  }

  async saveDiary() {
    Keyboard.dismiss()

    if (this.state.savingDiary) return

    this.setState({savingDiary: true})

    const { title, content, base64List, imgPathList } = this.state

    if (!title && !content) return Actions.pop()
    if (!title) return Alert.alert('', '给日记起个标题吧')
    if (!content) return Alert.alert('', '日记内容不能为空哦')

    Toast.loading('正在保存', 0)

    await sleep(100)

    // 过滤已存在的图片
    let newImgPathList = [] // 新的未缓存图片
    let oldUseingImgPathList = [] // 更新日记继续使用的已缓存图片
    for(let i = 0; i < imgPathList.length; i++) {
      for(let j = 0; j < this.state.oldImgPathList.length; j++) {
        if (imgPathList[i] === this.state.oldImgPathList[j]) {
          oldUseingImgPathList.push(imgPathList[i])
          break
        }
        if (j === this.state.oldImgPathList.length - 1) {
          newImgPathList.push(imgPathList[i])
        }
      }
    }
    if(!this.state.oldImgPathList.length) {
      newImgPathList = imgPathList
    }
    // 复制图片文件
    let newPathListPromises = newImgPathList.map(async path => {
      return await downloadImg(path, this.props.user.id)
    })
    let newUsingImgPathList = []
    for (let newPathListPromise of newPathListPromises) {
      newUsingImgPathList.push(await newPathListPromise)
    }

    // 更新配置文件
    await updateFile({
      user_id: this.props.user.id || 0,
      action: 'update',
      data: {
        ...this.props.diary,
        title,
        content,
        base64List,
        imgPathList: [...newUsingImgPathList, ...oldUseingImgPathList]
      }
    })

    // 修改本地日记
    // const newDiary = {
    //   ...this.props.diary,
    //   title,
    //   content,
    //   base64List,
    //   imgPathList: [...newUsingImgPathList, ...oldUseingImgPathList]
    // }
    // store.dispatch(deleteDiaryToLocal(this.props.diary.date))
    // store.dispatch(saveDiaryToLocal(newDiary))

    let images = ''
    // TODO: VIP
    const vip = false
    if (vip) {
      images = await postImgToQiniu(base64List, {
        type: 'note',
        user_id: this.props.user.id
      })

      const data = {
        note_id: this.props.diary.id,
        title,
        content,
        images: [...imageList, ...(images.length ? images.split(',') : [])].join(','),
        mode: this.props.diary.mode
      }
      const res = await HttpUtils.post(NOTES.update, data)
      // if (res.code === 0) {
      // }
    }

    Actions.reset(SCENE_INDEX)

    Toast.hide()
  }

  getBase64List(base64List) {
    this.setState({base64List})
  }

  getImgPathList(imgPathList) {
    this.setState({imgPathList})
    this._renderLeftButton()
  }

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

  render() {
    return (
      <Container hidePadding={true}>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scroll_style}
          extraScrollHeight={0}
          enableResetScrollToCoords
        >
          <DiaryBanner
            showNav={true}
            showBanner={true}
            showBottomBar={true}
            leftButton={this.state.leftButton}
            onPressBack={() => this.saveDiary()}
            imgPathList={this.state.imgPathList}
            getImgPathList={this.getImgPathList.bind(this)}
          />

          <View style={styles.date_container}>
            <TextPingFang style={styles.text_date}>{getMonth(this.state.date.getMonth())} </TextPingFang>
            <TextPingFang style={styles.text_date}>{this.state.date.getDate()}，</TextPingFang>
            <TextPingFang style={styles.text_date}>{this.state.date.getFullYear()}</TextPingFang>
          </View>


          <TextInput
            style={styles.text_title}
            value={this.props.diary.title}
            onChangeText={title => this.setState({ title })}
            placeholder='标题'
            placeholderTextColor='#aaa'
          />

          <View style={styles.line}></View>

          <TextInput
            style={styles.text_content}
            value={this.props.diary.content}
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
