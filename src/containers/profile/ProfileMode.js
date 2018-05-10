import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'
import TabBar from './components/TabBar'
import ModeCharts from './components/ModeCharts'

import {
  getResponsiveWidth,
} from '../../common/styles'

import HttpUtils from '../../network/HttpUtils'
import { MODES } from '../../network/Urls'

export default class ProfileMode extends Component {

  state = {
    totalModeData: { modes: [], timeRange: [] },
    weekModeData: { modes: [], timeRange: [] },
    monthModeData: { modes: [], timeRange: [] },
    yearModeData: { modes: [], timeRange: [] }
  }

  renderRightButton() {
    return (
      <TouchableOpacity
        style={styles.nav_right_btn}
      >
        <Image source={require('../../../res/images/common/icon_exchange.png')}/>
      </TouchableOpacity>
    )
  }

  async componentWillMount() {
    const res = await HttpUtils.get(MODES.show)
    if (res.code === 0) {
      const weekData = res.data.length >= 7 ? res.data.slice(-7) : res.data
      const monthData = res.data.length >= 30 ? res.data.slice(-30) : res.data
      const yearData = res.data.length >= 365 ? res.data.slice(-365) : res.data
      this.setState({
        weekModeData: this.formData(weekData, 'week'),
        monthModeData: this.formData(monthData, 'month'),
        yearModeData: this.formData(yearData, 'year'),
        totalModeData: this.formData(res.data, 'total'),
      })
    }
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

        if (timeRange.length === 0)timeRange.push(m)

        for(let i = 0; i < timeRange.length; i++) {
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
    return {modes, timeRange}
  }

  render() {
    return (
      <Container>
        <View>
          <ProfileHeader
            title='情绪图表'
            // rightButton={this.renderRightButton()}
          />

          <ScrollableTabView
            style={styles.tabview}
            renderTabBar={() => <TabBar tabNames={['一周', '一月', '一年', '全部']}/>}
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
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  tabview: {
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24),
  }
})
