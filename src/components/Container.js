import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
} from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import PropTypes from 'prop-types'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../common/styles'

export default class Container extends Component {
	static propTypes = {
		hidePadding: PropTypes.bool
	}
	
	render() {
		let paddingTop = isIphoneX() ? 44 : 20

		return (
			<View 
				contentContainerStyle={[
					styles.container,
					{
						paddingTop: this.props.hidePadding ? 0 : paddingTop
					}
				]}
			>
				{this.props.children}
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    width: WIDTH,
		minHeight: HEIGHT,
  }
})
