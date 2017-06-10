import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Dimensions,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter
} from 'react-native';
import CommonNav from "../common/CommonNav";
import {HOST} from '../util/config';
import TextPingFang from '../common/TextPingFang';
import HttpUtils from '../util/HttpUtils';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const URL = HOST + 'notes/delete';

export default class ItemPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  formatDate(now) {     
    var month = now.getMonth() + 1;     
    var date = now.getDate();   
    var hour = now.getHours();     
    var minute = now.getMinutes();     
    var second = now.getSeconds();     
    return month+"月"+date+"日 "+hour+"点"+minute+"分";     
  }     
  render() {
    let DeleteButton = null;
    var d = new Date(this.props.note_time)
    var time = this.formatDate(d);
    console.log('note_time:' + time)

    if (this.props.me == 'yes') {
      DeleteButton = 
        <TouchableOpacity
          onPress={ 
            ()=>{
              HttpUtils.post(URL, {
                uid: this.props.user.uid,
                token: this.props.user.token,
                timestamp: this.props.user.timestamp,
                note_id: this.props.note_id
              }).then((res)=>{
                if (res.status == 0) {
                  Alert.alert('小提醒', '删除成功！');
                  DeviceEventEmitter.emit('homepageDidChange', 'update');
                  this.props.navigator.pop();
                }
              })
            }
          }
          style={styles.rightButton}>
          <Text style={styles.rightButton_font}>删除</Text>
        </TouchableOpacity> 
    }
    return (
      <View style={styles.container}>
      	<CommonNav title={"日记"} 
          navigator={this.props.navigator} 
          navStyle={styles.opacity0} 
          navBarStyle={styles.opacity0}
          rightButton={DeleteButton}
        />
        <View style={styles.title_container}>
          <TextPingFang style={styles.title}>{this.props.title}</TextPingFang>
          <TextPingFang style={styles.date}>写于 {time}</TextPingFang>
        </View>
        <View style={styles.content_container}>
          <TextPingFang style={styles.content}>{this.props.content}</TextPingFang>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    backgroundColor: "rgb(242,246,250)"
  },
  opacity0: {
    backgroundColor: "rgba(0,0,0,0)"
  },
  title_container: {
    marginTop: 8,
    alignItems: "center",
    padding: 4,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 20,
  },
  date: {
    fontSize: 8,
  },
  content_container: {
    margin: 20,
  },
  content: {
    fontSize: 16,
  },
  rightButton:{
    position:"absolute",
    right:0,
    width:56,
    alignItems:"center"
  },
  rightButton_font:{
    color:"red",
    fontSize:17,
    fontWeight:"500"
  },

});