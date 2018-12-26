import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView
} from 'react-native'

import Container from '../../components/Container'
import CommonNav from '../../components/CommonNav'
import TextPingFang from '../../components/TextPingFang'
import { VERSION } from './constants/config'

import {
  getResponsiveWidth, WIDTH
} from '../../common/styles'

export default class ProfileVersion extends Component {

  render() {
    return (
      <Container>

        <CommonNav />

        <ScrollView contentContainerStyle={styles.container}>
          <TextPingFang style={styles.big_title}>双生日记隐私协议</TextPingFang>
          <TextPingFang style={styles.content}>双生日记尊重和保护用户的隐私，本隐私政策将告诉您我们如何收集和使用有关您的信息，以及我们如何保护这些信息的安全。您在注册用户之前请务必仔细阅读本隐私条款，如同意，本隐私政策条款在您注册成为双生日记的用户后立即生效。</TextPingFang>

          {
            privacys.map((item, index) => {
              if (item.size === 'title') {
                return <TextPingFang key={index} style={styles.title}>{item.text}</TextPingFang>
              }
              if (item.size === 's_title') {
                return <TextPingFang key={index} style={styles.small_title}>{item.text}</TextPingFang>
              }
              if (item.size === 'content') {
                return <TextPingFang key={index} style={styles.content}>{item.text}</TextPingFang>
              }
            })
          }

        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
  },
  big_title: {
    color: '#333',
    fontSize: 24,
    fontWeight: '500'
  },
  title: {
    marginTop: getResponsiveWidth(16),
    color: '#333',
    fontSize: 18,
    fontWeight: '500'
  },
  small_title: {
    marginTop: getResponsiveWidth(16),
    color: '#333',
    fontSize: 16,
    fontWeight: '500'
  },
  content: {
    marginTop: getResponsiveWidth(16),
    color: '#333',
    fontSize: 14,
    fontWeight: '300',
  },
})
