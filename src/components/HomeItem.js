import React, { Component } from 'react'
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native'
import { PropTypes } from 'prop-types'
import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
  getResponsiveHeight
} from '../common/styles'

export default class HomeItem extends Component {
  static propTypes = {
    sex: PropTypes.number,
    name: PropTypes.string,
    content: PropTypes.string,
    image: PropTypes.string
  }

  static defaultProps = {
    sex: 0,
    name: 'miemie',
    content: '暂无内容',
    image: ''
  }


  render() {
    let date =
      this.props.key == 0 ? (
        <View style={styles.date}>
          <Text style={styles.text_date}>20</Text>
          <Text style={styles.weekday}>星期二</Text>
        </View>
      ) : (
        <View />
      )
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.mask}>
          <View style={styles.date}>
            <Text style={styles.text_date}>20</Text>
            <Text style={styles.weekday}>星期二</Text>
          </View>
          <Image
            style={styles.image}
            source={require('../../res/images/profile/example.png')}
          />
          <View style={styles.texts}>
            <Text style={styles.title}>今天好热好热</Text>
            <View style={styles.info}>
              <Text style={styles.time}>下午16:40</Text>
              <Text style={{ color: this.props.sex ? '#45B0F9' : '#FFC0CB' }}>
                {this.props.name}
              </Text>
            </View>
            <View style={styles.location}>
              <Text
                style={styles.loc_text}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                菊苑B22，广州大学，广州市广州大学
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: getResponsiveWidth(WIDTH - 26 - 22),
    height: getResponsiveHeight(84)
  },
  date: {
    alignSelf: 'flex-start',
    marginRight: getResponsiveWidth(32),
    display: 'flex',
    alignItems: 'center'
  },
  text_date: {
    color: '#333333',
    fontSize: 30,
    fontWeight: '500'
  },
  weekday: {
    fontSize: 12,
    color: '#666666'
  },
  mask: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: getResponsiveWidth(80),
    height: getResponsiveHeight(80)
  },
  texts: {
    display: 'flex',
    width: getResponsiveWidth(165),
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: '100%',
    marginLeft: getResponsiveWidth(14)
  },
  title: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '700'
  },
  info: {
    fontSize: 12,
    display: 'flex',
    flexDirection: 'row',
    height: getResponsiveHeight(17)
  },
  time: {
    color: '#999999',
    marginRight: getResponsiveWidth(8),
    height: 'auto'
  },
  location: {
    color: '#999999',
    justifyContent: 'flex-end',
    height: getResponsiveHeight(44),
    display: 'flex'
  },
  loc_text: {
    fontSize: 12,
    color: '#999999'
  }
})
