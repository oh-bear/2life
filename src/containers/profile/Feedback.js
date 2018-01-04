import React, { Component } from 'react'
import {
  TextInput,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text
} from 'react-native'
import { View } from 'react-native-animatable'

import {
  WIDTH,
  INNERWIDTH,
  HEIGHT
} from '../../common/styles'

import { connect } from 'react-redux'
import { USERS } from '../../network/Urls'
import dismissKeyboard from 'dismissKeyboard'
import HttpUtils from '../../network/HttpUtils'
import CommonNav from '../../components/CommonNav'

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
    const {
      content,
      contact
    } = this.state

    if (!contact.trim()) {
      Alert.alert('小提示', '请输入您的联系方式哦~')
      return
    }
    if (!content.trim()) {
      Alert.alert('小提示', '请输入您的反馈内容哦~')
      return
    }
    HttpUtils.post(URL, {content, contact})
      .then(res => {
        if (res.msg === '请求成功') {
          this.showDialog()
        }
      })
  }

  render() {
    return <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <CommonNav
          title={this.props.title}
          rightButton={
            <TouchableOpacity
              onPress={this.onPost}
              style={styles.rightButton}
            >
              <Text style={styles.rightButton_font}>完成</Text>
            </TouchableOpacity>
          }
        />
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
  rightButton: {
    position: 'absolute',
    right: 0,
    width: 56,
    alignItems: 'center'
  },
  rightButton_font: {
    color: '#73C0FF',
    fontSize: 17,
    fontWeight: '500'
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
