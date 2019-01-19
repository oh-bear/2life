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
    showModalTip: false,
  }

  async componentDidMount() {
    this.getHoleList()
  }

  getHoleList = async () => {
    const res = await HttpUtils.get(NOTES.show_holes)
    if (res.code === 0) {
      this.setState({ holeList: res.data })
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
    marginTop: getWidth(18)
  }
})
