import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image
} from 'react-native'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

import { View } from 'react-native-animatable'
import TextPingFang from '../../components/TextPingFang'
import CommonNav from '../../components/CommonNav'
import HttpUtil from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

import { connect } from 'react-redux'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class Connection extends Component {

  state = {
    data: {},
    file: {},
    upload: 0
  }

  connectByRandom = async () => {

  }

  connectById = async () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <CommonNav
          title={this.props.title}
          navigator={this.props.navigator}
          navStyle={styles.opacity0}
          navBarStyle={styles.opacity0}/>
        <Image
          style={styles.title_image}
          source={require('../../../res/images/profile/bad.png')}/>
        <Text style={styles.title}>"Oh - Uh"</Text>
        <TextPingFang style={styles.e_title}>快点匹配自己的另一半吧~</TextPingFang>
        <TouchableOpacity
          onPress={this.connectByRandom}>
          <View style={styles.online_button_1} delay={100} animation="bounceInRight">
            <Text
              style={styles.online_font}>
              随机匹配
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.connectById}>
          <View style={styles.online_button_2} delay={150} animation="bounceInRight">
            <Text
              style={styles.online_font}>
              定点匹配
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
    backgroundColor: 'rgb(242,246,250)'
  },
  opacity0: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  online_button_1: {
    marginTop: 50,
    backgroundColor: '#73C0FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_button_2: {
    margin: 20,
    backgroundColor: '#73C0FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_font: {
    fontSize: 14,
    color: 'white',
  },
  title_image: {
    margin: 20
  },
  title: {
    margin: 10,
    color: '#1B1B1B',
    fontSize: 20
  },
  e_title: {
    margin: 5,
    color: '#777777',
    fontSize: 12,
  }
})
