import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Dimensions,
  TouchableOpacity,
  AlertIOS
} from 'react-native';
import CommonNav from '../common/CommonNav';
import TextPingFang from '../common/TextPingFang';
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

export default class ConnectPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  connectByRandom() {

  }
  connectById() {
    AlertIOS.prompt('请输入另一半的ID号','',[
      {text:'取消'},
      {text:'确定'}],
      (id)=>{this.setState({id: id})});
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
        <TouchableOpacity 
          style={styles.online_register}
          onPress={()=>{
            this.connectById();
          }}>
          <Text 
            style={styles.online_font}>
            定点匹配
          </Text>
        </TouchableOpacity>
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