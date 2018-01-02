import React, { Component } from 'react'
import { View, StyleSheet, Text, ListView } from 'react-native'
import { HEIGHT, getResponsiveHeight } from '../common/styles'
import HomeItem from '../components/HomeItem'
import { PropTypes } from 'prop-types'

export default class Home extends Component {
  static propTypes = {
    data: PropTypes.array
  }
  render() {
    return (
      <View style={styles.container}>
        <HomeItem />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'rgb(242,246,250)',
    alignItems: 'center',
    height: HEIGHT
  }
})
