import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Navigator,
  Dimensions,
  TouchableOpacity,
  Modal
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

import TextPingFang from '../common/TextPingFang';

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

export default class DairyPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {
      isImageViewerVisible: false,
      ImageViewerIndex:0,
    };
  }

  showImageViewer(){
    this.setState({isImageViewerVisible:true});
  }

  render() {
    const images = [{
      url: 'https://airing.ursb.me/image/twolife/demo.png',
    }, {
      url: 'https://airing.ursb.me/image/twolife/demo.png',
    }, {
      url: 'https://airing.ursb.me/image/twolife/demo.png',
    }]
    return (
      <View style={styles.container}>
        <Modal 
          animationType={"fade"} 
          transparent={true} 
          visible={this.state.isImageViewerVisible}>
          <ImageViewer 
            imageUrls={images} 
            index={this.state.ImageViewerIndex} 
            onClick={()=>{ 
              this.setState({isImageViewerVisible:false}) 
            }}/>
        </Modal>
        <View style={styles.card}>
        	<View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={()=> {
              this.props.navigator.pop();
            }}>
        	  <Image style={styles.menu} source={require('../../res/images/menu.png')}></Image>
        	</TouchableOpacity>
          <TextPingFang style={styles.date}>06-06-2017</TextPingFang>
        	<TextPingFang style={styles.time}>23:15</TextPingFang>
        	</View>
        	<View style={styles.avatarContainer}>
        		<Image style={styles.avatar} source={require('../../res/images/avatar3.png')}></Image>
        		<TextPingFang style={styles.username}>{this.props.user.user_name}</TextPingFang>
        	</View>
        	<View style={styles.swiperContainer}>
            <Carousel
              sliderWidth={269 / 375 * WIDTH}
              itemWidth={220 / 375 * WIDTH}
              firstItem={0}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.6}
              enableMomentum={false}
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContainer}
              showsHorizontalScrollIndicator={false}
              snapOnAndroid={true}
              removeClippedSubviews={false}
            >
        		<Image style={styles.image} source={require('../../res/images/demo.png')}></Image>
            <Image style={styles.image} source={require('../../res/images/demo.png')}></Image>
            <Image style={styles.image} source={require('../../res/images/demo.png')}></Image>
            </Carousel> 
          </View>
        	<View style={styles.contentContainer}>
        		<TextPingFang style={styles.title}>{this.props.title}</TextPingFang>
        		<TextPingFang style={styles.place}>广东省广州市大学城外环西路230号</TextPingFang>
        		<TextPingFang style={styles.content}>{this.props.content}</TextPingFang>
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
  	marginTop: 20 / 667 * HEIGHT,
    width: 269 / 375 * WIDTH
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
  },
  slider: {
    margin: 0,
    width: 220 / 375 * WIDTH,
    height: 108 / 667 * HEIGHT
  },  
  sliderContainer: {
  }
});