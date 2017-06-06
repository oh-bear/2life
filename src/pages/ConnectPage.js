import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Dimensions,
  TouchableOpacity,
  AlertIOS,
  Alert
} from 'react-native';
import CommonNav from '../common/CommonNav';
import TextPingFang from '../common/TextPingFang';
import {HOST} from '../util/config';
import HttpUtils from '../util/HttpUtils';
import LoginPage from './LoginPage';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const URL1 = HOST + 'users/connect';
const URL2 = HOST + 'users/connect_by_id';

export default class ConnectPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  connectByRandom() {
    HttpUtils.post(URL1, {
      uid: this.props.user.uid,
      token: this.props.user.token,
      timestamp: this.props.user.timestamp,
      sex: this.props.user.user_sex
    }).then((res)=>{
      if (res.status == 0) {
        Alert.alert('小提醒', '匹配成功啦！重新登录之后就可以看见TA啦~');
        this.props.navigator.push({
          component: LoginPage,
        })
      }
    }).catch((error)=> {
      console.log(error);
    })
  }
  connectById() {
    AlertIOS.prompt('请输入另一半的ID号','',[
      {text:'取消'},
      {text:'确定'}],
      (code)=>{
        HttpUtils.post(URL2, {
          uid: this.props.user.uid,
          token: this.props.user.token,
          timestamp: this.props.user.timestamp,
          sex: this.props.user.user_sex,
          code: code
        }).then((res)=>{
          Alert.alert('小提醒', '匹配成功啦！重新登录之后就可以看见TA啦~');
          this.props.navigator.push({
            component: LoginPage,
          })
        }).catch((error)=> {
          console.log(error);
        })
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <CommonNav title={this.props.title} 
          navigator={this.props.navigator} navStyle={styles.opacity0} navBarStyle={styles.opacity0}/>
        <Image style={styles.title_image} source={require('../../res/images/bad.png')} />
        <Text style={styles.title}>"Oh - Uh"</Text>
        <TextPingFang style={styles.e_title}>快点匹配自己的另一半吧~</TextPingFang>
        <TouchableOpacity
          style={styles.online_login}
          onPress={()=>{
            this.connectByRandom();
          }}>
          <Text
            style={styles.online_font}>
            随机匹配
          </Text>
        </TouchableOpacity>
        {/*<TouchableOpacity 
          style={styles.online_register}
          onPress={()=>{
            this.connectById();
          }}>
          <Text 
            style={styles.online_font}>
            定点匹配
          </Text>
        </TouchableOpacity>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:WIDTH,
    height:HEIGHT,
    alignItems:"center",
    backgroundColor:"rgb(242,246,250)"
  },
  opacity0:{
    backgroundColor:"rgba(0,0,0,0)"
  },
  online_login:{
    marginTop: 50,
    backgroundColor:"#73C0FF",
    alignItems:"center",
    justifyContent:"center",
    width:150/375*WIDTH,
    height:44/667*HEIGHT,
    borderRadius:22/667*HEIGHT
  },
  online_register:{
    margin: 20,
    backgroundColor:"#73C0FF",
    alignItems:"center",
    justifyContent:"center",
    width:150/375*WIDTH,
    height:44/667*HEIGHT,
    borderRadius:22/667*HEIGHT
  },
  online_font: {
    fontSize:14,
    color: 'white',
  },
  title_image: {
    margin: 20
  },
  title: {
    margin: 10,
    color: '#1B1B1B',
    fontSize: 20
  },
  e_title: {
    margin: 5,
    color: '#777777',
    fontSize: 12,
  }
});