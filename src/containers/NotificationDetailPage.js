import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  WebView
} from 'react-native'
import CommonNav from '../components/CommonNav'


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class NotificationDetailPage extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <CommonNav
          title={'活动详情'}
          navigator={this.props.navigator}/>
        <WebView
          bounces={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{uri: this.props.url}}
          style={styles.webview}>
        </WebView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    width: WIDTH,
    height: HEIGHT
  }
})