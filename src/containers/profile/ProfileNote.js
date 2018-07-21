import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  DeviceEventEmitter
} from 'react-native'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import Diary from '../home/Diary'
import ProfileHeader from './components/ProfileHeader'

import { connect } from 'react-redux'

import {
  diaryClassify,
  readFile
} from '../../common/util'

import {
  WIDTH,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class ProfileNote extends Component {

  state = {
    diaryList: [],
    isRefreshing: false,
  }

  async componentDidMount() {
    this._fetchDiary()

    DeviceEventEmitter.addListener('flush_note', () => this._fetchDiary())
  }

  async _fetchDiary() {
    this.setState({ isRefreshing: true })

    let diaryList = await readFile(this.props.user.id)
    diaryList.sort((a, b) => b.date - a.date)
    diaryList =
      diaryClassify(diaryList, 'date')
      .map(dayDiary => {
        return dayDiary.filter(diary => {
          return this.props.isMe ? diary.user_id === this.props.user.id : diary.user_id !== this.props.user.id
        })
      })
    this.setState({
      diaryList,
      isRefreshing: false
    })
  }

  _renderItem({ item }) {
    return <Diary data={item} isProfileNote={true}/>
  }

  _emptyDiary() {
    return (
      <View style={styles.none_container}>
        <TextPingFang style={styles.text_none}>空空如也，{'\n'}来写一篇日记吧～</TextPingFang>
      </View>
    )
  }

  _listFooter() {
    return (
      <View style={[styles.list_footer, { display: this.state.diaryList.length === 0 ? 'none' : 'flex' }]}/>
    )
  }

  render() {

    return (
      <Container>
        <ProfileHeader title={this.props.isMe ? '我的日记' : 'TA 的日记'}/>

        <FlatList
          ref={ref => this.fl = ref}
          style={styles.diary_container}
          data={this.state.diaryList}
          extraData={this.state}
          renderItem={this._renderItem}
          ListEmptyComponent={() => this._emptyDiary()}
          ListFooterComponent={() => this._listFooter()}
          onRefresh={() => this._fetchDiary()}
          refreshing={this.state.isRefreshing}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  diary_container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    backgroundColor: 'transparent',
  },
  none_container: {
    alignItems: 'center',
    paddingTop: getResponsiveHeight(150),
    backgroundColor: 'transparent',
    zIndex: -10
  },
  text_none: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center'
  },
  list_footer: {
    width: WIDTH,
    height: getResponsiveHeight(50),
    backgroundColor: '#fff',
    zIndex: -10
  }
})
