import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ScrollView
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { Actions } from '../../../node_modules/react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import TabBar from './components/TabBar'
import ModeCharts from './components/ModeCharts'
import Pie from './components/Pie'
import Radar from './components/Radar'

import {
  getResponsiveWidth,
  WIDTH
} from '../../common/styles'
import { readFile } from '../../common/util'
import { SCENE_PROFILE_TEST } from '../../constants/scene'
import HttpUtils from '../../network/HttpUtils'
import { UTILS } from '../../network/Urls'

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

@connect(mapStateToProps)
export default class ProfileMode extends Component {

  state = {
    totalModeData: { modes: [], timeRange: [] },
    weekModeData: { modes: [], timeRange: [] },
    monthModeData: { modes: [], timeRange: [] },
    yearModeData: { modes: [], timeRange: [] },
    averageMode: 0,
    totalDay: 0,
    emotions: [],
    pieData: [],
    reportList: [],
    characterImg: null
  }

  async componentWillMount() {
    let user = this.props.user

    const res = await HttpUtils.get(UTILS.update_emotion_report)
    if (res.code === 0) {
      user = res.data
    }

    let emotions = [], reportList = []
    if (user.emotions_basis) {
      const reports = user.emotions_report.split('\n')
      for (let report of reports) {
        const indexLeft = report.indexOf('（')
        const indexRight = report.indexOf('）')
        const title = report.slice(indexLeft + 1, indexRight)
        const content = report.slice(0, indexLeft)

        reportList.push({ title, content })
      }

      emotions = user.emotions.split(',').map(num => +num)
    }

    this.setCharacterImg(user.emotions_type)


    // 获得我的所有日记情绪值
    const diaryList = await readFile(user.id)
    let myDiaryList = diaryList.filter(diary => diary.user_id === user.id)
    myDiaryList.sort((a, b) => a.date - b.date)

    let modeData = [], totalMode = 0, posDays = 0, midDays = 0, negDays = 0
    for (let diary of myDiaryList) {
      modeData.push({
        [diary.date]: diary.mode
      })

      totalMode += diary.mode
      diary.mode <= 33.33 ? negDays++ : null
      33.33 < diary.mode && diary.mode <= 66.66 ? midDays++ : null
      66.66 < diary.mode && diary.mode <= 100 ? posDays++ : null
    }

    const mergeData = this.mergeData(modeData)
    const weekData = mergeData.length >= 7 ? mergeData.slice(-7) : mergeData
    const monthData = mergeData.length >= 30 ? mergeData.slice(-30) : mergeData
    const yearData = mergeData.length >= 365 ? mergeData.slice(-365) : mergeData

    this.setState({
      averageMode: (totalMode / myDiaryList.length).toFixed(2),
      totalDay: mergeData.length,
      emotions,
      pieData: [posDays, midDays, negDays],
      reportList,
      weekModeData: this.formData(weekData, 'week'),
      monthModeData: this.formData(monthData, 'month'),
      yearModeData: this.formData(yearData, 'year'),
      totalModeData: this.formData(modeData, 'total'),
    })
  }

  // 将情绪值按日期分类，相同天数的日记取情绪平均值
  mergeData(modeData) {

    let newModeData = []
    let sameDayModes = []
    let sameDayStr = ''
    let sameDayTs = 0

    modeData.forEach((data, index) => {
      const mode = Object.values(data)[0]
      const ts = Object.keys(data)[0]
      const date = new Date(parseInt(ts))
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      const dayStr = `${y}.${m}.${d}`

      if (!sameDayStr) {
        sameDayStr = dayStr
        sameDayTs = ts
        sameDayModes.push(mode)
        return
      }

      if (sameDayStr && (sameDayStr === dayStr)) {
        sameDayModes.push(mode)
      }

      if (sameDayStr && (sameDayStr !== dayStr)) {
        newModeData.push({ [sameDayTs]: sameDayModes.reduce((accu, curr) => accu + curr) / sameDayModes.length })
        sameDayStr = dayStr
        sameDayTs = ts
        sameDayModes = []
        sameDayModes.push(mode)
      }

      if (index === modeData.length - 1) {
        newModeData.push({ [sameDayTs]: sameDayModes.reduce((accu, curr) => accu + curr) / sameDayModes.length })
      }
    })
    return newModeData
  }

