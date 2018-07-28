import React, { Component } from 'react'
import {
	View,
	StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Echarts from 'native-echarts'

import TextPingFang from '../../../components/TextPingFang'

import {
	getResponsiveWidth
} from '../../../common/styles'

export default class Radar extends Component {

	static propTypes = {
		data: PropTypes.arrayOf(PropTypes.number).isRequired,
		height: PropTypes.number
	}

	render() {
		let max = Math.max(...this.props.data) / 0.9
		const option = {
			radar: {
				shape: 'circle',
				name: {
					color: '#333',
					fontSize: 14,
					backgroundColor: 'red'
				},
				indicator: [
					{ name: '喜悦', max },
					{ name: '低落', max },
					{ name: '厌恶', max },
					{ name: '愤怒', max },
				]
			},
			series: [{
				name: '测试结果',
				type: 'radar',
				data: [
					{
						value: this.props.data
					}
				],
				areaStyle: {
					normal: {
						opacity: 0.1,
						color: 'rgba(45, 195, 166, 1)'
					},
				},
				lineStyle: {
					normal: {
						color: 'rgba(45, 195, 166, 1)'
					},
				},
				itemStyle: {
					normal: {
						color: 'rgba(45, 195, 166, 1)',
					}
				},
			}]
		}

		return (
			<View style={styles.container}>
				<Echarts option={option} height={this.props.height} />
				<TextPingFang style={styles.text_title}>• 四维情绪雷达图</TextPingFang>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignItems: 'center'
	},
	text_title: {
		color: '#aaa',
		fontSize: 12,
		fontWeight: '400',
		marginTop: getResponsiveWidth(8)
	},
})
