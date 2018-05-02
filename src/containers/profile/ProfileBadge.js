import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	ImageBackground,
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './ProfileHeader'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'

export default class ProfileBadge extends Component {

	render() {
		return (
			<Container hidePadding={true}>
				<ScrollView contentContainerStyle={styles.scroll_container}>
					<ImageBackground style={styles.bg_container} source={require('../../../res/images/profile/bg_badge.png')}>
						<ProfileHeader title='我的徽章'/>
						<View style={styles.badge_count}>
							<Image source={require('../../../res/images/profile/icon_badge_star.png')}/>
							<TextPingFang style={styles.text_badge_count}>12个</TextPingFang>
						</View>
					</ImageBackground>

					<View style={styles.badge_container}>
						<TextPingFang style={styles.badge_title}>成就徽章</TextPingFang>

						<View style={styles.badge_star}>
							<View style={styles.badge_item}>
								<View style={styles.bg_gray}>
									<Image source={require('../../../res/images/profile/icon_badge_undo.png')}/>
								</View>
								<TextPingFang style={styles.text_todo}>抒写10篇日记</TextPingFang>
							</View>

							<View style={styles.badge_item}>
								<View style={styles.bg_gray}>
									<Image source={require('../../../res/images/profile/icon_badge_undo.png')}/>
								</View>
								<TextPingFang style={styles.text_todo}>抒写20篇日记</TextPingFang>
							</View>

							<View style={styles.badge_item}>
								<View style={styles.bg_gray}>
									<Image source={require('../../../res/images/profile/icon_badge_undo.png')}/>
								</View>
								<TextPingFang style={styles.text_todo}>抒写30篇日记</TextPingFang>
							</View>
						</View>
						
					</View>
				</ScrollView>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	bg_container: {
		width: WIDTH,
		height: getResponsiveWidth(224),
		...ifIphoneX({
			paddingTop: 44
		}, {
			paddingTop: 20
		})
	},
	badge_count: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: getResponsiveWidth(24)
	},
	text_badge_count: {
		marginLeft: getResponsiveWidth(8),
		color: '#000',
		fontSize: 24,
		fontWeight: '500'
	},
	badge_container: {
		marginTop: getResponsiveWidth(40),
		paddingLeft: getResponsiveWidth(24),
		paddingRight: getResponsiveWidth(24),
	},
	badge_title: {
		color: '#000',
		fontSize: 20,
		fontWeight: '500'
	},
	badge_star: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: getResponsiveWidth(32),
	},
	badge_item: {
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	bg_gray: {
		width: getResponsiveWidth(85),
		height: getResponsiveWidth(85),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f7f7f7'
	},
	text_todo: {
		marginTop: getResponsiveWidth(8),
		color: '#000',
		fontSize: 12,
		fontWeight: '300'
	}
})
