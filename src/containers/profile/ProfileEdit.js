import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native'

import ImagePicker from 'react-native-image-picker'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'

import store from '../../redux/store'
import { fetchProfileSuccess } from '../../redux/modules/user'

import {
  getResponsiveWidth,
} from '../../common/styles'
import {
  updateUser
} from '../../common/util'

import { postImgToQiniu } from '../../common/util'
import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

export default class ProfileEdit extends Component {

  state = {
    user: this.props.user,
  }

  componentDidMount() {
    this.setState({ user: this.props.user })
  }

  async seleceFace() {
    const options = {
      title: '',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍摄',
      chooseFromLibraryButtonTitle: '从相册选择',
      cameraType: 'back',
      mediaType: 'photo',
      maxWidth: 375,
      maxHeight: 282,
      quality: 1,
      allowsEditing: true,
      storageOptions: {
        skipBackup: true,
        cameraRoll: true,
        waitUntilSaved: true
      }
    }
    ImagePicker.showImagePicker(options, async res => {
      if (!res.didCancel) {
        const base64 = res.data
        const images = await postImgToQiniu([base64], { type: 'profile', user_id: this.state.user.id })
        this.setState({ user: Object.assign({}, this.state.user, { face: images }) }, () => {
          this.updateUser()
        })
      }
    })
  }

  async updateUser() {
    const data = {
      sex: this.state.user.sex,
      name: this.state.user.name,
      face: this.state.user.face
    }
    try {
      const res = await updateUser(this.state.user, data)
      if (res.code === 0) {
        store.dispatch(fetchProfileSuccess(this.state.user))
        Alert.alert('', '修改成功')
      }
    } catch (e) {
      Alert.alert('', '出错了，等会再试试')
    }
  }

  render() {
    return (
      <Container>
        <View>
          <ProfileHeader title='个人信息'/>

          <ScrollView scrollEnabled={false} contentContainerStyle={styles.main_container}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => this.seleceFace()}
            >
              <TextPingFang style={styles.text_row_left}>头像</TextPingFang>
              <Image style={styles.row_face} source={{ uri: this.state.user.face }}/>
              <Image style={styles.row_indicator} source={require('../../../res/images/common/icon_indicator.png')}/>
            </TouchableOpacity>

            <View
              style={styles.row}
            >
              <TextPingFang style={styles.text_row_left}>昵称</TextPingFang>
              <TextInput
                ref={ref => this.name_ipt = ref}
                style={styles.text_row_right}
                value={this.state.user.name}
                maxLength={48}
                returnKeyType='done'
                enablesReturnKeyAutomatically
                onChangeText={name => this.setState({ user: Object.assign({}, this.state.user, { name }) })}
                onSubmitEditing={() => this.updateUser()}
              />
              <TouchableOpacity
                style={styles.row_indicator}
                onPress={() => this.name_ipt.focus()}
              >
                <Image source={require('../../../res/images/profile/icon_edit.png')}/>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TextPingFang style={styles.text_row_left}>ID</TextPingFang>
              <TextPingFang style={styles.text_row_right}>{this.props.user.code}</TextPingFang>
            </View>

            {/* <View style={styles.badge}>
              <TextPingFang style={styles.text_badge_title}>展示徽章</TextPingFang>
              {
                (() => {
                  if (!this.props.user.badges) {
                    return <TextPingFang style={styles.text_badge_content}>你还没有获得任何徽章</TextPingFang>
                  } else {
                    // todo: 缺少获取徽章接口
                  }
                })()
              }
            </View> */}
          </ScrollView>
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
  },
  row: {
    height: getResponsiveWidth(64),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  text_row_left: {
    color: '#000',
    fontSize: 16,
    fontWeight: '300'
  },
  text_row_right: {
    width: 200,
    position: 'absolute',
    left: getResponsiveWidth(40),
    marginLeft: getResponsiveWidth(16),
    color: '#000',
    fontSize: 20,
    fontWeight: '300',
  },
  row_face: {
    width: getResponsiveWidth(48),
    height: getResponsiveWidth(48),
    marginLeft: getResponsiveWidth(16),
    borderRadius: getResponsiveWidth(24)
  },
  row_indicator: {
    position: 'absolute',
    right: 0
  },
  badge: {
    marginTop: getResponsiveWidth(56)
  },
  text_badge_title: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold'
  },
  text_badge_content: {
    marginTop: getResponsiveWidth(16),
    color: '#000',
    fontSize: 16
  }
})
