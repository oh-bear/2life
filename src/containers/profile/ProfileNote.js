import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  DeviceEventEmitter
} from 'react-native'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import Diary from '../home/Diary'
import Popup from '../../components/Popup'
import ProfileHeader from './components/ProfileHeader'

import { CalendarList } from '../../components/react-native-calendars/src'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import HttpUtils from '../../network/HttpUtils'
import { NOTES, USERS } from '../../network/Urls'

const URL_list = NOTES.list

import {
  getMonth,
  getFormDay,
  getLocation,
  getWeather,
  diaryClassify,
  getWeatherDesc,
  updateUser,
  updateReduxUser
} from '../../common/util'

import {
  WIDTH,
  HEIGHT,
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
    year: new Date().getFullYear(),
    month: getMonth(new Date().getMonth()),
    day: new Date().getDate(),
    diaryList: [],
    markedDates: {},
    showMe: true,
    isRefreshing: false,
    filterDiaryList: [],
    profileNote: true,
  }

  async componentDidMount() {
    this._fetchDiary()

    DeviceEventEmitter.addListener('flush_note', () => this._fetchDiary())
  }

  async _fetchDiary() {
    this.setState({ isRefreshing: true })
    const res = await HttpUtils.get(URL_list)
    if (res.code === 0) {
      const { partner, user } = res.data
      let diaryList = []

      if (this.props.isMe) {
        diaryList = [...user]
      } else {
        diaryList = [...partner]
      }

      diaryList.sort((a, b) => b.date - a.date)
      diaryList = diaryClassify(diaryList, 'date')

      let markedDates = {}

      diaryList.forEach(dayDiary => {
        markedDates[getFormDay(dayDiary[0].date)] = { dots: [] }
      })

      this.setState({
        diaryList,
        markedDates,
        filterDiaryList: diaryList,
        isRefreshing: false
      })
    }
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
      <View style={[styles.list_footer, { display: this.state.diaryList.length === 0 ? 'none' : 'flex' ,position: this.state.diaryList.length === 0 ? 'relative' : 'absolute'}]}/>
    )
  }

  render() {

    return (
      <Container>
        <FlatList
          showsVerticalScrollIndicator={true}
          ref={ref => this.fl = ref}
          style={styles.diary_container}
          data={this.state.filterDiaryList}
          extraData={this.state}
          renderItem={this._renderItem}
          ListHeaderComponent={() => {
            return <ProfileHeader title={this.props.isMe ? '我的日记' : 'TA 的日记'}/>
          }}
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
  header_container: {
    width: WIDTH,
    flexDirection: 'row',
    paddingTop: getResponsiveHeight(28),
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header_left: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: getResponsiveWidth(72)
  },
  text_month: {
    color: '#444',
    fontSize: 34
  },
  text_year: {
    color: '#000',
    fontSize: 34,
    marginLeft: getResponsiveWidth(4)
  },
  img_tri: {
    marginLeft: getResponsiveWidth(6)
  },
  header_right_container: {
    position: 'absolute',
    right: getResponsiveWidth(20),
    bottom: getResponsiveWidth(10),
  },
  header_right: {
    width: getResponsiveWidth(25),
    height: getResponsiveWidth(25)
  },
  text_day: {
    textAlign: 'center',
    paddingTop: getResponsiveWidth(9),
    color: '#444',
    fontSize: 10,
  },
  inner_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_weather: {
    marginLeft: getResponsiveWidth(24),
    color: '#aaa',
    fontSize: 14,
  },
  weather_exchange: {
    position: 'absolute',
    right: 0,
  },
  diary_container: {
    height: (() => {
      if (HEIGHT === 568) return 190 // iphone 5/5s/SE
      if (HEIGHT === 667) return 190 // iphone 6/7/8
      if (HEIGHT === 736) return 425 // iphone 6P/7P/8P
      if (HEIGHT === 812) return 500 // iphone X
    })(),
    width: WIDTH,
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24),
    backgroundColor: 'transparent',
    zIndex: -10
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
  },
  new_diary: {
    position: 'absolute',
    bottom: getResponsiveHeight(65),
    right: getResponsiveWidth(16),
  }
})
