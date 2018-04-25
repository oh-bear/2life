import React, { Component } from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	StatusBar,
	Image
} from 'react-native'
import PropTypes from 'prop-types'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Swiper from 'react-native-swiper'
import ImagePicker from 'react-native-image-picker'

import { View, Text } from 'react-native-animatable'

import TextPingFang from '../../components/TextPingFang'
import CommonNav from '../../components/CommonNav'

import {
  HEIGHT,
  WIDTH,
  getResponsiveHeight,
  getResponsiveWidth
} from '../../common/styles'

export default class DiaryBanner extends Component {
  static propTypes = {
	}
	
	async _showPicker () {
		const options = {
			title: 'Select Avatar',
			customButtons: [
				{name: 'fb', title: 'Choose Photo from Facebook'},
			],
			storageOptions: {
				skipBackup: true,
				path: 'images'
			}
		}
		ImagePicker.showImagePicker(options, res => {
			console.log(res)
		})
	}

  render() {
    return (
			<View style={styles.container} animation='fadeIn'>
				<CommonNav
					navStyle={styles.nav_style}
					navBarStyle={styles.navbar_style}
				/>

				<Swiper
					width={WIDTH}
					height={getResponsiveWidth(282)}
					style={styles.swiper}
				>
					<TouchableOpacity
						style={styles.img_container}
						onPress={() => this._showPicker()}
					>
						<Image source={require('../../../res/images/home/icon_add_photo.png')}/>
					</TouchableOpacity>
				</Swiper>
			</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
	},
	nav_style: {
		position: 'absolute',
		top: 0,
		left: 0,
		...ifIphoneX({
			marginTop: 44
		}, {
			marginTop: 20
		}),
		zIndex: 2,
		backgroundColor: 'transparent'
	},
	navbar_style: {
		backgroundColor: 'transparent'
	},
	nav_bar: {
    width: WIDTH,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: getResponsiveWidth(18),
    paddingRight: getResponsiveWidth(18)
	},
	nav_left_container: {
    width: getResponsiveWidth(25)
  },
	swiper: {
		backgroundColor: '#f5f5f5'
	},
	img_container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
})
