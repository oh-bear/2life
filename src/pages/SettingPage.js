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
import RightButtonNav from '../common/RightButtonNav';
import TextPingFang from '../common/TextPingFang';
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;

export default class SettingPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {
      name: 'Airing',
      sex: '男'
    };
  }
  onPost() {

  }
  changeName() {
    AlertIOS.prompt('请输入新的昵称','',[
      {text:'取消'},
      {text:'确定'}],
      (name)=>{this.setState({name: name})});
  }
  changeSex() {
    Alert.alert('是否更改性别？','',[
      {text:'取消', onPress:this.userCanceled},
      {text:'确定', onPress:(sex)=>{
        this.state.sex == '女'? this.setState({sex: '男'}):this.setState({sex: '女'})
      }}])
  }
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.bg} source={require("../../res/images/about_bg.png")}>
          <RightButtonNav 
            title={"设置"} 
            navigator={this.props.navigator} 
            rightOnPress={()=>{
              this.onPost();
            }}
          />
          <Image style={styles.avatar_round} source={require("../../res/images/avatar_round.png")}>
            <Image style={styles.avatar} source={require("../../res/images/avatar.png")} />
          </Image>
          <TextPingFang style={styles.avatar_font}>071515</TextPingFang>
        </Image>
        <TouchableOpacity 
          style={styles.online_name}
          onPress={()=>{
            this.changeName();
          }}>
          <Text 
            style={styles.online_font}>
            {this.state.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.online_sex}
          onPress={()=>{
            this.changeSex();
          }}>
          <Text 
            style={styles.online_font}>
            {this.state.sex}
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
    marginTop:48
  },
  avatar: {
  },
  avatar_font:{
    color:"#666666",
    fontSize:17,
    backgroundColor:"rgba(0,0,0,0)",
    marginTop:15,
    fontWeight:"600"
  },
  online_name:{
    marginTop: 52,
    backgroundColor:"white",
    alignItems:"center",
    justifyContent:"center",
    width:150/375*WIDTH,
    height:44/667*HEIGHT,
    borderRadius:22/667*HEIGHT
  },
  online_sex:{
    marginTop:20,
    backgroundColor:"white",
    alignItems:"center",
    justifyContent:"center",
    width:150/375*WIDTH,
    height:44/667*HEIGHT,
    borderRadius:22/667*HEIGHT
  },
  online_font: {
    fontSize:14
  }
});