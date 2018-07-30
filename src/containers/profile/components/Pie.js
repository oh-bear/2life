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

export default class Pie extends Component {

	static propTypes = {
		data: PropTypes.arrayOf(PropTypes.number).isRequired,
		height: PropTypes.number
	}

	render() {
		const data = [
			{}
		]

		const option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				right: getResponsiveWidth(30),
				top: 'middle',
				itemGap: 8,
				itemWidth: 6,
				itemHeight: 6,
				data: ['积极情绪', '一般情绪', '消极情绪'],
				textStyle: {
					color: 'RGBA(51, 51, 51, 0.87)',
					fontSize: 14,
					fontWeight: '300'
				}
			},
			// backgroundColor: 'red',
			color: ['#2DC3A6', '#FAA755', '#F54E4E'],
			series: [
				{
					name: '日记情绪',
					type: 'pie',
					radius: ['50%', '70%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'left'
						},
						emphasis: {
							show: false,
							textStyle: {
								fontSize: '0',
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: [
						{ value: this.props.data[0], name: '积极情绪' },
						{ value: this.props.data[1], name: '一般情绪' },
						{ value: this.props.data[2], name: '消极情绪' }
					]
				}
			]
		};

		return (
			<View style={styles.container}>
				<Echarts option={option} height={this.props.height} />
				<TextPingFang style={styles.text_title}>• 情绪饼状图</TextPingFang>
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
