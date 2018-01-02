import React, { Component } from "react"
import { StyleSheet, View, Text } from "react-native"
import NavigationBar from "../components/NavigationBar"
import { WIDTH, HEIGHT } from "../common/styles"

export default class Edit extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar backArrow title="双生日记" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: "#ffffff"
  }
})
