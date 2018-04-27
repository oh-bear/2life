import React, { Component } from 'react'
import {
	View,
	StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  Alert
} from 'react-native'
import { CalendarList } from 'react-native-calendars'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import Diary from './Diary'

import Storage from '../../common/storage'
import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'
import {
  getMonth,
  getFormDay,
  getDay,
  getTime,
  getLocation,
  getWeather,
  diaryClassify,
} from '../../common/util'
import { SCENE_NEW_DIARY } from '../../constants/scene'

import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

const URL_list = NOTES.list

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

@connect(mapStateToProps)
export default class Home extends Component {

  state = {
    year: new Date().getFullYear(),
    month: getMonth(new Date().getMonth()),
    day: new Date().getDate(),
    showCalendar: false,
    weather_text: '',
    weather_icon: require('../../../res/images/home/icon_sunny.png'),
    diaryList: [],
    markedDates: {}
  }

  async componentDidMount () {
    this._getWeather()
    const res = await HttpUtils.get(URL_list)
    if (res.code === 0) {
      const { partner, recommend, user } = res.data
      let diaryList = [...partner, ...user]
      // 判断是否空对象
      if (recommend.id) diaryList.push(recommend)
      diaryList.sort((a, b) => b.date - a.date)
      diaryList = diaryClassify(diaryList, 'date')

      let markedDates = {}
      const boy = {key:'boy', color: 'pink'}
      const girl = {key:'girl', color: 'pink'}

      diaryList.forEach(dayDiary => {
        markedDates[getFormDay(dayDiary[0].date)] = {dots: []}
        let hasBoyDiary = false
        let hasGirlDiary = false

        dayDiary.forEach(diary => {
          if ((diary.user_id === this.props.user.id) && (this.props.user.sex === 0)) {
            hasBoyDiary = true
          }
          if ((diary.user_id === this.props.user.id) && (this.props.user.sex === 1)) {
            hasGirlDiary = true
          }
        })

        if (hasBoyDiary) {
          markedDates[getFormDay(dayDiary[0].date)].dots.push(boy)
        }
        if (hasGirlDiary) {
          markedDates[getFormDay(dayDiary[0].date)].dots.push(girl)
        }
      })

      this.setState({diaryList, markedDates})
    }
  }

  async _getWeather () {
    navigator.geolocation.getCurrentPosition(async res => {
      try {
        const {latitude, longitude} = res.coords
        const location = await getLocation(113.387061, 23.053829)
        const weather = await getWeather(location.city)
        switch(weather.weather) {
          case '晴':
            this.setState({
              weather_text: `${weather.weather} ${weather.temperature}℃`,
              weather_icon: require('../../../res/images/home/icon_sunny.png')
            })
            break
          case '多云':
            this.setState({
              weather_text: `${weather.weather} ${weather.temperature}℃`,
              weather_icon: require('../../../res/images/home/icon_cloud.png')
            })
            break
          case '阵雨':
            this.setState({
              weather_text: `${weather.weather} ${weather.temperature}℃`,
              weather_icon: require('../../../res/images/home/icon_rainy.png')
            })
            break
          case '阵雪':
            this.setState({
              weather_text: `${weather.weather} ${weather.temperature}℃`,
              weather_icon: require('../../../res/images/home/icon_snow.png')
            })
            break
          case '霾':
            this.setState({
              weather_text: `${weather.weather} ${weather.temperature}℃`,
              weather_icon: require('../../../res/images/home/icon_snow.png')
            })
            break
          defaylt:
            this.setState({
              weather_text: ``,
              weather_icon: require('')
            }) 
        }
      } catch (e){
        console.log(e)
        Alert.alert('', '无法获取天气')
      }
    })
  }

  async setDate (months) {
    await 0
    this.setState({
      month: getMonth(months[0].month-1),
      year: months[0].year
    })
  }

  tri () {
    if (this.state.showCalendar) {
      return <Image style={styles.img_tri} source={require('../../../res/images/home/icon_dropup.png')}></Image>
    } else {
      return <Image style={styles.img_tri} source={require('../../../res/images/home/icon_dropdown.png')}></Image>
    }
  }

