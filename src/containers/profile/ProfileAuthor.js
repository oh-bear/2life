import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import ProfileHeader from './components/ProfileHeader'

import {
  getResponsiveWidth, WIDTH
} from '../../common/styles'

export default class ProfileAuthor extends Component {

  state = {
    contacts: [
      {
        avatar: require('../../../res/images/profile/thanks/icon_profile_weibo.png'),
        name: '微博',
        detail: 'Airing'
      },
      {
        avatar: require('../../../res/images/profile/thanks/icon_profile_wechat.png'),
        name: '微信公众号',
        detail: '零熊技术团队'
      },
      {
        avatar: require('../../../res/images/profile/thanks/icon_profile_github.png'),
        name: 'GitHub',
        detail: 'airingursb'
      },
      {
        avatar: require('../../../res/images/profile/thanks/icon_profile_email.png'),
        name: '邮箱',
        detail: 'airing@ursb.me'
      },
    ]
  }

  render() {
    return (
      <Container>

        <ProfileHeader title='联系我们' />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.outer_container}>
            {
              this.state.contacts.map(item => {
                return (
                  <View style={styles.f4_item_container}>
                    <Image source={item.avatar} />
                    <View style={styles.f4_right}>
                      <TextPingFang style={styles.text_name}>{item.name}</TextPingFang>
                      <TextPingFang style={styles.text_job}>{item.detail}</TextPingFang>
                    </View>
                  </View>
                )
              })
            }
          </View>
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
  outer_container: {
    marginBottom: getResponsiveWidth(40)
  },
  text_title: {
    color: '#333',
    fontSize: 20,
    fontWeight: '500'
  },
  text_s_title: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '400',
    marginTop: getResponsiveWidth(8)
  },
  f4_item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: getResponsiveWidth(16),
    paddingBottom: getResponsiveWidth(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  f4_right: {
    alignItems: 'flex-start',
    marginLeft: getResponsiveWidth(32)
  },
  text_name: {
    color: '#444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text_job: {
    color: '#666',
    fontSize: 14,
    fontWeight: '400'
  },
  names_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: getResponsiveWidth(24)
  },
  text_word_name: {
    width: getResponsiveWidth(60),
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
    marginBottom: getResponsiveWidth(16),
  }
})
