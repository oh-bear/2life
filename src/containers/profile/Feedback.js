import React, { Component } from 'react'
import {
  TextInput,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback
} from 'react-native'
import { View } from 'react-native-animatable'

import {
  WIDTH,
  INNERWIDTH,
  HEIGHT
} from '../../common/styles'

import { Actions } from 'react-native-router-flux'
import * as scenes from '../../constants/scene'
import { connect } from 'react-redux'
import { USERS } from '../../network/Urls'
import dismissKeyboard from 'dismissKeyboard'
import HttpUtils from '../../network/HttpUtils'
import NavigationBar from '../../components/NavigationBar'

const URL = USERS.feedback

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

@connect(mapStateToProps)
export default class Feedback extends Component {

  state = {
    contact: '',
    content: ''
  }

  onPost() {
    if (!this.state.contact.trim()) {
      Alert.alert('小提示', '请输入您的联系方式哦~')
      return
    }
    if (!this.state.content.trim()) {
      Alert.alert('小提示', '请输入您的反馈内容哦~')
      return
    }
    HttpUtils.post(URL, {
      content: this.state.content,
      contact: this.state.contact,
    }).then(res => {
      if (res.msg === '请求成功') {
        this.showDialog()
      }
    })
  }

  render() {
    return <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TextInput
          underlineColorAndroid='transparent'
          placeholder={'请输入您的邮箱或者电话'}
          placeholderTextColor={'#999999'}
          style={styles.textInput_title}
          onChangeText={(text) => {
            this.setState({contact: text})
          }}
        />
        <TextInput
          underlineColorAndroid='transparent'
          placeholder={'描述一下你的体验或者建议吧～'}
          placeholderTextColor={'#999999'}
          multiline={true}
          style={[styles.textInput_title, styles.textInput_content]}
          onChangeText={(text) => {
            this.setState({content: text})
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(242,246,250)',
    width: WIDTH,
    height: HEIGHT
  },
  textInput_title: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    width: INNERWIDTH,
    height: 48,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 8,
    marginLeft: 8,
    paddingLeft: 16,
    borderRadius: 8,
  },
  textInput_content: {
    height: 270
  }
})
