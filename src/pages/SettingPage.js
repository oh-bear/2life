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
  Alert,
  AsyncStorage
} from 'react-native';
import CommonNav from '../common/CommonNav';
import RightButtonNav from '../common/RightButtonNav';
import TextPingFang from '../common/TextPingFang';
import {HOST} from '../util/config';
import HttpUtils from '../util/HttpUtils';
import Platform from 'Platform';
import AlertBox from '../common/AlertBox';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;
const URL1 = HOST + 'users/update';
const URL2 = HOST + 'users/close_connect';

export default class SettingPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {
      user_sex: this.props.user.user_sex,
      user_name: this.props.user.user_name,
      user_state: this.props.user.user_other_id,
      isDialogVisible: false,
      data: {}
    };
  }
  onPost() {
    HttpUtils.post(URL1, {
      uid: this.props.user.uid,
      timestamp: this.props.user.timestamp,
      token: this.props.user.token,
      user_name: this.state.user_name,
      user_sex: this.state.user_sex,
      user_other_id: this.user_state
    }).then((res)=> {
      if (res.status == 0) {
        this.showDialog()
        this.setState({
          data: {
            user_name: this.state.user_name,
            user_sex: this.state.user_sex,
            user_other_id: this.state.user_state
          }
        })
      }      
    }).catch((error)=> {
      console.log(error);
    })
  }
  changeName() {
    if(Platform.OS === 'ios'){
      AlertIOS.prompt('请输入新的昵称','',[
        {text:'取消', onPress:this.userCanceled},
        {text:'确定', onPress:(name)=>{this.setState({user_name: name})}}
      ]);
    } else {
      Alert.alert('小提醒', '对不起，安卓用户暂时不支持更改昵称。。');
    }
  }

  showDialog(){
    this.setState({isDialogVisible:true});
  }

  hideDialog(){
    this.setState({isDialogVisible:false});
  }
  changeSex() {
    Alert.alert('是否更改性别？','',[
      {text:'取消', onPress:this.userCanceled},
      {text:'确定', onPress:(sex)=>{
        this.state.user_sex == 1? this.setState({user_sex: 0}):this.setState({user_sex: 1})
      }}])
  }
  changeConnectState() {
    Alert.alert('是否关闭匹配功能？如果关闭，任何人都将无法再匹配到您，并会断绝现有契约。','',[
      {text:'取消', onPress:this.userCanceled},
      {text:'确定', onPress:(user_state)=>{
        if(this.state.user_state !== -404) {
          HttpUtils.post(URL2, {
            uid: this.props.user.uid,
            token: this.props.user.token,
            timestamp: this.props.user.timestamp,
            user_other_id: this.state.user_state
          }).then((res)=>{
            if (res.status == 0) {
              this.setState({user_state: -404});
              Alert.alert('小提醒', '您已成功关闭了匹配功能');
              let data = {
                user_name: this.state.user_name,
                user_sex: this.state.user_sex,
                user_other_id: this.state.user_state
              }
              this.props.onCallBack(data);
            } else {
              Alert.alert('小提醒', '网络故障QAQ');
            }
          })
        } else {
          Alert.alert('小提醒', '您已成功开启了匹配功能，快去寻找另一半吧！');
          this.setState({user_state: -1})
          let data = {
            user_name: this.state.user_name,
            user_sex: this.state.user_sex,
            user_other_id: this.state.user_state
          }
          this.props.onCallBack(data);
        }
      }}])
  }
  render() {
    return (
      <View style={styles.container}>
        <AlertBox
          _dialogVisible={this.state.isDialogVisible}
          _dialogLeftBtnAction={()=> {
            AsyncStorage.setItem('user_info', JSON.stringify(this.state.data), (error, result)=>{
              if (!error) {
                console.log(JSON.stringify(this.state.data));
                this.props.onCallBack(this.state.data);
                this.props.navigator.pop();
              }
            })
          }}
          _dialogRightBtnAction={()=>{this.hideDialog()}}
          _dialogContent={'个人信息更改成功'}
          />
        <Image 
          style={styles.bg} 
          source={this.state.user_sex==0?require("../../res/images/about_bg.png"):require("../../res/images/about_bg1.png")}>
          <RightButtonNav 
            title={"设置"}
            navigator={this.props.navigator} 
            rightOnPress={()=>{
              this.onPost();
            }}
          />
          <Image 
            style={styles.avatar_round} 
            source={require("../../res/images/avatar_round.png")}>
            <Image 
              style={styles.avatar} 
              source={this.state.user_sex==0?require("../../res/images/avatar.png"):require("../../res/images/avatar2.png")} />
          </Image>
          <TextPingFang style={styles.avatar_font}>{this.props.user.user_code}</TextPingFang>
        </Image>
        <TouchableOpacity 
          style={styles.online_name}
          onPress={()=>{
            this.changeName();
          }}>
          <Text 
            style={styles.online_font}>
            {this.state.user_name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.online_sex}
          onPress={()=>{
            this.changeSex();
          }}>
          <Text 
            style={styles.online_font}>
            {this.state.user_sex==0?'男':'女'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.online_state}
          onPress={()=>{
            this.changeConnectState();
          }}>
          <Text 
            style={styles.online_font}>
            {this.state.user_state==-404?'拒绝任何匹配':'开放匹配'}
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
  opacity0:{
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
    color:"#666666",
    fontSize:17,
    backgroundColor:"rgba(0,0,0,0)",
    marginTop:15,
    fontWeight:"600"
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
  online_sex:{
    marginTop: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_state:{
    marginTop: 20,
    backgroundColor: "white",
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
  }
});