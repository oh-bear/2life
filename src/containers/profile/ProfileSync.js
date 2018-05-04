import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	Switch
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './ProfileHeader'
import Storage from '../../common/storage'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight,
} from '../../common/styles'

export default class ProfileSync extends Component {

	state = {
		isSync: true
	}

	async componentDidMount() {
		const isSync = await Storage.get('isSync', true)
		this.setState({isSync})
	}

	componentWillUnmount() {
		Storage.set('isSync', this.state.isSync)
	}
	

	render() {
		return (
			<Container>
				<ScrollView>
					<ProfileHeader title='日记同步'/>

					<View style={styles.container}>
						<View style={styles.row}>
							<TextPingFang style={styles.text_left}>同步</TextPingFang>
							<Switch
								value={this.state.isSync}
								onValueChange={isSync => this.setState({isSync})}
								onTintColor='#2DC3A6'
							/>
						</View>

						<TextPingFang style={styles.text_close_sync}>关闭同步功能将不能匹配对象，已经匹配对象的将会被解除关系！请谨慎！</TextPingFang>

						<View style={styles.row}>
							<TextPingFang style={styles.text_left}>同步间隔</TextPingFang>
							<TextPingFang style={styles.text_left}>15 Min</TextPingFang>
						</View>

						<View style={styles.row}>
							<TextPingFang style={styles.text_left}>储存</TextPingFang>
							<TextPingFang style={styles.text_left}>4.8MB</TextPingFang>
						</View>
					</View>

				</ScrollView>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: getResponsiveWidth(24),
		paddingRight: getResponsiveWidth(24),
	},
	row: {
		height: getResponsiveWidth(66),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: getResponsiveWidth(1),
		borderBottomColor: '#f1f1f1'
	},
	text_left: {
		color: '#000',
		fontSize: 20,
		fontWeight: '300'
	},
	text_close_sync: {
		marginTop: getResponsiveWidth(8),
		marginBottom: getResponsiveWidth(40),
		color: '#000',
		fontSize: 16,
		fontWeight: '300'
	}
})
