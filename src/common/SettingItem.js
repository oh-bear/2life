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

export default class SettingItem extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <TouchableOpacity>
      	
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    height:HEIGHT,
    backgroundColor:"rgb(242,246,250)"
  },
});