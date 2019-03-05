import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  Platform,
  Alert,
  DeviceEventEmitter,
  Modal,
  Animated,
  TextInput,
} from 'react-native'
import { ActionSheet } from 'antd-mobile'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import ImageViewer from 'react-native-image-zoom-viewer'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'antd-mobile/lib/toast'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import CommonNav from '../../components/CommonNav'
import KeyboardStickeyBar from '../../components/KeyboardStickeyBar'
import CommentList from '../../components/CommentList'
import DiaryBanner from './DiaryBanner'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'
import { formatDate, updateFile, syncFile, getPath } from '../../common/util'
import { SCENE_UPDATE_DIARY } from '../../constants/scene'

import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class RichDiaryDetail extends Component {

  state = {
    showBanner: false,
    imgPathList: [],
    likeComponent: null,
    mode: '',
    mode_face: require('../../../res/images/home/icon_happy.png'),
    showChangeMode: false,
    showImgPreview: false,
    hideCommentInput: true,
    modeWidth: new Animated.Value(0),
    modeOpacity: new Animated.Value(0),
    leftButton: null,
    rightButton: null,
    commentContent: '',
    commentContent_2: '',
    commentList: [],
    inputCommentPlaceholder: '写下想对Ta说的吧～',
    currentReplyComment: {}, // 当前正在回复的评论
  }

  async componentWillMount() {
    const { diary, from } = this.props

    if (diary.imgPathList) {
      this.setState({
        imgPathList: diary.imgPathList.map(path => getPath(path)),
        showBanner: !!diary.imgPathList.length
      }, () => {
        this._renderLeftButton()
        this._renderRightButton()
      })
    } 

    if (from === 'hole') {
      this.setState({
        imgPathList: diary.images.split(','),
        showBanner: !!diary.images
      }, () => {
        this._renderLeftButton()
        this._renderHoleRightButton()
      })
    }

    this.renderlikeComponent(diary.is_liked)
  }

  componentDidMount() {

    const { diary } = this.props

    if (diary.mode >= 0 && diary.mode <= 20) this.setState({ mode_face: require('../../../res/images/home/icon_very_sad_male.png') })
    if (diary.mode > 20 && diary.mode <= 40) this.setState({ mode_face: require('../../../res/images/home/icon_sad_male.png') })
    if (diary.mode > 40 && diary.mode <= 60) this.setState({ mode_face: require('../../../res/images/home/icon_normal_male.png') })
    if (diary.mode > 60 && diary.mode <= 80) this.setState({ mode_face: require('../../../res/images/home/icon_happy_male.png') })
    if (diary.mode > 80 && diary.mode <= 100) this.setState({ mode_face: require('../../../res/images/home/icon_very_happy_male.png') })

    this.setState({ mode: diary.mode ? diary.mode : 0 })

    this.getComment()
  }

  async updateMode(mode, mode_face) {
    if (!this.state.showChangeMode) return

    // 更新配置文件
    await updateFile({
      user_id: this.props.user.id || 0,
      action: 'update',
      data: {
        ...this.props.diary,
        mode,
        op: this.props.diary.id ? 2 : 1
      }
    })

    !!this.props.user.id && syncFile(this.props.user.id)

    this.setState({
      showChangeMode: false,
      mode,
      mode_face
    })
    this.toggleChooseMode()
  }

  showOptions() {
    const options = {
      options: ['修改日记', '删除日记', '取消'],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1
    }
    ActionSheetIOS.showActionSheetWithOptions(options, index => {
      if (index === 0) Actions.replace(SCENE_UPDATE_DIARY, { diary: this.props.diary })
      if (index === 1) {
        Alert.alert(
          '',
          '确定要删除这篇日记吗？',
          [
            {
              text: '取消',
              onPress: () => { }
            },
            {
              text: '确定',
              onPress: async () => {
                // 更新配置文件
                await updateFile({
                  user_id: this.props.user.id || 0,
                  action: this.props.diary.id ? 'update' : 'delete',
                  data: {
                    ...this.props.diary,
                    op: 3
                  }
                })

                !!this.props.user.id && syncFile(this.props.user.id)

                Actions.pop()
              }
            },
          ]
        )
      }
      if (index === 3) return
    })
  }

  showHoleOptions() {
    const options = {
      options: ['举报该不适当内容', '取消'],
      cancelButtonIndex: 1,
    }
    ActionSheetIOS.showActionSheetWithOptions(options, index => {
      if (index === 0) {
        HttpUtils.get(NOTES.report_hole, { note_id: this.props.diary.id })
        Toast.info('将会对内容进行核查，感谢您的反馈', 1.5)
      }
    })
  }

  showActionSheet() {
    const BUTTONS = ['修改日记', '删除日记', '取消']
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      destructiveButtonIndex: BUTTONS.length - 2,
      // title: 'title',
      // message: 'I am description, description, description',
      maskClosable: true,
      'data-seed': 'logId',
      // wrapProps,
    },
    (index) => {
      if (index === 0) Actions.replace(SCENE_UPDATE_DIARY, { diary: this.props.diary })
      if (index === 1) {
        Alert.alert(
          '',
          '确定要删除这篇日记吗？',
          [
            {
              text: '取消',
              onPress: () => { }
            },
            {
              text: '确定',
              onPress: async () => {
                // 更新配置文件
                await updateFile({
                  user_id: this.props.user.id || 0,
                  action: this.props.diary.id ? 'update' : 'delete',
                  data: {
                    ...this.props.diary,
                    op: 3
                  }
                })

                !!this.props.user.id && syncFile(this.props.user.id)

                Actions.pop()
              }
            },
          ]
        )
      }
      if (index === 3) return
    })
  }

  async likeNote() {
    const res = await HttpUtils.post(NOTES.like, { note_id: this.props.diary.id })

    if (res.code === 0) {
      // 更新配置文件
      await updateFile({
        user_id: this.props.user.id || 0,
        action: 'update',
        data: {
          ...this.props.diary,
          is_liked: true,
          op: 0
        }
      })

      DeviceEventEmitter.emit('flush_note', {})
      this.renderlikeComponent(true)
    }
  }

  renderlikeComponent(isLiked) {
    let likeComponent
    if (isLiked) {
      likeComponent = (
        <TouchableOpacity>
          <Image style={styles.img_btn} source={require('../../../res/images/home/icon_liked.png')} />
        </TouchableOpacity>
      )
    } else {
      likeComponent = (
        <TouchableOpacity onPress={() => this.likeNote()}>
          <Image style={styles.img_btn} source={require('../../../res/images/home/icon_like.png')} />
        </TouchableOpacity>
      )
    }
    this.setState({ likeComponent })
  }

  toggleChooseMode() {
    this.setState({ showChangeMode: !this.state.showChangeMode })
    Animated.parallel([
      Animated.spring(
        this.state.modeWidth,
        {
          toValue: this.state.showChangeMode ? 0 : getResponsiveWidth(250),
          duration: 300
        }
      ),
      Animated.timing(
        this.state.modeOpacity,
        {
          toValue: this.state.showChangeMode ? 0 : 1,
          duration: 300
        }
      )
    ]).start()
  }

  keyboardWillShow = () => {
    this.inputComment.focus()
    this.setState({ hideCommentInput: false })
  }
  keyboardWillHide = () => {
    this.inputComment.blur()
    this.setState({ hideCommentInput: true })
  }

  getComment = async () => {
    const params = {
      note_id: this.props.diary.id,
      owner_id: this.props.diary.user_id
    }
    const res = await HttpUtils.get(NOTES.show_comment, params)
    this.setState({ commentList: res.comments })
  }

  addComment = async () => {
    const data = {
      note_id: this.props.diary.id,
      user_id: this.props.user.id,
      owner_id: this.props.diary.user_id,
      content: this.state.commentContent,
    }
    const res = await HttpUtils.post(NOTES.add_comment, data)
    if (res.code === 0) {
      this.keyboardWillHide()
      this.setState({ commentContent: '', commentContent_2: '', currentReplyComment: {} })
      this.getComment()
    }
  }

  replyComment = async () => {
    const comment = this.state.currentReplyComment
    this.setState({ inputCommentPlaceholder: '回复 ' + comment.reply.name })
    const data = {
      note_id: this.props.diary.id,
      user_id: comment.user.id,
      owner_id: this.props.diary.user_id,
      content: this.state.commentContent,
    }
    const res = await HttpUtils.post(NOTES.add_comment, data)
    if (res.code === 0) {
      this.keyboardWillHide()
      this.setState({ commentContent: '', commentContent_2: '', currentReplyComment: {} })
      this.getComment()
    }
  }

  _renderLeftButton() {
    let source = this.props.diary.images ?
      require('../../../res/images/common/icon_back_white.png') :
      require('../../../res/images/common/icon_back_black.png')

    const leftButton = (
      <TouchableOpacity onPress={() => Actions.pop()}>
        <Image source={source} />
      </TouchableOpacity>
    )

    this.setState({ leftButton })
  }

  _renderRightButton() {
    // 未登录日记和自己的日记才显示更多按钮
    if (!this.props.user.id || this.props.user.id === this.props.diary.user_id) {
      let source = this.state.imgPathList.length ?
        require('../../../res/images/common/icon_more_white.png') :
        require('../../../res/images/common/icon_more_black.png')
      const rightButton = (
        <TouchableOpacity
          style={styles.nav_right}
          onPress={() => {
            if (Platform.OS === 'android') {
              this.showActionSheet()
            } else {
              this.showOptions()
            }
          }}
        >
          <Image source={source} />
        </TouchableOpacity>
      )
      this.setState({ rightButton })
    }
  }

  
  _renderHoleRightButton() {
    const { diary } = this.props
    let source = diary.images ?
      require('../../../res/images/common/icon_more_white.png') :
      require('../../../res/images/common/icon_more_black.png')
    const rightButton = (
      <TouchableOpacity
        style={styles.nav_right}
        onPress={() => {
          if (Platform.OS === 'android') {
            this.showActionSheet()
          } else {
            this.showHoleOptions()
          }
        }}
      >
        <Image source={source} />
      </TouchableOpacity>
    )
    this.setState({ rightButton })
  }

  render() {
    const { from } = this.props
    let name = '匿名'
    let code = '0000'
    let face = 'https://airing.ursb.me/image/twolife/male.png'
    if (from === 'hole') {
      const { diary } = this.props
      name = diary.user.emotions_type && diary.user.emotions_type || '匿名'
      code = diary.user.code.toString().substr(diary.user.code.toString().length - 4, 4)
      face = !diary.user.sex && 'https://airing.ursb.me/image/twolife/male.png' || 'https://airing.ursb.me/image/twolife/female.png'
    }
    return (
      <Container
        style={styles.container}
        hidePadding={this.state.showBanner}
      >
        <KeyboardAwareScrollView>
          <DiaryBanner
            showNav={true}
            showBanner={this.state.showBanner}
            imgPathList={this.state.imgPathList}
            leftButton={this.state.leftButton}
            rightButton={this.state.rightButton}
            onTouchStart={() => this.setState({ touchStartTs: Date.now() })}
            onTouchEnd={() => {
              if (Date.now() - this.state.touchStartTs < 80) {
                this.setState({ showImgPreview: true })
              }
            }}
          />

          {/* 在无图片日记下的顶部导航 */}
          <CommonNav
            navStyle={[styles.nav_style, { display: this.state.showBanner ? 'none' : 'flex' }]}
            navBarStyle={styles.navbar_style}
            leftButton={this.state.leftButton}
            rightButton={this.state.rightButton}
          />

          <View style={styles.date_container}>
            <TextPingFang style={styles.text_date}>{formatDate(this.props.diary.date, 'Z月 dd, yyyy')}</TextPingFang>
          </View>

          <TextPingFang style={styles.text_title}>{this.props.diary.title}</TextPingFang>

          <View style={[styles.partner_container, { display: this.props.diary.user_id !== this.props.user.id && from === 'home' ? 'flex' : 'none' }]}>
            <Image style={styles.partner_face} source={{ uri: this.props.partner.face }} />
            <TextPingFang style={styles.text_name}>{this.props.partner.name}</TextPingFang>
          </View>

          <View style={[styles.partner_container, { display: this.props.diary.user_id == this.props.user.id && from === 'home' ? 'flex' : 'none' }]}>
            <Image style={styles.partner_face} source={{ uri: this.props.user.face }} />
            <TextPingFang style={styles.text_name}>{this.props.user.name}</TextPingFang>
          </View>

          <View style={[styles.partner_container, { display: from === 'hole' ? 'flex' : 'none' }]}>
            <Image style={styles.partner_face} source={{ uri: face }} />
            <TextPingFang style={styles.text_name}>{name + ' ' + code}</TextPingFang>
          </View>

          <View style={styles.line} />

          <TextPingFang style={styles.text_content}>{this.props.diary.content}</TextPingFang>

          <View style={styles.location_container}>
            <Image style={styles.location_icon} source={require('../../../res/images/home/icon_location.png')} />
            <TextPingFang style={styles.text_location}>{from === 'home' ? this.props.diary.location : '地球上的某个角落'}</TextPingFang>
          </View>

          <View style={styles.mode_container}>
            <Image style={styles.location_icon} source={this.state.mode_face} />
            <TextPingFang style={styles.text_mode}>{this.state.mode}</TextPingFang>
            <TextPingFang style={styles.text_value}>情绪值</TextPingFang>
            <TouchableOpacity
              style={[styles.update_container, { display: this.props.user.id === this.props.diary.user_id || this.props.diary.user_id === 0 ? 'flex' : 'none', position: this.props.user.id === this.props.diary.user_id || this.props.diary.user_id === 0 ? 'absolute' : 'relative' }]}
              onPress={() => this.toggleChooseMode()}
            >
              <TextPingFang style={styles.text_update}>更正</TextPingFang>
            </TouchableOpacity>

            <Animated.View style={[
              styles.choose_mode,
              {
                width: this.state.modeWidth,
                opacity: this.state.modeOpacity
              }
            ]}>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateMode(0, require('../../../res/images/home/icon_very_sad_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_very_sad_male.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateMode(25, require('../../../res/images/home/icon_sad_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_sad_male.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateMode(50, require('../../../res/images/home/icon_normal_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_normal_male.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateMode(75, require('../../../res/images/home/icon_happy_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_happy_male.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateMode(100, require('../../../res/images/home/icon_very_happy_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_very_happy_male.png')} />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <TouchableOpacity
            style={[styles.mode_container]}
            activeOpacity={1}
            onPress={this.keyboardWillShow}
          >
            <Image style={styles.location_icon} source={require('../../../res/images/home/diary/icon_comment.png')} />
            <TextPingFang style={styles.text_comment}>有什么想说的</TextPingFang>
          </TouchableOpacity>

          <CommentList
            data={this.state.commentList}
            onPressItem={(comment) => {
              this.setState({currentReplyComment: comment})
              this.keyboardWillShow()
            }}
          />

        </KeyboardAwareScrollView>

        <Modal
          visible={this.state.showImgPreview}
          transparent={false}
          animationType={'fade'}
          onRequestClose={() => {}}
        >
          <ImageViewer
            imageUrls={this.state.imgPathList.map(path => {
              return { url: getPath(path) }
            })}
            enableSwipeDown={true}
            onSwipeDown={() => this.setState({ showImgPreview: false })}
            onClick={() => this.setState({ showImgPreview: false })}
          />
        </Modal>

        <TouchableOpacity
          style={[styles.btn_container, { display: this.props.user.id !== this.props.diary.user_id && this.props.partner.id && from === 'home' ? 'flex' : 'none', position: this.props.user.id !== this.props.diary.user_id && this.props.partner.id ? 'absolute' : 'relative' }]}
        >
          {this.state.likeComponent}
        </TouchableOpacity>

        <KeyboardStickeyBar
          hide={this.state.hideCommentInput}
          ctnStyle={styles.input_container}
          keyboardWillHide={this.keyboardWillHide}
        >
          <TextInput
            ref={ref => this.inputComment = ref}
            style={styles.input_comment}
            value={this.state.commentContent}
            onChangeText={text => this.setState({ commentContent_2: text })}
            placeholder={this.state.inputCommentPlaceholder}
            placeholderTextColor='#aaa'
            enablesReturnKeyAutomatically={true}
            multiline={true}
            underlineColorAndroid='transparent'
            returnKeyType={'send'}
            onSubmitEditing={() => {
              this.setState({ commentContent: this.state.commentContent_2 }, () => {
                this.state.currentReplyComment.id ? this.replyComment() : this.addComment()
              })
            }}
          />
        </KeyboardStickeyBar>

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  nav_right: {
    justifyContent: 'center',
    height: getResponsiveWidth(30)
  },
  date_container: {
    width: WIDTH,
    flexDirection: 'row',
    paddingLeft: getResponsiveWidth(24),
    paddingTop: getResponsiveWidth(24),
    paddingBottom: getResponsiveWidth(24),
  },
  text_date: {
    color: '#aaa',
    fontSize: 12
  },
  text_title: {
    color: '#000',
    fontSize: 24,
    fontWeight: '400',
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    paddingTop: getResponsiveWidth(48),
  },
  partner_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: getResponsiveWidth(24),
    marginTop: getResponsiveWidth(8),
    marginBottom: getResponsiveWidth(48),
  },
  partner_face: {
    width: getResponsiveWidth(24),
    height: getResponsiveWidth(24),
    borderRadius: getResponsiveWidth(12)
  },
  text_name: {
    marginLeft: getResponsiveWidth(8),
    color: '#000',
    fontSize: 14,
    fontWeight: '400'
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
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    marginTop: getResponsiveWidth(24),
    paddingBottom: getResponsiveWidth(24),
  },
  location_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: getResponsiveWidth(24),
    marginBottom: getResponsiveWidth(16)
  },
  location_icon: {
    marginRight: getResponsiveWidth(8)
  },
  text_location: {
    color: '#000',
    fontSize: 10,
    fontWeight: '300'
  },
  mode_container: {
    height: getResponsiveWidth(64),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24),
    borderBottomWidth: getResponsiveWidth(1),
    borderBottomColor: '#f1f1f1'
  },
  text_mode: {
    width: getResponsiveWidth(30),
    marginLeft: getResponsiveWidth(15),
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  text_value: {
    marginLeft: getResponsiveWidth(8),
    color: '#aaa',
    fontSize: 16,
    fontWeight: '300'
  },
  text_comment: {
    marginLeft: getResponsiveWidth(8),
    color: '#333',
    fontSize: 16,
    fontWeight: '400'
  },
  update_container: {
    position: 'absolute',
    right: 0,
  },
  text_update: {
    color: '#2DC3A6',
    fontSize: 16
  },
  btn_container: {
    position: 'absolute',
    right: 24,
    ...ifIphoneX({
      bottom: 48
    }, {
      bottom: 24
    })
  },
  img_btn: {
    width: getResponsiveWidth(64),
    height: getResponsiveWidth(64)
  },
  choose_mode: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  },
  input_container: {
    width: WIDTH,
    paddingVertical: getResponsiveWidth(8),
    paddingHorizontal: getResponsiveWidth(8),
    backgroundColor: '#f3f3f3'
  },
  input_comment: {
    minHeight: getResponsiveWidth(30),
    maxHeight: getResponsiveWidth(80),
    paddingVertical: getResponsiveWidth(8),
    paddingHorizontal: getResponsiveWidth(12),
    textAlignVertical: 'center',
    color: '#444',
    fontSize: 14,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
})
