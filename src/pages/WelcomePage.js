import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  AsyncStorage,
  PushNotificationIOS
} from 'react-native'
import HomeScreen from './HomeScreen'
import LoginPage from './LoginPage'
import HttpUtils from '../util/HttpUtils'
import {HOST} from '../util/config'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const URL = HOST + 'users/check'

export default class WelcomePage extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  _checkPermissions() {
    PushNotificationIOS.checkPermissions((permissions) => {
      if (!permissions.alert) {
        PushNotificationIOS.requestPermissions()
      }
    })
  }

  _sendLocalNotification() {
    AsyncStorage.setItem('notifi_registered', 'true', (error) => {
      let notification = {
        fireDate: new Date(1970, 1, 1, 20, 0, 0).getTime(),
        alertBody: '今天你遇到了什么？记得来双生里记录一下哦~',
        userInfo: {},
        applicationIconBadgeNumber: 1,
        repeatInterval: 'day'
      }
      PushNotificationIOS.scheduleLocalNotification(notification)
    })
  }

  componentDidMount() {
    this._checkPermissions()
    AsyncStorage.getItem('notifi_registered', (error, result) => {
      if (!error) {
        if (result === '' || result === null || result !== 'true') {
          this._sendLocalNotification()
        }
      } else {
        console.log('查询数据失败')
      }
    })
  }

  componentWillMount() {
    AsyncStorage.getItem('user_info',
      (error, result) => {
        if (!error) {
          if (result !== '' && result !== null) {
            console.log('查询到的内容是：' + result)
            this.state.user = JSON.parse(result)
            AsyncStorage.getItem('partner_info', (error, result) => {
              this.state.partner = JSON.parse(result)
              if (!error) {
                HttpUtils.post(URL, {
                  token: this.state.user.token,
                  uid: this.state.user.uid,
                  timestamp: this.state.user.timestamp,
                }).then((res) => {
                  if (res.status === 0) {
                    console.log('User already login')
                    this.props.navigator.push({
                      component: HomeScreen,
                      params: {
                        user: this.state.user,
                        partner: this.state.partner,
                      }
                    })
                  } else {
                    this.props.navigator.push({component: LoginPage})
                  }
                }).then(result => {
                  resolve(result)
                }).catch(error => {
                  reject(error)
                  this.props.navigator.push({component: LoginPage})
                })
              }
            })
          } else {
            this.props.navigator.push({component: LoginPage})
          }
        } else {
          this.props.navigator.push({component: LoginPage})
        }
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../res/images/welcome1.png')} style={styles.logo}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    backgroundColor: 'white'
  },
  logo: {
    position: 'absolute',
    top: 260 / 667 * HEIGHT,
    left: (WIDTH - 165 / 375 * WIDTH) / 2,
    width: 165 / 375 * WIDTH,
    height: 138 / 667 * HEIGHT,
  }
})
