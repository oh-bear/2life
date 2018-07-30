import React, { Component } from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	Switch,
	Image
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
		showSwitch: PropTypes.bool,
		switchValue: PropTypes.bool,
		onValueChange: PropTypes.func,
		tintColor: PropTypes.string
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
					style={[styles.row_right, {display: this.props.showSwitch ? 'flex' : 'none',position:this.props.showSwitch ? 'absolute' : 'relative'}]}
					value={this.props.switchValue}
					onValueChange={value => this.props.onValueChange(value)}
					onTintColor={this.props.tintColor || '#2DC3A6'}
				/>

				<TextPingFang style={styles.text_right}>{this.props.textRight}</TextPingFang>

				<Image style={[styles.row_right, {display: this.props.showSwitch ? 'none' : 'flex',position:this.props.showSwitch ? 'relative' : 'absolute'}]} source={require('../../../../res/images/common/icon_indicator.png')} />
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
