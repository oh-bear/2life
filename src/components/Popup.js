import React, { Component } from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	StatusBar,
	Image
} from 'react-native'
import PropTypes from 'prop-types'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Swiper from 'react-native-swiper'
import ImagePicker from 'react-native-image-picker'

import { View, Text } from 'react-native-animatable'

import TextPingFang from './TextPingFang'

import {
	HEIGHT,
	WIDTH,
	getResponsiveHeight,
	getResponsiveWidth
} from '../common/styles'

export default class Popup extends Component {
	static propTypes = {
		showPopup: PropTypes.bool.isRequired,
		popupBgColor: PropTypes.string.isRequired,
		icon: PropTypes.number,
		title: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		onPressLeft: PropTypes.func,
		onPressRight: PropTypes.func,
		textBtnLeft: PropTypes.string.isRequired,
		textBtnRight: PropTypes.string.isRequired,
	}

	render() {
		return (
			<View style={[styles.container, { display: this.props.showPopup ? 'flex' : 'none' }]}>
				<View style={[styles.popup_container, {backgroundColor: this.props.popupBgColor}]} animation='bounceIn'>
					<Image style={styles.icon} source={this.props.icon}/>
					<TextPingFang style={styles.text_title}>{this.props.title}</TextPingFang>
					<TextPingFang style={styles.text_content}>{this.props.content}</TextPingFang>

					<View style={styles.btn_container}>
						<TouchableOpacity onPress={this.props.onPressLeft}>
							<TextPingFang style={styles.text_btn_left}>{this.props.textBtnLeft}</TextPingFang>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.props.onPressRight}>
							<TextPingFang style={styles.text_btn_right}>{this.props.textBtnRight}</TextPingFang>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: WIDTH,
		height: HEIGHT,
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,.8)'
	},
	popup_container: {
		width: getResponsiveWidth(311),
		height: getResponsiveWidth(415),
		paddingLeft: getResponsiveWidth(40),
		paddingRight: getResponsiveWidth(24),
		backgroundColor: '#fff',
		borderRadius: getResponsiveWidth(8)
	},
	icon: {
		marginTop: getResponsiveWidth(48),
		marginBottom: getResponsiveWidth(32)
	},
	text_title: {
		color: '#000',
		fontSize: 24,
		fontWeight: 'bold'
	},
	text_content: {
		marginTop: getResponsiveWidth(24),
		color: '#000',
		fontSize: 16
	},
	btn_container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		left: getResponsiveWidth(40),
		bottom: getResponsiveWidth(24),
	},
	text_btn_left: {
		color: '#000',
		fontSize: 16,
		fontWeight: '500'
	}
})
