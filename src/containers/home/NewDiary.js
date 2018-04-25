import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ImageBackground,
	Image,
	ScrollView,
	TextInput,
	Keyboard,
	Alert
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import DiaryBanner from './DiaryBanner'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'
import { getMonth, getToday } from '../../common/util'

import HttpUtils from '../../network/HttpUtils'
import { NOTES } from '../../network/Urls'

const URL_publish = NOTES.publish

export default class NewDiary extends Component {

	state = {
		date: new Date(),
		title: '',
		content: '',
		images: '222',
		latitude: 0,
		longitude: 0,
		showKeyboard: false
	}

	componentDidMount () {
		Keyboard.addListener('keyboardDidShow', () => this.setState({showKeyboard: true}))
		Keyboard.addListener('keyboardDidHide', () => this.setState({showKeyboard: false}))
		this.getLocation()
	}

	getLocation () {
		navigator.geolocation.getCurrentPosition(res => {
			const latitude = res.coords.latitude
			const longitude = res.coords.longitude
			this.setState({latitude, longitude})
		}, err => {
			Alert.alert('', '无法获取地理位置')
		})
	}

	async saveDiary () {
		Keyboard.dismiss()

		const { title, content, images, latitude, longitude } = this.state
		const data = { title, content, images, latitude, longitude }
		const res = await HttpUtils.post(URL_publish, data)
		if (res.code === 0) {
			Alert.alert('', '日记保存成功')
		}
	}

  render() {
    return (
      <Container hidePadding={true}>
        
				<ScrollView>
					<DiaryBanner/>

					<View style={styles.date_container}>
						<TextPingFang style={styles.text_date}>{getMonth(this.state.date.getMonth())} </TextPingFang>
						<TextPingFang style={styles.text_date}>{this.state.date.getDate()}，</TextPingFang>
						<TextPingFang style={styles.text_date}>{this.state.date.getFullYear()}</TextPingFang>
					</View>

					
					<TextInput
						style={styles.text_title}
						onChangeText={title => this.setState({title})}
						placeholder='标题'
						placeholderTextColor='#aaa'
					/>

					<View style={styles.line}></View>

					<TextInput
						style={styles.text_content}
						onChangeText={content => this.setState({content})}
						placeholder='请输入正文'
						placeholderTextColor='#aaa'
						multiline
					/>

					<TouchableOpacity
						style={[styles.hide_keyboard, {display: this.state.showKeyboard ? 'flex' : 'none'}]}
						onPress={() => this.saveDiary()}
					>
						<TextPingFang style={styles.text_hide}>收起</TextPingFang>
					</TouchableOpacity>
				</ScrollView>
      </Container> 
    )
  }
}

const styles = StyleSheet.create({
  date_container: {
		width: WIDTH,
		flexDirection: 'row',
		paddingLeft: getResponsiveWidth(24),
		paddingTop: getResponsiveWidth(24),
		paddingBottom: getResponsiveWidth(24),
	},
	text_date: {
		color: '#aaa',
		fontSize: 12
	},
	text_title: {
		color: '#000',
		fontSize: 24,
		paddingLeft: getResponsiveWidth(24),
		paddingRight: getResponsiveWidth(24),
		paddingTop: getResponsiveWidth(48),
		paddingBottom: getResponsiveWidth(48),
	},
	line: {
		width: getResponsiveWidth(40),
		height: getResponsiveWidth(1),
		marginLeft: getResponsiveWidth(24),
		backgroundColor: '#aaa'
	},
	text_content: {
		color: '#444',
		fontSize: 16,
		height: getResponsiveWidth(240),
		paddingLeft: getResponsiveWidth(24),
		paddingRight: getResponsiveWidth(24),
		marginTop: getResponsiveWidth(24),
		paddingBottom: getResponsiveWidth(24),
	},
	hide_keyboard: {
		position: 'absolute',
		width: getResponsiveWidth(50),
		height: getResponsiveWidth(20),
		justifyContent: 'center',
		bottom: getResponsiveHeight(70),
		right: 2,
		backgroundColor: '#eee',
		borderRadius: getResponsiveWidth(10)
	},
	text_hide: {
		color: '#bbb',
		fontSize: 12,
		textAlign: 'center'
	}
})
