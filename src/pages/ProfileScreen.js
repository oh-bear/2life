import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Navigator,
  TouchableOpacity,
  Image,
  Dimensions,
  AsyncStorage,
  Alert
} from 'react-native';
import TextPingFang from "../common/TextPingFang";
import CreateNotePage from './CreateNotePage';
import SettingPage from './SettingPage';
import FeedBackPage from './FeedBackPage';
import ConnectPage from './ConnectPage';
import PartnerPage from './PartnerPage';
import LoginPage from './LoginPage';
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width
const INNERWIDTH = WIDTH - 16
const HEIGHT = Dimensions.get("window").height

export default class ProfileScreen extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      partner: this.props.partner
    };
  }
  onAboutUs() {
    this.props.navigator.push({
      component:TextPingFang
    })
  }
  onJump(page,params) {
    this.props.navigator.push({
      component:page,
      params:params
    })
  }
  logout() {
    this.props.navigator.push({
      component: LoginPage,
    })
  }
  componentDidMount() {
    console.log('props.user:' + this.props.user)
    console.log('props.partner:' + this.props.partner)
    console.log('state.user.user_other_id:' + this.state.user.user_other_id)
    console.log('state.partner:' + this.state.partner)
  }

  render() {
    let booklist = require("../../res/images/icon_booklist.png");
    let history = require("../../res/images/icon_history.png");
    let setting = require("../../res/images/icon_setting.png");
    let feedback = require("../../res/images/icon_feedback.png");
    let aboutus = require("../../res/images/icon_aboutus.png");
    let images = [booklist,aboutus,setting,feedback,images];
    let texts = ["创建日记","匹配","设置","意见反馈"];
    let male_pic = require("../../res/images/avatar.png");
    let fm_pic = require("../../res/images/avatar2.png");
    let LinkImage, PartnerView = null;
    if (this.state.user.user_other_id !== -1 && this.state.user.user_other_id !== -404) {
      LinkImage = 
          <Image style={styles.link} source={require("../../res/images/link1.png")}/>
      PartnerView = 
          <View style={styles.avatar_content}>
            <Image style={styles.avatar_round} source={require("../../res/images/avatar_round.png")}>
              <Image source={this.state.partner.user_sex==1?fm_pic:male_pic}/>
            </Image>
            <TextPingFang style={styles.avatar_font}>{this.state.partner.user_name}</TextPingFang>
          </View>
    }

    return <View style={styles.container}>
      <View style={styles.info_container}>
        <Image style={styles.avatar} source={require("../../res/images/avatar_bg.png")}>
          <View style={styles.avatar_container}>
            <View style={styles.avatar_content}>
              <Image style={styles.avatar_round} source={require("../../res/images/avatar_round.png")}>
                <Image source={this.state.user.user_sex==1?fm_pic:male_pic}/>
              </Image>
              <TextPingFang style={styles.avatar_font}>{this.state.user.user_name}</TextPingFang>
            </View>
            {LinkImage}
            {PartnerView}
          </View>
        </Image>
      </View>
      <View style={styles.items1}>
          {
            texts.map((d,i)=>{
              if(i>=4) return 
              return <TouchableOpacity 
                    key={i}
                    onPress={
                      ()=>{
                        let text = d
                        switch(text) {
                          case "创建日记":
                            this.onJump(CreateNotePage,{
                              title:"创建日记",
                              user: this.state.user
                            });
                            break;
                            case "匹配":
                              if (this.state.user.user_other_id == -1) {
                                this.onJump(ConnectPage,{
                                  title: "匹配",
                                  user: this.state.user,
                                  onCallBack: (data)=>{
                                    this.state.user.user_other_id = data.user_other_id;
                                    this.state.partner = data.partner;
                                  }
                                })
                              } else if (this.state.user.user_other_id !== -1 && this.state.user.user_other_id !== -404) {
                                this.onJump(PartnerPage,{
                                  title: "TA",
                                  partner: this.state.partner,
                                  user: this.state.user,
                                  onCallBack: (data)=>{
                                    this.state.user.user_other_id = data.user_other_id;
                                    this.state.partner = data.partner;
                                  }
                                })
                              } else if (this.state.user.user_other_id == -404) {
                                Alert.alert('小提醒', '您已关闭匹配功能，无法进行匹配！')
                              }
                              break;
                            case "设置":
                              this.onJump(SettingPage,{
                                title: "设置",
                                user: this.state.user,
                                onCallBack: (data)=>{
                                  this.state.user.user_name = data.user_name;
                                  this.state.user.user_sex = data.user_sex;
                                  this.state.user.user_other_id = data.user_other_id;
                                }
                              })
                              break;
                            case "意见反馈":
                              this.onJump(FeedBackPage,{
                                title:"意见反馈",
                                user: this.state.user,
                              })
                              break
                        }
                      }
                    }
                  style={styles.item}>
                    <Image source={images[i]}/>
                    <TextPingFang style={styles.item_font}>{d}</TextPingFang>
                <Image style={styles.item_arrow} source={require("../../res/images/right_arrow.png")}/>
            </TouchableOpacity>
            })
          }
      </View>
      <TouchableOpacity 
          style={styles.online_delete}
          onPress={()=>{
            this.logout()
          }}
          >
          <Text 
            style={styles.online_font}>
            退出登录
          </Text>
        </TouchableOpacity>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    height:HEIGHT,
    alignItems:"center"
  },
  info_container:{
    alignItems:"center",
    width:INNERWIDTH
  },
  avatar: {
    justifyContent:"center",
    alignItems:"center",
    marginTop:52,
    width:INNERWIDTH
  },
  avatar_round: {
    justifyContent:"center",
    alignItems:"center",
  },
  item: {
    width:WIDTH-30/375*WIDTH,
    flexDirection:"row",
    marginLeft:30/375*WIDTH,
    alignItems:"center",
    height:56/667*HEIGHT,
  },
  item_font: {
    fontSize:14,
    fontWeight:"500",
    color:"#666666",
    marginLeft:16,
  },
  item_arrow: {
    position:"absolute",
    right:30/375*WIDTH
  },
  items1: {
    marginTop:24
  },
  items2: {
    marginTop:40
  },
  avatar_font:{
    color:"#666666",
    fontSize:17,
    backgroundColor:"rgba(0,0,0,0)",
    marginTop:15,
    fontWeight:"600"
  },
  avatar_container: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
  },
  avatar_content: {
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginLeft: 20,
    marginRight: 20,
  },
  online_delete: {
    position: "absolute",
    bottom: HEIGHT * 0.105,
    backgroundColor: "#FF3542",
    alignItems: "center",
    justifyContent: "center",
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_font: {
    fontSize: 14,
    color: 'white'
  },
})