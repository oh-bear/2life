import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import TextPingFang from '../../components/TextPingFang'

import { getResponsiveWidth } from '../../common/styles'
import {
  formatDate,
  getPath
} from '../../common/util'

import { SCENE_DIARY_DETAIL } from '../../constants/scene'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
class SingleDiary extends Component {
  static propTypes = {
    diary: PropTypes.object
  }

  render() {
    const diary = this.props.diary

    let other_note_color = '#000'
    if (diary.user_id === this.props.partner.id && this.props.partner.sex === 0) {
      other_note_color = '#4590F8'
    }
    if (diary.user_id === this.props.partner.id && this.props.partner.sex === 1) {
      other_note_color = '#F83AC1'
    }

    return (
      <TouchableOpacity
        style={styles.diary_container}
        onPress={() => Actions.jump(SCENE_DIARY_DETAIL, { diary: this.props.diary, from: 'home' })}
      >
        <View style={styles.diary_top}>
          <View style={styles.diary_top_text}>
            <TextPingFang style={[styles.text_diary_title, { color: other_note_color }]} numberOfLines={1}>{diary.title}</TextPingFang>
            <TextPingFang style={styles.text_diary_content} numberOfLines={2}>{diary.content}</TextPingFang>
          </View>
          {
            (() => {
              if (diary.imgPathList.length) {
                return (
                  <Image style={styles.img_diary} source={{uri: getPath(diary.imgPathList[0])}} />
                )
              }
            })()
          }
        </View>
        <View style={styles.diary_bottom}>
          <TextPingFang style={styles.time}>{formatDate(diary.date, 'hh:ii')}</TextPingFang>
          <View style={styles.location_container}>
            <Image style={styles.location_icon} source={require('../../../res/images/home/icon_location.png')}/>
            <TextPingFang style={styles.text_location}>{diary.location}</TextPingFang>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default class Diary extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    let date = ''
    if (this.props.data.length !== 0) {
      date = this.props.isProfileNote ? formatDate(this.props.data[0].date, 'dd\nZ月') : formatDate(this.props.data[0].date, 'dd\n周W')
    }

    return (
      <View style={styles.container}>
        <TextPingFang style={[styles.date, {display: date ? 'flex' : 'none'}]}>{date}</TextPingFang>
        <View style={styles.main_container}>
          {
            this.props.data.map((diary, index) => {
              return (
                <SingleDiary key={index} diary={diary}/>
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
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  date: {
    width: getResponsiveWidth(48),
    paddingTop: getResponsiveWidth(16),
    color: '#aaa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  main_container: {
    flex: 1
  },
  diary_container: {
    display: 'flex',
    paddingTop: getResponsiveWidth(16),
    paddingBottom: getResponsiveWidth(16),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  diary_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diary_top_text: {
    flex: 1,
    paddingRight: getResponsiveWidth(10),
  },
  text_diary_title: {
    color: '#333',
    fontSize: 16,
    fontWeight: '300',
  },
  text_diary_content: {
    color: '#666',
    fontSize: 12,
    fontWeight: '300',
    marginTop: getResponsiveWidth(8),
  },
  img_diary: {
    width: getResponsiveWidth(72),
    height: getResponsiveWidth(72),
    borderRadius: getResponsiveWidth(8)
  },
  diary_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: getResponsiveWidth(16),
  },
  time: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '300'
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
    fontSize: 12,
    fontWeight: '300'
  }
})
