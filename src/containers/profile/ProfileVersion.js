import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  Platform,
  Alert,
  
} from 'react-native'

import Container from '../../components/Container'
import CommonNav from '../../components/CommonNav'
import TextPingFang from '../../components/TextPingFang'
import Row from './components/Row'

import { VERSION } from '../../constants/config'

import HttpUtils from '../../network/HttpUtils'
import { UTILS } from '../../network/Urls'

import {
  SCENE_PROFILE_THANKS,
  SCENE_PROFILE_AUTHOR,
  SCENE_WEB,
} from '../../constants/scene'

import {
  getResponsiveWidth, 
  getResponsiveHeight,
  WIDTH,
  HEIGHT
} from '../../common/styles'
import { Actions } from 'react-native-router-flux'

export default class ProfileVersion extends Component {

  render() {
    return (
      <Container>

        <CommonNav />

        <ScrollView contentContainerStyle={styles.container}>
          <Image style={styles.icon} source={require('../../../res/images/logo.png')} />
          <TextPingFang style={styles.big_title}>双生日记</TextPingFang>
          <TextPingFang style={styles.small_title}>Version {VERSION}</TextPingFang>

          <View style={styles.margin}></View>

          {Platform.OS === 'ios'?
            <Row
              title='去评分'
              onPress={() => Actions.jump(SCENE_WEB, { url: 'https://itunes.apple.com/cn/app/%E5%8F%8C%E7%94%9F%E6%97%A5%E8%AE%B0-%E4%BD%A0%E6%98%AF%E6%88%91%E6%97%A5%E8%AE%B0%E9%87%8C%E5%86%99%E4%B8%8B%E7%9A%84%E4%B8%83%E5%A4%95/id1245100877?mt=8&action=write-review' })}
            />:<View/>
          }

          <Row
            title='版本更新'
            onPress={async() => {
              let platform = 1
              Platform.OS === 'ios' ? platform = 1 : platform = 0
              const res = await HttpUtils.get(UTILS.check_version, { version: VERSION, platform })
              if (res && res.code !== 0) {
                Alert.alert('双生日记', '当前有更新版本可以下载。', 
                  [
                    {
                      text: '现在下载', 
                      onPress: () => {
                        Platform.OS === 'ios' ?
                          Actions.jump(SCENE_WEB, { url: 'https://itunes.apple.com/cn/app/%E5%8F%8C%E7%94%9F%E6%97%A5%E8%AE%B0-%E4%BD%A0%E6%98%AF%E6%88%91%E6%97%A5%E8%AE%B0%E9%87%8C%E5%86%99%E4%B8%8B%E7%9A%84%E4%B8%83%E5%A4%95/id1245100877?mt=8' }) :
                          Actions.jump(SCENE_WEB, { url: 'https://www.pgyer.com/2life' })
                      }
                    },
                    {
                      text: '暂不更新',
                      style: 'cancel'
                    }
                  ]
                )
              } else {
                Alert.alert('双生日记', '目前已经是最新版本。')
              }
            }}
          />

          <Row
            title='联系作者'
            onPress={() => Actions.jump(SCENE_PROFILE_AUTHOR)}
          />

          <Row
            title='鸣谢'
            onPress={() => Actions.jump(SCENE_PROFILE_THANKS)}
          />

          <View style={styles.footer}>
            <TextPingFang style={styles.content}>
              零熊团队 版权所有
            </TextPingFang>
            <TextPingFang style={styles.content}>
              Copyright ©️ 2017-2019 Oh-Bear. All Rights Reserved.
            </TextPingFang>
          </View>
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
  margin: {
    height: getResponsiveHeight(24)
  },
  footer: {
    height: getResponsiveHeight(50),
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0.12 * HEIGHT,
  },
  content: {
    color: '#666',
    fontSize: 12,
    fontWeight: '100',
  },
})