  formData(modeData, type) {
    let modes = [], timeRange = []

    modeData.forEach((data, index) => {
      const mode = Object.values(data)[0]
      modes.push(mode)

      const ts = Object.keys(data)[0]
      const date = new Date(parseInt(ts))

      if (type === 'week') {
        const m = date.getMonth() + 1
        const d = date.getDate()
        timeRange.push(`${m}.${d}`)
      }

      if (type === 'month' && (index === 0 || index === Math.floor((modeData.length - 1) / 2) || index === modeData.length - 1)) {
        const m = date.getMonth() + 1
        const d = date.getDate()
        timeRange.push(`${m}.${d}`)
      }

      if (type === 'year') {
        const m = date.getMonth() + 1 + '月'

        if (timeRange.length === 0) timeRange.push(m)

        for (let i = 0; i < timeRange.length; i++) {
          if (timeRange[i] === m) break
          if (i === timeRange.length - 1) timeRange.push(m)
        }
      }

      if (type === 'total' && (index === 0 || index === modeData.length - 1)) {
        const y = date.getFullYear()
        const m = date.getMonth() + 1
        const d = date.getDate()
        timeRange.push(`${y}.${m}.${d}`)
      }
    })

    return { modes, timeRange }
  }

  setCharacterImg(type) {
    let source
    switch (type) {
      case '实干主义者':
        source = require('../../../res/images/profile/character/e_tianshi.jpg')
        break;
      case '心灵多面手':
        source = require('../../../res/images/profile/character/e_tianxin.jpg')
        break;
      case '温和思想家':
        source = require('../../../res/images/profile/character/e_qingnian.jpg')
        break;
      case '自我笃行者':
        source = require('../../../res/images/profile/character/e_xiaozi.jpg')
        break;
      case '恬淡小天使':
        source = require('../../../res/images/profile/character/e_tianshi.jpg')
        break;
      case '温暖小甜心':
        source = require('../../../res/images/profile/character/e_tianxin.jpg')
        break;
      case '元气小青年':
        source = require('../../../res/images/profile/character/e_qingnian.jpg')
        break;
      case '品质小资':
        source = require('../../../res/images/profile/character/e_xiaozi.jpg')
        break;
      case '躁动小魔王':
        source = require('../../../res/images/profile/character/c_mowang.jpg')
        break;
      case '科学小怪人':
        source = require('../../../res/images/profile/character/c_guairen.jpg')
        break;
      case '极致主义者':
        source = require('../../../res/images/profile/character/c_zhuyizhe.jpg')
        break;
      case '暴躁领袖':
        source = require('../../../res/images/profile/character/c_lingxiu.jpg')
        break;
      case '厌世大魔王':
        source = require('../../../res/images/profile/character/o_mowang.jpg')
        break;
      case '灵性创作家':
        source = require('../../../res/images/profile/character/o_chuangzuojia.jpg')
        break;
      case '小世界掌控家':
        source = require('../../../res/images/profile/character/o_zhangkongjia.jpg')
        break;
      case '灵魂多面手':
        source = require('../../../res/images/profile/character/o_duomianshou.jpg')
        break;
      case '忧郁小王子':
        source = require('../../../res/images/profile/character/n_wangzi.jpg')
        break;
      case '忧伤小绵羊':
        source = require('../../../res/images/profile/character/n_mianyang.jpg')
        break;
      case '谦和小智者':
        source = require('../../../res/images/profile/character/n_zhizhe.jpg')
        break;
      case '忧郁小麋鹿':
        source = require('../../../res/images/profile/character/n_milu.jpg')
        break;
      default:
        source = require('../../../res/images/profile/character/untested.png')
        break;
    }
    this.setState({characterImg: source})
  }

