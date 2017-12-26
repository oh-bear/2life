import React, {Component} from 'react'
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  AlertIOS,
  Alert
} from 'react-native'
import {View, Text} from 'react-native-animatable'

import RightButtonNav from '../components/RightButtonNav'
import TextPingFang from '../components/TextPingFang'
import {HOST, QINIU_UPHOST} from '../util/config'
import HttpUtils from '../util/HttpUtils'
import Platform from 'Platform'
import AlertBox from '../components/AlertBox'

import ImageCropPicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'

import Image from 'react-native-image-progress'
import * as Progress from 'react-native-progress'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const URL1 = HOST + 'users/update'
const URL2 = HOST + 'users/close_connect'
const URL_TOKEN = HOST + 'util/qiniu_token'

export default class SettingPage extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      user_sex: this.props.user.user_sex,
      user_name: this.props.user.user_name,
      user_state: this.props.user.user_other_id,
      isDialogVisible: false,
      isInputVisible: false,
      data: {},
      file: {},
      upload: 0,
      user_face: this.props.user.user_face
    }
  }

  showInput() {
    this.setState({isInputVisible: true})
  }

  hideInput() {
    this.setState({isInputVisible: false})
  }

  onPost() {
    let user_face = this.state.user_face
    if (this.state.upload !== 0) {
      user_face = 'https://airing.ursb.me/' + this.state.file.name + '-avatar.jpg'
    }
    HttpUtils.post(URL1, {
      uid: this.props.user.uid,
      timestamp: this.props.user.timestamp,
      token: this.props.user.token,
      user_name: this.state.user_name,
      user_sex: this.state.user_sex,
      user_face: user_face,
    }).then((res) => {
      if (res.status === 0) {
        this.showDialog()
        this.setState({
          data: {
            user_name: this.state.user_name,
            user_sex: this.state.user_sex,
            user_other_id: this.state.user_state,
            user_face: user_face
          }
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  resizeFile(file, complete) {
    if (!file.name) {
      Alert.alert('小提示', '图片没有名称哦~')
      return
    }
    if (!file.uri) {
      Alert.alert('小提示', '图片没有内容哦~')
      return
    }

    ImageResizer.createResizedImage(file.uri, file.width, file.height, 'JPEG', 80)
      .then((resizedImageUri) => {
        file.resizedUri = resizedImageUri
        complete(file)
      })
      .catch((err) => {
        Alert.alert('小提示', '压缩图片失败哦~')
      })
  }

  uploadFile(file, complete) {
    if (!file.name) {
      Alert.alert('小提示', '图片没有名称哦~')
      return
    }
    if (!file.uri) {
      Alert.alert('小提示', '图片没有内容哦~')
      return
    }

    HttpUtils.post(URL_TOKEN, {
      token: this.props.user.token,
      uid: this.props.user.uid,
      timestamp: this.props.timestamp,
      filename: file.name//'image/twolife/' + this.state.file.name,
    }).then((response) => {
      if (response.status === 0) {
        file.token = response.qiniu_token

        let formData = new FormData()
        formData.append('file', {uri: file.resizedUri, type: 'application/octet-stream', name: file.name})
        formData.append('key', file.name)
        formData.append('token', file.token)

        return fetch(QINIU_UPHOST, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/octet-stream'
          },
          body: formData
        })
          .then((response) => {
            this.state.upload = 1
            complete()
          }).catch((error) => {
            Alert.alert('小提示', '网络故障:(')
          })
      }
    }).catch((error) => {
      Alert.alert('小提示', '网络故障:(')
    })
  }

  changeName() {
    if (Platform.OS === 'ios') {
      AlertIOS.prompt('请输入新的昵称', '',
        [
          {text: '取消', onPress: this.userCanceled},
          {
            text: '确定',
            onPress: (name) => {
              this.setState({user_name: name})
            }
          }
        ])
    } else {
      Alert.alert('小提醒', '对不起，安卓用户暂时不支持更改昵称。。')
    }
  }

  showDialog() {
    this.setState({isDialogVisible: true})
  }

  hideDialog() {
    this.setState({isDialogVisible: false})
  }

  changeSex() {
    Alert.alert('是否更改性别？', '', [
      {text: '取消', onPress: this.userCanceled},
      {
        text: '确定',
        onPress: () => {
          this.state.user_sex === 1 ? this.setState({user_sex: 0}) : this.setState({user_sex: 1})
        }
      }])
  }

  changeConnectState() {
    Alert.alert('是否关闭匹配功能？如果关闭，任何人都将无法再匹配到您，并会断绝现有契约。', '', [
      {text: '取消', onPress: this.userCanceled},
      {
        text: '确定',
        onPress: (user_state) => {
          if (this.state.user_state !== -404) {
            HttpUtils.post(URL2, {
              uid: this.props.user.uid,
              token: this.props.user.token,
              timestamp: this.props.user.timestamp,
              user_other_id: this.state.user_state
            }).then((res) => {
              if (res.status === 0) {
                this.setState({user_state: -404})
                Alert.alert('小提醒', '您已成功关闭了匹配功能')
                let data = {
                  user_name: this.state.user_name,
                  user_sex: this.state.user_sex,
                  user_other_id: this.state.user_state
                }
                this.props.onCallBack(data)
              } else {
                Alert.alert('小提醒', '网络故障QAQ')
              }
            })
          } else {
            Alert.alert('小提醒', '您已成功开启了匹配功能，快去寻找另一半吧！')
            this.setState({user_state: -1})
            let data = {
              user_name: this.state.user_name,
              user_sex: this.state.user_sex,
              user_other_id: this.state.user_state
            }
            this.props.onCallBack(data)
          }
        }
      }])
  }

  render() {
    let options = {
      title: '选择头像',
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    let avatar = null
    if (this.state.file.uri) {
      avatar = <Image
        style={styles.avatar}
        source={{uri: this.state.file.uri}}
        indicator={Progress.Circle}
        indicatorProps={{indeterminate: true, progress: 0.5}}/>
    } else {
      avatar = <Image style={styles.avatar} source={{uri: this.props.user.user_face}} indicator={Progress.Circle}/>
    }

    return (
      <View style={styles.container}>
        <AlertBox
          _dialogVisible={this.state.isDialogVisible}
          _dialogRightBtnAction={() => {
            this.props.onCallBack(this.state.data)
            this.props.navigator.pop()
          }}
          _dialogContent={'个人信息更改成功'}
        />

        <Image
          style={styles.bg}
          source={this.state.user_sex === 0 ? require('../../res/images/about_bg.png') : require('../../res/images/about_bg1.png')}>
          <RightButtonNav
            title={'设置'}
            navigator={this.props.navigator}
            rightOnPress={() => {
              this.onPost()
            }}
          />

          <TouchableOpacity
            onPress={() => {
              ImageCropPicker.openPicker({
                width: 400,
                height: 400,
                cropping: true
              }).then(response => {
                console.log(response)
                let file = {
                  uri: response.path,
                  height: response.height,
                  width: response.width,
                  name: 'image/twolife/' + this.props.user.uid + '/' + response.path.substr(response.path.length - 12)
                }
                console.log(file)
                this.setState({
                  file: file
                })

                if (this.state.file.uri) {
                  this.resizeFile(this.state.file, () => {
                    this.uploadFile(this.state.file, () => {
                      console.log('uploadFile success')
                    })
                  })
                }

              })
            }}>
            <Image
              style={styles.avatar_round}
              source={require('../../res/images/avatar_round.png')}>
              {avatar}
            </Image>
          </TouchableOpacity>

          <TextPingFang style={styles.avatar_font}>{this.props.user.user_code}</TextPingFang>
        </Image>
        <TouchableOpacity
          onPress={() => {
            this.changeName()
          }}>
          <View style={styles.online_name} delay={100} animation='bounceInRight'>
            <Text
              style={styles.online_font}>
              {this.state.user_name}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.changeSex()
          }}>
          <View style={styles.online_sex} delay={150} animation='bounceInRight'>
            <Text
              style={styles.online_font}>
              {this.state.user_sex === 0 ? '男' : '女'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.changeConnectState()
          }}>
          <View style={styles.online_state} delay={200} animation='bounceInRight'>
            <Text
              style={styles.online_font}>
              {this.state.user_state === -404 ? '拒绝任何匹配' : '开放匹配'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: 'rgb(242,246,250)'
  },
  bg: {
    width: WIDTH,
    alignItems: 'center',
  },
  opacity0: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  avatar_round: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48
  },
  avatar: {
    width: 55 / 375 * WIDTH,
    height: 55 / 667 * HEIGHT,
    borderRadius: 27.5 / 667 * HEIGHT
  },
  avatar_font: {
    color: '#666666',
    fontSize: 17,
    backgroundColor: 'rgba(0,0,0,0)',
    marginTop: 15,
    fontWeight: '600'
  },
  online_name: {
    marginTop: 52,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_sex: {
    marginTop: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_state: {
    marginTop: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_font: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  }
})
