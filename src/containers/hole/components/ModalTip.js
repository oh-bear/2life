import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  Platform,
  DeviceEventEmitter,
  Animated,
  Text
} from 'react-native'
import { View } from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import PropTypes from 'prop-types'

import Container from '../../../components/Container'

import Storage from '../../../common/storage'
import {
  WIDTH,
  HEIGH,
  getResponsiveWidth,
  font
} from '../../../common/styles'

import {
  formatDate,
  getLocation,
  getWeather,
  diaryClassify,
  getWeatherDesc,
  updateUser,
  updateReduxUser,
  downloadImg,
  updateFile,
  readFile,
  readFullFile,
  uuid,
  SYNC_TIMEOUT_ID
} from '../../../common/util'
import store from '../../../redux/store'
import { cleanPartner } from '../../../redux/modules/partner'
import { SCENE_NEW_DIARY } from '../../../constants/scene'
import Toast from 'antd-mobile/lib/toast'

import HttpUtils from '../../../network/HttpUtils'
import { NOTES } from '../../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class ModalTip extends Component {

  static propTypes = {
    show: PropTypes.bool,
    data: PropTypes.array.isRequired,
    title: PropTypes.string,
    textOk: PropTypes.string,
    onPressOk: PropTypes.func,
  }

  static defaultProps = {
    show: false,
    textOk: '我明白了'
  }

  state = {
    modalWidth: new Animated.Value(0),
    modalHeight: new Animated.Value(0),
  }

  componentWillReceiveProps(nextProps) {
    this.startAnimation(nextProps.show)
  }    

  startAnimation = (show) => {
    Animated.parallel([
      Animated.timing(this.state.modalWidth, {
        toValue: show ? WIDTH - getWidth(60) : 0,
        duration: 200
      }),
      Animated.timing(this.state.modalHeight, {
        toValue: show ? getWidth(450) : 0,
        duration: 200
      }),
    ]).start()
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.item_ctn}>
        <Text style={styles.text_item_title}>{item.title}</Text>
        <Text style={styles.text_item_content}>{item.content}</Text>
      </View>
    )
  }

  renderHeader = () => {
    return <Text style={styles.text_title}>{this.props.title}</Text>
  }

  render() {
    return (
      <View style={[styles.ctn, { display: this.props.show ? 'flex' : 'none' }]}>
        <Animated.View
          style={[styles.inner_ctn, {
            width: this.state.modalWidth,
            height: this.state.modalHeight
          }]}
        >
          <FlatList
            style={styles.flatlist}
            data={this.props.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            ListHeaderComponent={this.renderHeader}
          />
          
          <TouchableOpacity style={styles.btn_ctn} activeOpacity={1} onPress={this.props.onPressOk}>
            <Text style={styles.text_btn}>{this.props.textOk}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}

const getWidth = getResponsiveWidth
const styles = StyleSheet.create({
  ctn: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.7)',
  },
  inner_ctn: {
    backgroundColor: '#fff',
    borderRadius: getWidth(8),
    overflow: 'hidden'
  },
  flatlist: {
    paddingTop: getWidth(24),
    paddingHorizontal: getWidth(24),
    paddingBottom: getWidth(48),
  },
  text_title: {
    ...font('#333', 24, '500'),
  },
  item_ctn: {
    marginTop: getWidth(24)
  },
  text_item_title: {
    ...font('#333', 16, '500'),
  },
  text_item_content: {
    ...font('#333', 14),
    marginTop: getWidth(18)
  },
  btn_ctn: {
    width: '100%',
    height: getWidth(48),
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#2DC3A6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_btn: {
    ...font('#fff', 16, '500'),

  }
})
