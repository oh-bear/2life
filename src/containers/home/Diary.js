import React, { Component } from 'react'
import {
	View,
	StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'

import TextPingFang from '../../components/TextPingFang'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'
import { getMonth, getToday } from '../../common/util'

export default class Diary extends Component {
	static propTypes = {

	}

  render() {
    return (
      <View style={styles.container}>
				<TextPingFang style={styles.date}>{this.props.date}</TextPingFang>
				<TouchableOpacity style={styles.dairy_container}>
					<View style={styles.dairy_top}>
						<View style={styles.dairy_top_text}>
							<TextPingFang style={styles.text_dairy_title}>{this.props.dairy_title}</TextPingFang>
							<TextPingFang style={styles.text_dairy_brief} numberOfLines={2}>{this.props.dairy_brief}</TextPingFang>
						</View>
						<Image style={[styles.img_dairy, {display: this.props.dairy_img ? 'flex' : 'none'}]} source={this.props.dairy_img}/>
					</View>
					<View style={styles.dairy_bottom}>
						<TextPingFang style={styles.time}>{this.props.diary_time}</TextPingFang>
						<View style={styles.location_container}>
							<Image source={require('../../../res/images/home/icon_location.png')}/>
							<TextPingFang style={styles.text_location}>{this.props.dairy_location}</TextPingFang>
						</View>
					</View>
				</TouchableOpacity>
			</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
		width: '100%',
		height: getResponsiveHeight(140),
		flexDirection: 'row',
		paddingTop: getResponsiveWidth(16),
		paddingBottom: getResponsiveWidth(16),
		backgroundColor: '#fff'
	},
	date: {
		color: '#aaa',
		fontSize: 14,
	},
	dairy_container: {
		flex: 1,
		marginLeft: getResponsiveWidth(24),
		justifyContent: 'space-between'
	},
	dairy_top: {
		height: getResponsiveHeight(72),
		flexDirection: 'row',
		justifyContent: 'space-between',
		// alignItems: 'center',
	},
	dairy_top_text: {
		flex: 1,
		paddingRight: getResponsiveWidth(10),
		height: getResponsiveWidth(72),
	},
	text_dairy_title: {
		color: '#444',
		fontSize: 20
	},
	text_dairy_brief: {
		color: '#666',
		fontSize: 12,
	},
	img_dairy: {
		width: getResponsiveWidth(72),
		height: getResponsiveWidth(72)
	},
	dairy_bottom: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingRight: getResponsiveWidth(10),
	},
	time: {
		color: '#000',
		fontSize: 12
	},
	location_container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
})
