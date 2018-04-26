import React, { Component } from 'react'
import {
	View,
	StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import CommonNav from '../../components/CommonNav'
import DiaryBanner from './DiaryBanner'

import {
	WIDTH,
	HEIGHT,
	getResponsiveWidth,
	getResponsiveHeight
} from '../../common/styles'
import { getMonth, getLocation } from '../../common/util'

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

@connect(mapStateToProps)
export default class DiaryDetail extends Component {

  state = {
    showBanner: false,
    imageList: [],
    location: '',
    likeComponent: null
  }

  async componentWillMount () {
    if (this.props.diary.images) {
      let imageList = this.props.diary.images.split('&')
      this.setState({imageList, showBanner: true})
    } else {
      this.setState({showBanner: false})
    }
    const location = await getLocation(this.props.diary.longitude, this.props.diary.latitude)
    this.setState({location})
    
    this.renderlikeComponent()
  }

  renderlikeComponent () {
    let likeComponent
    if (this.props.diary.is_liked) {
      likeComponent = <Image style={styles.img_btn} source={require('../../../res/images/home/icon_liked.png')}/>
    } else {
      likeComponent = <Image style={styles.img_btn} source={require('../../../res/images/home/icon_like.png')}/>
    }
    this.setState({likeComponent})
  }

  render() {
    return (
      <Container hidePadding={this.state.showBanner}>
        <ScrollView>
          <DiaryBanner
            showBanner={this.state.showBanner}
            imageList={this.state.imageList}
            showNav={true}
          />

          <CommonNav
            navStyle={[styles.nav_style, {display: this.state.showBanner ? 'none' : 'flex'}]}
            navBarStyle={styles.navbar_style}
            rightButton={this.props.rightButton}
          />

          <View style={styles.date_container}>
						<TextPingFang style={styles.text_date}>{getMonth(new Date(this.props.diary.date).getMonth())} </TextPingFang>
						<TextPingFang style={styles.text_date}>{new Date(this.props.diary.date).getDate()}，</TextPingFang>
						<TextPingFang style={styles.text_date}>{new Date(this.props.diary.date).getFullYear()}</TextPingFang>
					</View>

          <TextPingFang style={styles.text_title}>{this.props.diary.title}</TextPingFang>

          <View style={styles.line}></View>

          <TextPingFang style={styles.text_content}>{this.props.diary.content}</TextPingFang>

          <View style={styles.location_container}>
						<Image style={styles.location_icon} source={require('../../../res/images/home/icon_location.png')}/>
						<TextPingFang style={styles.text_location}>{this.state.location}</TextPingFang>
					</View>

          <View style={styles.mode_container}>
						<Image style={styles.location_icon} source={require('../../../res/images/home/icon_happy.png')}/>
						<TextPingFang style={styles.text_mode}>{this.props.diary.mode}</TextPingFang>
						<TextPingFang style={styles.text_value}>情绪值</TextPingFang>
            <TouchableOpacity
              style={styles.update_container}
            >
              <TextPingFang style={styles.text_update}>更正</TextPingFang>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn_container, {display: this.props.user.id !== this.props.diary.user_id ? 'flex' : 'none'}]}
            >
              {this.state.likeComponent}
            </TouchableOpacity>
					</View> 
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
		paddingLeft: getResponsiveWidth(24),
		paddingRight: getResponsiveWidth(24),
		marginTop: getResponsiveWidth(24),
		paddingBottom: getResponsiveWidth(24),
  },
  location_container: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: getResponsiveWidth(24)
	},
	location_icon: {
		marginRight: getResponsiveWidth(8)
	},
	text_location: {
		color: '#aaa',
		fontSize: 10
  },
  mode_container: {
    height: getResponsiveWidth(88),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: getResponsiveWidth(24),
    marginRight: getResponsiveWidth(24),
    borderBottomWidth: getResponsiveWidth(1),
    borderBottomColor: '#f5f5f5'
  },
  text_mode: {
    marginLeft: getResponsiveWidth(15),
    color: '#444',
    fontSize: 16
  },
  text_value: {
    marginLeft: getResponsiveWidth(8),
    color: '#aaa',
    fontSize: 16
  },
  update_container: {
    position: 'absolute',
    right: 0,
  },
  text_update: {
    color: '#2DC3A6',
    fontSize: 16
  },
  btn_container: {
    position: 'absolute',
    right: 0,
    top: getResponsiveWidth(24)
  },
  img_btn: {
    width: getResponsiveWidth(64),
    height: getResponsiveWidth(64)
  }
})
