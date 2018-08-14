import React, { Component } from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	Switch,
	Image,
	View
} from 'react-native'
import PropTypes from 'prop-types'

import TextPingFang from '../../../components/TextPingFang'

import {
	getResponsiveWidth
} from '../../../common/styles'

export default class Row extends Component {

	static propTypes = {
		onPress: PropTypes.func,
		imageLeft: PropTypes.element,
		title: PropTypes.string,
		textRight: PropTypes.string,
		textRightStyle: PropTypes.object,
		showSwitch: PropTypes.bool,
		switchValue: PropTypes.bool,
		onValueChange: PropTypes.func,
		tintColor: PropTypes.string,
		showRedPoint: PropTypes.bool
	}

	render() {
		return (
			<TouchableOpacity
				style={styles.container}
				onPress={() => this.props.onPress && this.props.onPress()}
				activeOpacity={this.props.onPress ? .2 : 1}
			>
				{this.props.imageLeft}

				<TextPingFang style={[styles.text_title, { marginLeft: this.props.imageLeft ? getResponsiveWidth(23) : 0}]}>
					{this.props.title}
				</TextPingFang>

				<View style={[styles.red_point, {display: this.props.showRedPoint ? 'flex' : 'none'}]}></View>

				<Switch
					style={[styles.row_right, {display: this.props.showSwitch ? 'flex' : 'none'}]}
					value={this.props.switchValue}
					onValueChange={value => this.props.onValueChange(value)}
					onTintColor={this.props.tintColor || '#2DC3A6'}
				/>

				<TextPingFang style={[styles.text_right, this.props.textRightStyle]}>{this.props.textRight}</TextPingFang>

				<Image style={[styles.row_right, {display: this.props.showSwitch ? 'none' : 'flex'}]} source={require('../../../../res/images/common/icon_indicator.png')} />
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: getResponsiveWidth(64),
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
	},
	red_point: {
		width: 8,
		height: 8,
		marginLeft: 4,
		bottom: 9,
		backgroundColor: '#F54E4F',
		borderRadius: 4,
		zIndex: 100
	},
	text_title: {
		color: '#333',
    fontSize: 16,
		fontWeight: '300'
	},
	text_right: {
		position: 'absolute',
    right: 20,
		color: '#333',
    fontSize: 14,
		fontWeight: '300'
	},
	row_right: {
    position: 'absolute',
    right: 0
  },
})
