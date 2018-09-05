import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import * as RNIap from 'react-native-iap'
import LinearGradient from 'react-native-linear-gradient'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import Popup from '../../components/Popup'
import ProfileHeader from './components/ProfileHeader'
import Storage from '../../common/storage'

import {
  getResponsiveWidth, WIDTH,
} from '../../common/styles'
import { updateReduxUser } from '../../common/util'
import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

const itemSkus = Platform.select({
  ios: [
    'vip_1'
  ],
  android: [],
})

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class ProfileVip extends Component {

  state = {
    isVip: false,
    showVipPopup: false,
    expiresDate: ''
  }

  async componentDidMount() {
    await RNIap.prepare()
    const products = await RNIap.getProducts(itemSkus)

    const isVip = await Storage.get('isVip', false)

    if (isVip) {
      const date = new Date(this.props.user.vip_expires)
      const expiresDate = `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
      this.setState({ isVip, expiresDate })
    }
  }

  _buyVip() {
    let expires = Date.now() + 30 * 24 * 60 * 60 * 1000

    RNIap.buySubscription('vip_1').then(purchase => {
      Storage.set('isVip', true)
      HttpUtils.get(USERS.update_vip, { expires }).then(async res => {
        if (res.code === 0) {
          this.setState({ isVip: true, showVipPopup: true })
          await updateReduxUser(this.props.user.id)
          const date = new Date(expires)
          const expiresDate = `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
          this.setState({ expiresDate })
        }
      })
    }).catch(err => {
      console.warn(err) // standardized err.code and err.message available
    })
  }

  render() {
    return (
      <Container>

        <ProfileHeader
          title='高级会员'
          titleIcon={require('../../../res/images/profile/vip/icon-profile-pro.png')}
        />

        <ScrollView contentContainerStyle={styles.container}>
          <Image style={{width: '100%', borderRadius: 8}} source={require('../../../res/images/profile/vip/bg-vip.png')} />
          <TextPingFang style={styles.text_bevip}>成为高级会员，享受更多服务</TextPingFang>

          <View style={styles.vip_item}>
            <Image style={styles.vip_item_img_left} source={require('../../../res/images/profile/vip/icon-profile-image.png')} />
            <View style={styles.item_center}>
              <TextPingFang style={styles.text_item_center_top}>高清大图</TextPingFang>
              <TextPingFang style={styles.text_item_center_bottom}>让宝贵的回忆更清晰</TextPingFang>
            </View>
            <Image style={styles.vip_item_img_right} source={require('../../../res/images/profile/vip/icon-profile-selected.png')} />
          </View>

          <View style={styles.vip_item}>
            <Image style={styles.vip_item_img_left} source={require('../../../res/images/profile/vip/icon-profile-more-feature.png')} />
            <View style={styles.item_center}>
              <TextPingFang style={styles.text_item_center_top}>后续高级功能</TextPingFang>
              <TextPingFang style={styles.text_item_center_bottom}>享受未来新开发的高级功能</TextPingFang>
            </View>
            <Image style={styles.vip_item_img_right} source={require('../../../res/images/profile/vip/icon-profile-selected.png')} />
          </View>

          <TextPingFang style={[styles.text_expires, {display: this.state.isVip ? 'flex' : 'none'}]}>您的会员将在 {this.state.expiresDate} 自动续费，如需取消可前往用户的帐户设置中关闭。</TextPingFang>
        </ScrollView>

        <View style={[styles.buy_container, {display: this.state.isVip ? 'none' : 'flex'}]}>
          <View style={styles.price_container}>
            <TextPingFang style={styles.text_price_now}>￥3.99/月</TextPingFang>
            <TextPingFang style={styles.text_price_before}>原价￥12.99</TextPingFang>
            <View style={styles.delete_line}></View>
          </View>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#9EE143', '#2DC3A6']} style={styles.liner_gradient}>
            <TouchableOpacity style={styles.buy_btn} onPress={this._buyVip.bind(this)}>
              <TextPingFang style={styles.text_btn}>马上开通</TextPingFang>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <Popup
          showPopup={this.state.showVipPopup}
          popupBgColor='#2DC3A6'
          icon={require('../../../res/images/profile/icon-popup-reward.png')}
          title='订阅成功'
          content='已经为您开启高级会员功能!'
          onPressLeft={() => this.setState({ showVipPopup: false })}
          textBtnLeft='好'
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    justifyContent: 'flex-start'
  },
  text_bevip: {
    marginTop: getResponsiveWidth(12),
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  vip_item: {
    height: getResponsiveWidth(56),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241,247,247,1)',
    borderRadius: 8,
    marginTop: 16,
  },
  vip_item_img_left: {
    marginLeft: 16
  },
  vip_item_img_right: {
    marginRight: 16
  },
  item_center: {
    flex: 1,
    marginLeft: 16
  },
  text_item_center_top: {
    color: '#15594B',
    fontSize: 14,
    fontWeight: '500',
  },
  text_item_center_bottom: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  text_expires: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 16
  },
  buy_container: {
    position: 'absolute',
    ...ifIphoneX({
      bottom: 44
    }, {
      bottom: 16
    }),
    width: WIDTH - getResponsiveWidth(48),
    height: getResponsiveWidth(52),
    flexDirection: 'row',
    alignItems: 'center'
  },
  text_price_now: {
    color: '#2DC3A6',
    fontSize: 20,
    fontWeight: '500',
  },
  text_price_before: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500',
  },
  delete_line: {
    position: 'absolute',
    top: 37,
    width: '75%',
    height: 1,
    backgroundColor: '#aaa'
  },
  liner_gradient: {
    flex: 1,
    marginLeft: 16,
    borderRadius: 8
  },
  buy_btn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_btn: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  }
})
