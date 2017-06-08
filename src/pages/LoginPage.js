import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Navigator,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  AsyncStorage
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import TextPingFang from "../common/TextPingFang";
import HomeScreen from './HomeScreen';
import RegisterPage from './RegisterPage';
import HttpUtils from '../util/HttpUtils';
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;
const URL1 = HOST + "users/login";
const URL2 = HOST + "users/user";

export default class LoginPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {
      user_account:"",
      user_password:""
    };
  }
  onSubmit() {
    if (!this.state.user_account.trim()) {
      Alert.alert("小提示","请输入账号哦~");
      return ;
    }
    if (!this.state.user_password.trim()) {
      Alert.alert("小提示","请输入密码哦~");
      return ;
    }
    HttpUtils.post(URL1, {
      user_account: this.state.user_account.trim(),
      user_password: this.state.user_password.trim()
    }).then((response)=>{
      switch(response.status) {
        case 0:
          AsyncStorage.setItem("user_info", JSON.stringify(response.data),(error)=>{
            if (!error) {  
              console.log('response.data.user_other_id:' + response.data.user_other_id)
              let user = response.data;
              let partner = null;
              if (response.data.user_other_id !== -1 && response.data.user_other_id !== -404) {
                HttpUtils.post(URL2, {
                  user_id: response.data.user_other_id
                }).then((res)=>{
                  let partner = res.data;    
                  AsyncStorage.setItem("partner_info", JSON.stringify(res.data), (error)=>{
                    console.log(error);
                  })
                  this.props.navigator.push({
                    component: HomeScreen,
                    params: {
                      user: user,
                      partner: partner,
                      timestamp: response.data.timestamp
                    }
                  })
                })
              } else {
                this.props.navigator.push({
                    component: HomeScreen,
                    params: {
                      user: user,
                      partner: partner,
                      timestamp: response.data.timestamp
                    }
                  })
              }
              
            } else {
              console.log(error);
            }
          });
          break
        default:
          Alert.alert("小提示","用户名或密码错误！");
          break
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
  render() {
    return (
      <View style={styles.container}>
      <Image style={styles.bg} source={require("../../res/images/welcome_bg.png")}>
        <Image style={styles.logo} source={require("../../res/images/ilo.png")}/>
        <View style={styles.text}>
          <TextPingFang style={styles.title}>双生</TextPingFang>
            <TextPingFang style={styles.e_title}>今夕何夕 见此良人</TextPingFang>
        </View>
        <View style={styles.form}>
            <TextInput 
              placeholder={"请输入您的手机号"}
              placeholderTextColor={"white"}
              style={styles.textinput}
              onChangeText={(text)=>{
                this.setState({user_account:text})
              }}
              />
            <TextInput 
              placeholder={"请输入密码"}
              placeholderTextColor={"white"}
              style={styles.textinput}
              password={true}
              onChangeText={(text)=>{
                this.setState({user_password:text})
              }}
                />
            <Text style={styles.remind}>很高兴 遇见你 ：）</Text>
            
          </View>
        <TouchableOpacity 
          style={styles.online_login}
          onPress={()=>{
            this.onSubmit();
          }}>
          <Text 
            style={styles.online_font}>
            登录
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.online_register}
          onPress={()=>{
            this.props.navigator.resetTo({
              component: RegisterPage
            })
          }}>
          <Text 
            style={styles.online_font}>
            注册
          </Text>
        </TouchableOpacity>
      </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:"#73C0FF",
    width:WIDTH,
    height:HEIGHT,
    alignItems:"center",
  },
  bg: {
    alignItems:"center",
    width:WIDTH,
    height:HEIGHT
  },
  logo: {
    marginTop:60*HEIGHT/667,
    height: HEIGHT/667 * 67,
  },
  text: {
    alignItems:"center",
  },
  title:{
    backgroundColor:"rgba(0,0,0,0)",
    color:"white",
    fontSize:20,
    fontWeight:"600",
    height:33/667*HEIGHT,
    marginTop:HEIGHT*0.0419
  },
  e_title: {
    backgroundColor:"rgba(0,0,0,0)",
    fontSize:12,
    color:"white"
  },
  form:{
    marginTop:HEIGHT*0.0479,
    alignItems:"center",
    justifyContent:"center",
    // width:240
  },
  textinput: {
    height:44/667*HEIGHT,
    width:240/375*WIDTH,
    color:"white",
    backgroundColor:"rgb(139,203,255)",
    borderRadius:22/667*HEIGHT,
    marginBottom:14/667*HEIGHT,
    fontSize:14,
    alignItems:"center",
    justifyContent:"center",
    paddingLeft:10/375*WIDTH,
    flexDirection:"row"
  },
  remind: {
    fontSize:10,
    color:"white",
    marginTop:HEIGHT*0.037,
    backgroundColor:"rgba(0,0,0,0)"
  },
  online_login:{
    position:"absolute",
    bottom:HEIGHT*0.165,
    backgroundColor:"white",
    alignItems:"center",
    justifyContent:"center",
    width:150/375*WIDTH,
    height:44/667*HEIGHT,
    borderRadius:22/667*HEIGHT
  },
  online_register:{
    position:"absolute",
    bottom:HEIGHT*0.075,
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