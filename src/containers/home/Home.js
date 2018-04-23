import React, { Component } from 'react'
import {
	View,
	StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
} from 'react-native'
import { Calendar,CalendarList, LocaleConfig } from 'react-native-calendars'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import Diary from './Diary'


import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'
import { getMonth, getToday } from '../../common/util'

export default class Home extends Component {

  state = {
    year: new Date().getFullYear(),
    month: getMonth(new Date().getMonth()),
    day: new Date().getDate(),
    showCalendar: false,
    weather_text: '19℃ 晴',
    weather_icon: require('../../../res/images/home/icon_sunny.png'),
    diaryData: [{
      date: 'San',
      dairy_img: require('../../../res/images/home/icon_sunny.png'),
      dairy_title: '今天是个好日子',
      dairy_brief: '今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子今天是个好日子',
      diary_time: '15:24',
      dairy_location: '广州，广东省，中国'
    }]
  }

  tri () {
    if (this.state.showCalendar) {
      return <Image style={styles.img_tri} source={require('../../../res/images/home/icon_dropup.png')}></Image>
    } else {
      return <Image style={styles.img_tri} source={require('../../../res/images/home/icon_dropdown.png')}></Image>
    }
  }

  async setWeather () {
  }

  _renderItem ({item}) {
    return (
      <Diary
        date={item.date}
        dairy_img={item.dairy_img}
        dairy_title={item.dairy_title}
        dairy_brief={item.dairy_brief}
        diary_time={item.diary_time}
        dairy_location={item.dairy_location}
      />
    )
  }

  _none_diary () {
    return (
      <View style={styles.none_container}>
        <TextPingFang style={styles.text_none}>空空如也，{'\n'}来写一篇日记吧～</TextPingFang>
      </View>
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
            todayTextColor: '#fff',
            textDayFontSize: 16,
          }}
          maxDate={new Date()}
          // onDayPress={day => {console.log(day)}}
          // onVisibleMonthsChange={months => this.setState({month: getMonth(months[0].month-1)})}
          markedDates={{
            [getToday()]: {
              customStyles: {
                container: {
                  backgroundColor: 'rgb(112,200,246)',
                },
                text: {
                  color: '#fff',
                  fontWeight: '300'
                },
              },
            }
          }}
          markingType={'custom'}
        />

        <View style={styles.weather}>
          <View style={styles.weather_inner}>
            <Image style={styles.weather_icon} source={this.state.weather_icon}/>
            <TextPingFang style={styles.text_weather}>{this.state.weather_text}</TextPingFang>
            <TouchableOpacity  style={styles.weather_exchange} onPress={() => this.setWeather()}>
              <Image source={require('../../../res/images/home/icon_exchange.png')}/>
            </TouchableOpacity>
          </View>
        </View>
        
        <FlatList
          style={styles.dairy_container}
          data={this.state.diaryData}
          extraData={this.state}
          renderItem={this._renderItem}
          ListEmptyComponent={() => this._none_diary()}
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
    zIndex: 10,
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
    top: getResponsiveHeight(36)
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
    top: getResponsiveHeight(-30),
    zIndex: 2
  },
  weather: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    backgroundColor: '#fff',
  },
  weather_inner: {
    height: getResponsiveHeight(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
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
  none_container: {
    height: HEIGHT,
    alignItems: 'center',
    paddingTop: getResponsiveHeight(150),
    backgroundColor: '#fff'
  },
  text_none: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center'
  },
  dairy_container: {
    width: WIDTH,
    minHeight: HEIGHT,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    backgroundColor: '#fff',
  }
})
