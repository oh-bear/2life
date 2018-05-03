import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	TextInput,
	Alert
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './ProfileHeader'
import TabBar from './TabBar'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'
import { SCENE_MATCH_RESULT } from '../../constants/scene'

export default class ProfileMatch extends Component {

	state = {
		matchType: 0, //0=随机，1=ID
		matchGender: 0,
		beMatched: true,
		character: '互补',
		matchUserId: null
	}

	componentDidMount() {
		this.setState({matchGender: !this.props.user.sex})
	}

	async match() {
		if (this.state.matchType === 1 && !this.state.matchUserId) {
			return Alert.alert('', '对方ID不能为空哦')
		}
		Actions.jump(SCENE_MATCH_RESULT)
	}

	render() {
		return (
			<Container>
				<ScrollView>
					<ProfileHeader
						title='选择你的匹配项'
						desc={`本月还能匹配${this.props.user.last_times ? this.props.user.last_times : 0}次`}
					/>

					<ScrollableTabView
						style={styles.tabview}
						renderTabBar={() => <TabBar tabNames={['随机匹配','ID匹配']}/>}
						onChangeTab={({i, from}) => this.setState({matchType: i})}
					>
						<View style={styles.tab_container}>

							<View style={styles.question_container}>
								<TextPingFang style={styles.text_question}>你希望匹配到</TextPingFang>
								<View style={styles.option_container}>
									<TouchableOpacity
										style={[styles.btn, this.state.matchGender !== this.props.user.sex ? styles.active_btn : null]}
										onPress={() => this.setState({matchGender: !this.props.user.sex})}
									>
										<TextPingFang style={[styles.text_btn, this.state.matchGender !== this.props.user.sex ? styles.active_text : null]}>异性</TextPingFang>
									</TouchableOpacity>
									<TouchableOpacity
										style={[styles.btn, this.state.matchGender === this.props.user.sex ? styles.active_btn : null]}
										onPress={() => this.setState({matchGender: this.props.user.sex})}
									>
										<TextPingFang style={[styles.text_btn, this.state.matchGender === this.props.user.sex ? styles.active_text : null]}>同性</TextPingFang>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.question_container}>
								<TextPingFang style={styles.text_question}>你是否希望被匹配</TextPingFang>
								<View style={styles.option_container}>
									<TouchableOpacity
										style={[styles.btn, this.state.beMatched ? styles.active_btn : null]}
										onPress={() => this.setState({beMatched: true})}
									>
										<TextPingFang style={[styles.text_btn, this.state.beMatched ? styles.active_text : null]}>希望</TextPingFang>
									</TouchableOpacity>
									<TouchableOpacity
										style={[styles.btn, !this.state.beMatched ? styles.active_btn : null]}
										onPress={() => this.setState({beMatched: false})}
									>
										<TextPingFang style={[styles.text_btn, !this.state.beMatched ? styles.active_text : null]}>不希望</TextPingFang>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.question_container}>
								<TextPingFang style={styles.text_question}>匹配者的性格</TextPingFang>
								<View style={styles.option_container}>
									<TouchableOpacity
										style={[styles.btn, this.state.character === '互补' ? styles.active_btn : null]}
										onPress={() => this.setState({character: '互补'})}
									>
										<TextPingFang style={[styles.text_btn, this.state.character === '互补' ? styles.active_text : null]}>互补</TextPingFang>
									</TouchableOpacity>

									<TouchableOpacity
										style={[styles.btn, this.state.character === '相同' ? styles.active_btn : null]}
										onPress={() => this.setState({character: '相同'})}
									>
										<TextPingFang style={[styles.text_btn, this.state.character === '相同' ? styles.active_text : null]}>相同</TextPingFang>
									</TouchableOpacity>
									
									<TouchableOpacity
										style={[styles.btn, this.state.character === '随意' ? styles.active_btn : null]}
										onPress={() => this.setState({character: '随意'})}
									>
										<TextPingFang style={[styles.text_btn, this.state.character === '随意' ? styles.active_text : null]}>随意</TextPingFang>
									</TouchableOpacity>
								</View>
							</View>

						</View>

						<View style={styles.tab_container}>
							<TextPingFang>请输入对方ID</TextPingFang>
							<TextInput
								style={styles.input}
								value={this.state.matchUserId}
								placeholder='Example: 123'
								keyboardType='numeric'
								onChangeText={id => this.setState({matchUserId: id})}
							/>
						</View>
					</ScrollableTabView>

					<TouchableOpacity
						style={styles.start_btn}
						onPress={() => this.match()}
					>
						<TextPingFang style={styles.text_start_btn}>开始匹配</TextPingFang>
					</TouchableOpacity>
				</ScrollView>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	tabview: {
		marginLeft: getResponsiveWidth(24),
		marginRight: getResponsiveWidth(24),
	},
	tab_container: {
		marginTop: getResponsiveWidth(32),
	},
	question_container: {
		height: getResponsiveWidth(63),
		justifyContent: 'space-between',
		marginTop: getResponsiveWidth(24)
	},
	text_question: {
		color: '#444',
		fontSize: 14
	},
	option_container: {
		flexDirection: 'row',
	},
	btn: {
		width: getResponsiveWidth(56),
		height: getResponsiveWidth(30),
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: getResponsiveWidth(24),
		borderWidth: getResponsiveWidth(1.3),
		borderColor: 'transparent',
		borderRadius: getResponsiveWidth(8)
	},
	active_btn: {
		borderColor: '#2DC3A6',
	},
	text_btn: {
		color: '#aaa',
		fontSize: 16
	},
	active_text: {
		color: '#2DC3A6'
	},
	input: {
		height: getResponsiveWidth(44),
		marginTop: getResponsiveWidth(8),
		color: '#000',
		fontSize: 14,
		borderBottomWidth: getResponsiveWidth(1),
		borderBottomColor: '#2DC3A6'
	},
	start_btn: {
		width: getResponsiveWidth(112),
		height: getResponsiveWidth(48),
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: getResponsiveWidth(50),
		marginLeft: WIDTH - getResponsiveWidth(136),
		backgroundColor: '#2DC3A6',
		borderRadius: getResponsiveWidth(24)
	}
})
