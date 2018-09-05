import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import Toast from 'antd-mobile/lib/toast'
import TouchID from 'react-native-touch-id'

import Container from '../components/Container'
import TextPingFang from '../components/TextPingFang'

import Storage from '../common/storage'
import { WIDTH } from '../common/styles';
import { Actions } from 'react-native-router-flux'


export default class AppAuth extends Component {

  state = {
    password: '',
    passwordConfirm: '',
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    gotoApp: false,
    cancelValidate: false,
    pswOnly: false
  }

  async componentDidMount() {
    if (this.props.gotoApp) {
      this.setState({ gotoApp: true })
      DeviceEventEmitter.once('validateId', this._validateId.bind(this))
    }

    if (this.props.cancelValidate)
      this.setState({ cancelValidate: true })
  }

  async _validateId() {
    if (this.state.pswOnly) return

    try {
      const type = await TouchID.isSupported()
      if (type) {
        const isSucceed = await TouchID.authenticate('需要验证')
        if (isSucceed) {
          Actions.pop()
        }
      }
    } catch (err) {
      console.log(err)
      this.setState({ pswOnly: true })
    }
  }

  async _validate(password) {
    const appAuthPsw = await Storage.get('appAuthPsw')
    if (appAuthPsw !== password) {
      Toast.fail('密码错误', 1)
      this.setState({ password: '' })
    } else {
      if (this.state.cancelValidate) {
        this.props.cb()
      }
      Actions.pop()
    }
  }

  async _setPsw(num) {
    let { password, passwordConfirm, gotoApp, cancelValidate } = this.state

    // 设置密码
    if (password.length < 4) {
      password = password.concat(num)
      this.setState({password})

      // 验证密码
      if ((gotoApp || cancelValidate) && password.length === 4) {
        this._validate(password)
      }
      return
    }

    // 再次输入密码
    if (!gotoApp && !cancelValidate && password.length === 4 && passwordConfirm.length < 4) {
      passwordConfirm = passwordConfirm.concat(num)
      this.setState({passwordConfirm})

      if (passwordConfirm.length === 4) {
        if (password === passwordConfirm) {
          await Storage.set('appAuthPsw', password)
          await Storage.set('openAppAuth', true)
          this.props.cb()
          Actions.pop()
        } else {
          this.setState({isDifferent: true})
        }
      }
    }
  }

  _delete() {
    let { password, passwordConfirm } = this.state
    if (password.length && password.length < 4) {
      this.setState({password: password.slice(0, -1)})
    } else {
      this.setState({passwordConfirm: passwordConfirm.slice(0, -1), isDifferent: false})
    }
  }

  render() {
    return (
      <Container>
        <View style={styles.psw_container}>
          <TextInput
            style={styles.psw_item}
            secureTextEntry
            editable={false}
            value={this.state.password.length < 4 ? this.state.password[0] : this.state.passwordConfirm[0]}
          />
          <TextInput
            style={styles.psw_item}
            secureTextEntry
            editable={false}
            value={this.state.password.length < 4 ? this.state.password[1] : this.state.passwordConfirm[1]}
          />
          <TextInput
            style={styles.psw_item}
            secureTextEntry
            editable={false}
            value={this.state.password.length < 4 ? this.state.password[2] : this.state.passwordConfirm[2]}
          />
          <TextInput
            style={styles.psw_item}
            secureTextEntry
            editable={false}
            value={this.state.password.length < 4 ? this.state.password[3] : this.state.passwordConfirm[3]}
          />
        </View>

        <TextPingFang
          style={[
            styles.text_tip,
            {
              color: this.state.isDifferent ? '#f00' : '#000'
            }
          ]}
        >
          {
            (() => {
              if (this.state.gotoApp || this.state.cancelValidate) return '验证密码'
              return this.state.password.length < 4 ? '设置密码' : (this.state.isDifferent ? '密码不一致' : '再次输入密码')
            })()
          }
        </TextPingFang>

        <View style={styles.numbers_container}>
          {
            this.state.numbers.map(num => {
              return (
                <TouchableOpacity
                  key={num}
                  style={styles.num_container}
                  onPress={() => this._setPsw(num)}
                >
                  <TextPingFang style={styles.text_num}>{num}</TextPingFang>
                </TouchableOpacity>
              )
            })
          }
        </View>
        
        <View style={styles.btns_container}>
          <TouchableOpacity style={{display: this.state.gotoApp ? 'none' : 'flex'}} onPress={() => Actions.pop()}>
            <TextPingFang style={styles.text_btn}>取消</TextPingFang>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._delete()}>
            <TextPingFang style={styles.text_btn}>删除</TextPingFang>
          </TouchableOpacity>
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  psw_container: {
    width: WIDTH - 48,
    marginTop: 48,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  psw_item: {
    width: 50,
    textAlign: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#F1F1F1'
  },
  text_tip: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '400'
  },
  numbers_container: {
    width: WIDTH - 95,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  num_container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#f1f1f1',
    marginTop: 24,
  },
  text_num: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500'
  },
  btns_container: {
    width: WIDTH - 48,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  text_btn: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: 36
  }
})
