import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native'
import * as RNIap from 'react-native-iap'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import Popup from '../../components/Popup'
import ProfileHeader from './components/ProfileHeader'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
} from '../../common/styles'

import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'

const itemSkus = Platform.select({
  ios: [
    'award_small', 'award_middle', 'award_big'
  ],
  android: [],
})

export default class ProfileReward extends Component {

  state = {
    bg: require('../../../res/images/profile/bg-6.png'),
    selecting: 'award_small',
    productList: [],
    receipt: '',
    availableItemsMessage: '',
    showPopup: false,
    popupBgColor: '#2DC3A6',
    pupupIcon: require('../../../res/images/home/icon_happy.png'),
    popupTitle: '',
    popupContent: ''
  }

  async componentDidMount() {
    try {
      await RNIap.prepare()
      const products = await RNIap.getProducts(itemSkus)
      this.setState({ productList: products })
    }
    catch (err) {
      console.warn(err.code, err.message)
    }

  }

  _select(id) {
    switch (id) {
    case 1:
      this.setState({ bg: require('../../../res/images/profile/bg-6.png'), selecting: 'award_small' })
      break
    case 2:
      this.setState({ bg: require('../../../res/images/profile/bg-16.png'), selecting: 'award_middle' })
      break
    case 3:
      this.setState({ bg: require('../../../res/images/profile/bg-30.png'), selecting: 'award_big' })
      break
    default:
      break
    }
  }

  buyItem = async () => {
    let price = 6
    if (this.state.selecting === 'award_big') price = 30
    if (this.state.selecting === 'award_middle') price = 12

    RNIap.buyProduct(this.state.selecting).then(purchase => {
      HttpUtils.post(USERS.update_rate, { price }).then(res => {
        this.setState({
          showPopup: true,
          popupBgColor: '#2DC3A6',
          pupupIcon: require('../../../res/images/profile/icon-popup-reward.png'),
          popupTitle: '打赏成功',
          popupContent: '感谢您对作者的支持，我们一定会更用心做好产品😊',
        })
      })
    }).catch(err => {
      console.warn(err) // standardized err.code and err.message available
    })
  }

  render() {
    return (
      <Container>
        <ProfileHeader
          title='打赏'
          headerStyle={styles.header_style}
        />
        <Image source={this.state.bg}/>
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.item, this.state.selecting === 'award_small' ? styles.item_selecting : null]}
            onPress={() => {
              this._select(1)
            }}
          >
            <TextPingFang style={styles.text_top}>赏金</TextPingFang>
            <View style={styles.money_container}>
              <TextPingFang style={styles.text_money}>￥</TextPingFang>
              <TextPingFang style={[styles.text_money, styles.text_bold]}>6</TextPingFang>
              <TextPingFang style={styles.text_money}>.00</TextPingFang>
            </View>
            <TextPingFang style={styles.text_bottom}>两罐可乐</TextPingFang>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.item, this.state.selecting === 'award_middle' ? styles.item_selecting : null]}
            onPress={() => {
              this._select(2)
            }}
          >
            <TextPingFang style={styles.text_top}>赏金</TextPingFang>
            <View style={styles.money_container}>
              <TextPingFang style={styles.text_money}>￥</TextPingFang>
              <TextPingFang style={[styles.text_money, styles.text_bold]}>12</TextPingFang>
              <TextPingFang style={styles.text_money}>.00</TextPingFang>
            </View>
            <TextPingFang style={styles.text_bottom}>一个汉堡</TextPingFang>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.item, this.state.selecting === 'award_big' ? styles.item_selecting : null]}
            onPress={() => {
              this._select(3)
            }}
          >
            <TextPingFang style={styles.text_top}>赏金</TextPingFang>
            <View style={styles.money_container}>
              <TextPingFang style={styles.text_money}>￥</TextPingFang>
              <TextPingFang style={[styles.text_money, styles.text_bold]}>30</TextPingFang>
              <TextPingFang style={styles.text_money}>.00</TextPingFang>
            </View>
            <TextPingFang style={styles.text_bottom}>一杯咖啡</TextPingFang>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            this.buyItem()
          }}
        >
          <TextPingFang style={styles.text_btn}>打赏作者</TextPingFang>
        </TouchableOpacity>

        <Popup
          showPopup={this.state.showPopup}
          popupBgColor={this.state.popupBgColor}
          icon={this.state.pupupIcon}
          title={this.state.popupTitle}
          content={this.state.popupContent}
          onPressLeft={() => this.setState({ showPopup: false })}
          textBtnLeft={'OK'}
        />

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  header_style: {
    paddingBottom: 0,
  },
  container: {
    width: WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
  },
  item: {
    width: getResponsiveWidth(100),
    height: getResponsiveWidth(140),
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f1f1f1',
    borderRadius: getResponsiveWidth(8)
  },
  item_selecting: {
    borderColor: '#2DC3A6',
  },
  text_top: {
    color: '#000',
    fontSize: 12
  },
  money_container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    top: -8
  },
  text_money: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  text_bold: {
    fontSize: 32,
    textAlignVertical: 'bottom',
    top: 8
  },
  text_bottom: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold'
  },
  btn: {
    width: getResponsiveWidth(112),
    height: getResponsiveWidth(48),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: getResponsiveWidth(24),
    bottom: getResponsiveWidth(80),
    backgroundColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(24)
  },
  text_btn: {
    color: '#fff',
  }
})
