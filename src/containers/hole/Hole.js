import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text
} from 'react-native'
import { View } from 'react-native-animatable'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Container from '../../components/Container'
import NoteCard from './components/NoteCard'
import ModalTip from './components/ModalTip'

import {
  WIDTH,
  getResponsiveWidth,
  font
} from '../../common/styles'

import holeRule from '../../constants/holeRule'

import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

export default class Hole extends Component {

  state = {
    holeList: [],
    pageSize: 10,
    pageIndex: 0,  // 下一次请求的页数
    isLast: false, // 是否为最后一页
    showModalTip: false,
    isHoleRefreshing: false
  }

  componentDidMount() {
    this.refreshHoleList()
  }

  refreshHoleList = () => {
    this.setState({
      holeList: [],
      pageIndex: 0,
      isHoleRefreshing: true,
      isLast: false
    }, () => this.getHoleList())
  }

  getHoleList = async () => {
    const { holeList, pageIndex, pageSize, isLast } = this.state
    if (!isLast) {
      const params = {
        pageIndex,
        pageSize,
      }
      const res = await HttpUtils.get(NOTES.show_holes, params)
      if (res.code === 0) {
        this.setState({
          holeList: [...holeList, ...res.data],
          pageIndex: pageIndex + 1,
          isHoleRefreshing: false,
          isLast: res.data.length !== pageSize
        })
      }
    }
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
            <TouchableOpacity style={styles.rule_inner_ctn} onPress={() => this.setState({ showModalTip: true })}>
              <Text style={styles.text_header_rule}>规则</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          style={styles.flatlist}
          data={this.state.holeList}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={this.state.isHoleRefreshing}
          onRefresh={this.refreshHoleList}
          onEndReached={this.getHoleList}
        />

        <ModalTip
          show={this.state.showModalTip}
          data={holeRule}
          title={'树洞规则'}
          onPressOk={() => this.setState({ showModalTip: false })}
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
  rule_ctn: {
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
    marginTop: getWidth(18),
    marginBottom: getWidth(20),
  }
})
