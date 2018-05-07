import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'

import {
  WIDTH,
  getResponsiveWidth,
} from '../../common/styles'

export default class MatchResult extends Component {

  state = {
    title: '匹配中...',
    content: null
  }

  componentDidMount() {
    setTimeout(this.fetchMatch.bind(this), 500)
  }

  async fetchMatch() {
    this.matchSucceed()
  }

  matchSucceed() {
    let content = (
      <View style={styles.container}>
        <View style={styles.face_container}>
          <Image style={styles.face} source={{ uri: 'https://airing.ursb.me/image/twolife/male.png' }}/>
        </View>
        <TextPingFang style={styles.text_name}>隔壁王小姐</TextPingFang>
      </View>
    )

    this.setState({
      title: '匹配成功',
      content
    })
  }

  matchFailed() {
    let content = (
      <View style={styles.container}>
        <Image style={styles.img_fail} source={require('../../../res/images/profile/bg_match_fail.png')}/>
        <TextPingFang style={styles.text_fail}>没有找到符合条件的人，或许你可以继续写日记，稍后再来匹配，成功率更高哦</TextPingFang>
        <TouchableOpacity
          style={styles.start_btn}
        >
          <TextPingFang style={styles.text_start_btn}>我明白了</TextPingFang>
        </TouchableOpacity>
      </View>
    )

    this.setState({
      title: '匹配成功',
      content
    })
  }

  render() {
    return (
      <Container>
        <ScrollView>
          <ProfileHeader
            title={this.state.title}
          />
          {this.state.content}
        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: getResponsiveWidth(250),
    alignItems: 'center',
  },
  face_container: {
    height: getResponsiveWidth(250),
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    width: getResponsiveWidth(88),
    height: getResponsiveWidth(88),
  },
  img_fail: {
    width: WIDTH
  },
  text_name: {
    color: '#444',
    fontSize: 24
  },
  text_fail: {
    marginTop: getResponsiveWidth(8),
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    color: '#000',
    fontSize: 16
  },
  start_btn: {
    width: getResponsiveWidth(112),
    height: getResponsiveWidth(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveWidth(50),
    marginLeft: WIDTH - getResponsiveWidth(136),
    backgroundColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(24)
  }
})
