import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Image,
	TouchableOpacity
} from 'react-native'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import Popup from '../../components/Popup'
import ProfileHeader from './components/ProfileHeader'
import Storage from '../../common/storage'

import {
	WIDTH,
	getResponsiveWidth,
} from '../../common/styles'

export default class ProfileReward extends Component {

	state = {
		bg: require('../../../res/images/profile/bg-6.png'),
		selecting: 1
	}

	render() {
		return (
			<Container>
				<ProfileHeader title='打赏' />

				<Image source={this.state.bg}/>

				<View style={styles.container}>
					<TouchableOpacity
						style={[styles.item, this.state.selecting === 1 ? styles.item_selecting : null]}
						onPress={() => this.setState({bg: require('../../../res/images/profile/bg-6.png'), selecting: 1})}
					>
						<TextPingFang style={styles.text_top}>赏金</TextPingFang>
						<View style={styles.money_container}>
							<TextPingFang style={styles.text_money}>￥</TextPingFang>
							<TextPingFang style={[styles.text_money, styles.text_bold]}>6</TextPingFang>
							<TextPingFang style={styles.text_money}>.00</TextPingFang>
						</View>
						<TextPingFang style={styles.text_bottom}>两罐可乐</TextPingFang>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.item, this.state.selecting === 2 ? styles.item_selecting : null]}
						onPress={() => this.setState({bg: require('../../../res/images/profile/bg-16.png'), selecting: 2})}
					>
						<TextPingFang style={styles.text_top}>赏金</TextPingFang>
						<View style={styles.money_container}>
							<TextPingFang style={styles.text_money}>￥</TextPingFang>
							<TextPingFang style={[styles.text_money, styles.text_bold]}>16</TextPingFang>
							<TextPingFang style={styles.text_money}>.00</TextPingFang>
						</View>
						<TextPingFang style={styles.text_bottom}>一个汉堡</TextPingFang>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.item, this.state.selecting === 3 ? styles.item_selecting : null]}
						onPress={() => this.setState({bg: require('../../../res/images/profile/bg-30.png'), selecting: 3})}
					>
						<TextPingFang style={styles.text_top}>赏金</TextPingFang>
						<View style={styles.money_container}>
							<TextPingFang style={styles.text_money}>￥</TextPingFang>
							<TextPingFang style={[styles.text_money, styles.text_bold]}>30</TextPingFang>
							<TextPingFang style={styles.text_money}>.00</TextPingFang>
						</View>
						<TextPingFang style={styles.text_bottom}>一杯咖啡</TextPingFang>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					style={styles.btn}
				>
					<TextPingFang style={styles.text_btn}>打赏作者</TextPingFang>
				</TouchableOpacity>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: WIDTH,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: getResponsiveWidth(24),
		paddingRight: getResponsiveWidth(24),
	},
	item: {
		width: getResponsiveWidth(100),
		height: getResponsiveWidth(140),
		justifyContent: 'space-around',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#f1f1f1',
		borderRadius: getResponsiveWidth(8)
	},
	item_selecting: {
		borderColor: '#2DC3A6',
	},
	text_top: {
		color: '#000',
		fontSize: 12
	},
	money_container: {
		flexDirection: 'row',
		alignItems: 'baseline',
		top: -8
	},
	text_money: {
		color: '#000',
		fontSize: 12,
		fontWeight: 'bold',
	},
	text_bold: {
		fontSize: 32,
		textAlignVertical: 'bottom',
		top: 8
	},
	text_bottom: {
		color: '#000',
		fontSize: 12,
		fontWeight: 'bold'
	},
	btn: {
    width: getResponsiveWidth(112),
    height: getResponsiveWidth(48),
    justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		right: getResponsiveWidth(24),
		bottom: getResponsiveWidth(80),
    backgroundColor: '#2DC3A6',
    borderRadius: getResponsiveWidth(24)
  }
})
