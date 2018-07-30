import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Switch,
	Image
} from 'react-native'
import PropTypes from 'prop-types'
import Echarts from 'native-echarts'

import TextPingFang from '../../../components/TextPingFang'

import {
	getResponsiveWidth
} from '../../../common/styles'

export default class Row extends Component {

	static propTypes = {
		
	}

	render() {
		return (
			<TouchableOpacity
				style={styles.container}
				onPress={() => this.props.onPress && this.props.onPress()}
				activeOpacity={this.props.onPress ? .2 : 1}
			>
				{this.props.imageLeft}

				<TextPingFang style={[styles.text_title, { marginLeft: this.props.imageLeft ? getResponsiveWidth(24) : 0}]}>{this.props.title}</TextPingFang>

				<Switch
					style={[styles.row_right, {display: this.props.showSwitch ? 'flex' : 'none'}]}
					value={this.props.switchValue}
					onValueChange={value => this.props.onValueChange(value)}
					onTintColor={this.props.tintColor || '#2DC3A6'}
				/>

				{/* <TextPingFang style={styles.text_title}>{this.props.title}</TextPingFang> */}

				<Image style={[styles.row_right, {display: this.props.showSwitch ? 'none' : 'flex'}]} source={require('../../../../res/images/common/icon_indicator.png')} />
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: getResponsiveWidth(44),
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
	},
	text_title: {
		color: '#000',
    fontSize: 16,
		fontWeight: '400'
	},
	row_right: {
    position: 'absolute',
    right: 0
  },
})
