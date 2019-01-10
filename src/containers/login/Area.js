import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  DeviceEventEmitter
} from 'react-native'

import dismissKeyboard from 'dismissKeyboard'
import { View } from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import ProfileHeader from '../profile/components/ProfileHeader'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'
import { SCENE_LOGIN_SIGNUP } from '../../constants/scene'

export default class Signup extends Component {

  state = {
    selectArea: '+86',
    area: [
      {
        num: '+86',
        name: '中国大陆'
      },
      {
        num: '+852',
        name: '中国香港'
      },
      {
        num: '+853',
        name: '中国澳门'
      },
      {
        num: '+886',
        name: '中国台湾'
      },
      {
        num: '+1',
        name: '美国'
      },
    ]
  }

  componentWillMount() {
    this.setState({ selectArea: this.props.area })
  }

  _renderItem({ item }) {
    return (
      <TouchableOpacity
        key={item.num}
        style={styles.item}
        onPress={() => {
          this.setState({ selectArea: item.num }, () => {
            DeviceEventEmitter.emit('select_area', this.state.selectArea)
          })
          Actions.pop()
        }}
      >
        <TextPingFang style={styles.text_item}>{item.name}</TextPingFang>
        <Image
          source={require('../../../res/images/login/icon_checked.png')}
          style={{ display: this.state.selectArea === item.num ? 'flex' : 'none' }}
        />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container>
        <ProfileHeader title='选择地区' />

        <FlatList
          data={this.state.area}
          renderItem={this._renderItem.bind(this)}
          extraData={this.state}
          keyExtractor={item => item.num}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    width: WIDTH - getResponsiveWidth(48),
    height: getResponsiveWidth(44),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: .5,
    borderBottomColor: '#f1f1f1'
  },
  text_item: {
    fontSize: 20,
    fontWeight: '300'
  }
})
