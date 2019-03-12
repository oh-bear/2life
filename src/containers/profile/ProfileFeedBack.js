import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput
} from 'react-native'
import Toast from 'antd-mobile/lib/toast'
import DeviceInfo from 'react-native-device-info'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'

import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

export default class ProfileFeedBack extends Component {

  state = {
    type: null,
    content: ''
  }

  _setType(type) {

    if (!type && Platform.OS === 'ios') {
      return this.setState({ type: 101 })
    }

    if (!type && Platform.OS === 'android') {
      return this.setState({ type: 102 })
    }

    this.setState({ type })
  }

  _submit() {
    if (!this.state.type) return Toast.info('请先选择反馈类型', 1.5)

    if (!this.state.content) return Toast.info('你什么都没写哦', 1.5)

    if (this.state.isSubmitted) return Toast.info('刚才已经提交反馈了^_^', 1.5)

    this.setState({ isSubmitted: true})

    const brand = DeviceInfo.getBrand() // 设备品牌
    const deviceId = DeviceInfo.getDeviceId() // 设备型号
    const systemVersion = DeviceInfo.getSystemVersion() // 系统版本

    const data = {
      title: this.state.content.slice(0, 15),
      content: this.state.content,
      type: this.state.type,
      brand: brand + ' ' + deviceId,
      systemVersion
    }
    HttpUtils.post(USERS.feedback, data)
    Toast.success('反馈提交成功', 1.5)
  }

  render() {
    return (
      <Container>
        <ScrollView scrollEnabled={false}>
          <ProfileHeader title='反馈'/>

          <View style={styles.btns_container}>
            <TouchableOpacity
              style={[styles.btn, (this.state.type === 101 || this.state.type === 102) ? styles.active_btn : null]}
              onPress={() => this._setType()}
            >
              <TextPingFang style={styles.text_btn}>Bug反馈</TextPingFang>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, this.state.type === 200 ? styles.active_btn : null]}
              onPress={() => this._setType(200)}
            >
              <TextPingFang style={styles.text_btn}>功能需求</TextPingFang>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, this.state.type === 300 ? styles.active_btn : null]}
              onPress={() => this._setType(300)}
            >
              <TextPingFang style={styles.text_btn}>吐槽</TextPingFang>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            onChangeText={content => this.setState({ content })}
            multiline={true}
            placeholder='写下你想告诉我们的吧~'
            underlineColorAndroid='transparent'
            placeholderTextColor='#000'
          />

          <TouchableOpacity
            style={styles.submit_btn}
            onPress={() => this._submit()}
          >
            <TextPingFang style={styles.text_submit_btn}>提交反馈</TextPingFang>
          </TouchableOpacity>
        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  btns_container: {
    flexDirection: 'row',
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
  },
  btn: {
    height: getResponsiveWidth(30),
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: getResponsiveWidth(12),
    paddingRight: getResponsiveWidth(12),
    marginRight: getResponsiveWidth(16),
    borderWidth: getResponsiveWidth(1),
    borderColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(4)
  },
  text_btn: {
    color: '#000',
    fontSize: 16,
    fontWeight: '300'
  },
  active_btn: {
    backgroundColor: '#2DC3A6',
    color: '#fff',
  },
  input: {
    height: getResponsiveWidth(176),
    paddingLeft: getResponsiveWidth(16),
    paddingRight: getResponsiveWidth(16),
    paddingTop: getResponsiveWidth(16),
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24),
    marginTop: getResponsiveWidth(32),
    color: '#000',
    fontSize: 16,
    fontWeight: '300',
    borderWidth: getResponsiveWidth(1),
    borderColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(8),
    textAlignVertical: 'top'
  },
  submit_btn: {
    width: getResponsiveWidth(112),
    height: getResponsiveWidth(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveWidth(50),
    marginLeft: WIDTH - getResponsiveWidth(136),
    backgroundColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(24)
  },
  text_submit_btn: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300'
  }
})
