import React, { Component } from "react"
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { PropTypes } from "prop-types"
import {
  WIDTH,
  INNERWIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from "../common/styles"

export default class NavigationBar extends Component {
  static propTypes = {
    style: View.propTypes.style,
    title: PropTypes.string,
    backArrow: PropTypes.bool,
    rightIcon: PropTypes.element,
    leftIcon: PropTypes.element
  }
  static defaultProps = {
    backArrow: false,
    leftIcon: <View />,
    title: "",
    rightIcon: <View />
  }

  render() {
    let backArrow = (
      <TouchableOpacity style={styles.back_container}>
        <Image
          style={styles.backArrow}
          source={require("../../res/images/profile/back.png")}
        />
      </TouchableOpacity>
    )
    let title = <Text style={styles.title}>{this.props.title}</Text>
    return (
      <View style={styles.container}>
        {this.props.backArrow ? backArrow : this.props.leftIcon}
        <View style={styles.title}>
          <Text>{title}</Text>
        </View>
        <TouchableOpacity style={styles.rightIcon}>
          {this.props.rightIcon}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    marginTop: getResponsiveHeight(20),
    display: "flex",
    flexDirection: "row",
    height: getResponsiveHeight(40),
    alignItems: "center",
    justifyContent: "center"
  },
  back_container: {
    width: WIDTH / 3,
    paddingLeft: getResponsiveWidth(16),
    display: "flex",
    justifyContent: "center"
  },
  backArrow: {
    height: getResponsiveHeight(20),
    width: getResponsiveWidth(18)
  },
  title: {
    color: "#45B0F9",
    fontSize: 18,
    width: WIDTH / 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  rightIcon: {
    paddingRight: getResponsiveWidth(16),
    width: WIDTH / 3,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center"
  }
})
