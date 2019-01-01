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

export default class ProfileThanks extends Component {

  state = {
    f6: [
      {
        avatar: require('../../../res/images/profile/thanks/author_1.png'),
        name: 'Airing',
        job: '产品设计，前端与服务端开发'
      },
      {
        avatar: require('../../../res/images/profile/thanks/author_2.png'),
        name: '梁志豪',
        job: 'UI 设计'
      },
      {
        avatar: require('../../../res/images/profile/thanks/author_3.png'),
        name: '王国全',
        job: 'iOS 开发'
      },
      {
        avatar: require('../../../res/images/profile/thanks/author_4.png'),
        name: '夏墨',
        job: 'Android 开发'
      },
      {
        avatar: require('../../../res/images/profile/thanks/author_5.png'),
        name: 'zyktrcn',
        job: '微信小程序开发'
      },
      {
        avatar: require('../../../res/images/profile/thanks/author_6.png'),
        name: '王善文',
        job: '算法设计'
      },
    ],
    f4: [
      {
        avatar: require('../../../res/images/profile/thanks/avatar_1.png'),
        name: '张锦涛',
        job: '心理学研究指导'
      },
      {
        avatar: require('../../../res/images/profile/thanks/avatar_2.png'),
        name: '林诗宁',
        job: '心理学研究助理'
      },
      {
        avatar: require('../../../res/images/profile/thanks/avatar_3.png'),
        name: '唐肆',
        job: '插画设计'
      },
      {
        avatar: require('../../../res/images/profile/thanks/avatar_4.png'),
        name: '兽爷',
        job: 'Logo 设计'
      },
    ],
    names: ['CT', 'HHH', 'Noblevil', 'Ree', 'Sunki', '丁林', '杜肯坑', '二胡', '范宏䣭', '卡比兽',
      '孔卓晖', '梁锐成', '刘盼盼', '林少燕', '马戈', '王子昂', '吴匡伦', '叶婉颖', '奕宏', '卓奇林',
      '朱国润'
    ]
  }

  render() {
    return (
      <Container>

        <ProfileHeader title='鸣谢' />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.outer_container}>
            <TextPingFang style={styles.text_title}>研发团队</TextPingFang>
            {
              this.state.f6.map(item => {
                return (
                  <View style={styles.f4_item_container}>
                    <Image source={item.avatar} />
                    <View style={styles.f4_right}>
                      <TextPingFang style={styles.text_name}>{item.name}</TextPingFang>
                      <TextPingFang style={styles.text_job}>{item.job}</TextPingFang>
                    </View>
                  </View>
                )
              })
            }
          </View>
          <View style={styles.outer_container}>
            <TextPingFang style={styles.text_title}>心理学和美术团队</TextPingFang>
            {
              this.state.f4.map(item => {
                return (
                  <View style={styles.f4_item_container}>
                    <Image source={item.avatar} />
                    <View style={styles.f4_right}>
                      <TextPingFang style={styles.text_name}>{item.name}</TextPingFang>
                      <TextPingFang style={styles.text_job}>{item.job}</TextPingFang>
                    </View>
                  </View>
                )
              })
            }
          </View>

          <View style={styles.outer_container}>
            <TextPingFang style={styles.text_title}>语料库整理团队</TextPingFang>
            <TextPingFang style={styles.text_s_title}>以下排名不分先后</TextPingFang>
            <View style={styles.names_container}>
              {
                this.state.names.map(name => {
                  return <TextPingFang style={styles.text_word_name}>{name}</TextPingFang>
                })
              }
            </View>

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
