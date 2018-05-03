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
import PropTypes from 'prop-types'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './ProfileHeader'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'

export default class TimeBar extends Component {
	static propTypes = {
		goToPage: PropTypes.func, // 跳转到对应tab的方法
		activeTab: PropTypes.number, // 当前被选中的tab下标
		tabs: PropTypes.array, // 所有tabs集合
		tabNames: PropTypes.array, // 保存Tab名称
	}

	renderTab(name, i) {
		return (
			<TouchableOpacity
				key={name}
				onPress={() => this.props.goToPage(i)}
				style={[styles.tab_item, this.props.activeTab === i ? styles.activeTab : null]}
			>
				<TextPingFang style={styles.text_tab}>
					{this.props.tabNames[i]}
				</TextPingFang>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<View style={styles.tabBarContainer}>
				{this.props.tabs.map((tab, i) => this.renderTab(tab, i))}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	tabBarContainer: {
		height: getResponsiveWidth(44),
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		borderBottomWidth: getResponsiveWidth(1),
		borderBottomColor: '#f6f6f6'
	},
	tab_item: {
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: getResponsiveWidth(2),
		borderBottomColor: 'transparent'
	},
	activeTab: {
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: getResponsiveWidth(2),
		borderBottomColor: '#2DC3A6'
	},
	text_tab: {
		color: '#000',
		fontSize: 14,
		fontWeight: '500'
	},
})
