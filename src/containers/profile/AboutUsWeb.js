import React, { Component } from 'react'
import { StyleSheet, View, WebView } from 'react-native'
import CommonNav from '../../components/CommonNav'
import { WIDTH, HEIGHT } from '../../common/styles'

export default function AboutUsWeb (props) {
  return (
    <View style={styles.container}>
      <CommonNav
        navigator={props.navigator}
        style={styles.nav}
        title={'联系我们'}
        navBarStyle={styles.nav}
        navStyle={styles.nav}
      />
      <WebView
        bounces={true}
        scalesPageToFit={true}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ uri: 'https://oh-bear.github.io/' }}
        style={styles.webview}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: 'rgb(242,246,250)'
  },
  container: {
    flex: 1
  },
  webview: {
    width: WIDTH,
    height: HEIGHT
  }
})
