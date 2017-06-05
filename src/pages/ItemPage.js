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
      	<CommonNav title={"日记"} navigator={this.props.navigator} navStyle={styles.opacity0} navBarStyle={styles.opacity0}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    height:HEIGHT,
    backgroundColor:"rgb(242,246,250)"
  },
  opacity0:{
    backgroundColor:"rgba(0,0,0,0)"
  },
});