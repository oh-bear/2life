import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Dimensions
} from 'react-native';
import CommonNav from "../common/CommonNav";
import {HOST} from '../util/config';
import TextPingFang from '../common/TextPingFang';


const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default class ItemPage extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
      	<CommonNav title={"日记"} 
          navigator={this.props.navigator} 
          navStyle={styles.opacity0} 
          navBarStyle={styles.opacity0}/>
        <View style={styles.title_container}>
          <TextPingFang style={styles.title}>{this.props.title}</TextPingFang>
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
  content_container: {
    margin: 20,
  },
  content: {
    fontSize: 16,
  }

});