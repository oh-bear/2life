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
import { CalendarList } from '../../components/react-native-calendars/src'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Container from '../../components/Container'
import NoteCard from './components/NoteCard'

import Storage from '../../common/storage'
import {
  WIDTH,
  getResponsiveWidth,
  font
} from '../../common/styles'

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
} from '../../common/util'
import store from '../../redux/store'
import { cleanPartner } from '../../redux/modules/partner'
import { SCENE_NEW_DIARY } from '../../constants/scene'
import Toast from 'antd-mobile/lib/toast'

import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class Hole extends Component {

  state = {
    holeList: [{
      id: 1,
      title: '第一次和朋友们研究设计 app',
      content: '这是我的第一篇日记。今天，我吃了一个都城快餐，回来看了十几页书，并且做了必要的笔记…这是我的第一篇日记。今天，我吃了一个都城快餐，回来看了十几页书，并且做了必要的笔记…这是我的第一篇日记。今天，我吃了一个都城快餐，回来看了十几页书，并且做了必要的笔记…这是我的第一篇日记。今天，我吃了一个都城快餐，回来看了十几页书，并且做了必要的笔记…',
      face: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3974392485,1351494685&fm=173&app=49&f=JPEG?w=599&h=296&s=F51A37769F00484141F01DEE0200B07A',
      name: '牛逼',
      mode: 55
    }]
  }

  async componentDidMount() {
  }

  // TODO: 获取树洞列表
  getHoleList = () => {

  }

  renderItem = ({item}) => {
    return <NoteCard diary={item}/>
  }

  render() {
    return (
      <Container style={styles.ctn}>
        <View style={styles.header_ctn}>
          <Text style={styles.text_header_title}>树洞</Text>
          <View style={styles.rule_ctn}>
            <TouchableOpacity style={styles.rule_inner_ctn}>
              <Text style={styles.text_header_rule}>规则</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          style={styles.flatlist}
          data={this.state.holeList}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </Container>
    )
  }
}

const getWidth = getResponsiveWidth
const styles = StyleSheet.create({
  ctn: {
    backgroundColor: '#292929',
    paddingHorizontal: getWidth(24),
  },
  header_ctn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...ifIphoneX({
      paddingTop: getWidth(4),
    }, {
      paddingTop: getWidth(28),
    }),
  },
  text_header_title: {
    ...font('#fff', 34, '500'),
  },
  rule_ctn:  {
    justifyContent: 'center',
  },
  rule_inner_ctn: {
    borderRadius: getWidth(8),
    paddingHorizontal: getWidth(6),
    paddingVertical: getWidth(4),
    backgroundColor: '#3d3d3d',
  },
  text_header_rule: {
    ...font('#fff', 14, '500'),
  },
  flatlist: {
    width: '100%',
    marginTop: getWidth(18)
  }
})
