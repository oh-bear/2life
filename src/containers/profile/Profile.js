import React, { Component } from 'react'
import {
	View,
	StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

@connect(mapStateToProps)
export default class Profile extends Component {
  render() {
    return (
      <Container>
        <ScrollView>
          <TextPingFang style={styles.title}>关于我</TextPingFang>

          <View style={styles.profile_container}>
            <TouchableOpacity
              style={styles.head_container}
            >
              <View style={styles.head_left}>
                <View style={styles.head_left_top}>
                  <TextPingFang style={styles.text_name}>{this.props.user.name}</TextPingFang>
                </View>
                <View style={styles.head_left_bottom}>
                  <TextPingFang style={styles.text_check}>查看资料</TextPingFang>
                </View>
              </View>
              <View style={styles.head_right}>
                <Image style={styles.img_head} source={{uri: this.props.user.face}}/>
                <Image style={styles.img_gender} source={{uri: this.props.user.face}}/>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(72),
    ...ifIphoneX({
      paddingTop: getResponsiveWidth(28),
    }, {
      paddingTop: getResponsiveWidth(52),
    }),
    color: '#444',
    fontSize: 34,
    fontWeight: '500',
    backgroundColor: '#fff'
  }
})
