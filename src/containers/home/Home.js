import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  Platform,
  DeviceEventEmitter,
  Animated
} from 'react-native'
import { View } from 'react-native-animatable'
import { CalendarList } from '../../components/react-native-calendars/src'
//import { CalendarList } from 'react-native-calendars/src'
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
  getLocation,
  getWeather,
  diaryClassify,
  getWeatherDesc,
  updateUser,
  updateReduxUser,
  downloadImg
} from '../../common/util'

import { SCENE_NEW_DIARY } from '../../constants/scene'

import store from '../../redux/store'
import { saveDiaryToLocal, cleanDiary } from '../../redux/modules/diary'
import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

const URL_list = NOTES.list

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class Home extends Component {

  state = {
    year: new Date().getFullYear(),
    month: getMonth(new Date().getMonth()),
    day: new Date().getDate(),
    showCalendar: false,
    weather_text: '你在的地方一定是晴天吧',
    weather_icon: require('../../../res/images/home/icon_sunny.png'),
    exchange_icon: require('../../../res/images/common/icon_exchange.png'),
    my_weather_text: '',
    my_weather_icon: null,
    other_weather_text: '',
    other_weather_icon: null,
    diaryList: [],
    filterDiaryList: [],
    markedDates: {},
    showDayTip: false,
    showWeatherTip: false,
    showWeatherFlag: false,
    showMe: true,
    showWeather: true,
    isRefreshing: false,
    profileNote: false,
    calendarHeight: new Animated.Value(0)
  }

  async componentDidMount() {
    //alert(HEIGHT)
    this._showTips()
    this._getWeather()

    this.props.user.id ? await this._fetchDiary() : this._formDiaryList(store.getState().diary)

    DeviceEventEmitter.addListener('flush_note', () => this._fetchDiary())
  }

  async _fetchDiary() {
    this.setState({ isRefreshing: true })
    const res = await HttpUtils.get(URL_list)
    if (res.code === 0) {
      const { partner, recommend, user } = res.data
      let diaryList = [...partner, ...user]

      // 版本过渡：保存网络日记到本地
      // store.dispatch(cleanDiary())
      let localDiaryList = store.getState().diary
      if (localDiaryList.length === 0) {
        const diaryListPromises = diaryList.map(async diary => {
          diary.imgPathList = diary.imgPathList || []
          // 缓存图片
          let pathPromises = []
          if (diary.images) {
            let urlList = diary.images.split(',')
            for (let url of urlList) {
              pathPromises.push(await downloadImg(url))
            }
          }

          for (let pathPromise of pathPromises) {
            diary.imgPathList.push(await pathPromise)
          }
          return diary
        })
        for (let diaryListPromise of diaryListPromises) {
          store.dispatch(saveDiaryToLocal(await diaryListPromise))
        }
      }

      this._formDiaryList(store.getState().diary)
    }
  }

  _formDiaryList(diaryList) {
    diaryList.sort((a, b) => b.date - a.date)
    diaryList = diaryClassify(diaryList)

    let markedDates = {}
    const boy = { key: 'boy', color: '#4590F8' }
    const girl = { key: 'girl', color: 'pink' }
    const otherBoy = { key: 'otherBoy', color: '#2DC3A6' }
    const otherGirl = { key: 'otherGirl', color: '#F83AC1' }

    diaryList.forEach(dayDiary => {
      markedDates[getFormDay(dayDiary[0].date)] = { dots: [] }
      let hasBoyDiary = false
      let hasGirlDiary = false
      let hasOtherBoyDiary = false
      let hasOtherGirlDiary = false

      dayDiary.forEach(diary => {
        if ((diary.user_id === this.props.user.id) && (this.props.user.sex === 0)) {
          hasBoyDiary = true
        }
        if ((diary.user_id === this.props.user.id) && (this.props.user.sex === 1)) {
          hasGirlDiary = true
        }
        if ((diary.user_id !== this.props.user.id) && (this.props.partner.sex === 0)) {
          hasOtherBoyDiary = true
        }
        if ((diary.user_id !== this.props.user.id) && (this.props.partner.sex === 1)) {
          hasOtherGirlDiary = true
        }
      })

      if (hasBoyDiary) markedDates[getFormDay(dayDiary[0].date)].dots.push(boy)
      if (hasGirlDiary) markedDates[getFormDay(dayDiary[0].date)].dots.push(girl)
      if (hasOtherBoyDiary) markedDates[getFormDay(dayDiary[0].date)].dots.push(otherBoy)
      if (hasOtherGirlDiary) markedDates[getFormDay(dayDiary[0].date)].dots.push(otherGirl)
    })

    this.setState({
      diaryList,
      markedDates,
      filterDiaryList: diaryList,
      isRefreshing: false
    })
  }

  _updateUser() {
    if (this.props.user.total_notes && this.props.user.status === 502 && !this.props.user.sex) {
      updateUser(this.props.user, { status: 103 })
    }
    if (this.props.user.total_notes && this.props.user.status === 502 && this.props.user.sex) {
      updateUser(this.props.user, { status: 113 })
    }
  }

  async _showTips() {
    const firstUse = await Storage.get('firstUse', true)
    if (firstUse) {
      this.setState({
        showDayTip: true,
        showWeatherTip: false,
      })
    } else {
      this.setState({
        showWeatherFlag: true
      })
    }
    Storage.set('firstUse', false)
  }

  async _getWeather() {
    navigator.geolocation.getCurrentPosition(async res => {
      try {
        const { latitude, longitude } = res.coords

        // 更新用户经纬度
        if(this.props.user.id) {
          await updateReduxUser(this.props.user.id)
          await updateUser(this.props.user, { latitude, longitude })
          this._updateUser()
        }

        // 获取用户地理位置和天气信息
        const location = await getLocation(longitude, latitude)
        // const location = await getLocation(117.28972256,31.8572069484)
        const weather = await getWeather(location.city)
        const { weather_text, weather_icon } = getWeatherDesc(weather)
        this.setState({
          weather_text,
          weather_icon,
          my_weather_text: weather_text,
          my_weather_icon: weather_icon
        })
      } catch (e) {
        this.setState({
          weather_text: '你在的地方一定是晴天吧',
          weather_icon: require('../../../res/images/home/icon_sunny.png'),
        })
      }
    })
  }

  async onDayPress(day) {
    const filterDiaryList = this.state.diaryList.filter(dayDiary => dayDiary[0].formDate === day.dateString)
    this.setState({ filterDiaryList })
  }

  async setDate(months) {
    await 0
    this.setState({
      month: getMonth(months[0].month - 1),
      year: months[0].year
    })
  }

  tri() {
    if (this.state.showCalendar) {
      return <Image style={styles.img_tri} source={require('../../../res/images/home/icon_dropup.png')}/>
    } else {
      return <Image style={styles.img_tri} source={require('../../../res/images/home/icon_dropdown.png')}/>
    }
  }

  async exchangeWeather() {
    this.setState({ showWeatherTip: false })

    if (!this.props.partner.id) return

    if (this.state.showMe) {
      try {
        const { latitude, longitude } = this.props.partner
        const location = await getLocation(longitude, latitude)
        // const location = await getLocation(113.387061, 23.053829)
        const weather = await getWeather(location.city)
        const { weather_text, weather_icon } = getWeatherDesc(weather)

        let exchange_icon = this.props.partner.sex ? require('../../../res/images/home/icon_exchange_female.png') : require('../../../res/images/home/icon_exchange_male.png')

        this.setState({
          weather_text,
          weather_icon,
          showMe: false,
          showWeather: true,
          exchange_icon
        })
      } catch (e) {
        let exchange_icon = this.props.partner.sex ? require('../../../res/images/home/icon_exchange_female.png') : require('../../../res/images/home/icon_exchange_male.png')

        this.setState({
          weather_text: 'ta在的地方一定是晴天吧',
          weather_icon: require('../../../res/images/home/icon_sunny.png'),
          showMe: false,
          showWeather: true,
          exchange_icon
        })
      }
    } else {
      this._getWeather()
      this.setState({
        showMe: true,
        showWeather: true,
        exchange_icon: require('../../../res/images/common/icon_exchange.png')
      })
    }
  }

  async exchangeWM() {
    let user = this.props.user
    let partner = this.props.partner
    let mode_icon, mode_text

    if (this.state.showMe) {
      if (this.state.showWeather) {
        mode_text = user.mode ? `${user.mode ? user.mode : ''} 情绪值` : '还没有情绪值'
        if (user.mode >= 0 && user.mode <= 20) mode_icon = require('../../../res/images/home/icon_very_sad.png')
        if (user.mode > 20 && user.mode <= 40) mode_icon = require('../../../res/images/home/icon_sad.png')
        if (user.mode > 40 && user.mode <= 60) mode_icon = require('../../../res/images/home/icon_normal.png')
        if (user.mode > 60 && user.mode <= 80) mode_icon = require('../../../res/images/home/icon_happy.png')
        if (user.mode > 80 && user.mode <= 100) mode_icon = require('../../../res/images/home/icon_very_happy.png')
        if (!user.mode) mode_icon = require('../../../res/images/home/icon_normal.png')

        this.setState({
          weather_text: mode_text,
          weather_icon: mode_icon,
          showMe: true,
          showWeather: false
        })
      } else {
        if (this.state.my_weather_text && this.state.my_weather_icon) {
          this.setState({
            weather_text: this.state.my_weather_text,
            weather_icon: this.state.my_weather_icon
          })
        } else {
          this._getWeather()
        }
        this.setState({
          showMe: true,
          showWeather: true
        })
      }
    } else {
      if (this.state.showWeather) {
        mode_text = partner.mode ? `${partner.mode ? partner.mode : ''} 情绪值` : '还没有情绪值'
        if (partner.mode >= 0 && partner.mode <= 20) mode_icon = require('../../../res/images/home/icon_very_sad.png')
        if (partner.mode > 20 && partner.mode <= 40) mode_icon = require('../../../res/images/home/icon_sad.png')
        if (partner.mode > 40 && partner.mode <= 60) mode_icon = require('../../../res/images/home/icon_normal.png')
        if (partner.mode > 60 && partner.mode <= 80) mode_icon = require('../../../res/images/home/icon_happy.png')
        if (partner.mode > 80 && partner.mode <= 100) mode_icon = require('../../../res/images/home/icon_very_happy.png')
        if (!partner.mode) mode_icon = require('../../../res/images/home/icon_normal.png')

        this.setState({
          weather_text: mode_text,
          weather_icon: mode_icon,
          showMe: false,
          showWeather: false
        })
      } else {
        if (this.state.other_weather_text && this.state.other_weather_icon) {
          this.setState({
            weather_text: this.state.other_weather_text,
            weather_icon: this.state.other_weather_icon,
            showMe: false,
            showWeather: true
          })
        } else {
          try {
            const { latitude, longitude } = partner
            const location = await getLocation(longitude, latitude)
            // const location = await getLocation(113.387061, 23.053829)
            const weather = await getWeather(location.city)
            const { weather_text, weather_icon } = getWeatherDesc(weather)
            this.setState({
              weather_text,
              weather_icon,
              other_weather_text: weather_text,
              other_weather_icon: weather_icon,
              showMe: false,
              showWeather: true
            })
          } catch (e) {
            this.setState({
              weather_text: 'ta在的地方一定是晴天吧',
              weather_icon: require('../../../res/images/home/icon_sunny.png'),
              showMe: false,
              showWeather: true
            })

          }
        }
      }
    }
  }

  _renderItem({ item }) {
    return <Diary data={item} isProfileNote={false}/>
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

  _toggleCalendar() {
    this.setState({ showCalendar: !this.state.showCalendar })
    Animated.spring(
      this.state.calendarHeight,
      {
        toValue: this.state.showCalendar ? 0 : 250,
        duration: 300
      }
    ).start()
  }

  render() {

    return (
      <Container showNetStatus={true}>
        <View style={styles.header_container}>
          <TouchableOpacity
            style={styles.header_left}
            activeOpacity={1}
            onPress={() => this._toggleCalendar()}
          >
            <TextPingFang style={styles.text_month}>{this.state.month}</TextPingFang>
            <TextPingFang style={styles.text_year}>{this.state.year}</TextPingFang>
            {this.tri()}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.header_right_container}
            onPress={() => this.setState({
              filterDiaryList: this.state.diaryList,
              showDayTip: false,
              showWeatherTip: !this.state.showWeatherFlag,
              showWeatherFlag: true
            })}
          >
            <ImageBackground style={styles.header_right} source={require('../../../res/images/home/icon_calendar.png')}>
              <TextPingFang style={styles.text_day}>{this.state.day}</TextPingFang>
            </ImageBackground>
          </TouchableOpacity>


        </View>
        <View
          style={[styles.tip_container, { display: this.state.showDayTip ? 'flex' : 'none',position:this.state.showDayTip?'absolute':'relative' }]}
          animation='bounceIn'
        >
          <TextPingFang style={styles.text_tip}>点击这里回到当天日期哦</TextPingFang>
          <View style={styles.triangle}/>
        </View>

        <Animated.View
          style={[
            {
              maxHeight: this.state.calendarHeight
            }
          ]}
        >
          <CalendarList
            horizontal={true}
            pagingEnabled={true}
            theme={{
              calendarBackground: 'rgb(250,250,250)',
              textDayFontSize: 14,
            }}
            maxDate={new Date()}
            onDayPress={day => this.onDayPress(day)}
            onVisibleMonthsChange={months => this.setDate(months)}
            markedDates={this.state.markedDates}
            markingType={'multi-dot'}
          />
        </Animated.View>

        <View style={styles.weather}>
          <View style={styles.weather_inner}>
            <TouchableOpacity
              style={styles.inner_left}
              onPress={() => this.exchangeWM()}
            >
              <Image style={styles.weather_icon} source={this.state.weather_icon}/>
              <TextPingFang style={styles.text_weather}>{this.state.weather_text}</TextPingFang>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.weather_exchange, { display: this.props.partner.id ? 'flex' : 'none',position: this.props.partner.id ? 'absolute' : 'relative' }]}
              onPress={() => this.exchangeWeather()}
            >
              <Image source={this.state.exchange_icon}/>
            </TouchableOpacity>
          </View>

          {/* <View
           style={[styles.tip_container, { display: this.state.showWeatherTip ? 'flex' : 'none' }]}
           animation='bounceIn'
           >
           <TextPingFang style={styles.text_tip}>点击这里可以看到对方天气哦</TextPingFang>
           <View style={styles.triangle}/>
           </View> */}
        </View>

        <FlatList
          showsVerticalScrollIndicator={true}
          ref={ref => this.fl = ref}
          style={styles.diary_container}
          data={this.state.filterDiaryList}
          extraData={this.state}
          renderItem={this._renderItem}
          ListEmptyComponent={() => this._emptyDiary()}
          ListFooterComponent={() => this._listFooter()}
          onRefresh={() => this._formDiaryList(store.getState().diary)}
          refreshing={this.state.isRefreshing}
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
    color: '#000',
    fontSize: 34,
    fontWeight: '500'
  },
  text_year: {
    color: '#aaa',
    fontSize: 34,
    fontWeight: '300',
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
  tip_container: {
    display:'flex',
    width: getResponsiveWidth(164),
    height: getResponsiveWidth(37),
    position: 'absolute',
    right: getResponsiveWidth(8),
    top:getResponsiveWidth(90),
    //bottom: getResponsiveWidth(-35),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(8),
    zIndex: 99
  },
  triangle: {
    position: 'absolute',
    top: getResponsiveWidth(-16),
    right: getResponsiveWidth(16),
    borderBottomWidth: 8,
    borderBottomColor: '#2DC3A6',
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
  },
  text_tip: {
    color: '#fff',
    fontSize: 12
  },
  calendar: {
    width: WIDTH,
    height: (() => {
      if (HEIGHT === 568) return 280 // iphone 5/5s/SE
      if (HEIGHT === 667) return 190 // iphone 6/7/8
      if (HEIGHT === 736) return 335 // iphone 6P/7P/8P
      if (HEIGHT === 812) return 350 // iphone X
      if (HEIGHT === 598) return 350
      return 350
    })()
  },
  weather: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    zIndex: -10
  },
  weather_inner: {
    height: getResponsiveHeight(60),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: getResponsiveWidth(1),
    borderBottomColor: '#f1f1f1',
  },
  inner_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // weather_icon: {
  // },
  text_weather: {
    marginLeft: getResponsiveWidth(24),
    color: '#aaa',
    fontSize: 14,
    fontWeight: '400'
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
      if (HEIGHT === 598) return 310
      if (HEIGHT >= 640) return 310
    })(),
    width: WIDTH,
    //paddingLeft: getResponsiveWidth(24),
    //paddingRight: getResponsiveWidth(24),
    backgroundColor: 'transparent',
    zIndex: -10
  },
  diary_item:{
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
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
