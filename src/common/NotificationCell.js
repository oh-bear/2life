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

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height


export default class NotificationCell extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.notification.title,
      content: this.props.notification.content,
      image: this.props.notification.image,

    };
  }


  render() {

    const cell = (
      <View style={styles.container}>

        <View style={styles.timeStampContainer}>
          <Text style={styles.timeStamp}>
            17:03
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {this.state.title}
          </Text>
          <Image style={styles.image} source={require('../../res/images/bad.png')} />
          <Text style={styles.content}>
            {this.state.content}
          </Text>

          <View style={styles.line}></View>
          <Text style={styles.detailTitle}>
            查看详情
          </Text>

          <Image style={styles.detailIcon} source={require('../../res/images/BackArrow.png')} />

        </View>



      </View>
    );

    return (
      <TouchableOpacity>
        {cell}
      </TouchableOpacity>
    );

  }

}


var styles = StyleSheet.create({
  container: {
    // 主轴方向
    flexDirection:'column',
    // 下边框
    margin:10,
    alignItems: "center"
  },

  timeStampContainer: {
    margin: 10,
    backgroundColor:"lightgray",
    borderRadius: 2 / 667 * HEIGHT,
    width:100,
    height:30,
    alignItems: "center"

  },
  timeStamp: {
    fontSize: 10,
    margin: 10,
    color: 'white',
  },
  contentContainer: {
    backgroundColor:"white",
    // 主轴方向
    flexDirection:'column',
    // 下边框
    margin:10,
    borderRadius: 10 / 667 * HEIGHT,
  },

  title: {
    fontSize: 17,
    margin: 10,
    color: '#032250',
  },
  image: {
      // 尺寸
    width:60,
    height:60,
    // 边距
  },

  content: {
    fontSize: 14,
    margin: 10,
    color: '#d3d3d3',
  },

  line: {
    backgroundColor:"black",
    height:1,
    marginLeft: 10,
    marginRight: 10,
  },

  detailTitle: {
    fontSize: 17,
    margin: 10,
    color: '#032250',
  },
  detailIcon: {
      // 尺寸
    width:30,
    height:30,
    // 边距
    right:-300,
  },


});
