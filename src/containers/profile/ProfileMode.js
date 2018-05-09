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

export default class ProfileMode extends Component {

  renderRightButton() {
    return (
      <TouchableOpacity
        style={styles.nav_right_btn}
      >
        <Image source={require('../../../res/images/common/icon_exchange.png')}/>
      </TouchableOpacity>
    )
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
            renderTabBar={() => <TabBar tabNames={['一周', '一年', '一月', '全部']}/>}
          >
            <ModeCharts
              modeData={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53]}
              timeRange={['日', '一', '二', '三', '四', '五', '六',]}
            />
            <ModeCharts
              modeData={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53]}
              timeRange={['日', '一', '二', '三', '四', '五', '六',]}
            />
            <ModeCharts
              modeData={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53]}
              timeRange={['日', '一', '二', '三', '四', '五', '六',]}
            />
            <ModeCharts
              modeData={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53]}
              timeRange={['日', '一', '二', '三', '四', '五', '六',]}
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