  render() {
    return (
      <Container>
        <TextPingFang style={styles.title}>情绪图表</TextPingFang>

        <ScrollView contentContainerStyle={styles.scroll_container}>
          <ScrollableTabView
            style={styles.chart_height}
            renderTabBar={() => <TabBar tabNames={['一周', '一月', '一年', '全部']} />}
          >
            <ModeCharts
              modeData={this.state.weekModeData.modes}
              timeRange={this.state.weekModeData.timeRange}
            />
            <ModeCharts
              modeData={this.state.monthModeData.modes}
              timeRange={this.state.monthModeData.timeRange}
            />
            <ModeCharts
              modeData={this.state.yearModeData.modes}
              timeRange={this.state.yearModeData.timeRange}
            />
            <ModeCharts
              modeData={this.state.totalModeData.modes}
              timeRange={this.state.totalModeData.timeRange}
            />
          </ScrollableTabView>

          <View style={styles.total_container}>
            <View style={styles.total_inner_container}>
              <TextPingFang style={styles.text_top}>{this.state.totalDay}</TextPingFang>
              <TextPingFang style={styles.text_bottom}>累计写日记/天</TextPingFang>
            </View>
            <View style={styles.total_inner_container}>
              <TextPingFang style={styles.text_top}>{this.state.averageMode || 0}</TextPingFang>
              <TextPingFang style={styles.text_bottom}>平均情绪值</TextPingFang>
            </View>
          </View>

          <View style={styles.pie_container}>
            <Pie data={this.state.pieData} height={getResponsiveWidth(180)} />
          </View>

          <View style={[styles.radar_container, { display: this.props.user.emotions_basis ? 'flex' : 'none'} ]}>
            <Radar data={this.state.emotions} height={getResponsiveWidth(220)} />
          </View>

          <View style={[styles.report_container, { display: this.props.user.emotions_basis ? 'flex' : 'none'} ]}>
            <TextPingFang style={styles.text_type}>{this.props.user.emotions_type}</TextPingFang>
            <TextPingFang style={styles.text_const}>你的性格属性</TextPingFang>
            <Image style={styles.img} resizeMethod='scale' source={this.state.characterImg} />
            {
              this.state.reportList.map(report => {
                return (
                  <View key={report.title}>
                    <TextPingFang style={styles.small_type}>{report.title}</TextPingFang>
                    <TextPingFang style={styles.text_report}>{report.content}</TextPingFang>
                  </View>
                )
              })
            }

          </View>

          <View style={[styles.report_container, { display: this.props.user.emotions_basis ? 'none' : 'flex' }]}>
            <Image style={styles.img} resizeMethod='scale' source={require('../../../res/images/profile/character/untested.png')} />
            <TextPingFang style={styles.text_test}>性格测试</TextPingFang>
            <TextPingFang style={styles.text_report}>我们准备了一个好玩的测试，可以分析出你的性格属性。测试完成后你不但可以看到你的五维情绪雷达图，还有你的性格属性哦。</TextPingFang>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => Actions.jump(SCENE_PROFILE_TEST)}
            >
              <TextPingFang style={styles.text_btn}>开始测试</TextPingFang>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(48),
    ...ifIphoneX({
      paddingTop: getResponsiveWidth(4),
    }, {
      paddingTop: getResponsiveWidth(28),
    }),
    color: '#000',
    fontSize: 34,
    fontWeight: '500',
  },
  scroll_container: {
    //marginLeft: getResponsiveWidth(24),
    //marginRight: getResponsiveWidth(24)
  },
  chart_height:{
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24),
    height:getResponsiveWidth(300)
  },
  total_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: getResponsiveWidth(56)
  },
  total_inner_container: {
    alignItems: 'center'
  },
  text_top: {
    color: '#333',
    fontSize: 20,
    fontWeight: '500'
  },
  text_bottom: {
    color: '#666',
    fontSize: 12,
    fontWeight: '400'
  },
  pie_container: {
    marginTop: getResponsiveWidth(32),
    width:WIDTH
  },
  radar_container: {
    marginTop: getResponsiveWidth(56)
  },
  report_container: {
    justifyContent: 'space-between',
    marginTop: getResponsiveWidth(56),
    marginBottom: getResponsiveWidth(24),
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24)
  },
  text_type: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold'
  },
  text_const: {
    color: '#333',
    fontSize: 14,
    fontWeight: '400',
    marginTop: getResponsiveWidth(8),
    marginBottom: getResponsiveWidth(8),
  },
  img: {
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 8
  },
  small_type: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: getResponsiveWidth(24)
  },
  text_report: {
    color: '#333',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: getResponsiveWidth(26),
    marginTop: getResponsiveWidth(8)
  },
  text_test: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: getResponsiveWidth(24)
  },
  btn: {
    width: WIDTH - getResponsiveWidth(48),
    height: getResponsiveWidth(52),
    marginTop: getResponsiveWidth(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5'
  },
  text_btn: {
    color: '#2DC3A6',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500'
  },
})
