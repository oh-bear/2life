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
import TextPingFang from '../common/TextPingFang';

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

export default class DairyPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
        	<View style={styles.menuContainer}>
        	<Image style={styles.menu} source={require('../../res/images/menu.png')}></Image>
        	<TextPingFang style={styles.date}>06-06-2017</TextPingFang>
        	<TextPingFang style={styles.time}>23:15</TextPingFang>
        	</View>
        	<View style={styles.avatarContainer}>
        		<Image style={styles.avatar} source={require('../../res/images/avatar3.png')}></Image>
        		<TextPingFang style={styles.username}>Traveler</TextPingFang>
        	</View>
        	<View style={styles.swiperContainer}>
        		<Image style={styles.image} source={require('../../res/images/demo.png')}></Image>
        	</View>
        	<View style={styles.contentContainer}>
        		<TextPingFang style={styles.title}>今天是个好天气</TextPingFang>
        		<TextPingFang style={styles.place}>广东省广州市大学城外环西路230号</TextPingFang>
        		<TextPingFang style={styles.content}>Now, if you are interested in being the best player, getting really good money and knowing some tricks and advices of what to do in a live tournament games, here is the best place to learn them.</TextPingFang>
        	</View>
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
  card: {
  	backgroundColor:"white",
    flexDirection:'column',
    marginTop: (HEIGHT - 567 / 667 * HEIGHT) / 2,
    marginLeft: (WIDTH - 336 / 375 * WIDTH) / 2,
    borderRadius: 5 / 667 * HEIGHT,
    shadowColor: "#000000",
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 4,
    shadowOpacity: 0.5,
    width: 336 / 375 * WIDTH,
    height: 567 / 667 * HEIGHT
  },
  menuContainer: {
  	flexDirection: 'row',
  	marginLeft: 31 / 375 * WIDTH,
  	marginTop: 33 / 667 * HEIGHT
  },
  menu: {
  	width: 18,
  	height: 16,
  },
  date: {
  	marginLeft: 21 / 375 * WIDTH,
  	fontSize: 12,
  	lineHeight: 17,
  	color: 'black'
  },
  time: {
  	marginLeft: 12 / 375 * WIDTH,
  	fontSize: 12,
  	lineHeight: 17,
  	color: '#989898'
  },
  avatarContainer: {
  	flexDirection: 'row',
  	marginLeft: 70 / 375 * WIDTH,
  	marginTop: 19 / 667 * HEIGHT
  },
  avatar: {
  	width: 20 / 375 * WIDTH,
    height: 20 / 667 * HEIGHT
  },
  username: {
  	marginLeft: 6 / 375 * WIDTH,
  	fontSize: 12,
  	lineHeight: 20,
  	color: 'black'
  },
  swiperContainer: {
  	marginLeft: 67 / 375 * WIDTH,
  	marginTop: 20 / 667 * HEIGHT
  },
  image: {
  	width: 220 / 375 * WIDTH,
    height: 108 / 667 * HEIGHT
  },
  contentContainer: {
  	marginLeft: 67 / 375 * WIDTH,
  	marginRight: 20 / 375 * WIDTH,
  	marginTop: 21 / 667 * HEIGHT
  },
  title: {
  	fontSize: 17,
  	lineHeight: 22,
  	color: '#030303'
  },
  place: {
  	marginTop: 21 / 667 * HEIGHT,
  	fontSize: 12,
  	lineHeight: 17,
  	color: '#9B9B9B'
  },
  content: {
		marginTop: 21 / 667 * HEIGHT,
  	fontSize: 12,
  	lineHeight: 17,
  	color: '#3D3D3D'
  }
});