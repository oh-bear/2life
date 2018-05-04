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
import PropTypes from 'prop-types'
import { LineChart, Grid} from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import TextPingFang from '../../../components/TextPingFang'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../../common/styles'

export default class ModeCharts extends Component {
	static propTypes = {
		modeData: PropTypes.arrayOf(PropTypes.number).isRequired,
		timeRange: PropTypes.arrayOf(PropTypes.string).isRequired
	}

	render() {

		const contentInset = { top: 20, bottom: 20 }

		return (
			<View style={styles.container}>
				<View style={styles.top_container}>
					<View style={styles.yaxis}>
						<View style={styles.y_item}>
							<TextPingFang style={styles.text_axis_item}>积极</TextPingFang>
						</View>
						<View style={styles.y_item}>
							<TextPingFang style={styles.text_axis_item}>中级</TextPingFang>
						</View>
						<View style={styles.y_item}>
							<TextPingFang style={styles.text_axis_item}>消极</TextPingFang>
						</View>
					</View>

					<LineChart
						style={styles.line_chart}
						data={this.props.modeData}
						svg={{ stroke: '#2DC3A6', strokeWidth: 1.5}}
						curve={ shape.curveNatural }
						contentInset={{ top: 20, bottom: 20 }}
						animate={true}
					>
					</LineChart>
				</View>

				<View style={styles.xaxis}>
					{
						this.props.timeRange.map(time => {
							return (
								<TextPingFang style={styles.text_axis_item}>{time}</TextPingFang>
							)
						})
					}
				</View>				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: getResponsiveWidth(48)
	},
	top_container: {
		flexDirection: 'row',
		// backgroundColor: 'red'
	},
	yaxis: {
		width: '100%',
		height: getResponsiveHeight(168),
		position: 'absolute',
	},
	y_item: {
		height: getResponsiveHeight(56),
		justifyContent: 'flex-end',
		borderBottomWidth: getResponsiveWidth(1),
		borderBottomColor: 'rgba(45,195,166,.15)',
	},
	text_axis_item: {
		color: '#000',
		fontSize: 12,
	},
	line_chart: {
		flex: 1,
		height: getResponsiveHeight(168),
		marginLeft: getResponsiveWidth(32),
	},
	xaxis: {
		height: getResponsiveHeight(24),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginLeft: getResponsiveWidth(32)
	}
})
