import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  Image
} from 'react-native'

import Container from '../../components/Container'
import CommonNav from '../../components/CommonNav'
import TextPingFang from '../../components/TextPingFang'
import { VERSION } from '../../constants/config'

import {
  getResponsiveWidth, 
  getResponsiveHeight,
  WIDTH
} from '../../common/styles'

export default class ProfileVersion extends Component {

  render() {
    return (
      <Container>

        <CommonNav />

        <ScrollView contentContainerStyle={styles.container}>
          <Image style={styles.icon} source={require('../../../res/images/logo.png')} />
          <TextPingFang style={styles.big_title}>双生日记</TextPingFang>
          <TextPingFang style={styles.small_title}>Version {VERSION}</TextPingFang>
        
        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
  },
  icon: {
    width: 80,
    height: 80,
  },
  big_title: {
    marginTop: getResponsiveHeight(16),
    color: '#333',
    fontSize: 18,
    fontWeight: '500'
  },
  small_title: {
    marginTop: getResponsiveHeight(8),
    color: '#333',
    fontSize: 12,
    fontWeight: '300'
  },
  content: {
    marginTop: getResponsiveWidth(16),
    color: '#333',
    fontSize: 14,
    fontWeight: '300',
  },
})
