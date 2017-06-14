import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Dimensions,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import HomeScreen from './HomeScreen';
import LoginPage from './LoginPage';
import HttpUtils from '../util/HttpUtils';
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height
const URL = HOST + "users/check";

export default class WelcomePage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
  	AsyncStorage.getItem('user_info', (error, result) => {
      if (!error) {
        if (result !== '' && result !== null) {
          console.log('查询到的内容是：' + result);
          this.state.user = JSON.parse(result);
          AsyncStorage.getItem('partner_info', (error, result) => {
            this.state.partner = JSON.parse(result)
            if (!error) {
                HttpUtils.post(URL, {
                  token: this.state.user.token,
                  uid: this.state.user.uid,
                  timestamp: this.state.user.timestamp,
                }).then((res)=>{
                  console.log(res)
                  if(res.status == 0) {
                    console.log('User already login')
                    this.props.navigator.push({
                      component: HomeScreen,
                      params: {
                        user: this.state.user,
                        partner: this.state.partner,
                      }
                    })
                  }
                })
            	}
          }) 
        } else {
        	this.props.navigator.push({component:LoginPage});
        }
      } else {
        console.log('查询数据失败');
      }
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../res/images/welcome1.png')} style={styles.logo}></Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:HEIGHT,
    backgroundColor:"white"
  },
  logo: {
  	position: 'absolute',
  	top: 260 / 667 * HEIGHT,
  	left: (WIDTH - 165 / 375 * WIDTH) / 2,
  	width: 165 / 375 * WIDTH,
  	height: 138 / 667 * HEIGHT,
  }
});