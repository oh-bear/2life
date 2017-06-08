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
import LoginPage from './LoginPage';
import TextPingFang from '../common/TextPingFang';
import HttpUtils from '../util/HttpUtils';
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;
const URL = HOST + 'users/disconnect';

export default class Partner extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {
      name: 'Airing',
      sex: '男'
    };
  }
  disconnect() {
    Alert.alert('您确定要与 TA 断绝关系吗？','',[
      {text:'取消', onPress:this.userCanceled},
      {text:'确定', onPress:()=>{
        HttpUtils.post(URL, {
          uid: this.props.user.uid,
          token: this.props.user.token,
          timestamp: this.props.user.timestamp,
          user_id: this.props.user.user_other_id
        }).then((res)=> {
          if (res.status == 0) {
            Alert.alert('小提醒', '你们已经成功断绝了关系QAQ');
            let data = {
              user_other_id: -1,
              partner: null
            }
            this.props.onCallBack(data);
            this.props.navigator.pop();
          }
        }).catch((error)=> {
          console.log(error);
        })
      }}])
  }
  render() {
    let female_pic = require("../../res/images/avatar2.png");
    let male_pic = require("../../res/images/avatar.png");
    let male_bg = require("../../res/images/about_bg.png");
    let female_bg = require("../../res/images/about_bg1.png");
    return (
      <View style={styles.container}>
        <Image style={styles.bg} source={this.props.partner.user_sex==1?female_bg:male_bg}>
          <CommonNav 
            title={"TA"} 
            navigator={this.props.navigator} 
          />
          <Image style={styles.avatar_round} source={require("../../res/images/avatar_round.png")}>
            <Image style={styles.avatar} source={this.props.partner.user_sex==1?female_pic:male_pic} />
          </Image>
          <TextPingFang style={styles.avatar_font}>{this.props.partner.user_code}</TextPingFang>
        </Image>
        <TouchableOpacity 
          style={styles.online_name}
          >
          <Text 
            style={styles.online_font}>
            {this.props.partner.user_name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.online_delete}
          onPress={()=>{
            this.disconnect()
          }}
          >
          <Text 
            style={styles.online_font2}>
            解除契约
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: "rgb(242,246,250)"
  },
  bg: {
    width: WIDTH,
    alignItems: 'center',
  },
  opacity0: {
    backgroundColor: "rgba(0,0,0,0)"
  },
  avatar_round: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48
  },
  avatar: {
  },
  avatar_font: {
    color: "#666666",
    fontSize: 17,
    backgroundColor: "rgba(0,0,0,0)",
    marginTop: 15,
    fontWeight: "600"
  },
  online_name: {
    marginTop: 52,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_delete: {
    marginTop: 20,
    backgroundColor: "#FF3542",
    alignItems: "center",
    justifyContent: "center",
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_font: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  online_font2: {
    fontSize: 14,
    color: 'white'
  },
});