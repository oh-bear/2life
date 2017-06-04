import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Navigator,
  TouchableOpacity,
  Image,
  Dimensions,
  AsyncStorage
} from 'react-native';
import TextPingFang from "../common/TextPingFang";

const WIDTH = Dimensions.get("window").width
const INNERWIDTH = WIDTH - 16
const HEIGHT = Dimensions.get("window").height

export default class ProfileScreen extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  onLists() {
    this.props.navigator.push({
      component:TextPingFang,
      params:{
        lists:lists,
        title:"我的书单",
        user:this.props.user,
        timestamp:this.props.timestamp
      }
    })
  }
  onHistory() {
    this.props.navigator.push({
      component:TextPingFang,
      params:{
        title:"借阅历史"
      }
    })
  }
  onAboutUs() {
    this.props.navigator.push({
      component:TextPingFang
    })
  }
  onJump(page,params){
    this.props.navigator.push({
      component:page,
      params:params
    })
  }
  render() {
    let booklist = require("../../res/images/icon_booklist.png")
    let history = require("../../res/images/icon_history.png")
    let setting = require("../../res/images/icon_setting.png")
    let feedback = require("../../res/images/icon_feedback.png")
    let aboutus = require("../../res/images/icon_aboutus.png")
    let images = [booklist,aboutus,setting,feedback,images]
    let texts = ["创建日记","匹配","设置","意见反馈"]
    let male_pic = require("../../res/images/avatar.png");
    let fm_pic = require("../../res/images/avatar2.png")
    return <View style={styles.container}>
      <View style={styles.info_container}>
        <Image style={styles.avatar} source={require("../../res/images/avatar_bg.png")}>
        <Image style={styles.avatar_round} source={require("../../res/images/avatar_round.png")}>
          <Image source={male_pic}/>
        </Image>
          <TextPingFang style={styles.avatar_font}>Airing</TextPingFang>
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
                            this.onJump(TextPingFang,{
                              title:"创建日记",
                              user:this.props.user,
                              timestamp:this.props.timestamp
                            });
                            break;
                            case "匹配":
                              this.onHistory()
                              break;
                            case "设置":
                              this.onJump(TextPingFang,{title:"设置"})
                              break;
                            case "意见反馈":
                              this.onJump(FeedBackPage,{
                                user:this.props.user,
                                timestamp:this.props.timestamp,
                                navigator:this.props.navigator
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
    width:56
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
  }
})