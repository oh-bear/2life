import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground
} from 'react-native'

import {
  WIDTH,
  INNERWIDTH,
  HEIGHT,
  getResponsiveHeight
} from '../../common/styles'

import CommonNav from '../../components/CommonNav'
import TextPingFang from '../../components/TextPingFang'
import { Actions } from 'react-native-router-flux'
import { SCENE_ABOUT_US_WEB } from '../../constants/scene'

export default function AboutUs() {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bg}
        source={require('../../../res/images/profile/about_bg.png')}
      >
        <CommonNav
          title={'关于我们'}
          navStyle={styles.opacity0}
          navBarStyle={styles.opacity0}
        />
      </ImageBackground>
      <View style={styles.text}>
        <Text style={styles.slogan}>TWO</Text>
        <TextPingFang style={styles.name}>双生</TextPingFang>
        <Text style={styles.slogan}>LIFE</Text>
        <View style={styles.border}/>
      </View>
      <View style={styles.names}>
        <Text style={styles.name}>Front-End: Airing, mieruko0713</Text>
        <Text style={styles.name}>Back-End: Airing</Text>
        <Text style={styles.name}>UI Design: Airing</Text>
        <View>
          <TouchableOpacity
            style={styles.contact}
            onPress={() => {
              Actions[SCENE_ABOUT_US_WEB]()
            }}
          >
            <Text style={styles.contact_font}>联系我们</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.version}>Verison 2.0.0</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center'
  },
  bg: {
    width: WIDTH,
    height: getResponsiveHeight(240)
  },
  opacity0: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  text: {
    alignItems: 'center',
    marginTop: getResponsiveHeight(18)
  },
  slogan: {
    fontSize: 64,
    color: 'rgb(250,250,250)'
  },
  border: {
    width: 2,
    height: getResponsiveHeight(74),
    backgroundColor: '#999999',
    marginTop: getResponsiveHeight(-74)
  },
  names: {
    marginTop: getResponsiveHeight(32),
    alignItems: 'center'
  },
  name: {
    color: '#999999',
    fontSize: 14,
    marginBottom: getResponsiveHeight(4)
  },
  version: {
    position: 'absolute',
    bottom: 5,
    color: '#999999',
    fontSize: 14
  },
  contact: {
    width: INNERWIDTH,
    height: getResponsiveHeight(44),
    marginTop: getResponsiveHeight(20),
    alignItems: 'center'
  },
  contact_font: {
    textDecorationLine: 'underline'
  }
})
