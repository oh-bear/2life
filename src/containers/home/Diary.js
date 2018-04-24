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

class SingleDiary extends Component {
	static propTypes = {

	}

	render () {
		return (
			<TouchableOpacity style={styles.dairy_container}>
				<View style={styles.dairy_top}>
					<View style={styles.dairy_top_text}>
						<TextPingFang style={styles.text_dairy_title} numberOfLines={1}>{this.props.dairy_title}</TextPingFang>
						<TextPingFang style={styles.text_dairy_brief} numberOfLines={2}>{this.props.dairy_brief}</TextPingFang>
					</View>
					<Image style={[styles.img_dairy, {display: this.props.dairy_img ? 'flex' : 'none'}]} source={this.props.dairy_img}/>
				</View>
				<View style={styles.dairy_bottom}>
					<TextPingFang style={styles.time}>{this.props.diary_time}</TextPingFang>
					<View style={styles.location_container}>
						<Image style={styles.location_icon} source={require('../../../res/images/home/icon_location.png')}/>
						<TextPingFang style={styles.text_location}>{this.props.dairy_location}</TextPingFang>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

export default class Diary extends Component {
	static propTypes = {
		date: PropTypes.string.isRequired,
		data: PropTypes.arrayOf(PropTypes.object).isRequired,
	}

  render () {
    return (
      <View style={styles.container}>
				<TextPingFang style={styles.date}>{this.props.date}</TextPingFang>
				<View style={styles.main_container}>
					{
						this.props.data.map((dairy, index) => {
							return (
								<SingleDiary
									key={index}
									date={dairy.date}
									dairy_img={dairy.dairy_img}
									dairy_title={dairy.dairy_title}
									dairy_brief={dairy.dairy_brief}
									diary_time={dairy.diary_time}
									dairy_location={dairy.dairy_location}
								/>
							)
						})
					}
				</View>
			</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
		width: '100%',
		flexDirection: 'row',
		paddingBottom: getResponsiveWidth(16),
		backgroundColor: '#fff'
	},
	date: {
		paddingTop: getResponsiveWidth(16),
		color: '#aaa',
		fontSize: 14,
	},
	main_container: {
		flex: 1
	},
	dairy_container: {
		marginLeft: getResponsiveWidth(24),
		paddingTop: getResponsiveWidth(16),
		paddingBottom: getResponsiveWidth(16),
		justifyContent: 'space-between',
		borderBottomWidth: getResponsiveWidth(1),
		borderBottomColor: '#f1f1f1'
	},
	dairy_top: {
		height: getResponsiveHeight(72),
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	dairy_top_text: {
		flex: 1,
		height: getResponsiveWidth(72),
		paddingRight: getResponsiveWidth(10),
		justifyContent: 'space-between',
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
	location_icon: {
		marginRight: getResponsiveWidth(8)
	},
	text_location: {
		color: '#aaa',
		fontSize: 12
	}
})