  _renderItem ({item}) {
    return (
      <Diary
        data={item}
      />
    )
  }

  _emptyDiary () {
    return (
      <View style={styles.none_container}>
        <TextPingFang style={styles.text_none}>空空如也，{'\n'}来写一篇日记吧～</TextPingFang>
      </View>
    )
  }

  _listHeader () {
    
    return (
      <View style={styles.weather}>
        <View style={styles.weather_inner}>
          <Image style={styles.weather_icon} source={this.state.weather_icon}/>
          <TextPingFang style={styles.text_weather}>{this.state.weather_text}</TextPingFang>
          <TouchableOpacity  style={styles.weather_exchange} onPress={() => this.setWeather()}>
            <Image source={require('../../../res/images/home/icon_exchange.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _listFooter () {
    return (
      <View style={[styles.list_footer, {display: this.state.diaryList.length === 0 ? 'none' : 'flex'}]}></View>
    )
  }

  render() {

    return (
      <Container>
        <View style={styles.header_container}>
          <TouchableOpacity
            style={styles.header_left}
            activeOpacity={1}
            onPress={() => this.setState({showCalendar: !this.state.showCalendar})}
          >
            <TextPingFang style={styles.text_month}>{this.state.month}</TextPingFang>
            <TextPingFang style={styles.text_year}>{this.state.year}</TextPingFang>
            {this.tri()}
          </TouchableOpacity>
          <ImageBackground style={styles.header_right} source={require('../../../res/images/home/icon_calendar.png')}>
            <TextPingFang style={styles.text_day}>{this.state.day}</TextPingFang>
          </ImageBackground>
        </View>

        <CalendarList
          horizontal={true}
          pagingEnabled={true}
          style={[styles.calendar, {display: this.state.showCalendar ? 'flex' : 'none'}]}
          theme={{
            calendarBackground: 'rgb(250,250,250)',
            textDayFontSize: 14,
          }}
          maxDate={new Date()}
          onDayPress={day => {console.log(day)}}
          onVisibleMonthsChange={months => this.setDate(months)}
          markedDates={this.state.markedDates}
          markingType={'multi-dot'}
        />
        
        <FlatList
          style={styles.diary_container}
          data={this.state.diaryList}
          extraData={this.state}
          renderItem={this._renderItem}
          ListEmptyComponent={() => this._emptyDiary()}
          ListHeaderComponent={() => this._listHeader()}
          ListFooterComponent={() => this._listFooter()}
        />

        <TouchableOpacity
          style={styles.new_diary}
          onPress={() => Actions.jump(SCENE_NEW_DIARY)}
        >
          <Image source={require('../../../res/images/home/icon_new_diary.png')}/>
        </TouchableOpacity>
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
  header_right: {
    position: 'absolute',
    width: 25,
    height: 25,
    right: getResponsiveWidth(20),
    bottom: getResponsiveWidth(10)
  },
  text_day: {
    position: 'absolute',
    top: 9.5,
    left: 6.8,
    color: '#444',
    fontSize: 10,
  },
  calendar: {
    width: WIDTH,
    height: 470
  },
  // weather: {
  // },
  weather_inner: {
    height: getResponsiveHeight(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: getResponsiveWidth(1),
    borderBottomColor: '#f1f1f1',
  },
  // weather_icon: {
  // },
  text_weather: {
    right: getResponsiveWidth(96),
    color: '#aaa',
    fontSize: 14
  },
  // weather_exchange: {
  // },
  diary_container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    backgroundColor: '#fff',
  },
  none_container: {
    alignItems: 'center',
    paddingTop: getResponsiveHeight(150),
    backgroundColor: '#fff'
  },
  text_none: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center'
  },
  list_footer: {
    width: WIDTH,
    height: getResponsiveHeight(50),
    backgroundColor: '#fff'
  },
  new_diary: {
    position: 'absolute',
    bottom: getResponsiveHeight(65),
    right: getResponsiveWidth(16),
  }
})
