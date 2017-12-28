import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import {
  WIDTH,
  HEIGHT
} from '../common/styles'
import Storage from '../common/storage'
import {SCENE_INDEX} from '../constants/scene'
import {Actions} from 'react-native-router-flux'
import {USERS} from '../network/Urls'
import {setToken} from '../network/HttpUtils'
import HttpUtils from '../network/HttpUtils'
import store from '../redux/store'
import {fetchProfileSuccess} from '../redux/modules/user'
import initApp from '../redux/modules/init'

const URL = USERS.login

export default class Login extends Component {

  state = {user_account: '', user_password: ''}

  componentDidMount() {
    reLoginInterval = setInterval(async () => {
      const user = await Storage.get('user', {})
      if (!user.user_account || !user.user_password) {
        return
      }

      try {
        onSubmit()
      } catch (e) {
        console.log(e)
      }
    }, 3600 * 1000)
  }

  onSubmit = async () => {

    const {user_account, user_password} = this.state

    HttpUtils.post(URL, {
      user_account,
      user_password
    }).then(res => {
      if (res.code === 0) {
        Storage.set('user', {...this.state})

        const {uid, token, timestamp} = res.data
        setToken({uid, token, timestamp})

        store.dispatch(fetchProfileSuccess(res.data))
        store.dispatch(initApp())

        Actions[SCENE_INDEX]({user: res.data})
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center'
  }
})
