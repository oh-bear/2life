import React, { Component } from 'react'
import {
	StyleSheet,
	ScrollView,
	TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'

import { View } from 'react-native-animatable'

import TextPingFang from './TextPingFang'
import privacyItems from '../constants/privacy'

import {
	HEIGHT,
	WIDTH,
	getResponsiveWidth
} from '../common/styles'

export default class PrivacyAgreement extends Component {
	static propTypes = {
		showPopup: PropTypes.bool.isRequired,
		onAgree: PropTypes.func.isRequired,
		onCancel: PropTypes.func
	}

	_renderText() {
		return (
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<TextPingFang style={styles.big_title}>双生日记隐私协议</TextPingFang>
				<TextPingFang style={styles.content}>双生日记尊重和保护用户的隐私，本隐私政策将告诉您我们如何收集和使用有关您的信息，以及我们如何保护这些信息的安全。您在注册用户之前请务必仔细阅读本隐私条款，如同意，本隐私政策条款在您注册成为双生日记的用户后立即生效。</TextPingFang>

				{
					privacyItems.map(item => {
						if(item.size === 'title') {
							return <TextPingFang style={styles.title}>{item.text}</TextPingFang>
						}
						if(item.size === 's_title') {
							return <TextPingFang style={styles.small_title}>{item.text}</TextPingFang>
						}
						if(item.size === 'content') {
							return <TextPingFang style={styles.content}>{item.text}</TextPingFang>
						}
					})
				}
			</ScrollView>
		)
	}

	render() {
		return (
			<View style={[styles.container, { display: this.props.showPopup ? 'flex' : 'none' }]}>
				<View style={styles.popup_container} animation='bounceIn'>
					{this._renderText()}
					<TouchableOpacity
						style={styles.btn}
						onPress={() => this.props.onAgree()}
						activeOpacity={1}
					>
						<TextPingFang style={styles.text_btn}>同意该隐私条款</TextPingFang>
					</TouchableOpacity>
				</View>

				<View
					style={styles.touch_view}
					onStartShouldSetResponder={() => true}
					onStartShouldSetResponder={() => this.props.onCancel()}
				></View>
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
		backgroundColor: 'rgba(0,0,0,.56)',
		zIndex: 100
	},
	touch_view: {
		width: WIDTH,
		height: HEIGHT,
		position: 'absolute',
		backgroundColor: 'transparent',
		zIndex: 10
	},
	popup_container: {
		width: getResponsiveWidth(311),
		height: getResponsiveWidth(415),
		paddingLeft: getResponsiveWidth(24),
		paddingRight: getResponsiveWidth(24),
		backgroundColor: '#fff',
		borderRadius: getResponsiveWidth(8),
		overflow: 'hidden',
		zIndex: 50
	},
	scroll: {
		paddingBottom: getResponsiveWidth(80)
	},
	big_title: {
		marginTop: getResponsiveWidth(40),
		color: '#333',
		fontSize: 24,
		fontWeight: '500'
	},
	title: {
		marginTop: getResponsiveWidth(16),
		color: '#333',
		fontSize: 18,
		fontWeight: '500'
	},
	small_title: {
		marginTop: getResponsiveWidth(16),
		color: '#333',
		fontSize: 16,
		fontWeight: '500'
	},
	content: {
		marginTop: getResponsiveWidth(16),
		color: '#333',
		fontSize: 14,
		fontWeight: '300',
	},
	btn: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: getResponsiveWidth(311),
		height: getResponsiveWidth(48),
		backgroundColor: '#2DC3A6',
		justifyContent: 'center',
		alignItems: 'center'
	},
	text_btn: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '400'
	}
})
