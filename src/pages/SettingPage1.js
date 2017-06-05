import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import CommonNav from '../common/CommonNav';
import TextPingFang from '../common/TextPingFang';
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;

export default class SettingPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.bg} source={require("../../res/images/about_bg.png")}>
          <CommonNav title={"设置"} navigator={this.props.navigator} navStyle={styles.opacity0} navBarStyle={styles.opacity0}/>
          <Image style={styles.avatar_round} source={require("../../res/images/avatar_round.png")}>
            <Image style={styles.avatar} source={require("../../res/images/avatar.png")} />
          </Image>
          <TextPingFang style={styles.avatar_font}>Airing</TextPingFang>
        </Image>
         
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
  }
});