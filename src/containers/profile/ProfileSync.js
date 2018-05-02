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

import TextPingFang from '../../components/TextPingFang'
import ProfileHeader from './ProfileHeader'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'

export default class ProfileSync extends Component {

	render() {
		return (
			<View>
				<ProfileHeader />
			</View>
		)
	}
}

const styles = StyleSheet.create({

})
