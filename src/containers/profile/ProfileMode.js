import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	Image
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'
import TabBar from './components/TabBar'
import ModeCharts from './components/ModeCharts'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'

export default class ProfileMode extends Component {

	renderRightButton() {
		return (
			<TouchableOpacity
				style={styles.nav_right_btn}
				onPress={() => console.log('right')}
			>
				<Image source={require('../../../res/images/common/icon_exchange.png')}/>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<Container>
				<ScrollView>
					<ProfileHeader
						title='情绪图表'
						rightButton={this.renderRightButton()}
					/>

					<ScrollableTabView
						style={styles.tabview}
						renderTabBar={() => <TabBar tabNames={['一周','一年','一月','全部']}/>}
					>
						<ModeCharts
							modeData={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53]}
							timeRange={['日','一','二','三','四','五','六',]}
						/>
						<ModeCharts
							modeData={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53]}
							timeRange={['日','一','二','三','四','五','六',]}
						/>
						<ModeCharts
							modeData={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53]}
							timeRange={['日','一','二','三','四','五','六',]}
						/>
						<ModeCharts
							modeData={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53]}
							timeRange={['日','一','二','三','四','五','六',]}
						/>
					</ScrollableTabView>
				</ScrollView>
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
