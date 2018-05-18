import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  TextInput,
  Alert,
  DeviceEventEmitter
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import CommonNav from '../../components/CommonNav'
import DiaryBanner from './DiaryBanner'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'
import { SCENE_INDEX, SCENE_UPDATE_DIARY } from '../../constants/scene'
import { getMonth, getLocation, updateReduxUser } from '../../common/util'

import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class DiaryDetail extends Component {

  state = {
    showBanner: false,
    imageList: [],
    likeComponent: null,
    mode: '',
    mode_face: require('../../../res/images/home/icon_happy.png'),
    changeMode: false
  }

  async componentWillMount() {
    const diary = this.props.diary

    if (diary.images) {
      let imageList = diary.images.split(',')
      this.setState({ imageList, showBanner: true })
    } else {
      this.setState({ showBanner: false })
    }

    if (diary.mode >= 0 && diary.mode <= 20) this.setState({mode_face: require('../../../res/images/home/icon_very_sad_male.png')})
    if (diary.mode > 20 && diary.mode <= 40) this.setState({mode_face: require('../../../res/images/home/icon_sad_male.png')})
    if (diary.mode > 40 && diary.mode <= 60) this.setState({mode_face: require('../../../res/images/home/icon_normal_male.png')})
    if (diary.mode > 60 && diary.mode <= 80) this.setState({mode_face: require('../../../res/images/home/icon_happy_male.png')})
    if (diary.mode > 80 && diary.mode <= 100) this.setState({mode_face: require('../../../res/images/home/icon_very_happy_male.png')})

    this.setState({mode: diary.mode.toString()})

    this.renderlikeComponent(diary.is_liked)
  }

  updateNote(mode, mode_face) {
    const data = {
      note_id: this.props.diary.id,
      title: this.props.diary.title,
      content: this.props.diary.content,
      images: this.props.diary.images,
      mode
    }
    HttpUtils.post(NOTES.update, data).then(res => {
      if (res.code === 0) {
        updateReduxUser(this.props.user.id)

        Alert.alert('', '修改成功')

        this.setState({
          changeMode: false,
          mode,
          mode_face
        })
        DeviceEventEmitter.emit('flash_note', {})
      }
    })
  }

  showOptions() {
    const options = {
      options: ['修改日记', '删除日记', '取消'],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1
    }
    ActionSheetIOS.showActionSheetWithOptions(options, index => {
      if (index === 0) Actions.jump(SCENE_UPDATE_DIARY, {diary: this.props.diary})
      if (index === 1) {
        Alert.alert(
          '',
          '确定要删除这篇日记吗？',
          [
            {
              text: '取消',
              onPress: () => {}
            },
            {
              text: '确定',
              onPress: () => {
                HttpUtils.get(NOTES.delete, {note_id: this.props.diary.id}).then(res => {
                  if (res.code === 0) {
                    updateReduxUser(this.props.user.id)
                    Actions.reset(SCENE_INDEX)
                  }
                })
              }
            },
          ]
        )
      }
      if (index === 3) return
    })
  }

  likeNote() {
    HttpUtils.post(NOTES.like, {note_id: this.props.diary.id}).then(res => {
      if (res.code === 0) {
        DeviceEventEmitter.emit('flush_note', {})
        this.renderlikeComponent(true)
      }
    })
  }

  renderRightButton() {
    if (this.props.user.id === this.props.diary.user_id) {
      return (
        <TouchableOpacity onPress={() => this.showOptions()}>
          <Image source={require('../../../res/images/common/icon_more_black.png')}/>
        </TouchableOpacity>
      )
    }
  }

  renderlikeComponent(isLiked) {
    let likeComponent
    if (isLiked) {
      likeComponent = (
        <TouchableOpacity>
          <Image style={styles.img_btn} source={require('../../../res/images/home/icon_liked.png')}/>
        </TouchableOpacity>
      )
    } else {
      likeComponent = (
        <TouchableOpacity onPress={() => this.likeNote()}>
          <Image style={styles.img_btn} source={require('../../../res/images/home/icon_like.png')}/>
        </TouchableOpacity>
      )
    }
    this.setState({ likeComponent })
  }

  render() {
    return (
      <Container hidePadding={this.state.showBanner}>
        <KeyboardAwareScrollView>
          <DiaryBanner
            showBanner={this.state.showBanner}
            imageList={this.state.imageList}
            showNav={true}
            rightButton={this.renderRightButton()}
          />

          <CommonNav
            navStyle={[styles.nav_style, { display: this.state.showBanner ? 'none' : 'flex' }]}
            navBarStyle={styles.navbar_style}
            rightButton={this.renderRightButton()}
          />

          <View style={styles.date_container}>
            <TextPingFang
              style={styles.text_date}>{getMonth(new Date(this.props.diary.date).getMonth())} </TextPingFang>
            <TextPingFang style={styles.text_date}>{new Date(this.props.diary.date).getDate()}，</TextPingFang>
            <TextPingFang style={styles.text_date}>{new Date(this.props.diary.date).getFullYear()}</TextPingFang>
          </View>

          <TextPingFang style={styles.text_title}>{this.props.diary.title}</TextPingFang>

          <View style={[styles.partner_container, { display: this.props.diary.user_id !== this.props.user.id ? 'flex' : 'none'}]}>
            <Image style={styles.partner_face} source={{uri: this.props.partner.face}}/>
            <TextPingFang style={styles.text_name}>{this.props.partner.name}</TextPingFang>
          </View>

          <View style={[styles.partner_container, { display: this.props.diary.user_id !== this.props.user.id ? 'none' : 'flex'}]}>
            <Image style={styles.partner_face} source={{uri: this.props.user.face}}/>
            <TextPingFang style={styles.text_name}>{this.props.user.name}</TextPingFang>
          </View>

          <View style={styles.line}/>

          <TextPingFang style={styles.text_content}>{this.props.diary.content}</TextPingFang>

          <View style={styles.location_container}>
            <Image style={styles.location_icon} source={require('../../../res/images/home/icon_location.png')}/>
            <TextPingFang style={styles.text_location}>{this.props.diary.location}</TextPingFang>
          </View>

          <View style={styles.mode_container}>
            <Image style={styles.location_icon} source={this.state.mode_face}/>
            <TextPingFang style={styles.text_mode}>{this.state.mode}</TextPingFang>
            <TextPingFang style={styles.text_value}>情绪值</TextPingFang>
            <TouchableOpacity
              style={[styles.update_container, { display: this.props.user.id === this.props.diary.user_id ? 'flex' : 'none' }]}
              onPress={() => this.setState({changeMode: !this.state.changeMode})}
            >
              <TextPingFang style={styles.text_update}>更正</TextPingFang>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn_container, { display: this.props.user.id !== this.props.diary.user_id ? 'flex' : 'none' }]}
            >
              {this.state.likeComponent}
            </TouchableOpacity>

            <View style={[styles.choose_mode, {display: this.state.changeMode ? 'flex' : 'none'}]}>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateNote(0, require('../../../res/images/home/icon_very_sad_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_very_sad_male.png')}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateNote(25, require('../../../res/images/home/icon_sad_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_sad_male.png')}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateNote(50, require('../../../res/images/home/icon_normal_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_normal_male.png')}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateNote(75, require('../../../res/images/home/icon_happy_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_happy_male.png')}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mode_item}
                onPress={() => this.updateNote(100, require('../../../res/images/home/icon_very_happy_male.png'))}
              >
                <Image source={require('../../../res/images/home/icon_very_happy_male.png')}/>
              </TouchableOpacity>
            </View>
          </View>
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
    fontWeight: 'bold'
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
    paddingLeft: getResponsiveWidth(24)
  },
  location_icon: {
    marginRight: getResponsiveWidth(8)
  },
  text_location: {
    color: '#aaa',
    fontSize: 10
  },
  mode_container: {
    height: getResponsiveWidth(88),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24),
    borderBottomWidth: getResponsiveWidth(1),
    borderBottomColor: '#f5f5f5'
  },
  text_mode: {
    width: getResponsiveWidth(30),
    marginLeft: getResponsiveWidth(15),
    color: '#444',
    fontSize: 16,
    fontWeight: 'bold'
  },
  text_value: {
    marginLeft: getResponsiveWidth(8),
    color: '#aaa',
    fontSize: 16
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
    right: 0,
    top: getResponsiveWidth(24)
  },
  img_btn: {
    width: getResponsiveWidth(64),
    height: getResponsiveWidth(64)
  },
  choose_mode: {
    width: getResponsiveWidth(250),
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  }
})
