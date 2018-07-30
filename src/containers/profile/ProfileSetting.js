import React, { Component } from 'react'
import {
  View,
	StyleSheet,
	Image
} from 'react-native'
import { Actions } from 'react-native-router-flux'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'
import Row from './components/Row'
import Storage from '../../common/storage'

import {
  SCENE_PROFILE_FEEDBACK,
} from '../../constants/scene'

import {
  getResponsiveWidth, WIDTH,
} from '../../common/styles'

export default class ProfileSetting extends Component {

  state = {
    allowRecommend: true
  }

  async componentDidMount() {
    const allowRecommend = await Storage.get('allowRecommend', true)
    this.setState({ allowRecommend })
  }

  componentWillUnmount() {
    Storage.set('allowRecommend', this.state.allowRecommend)
  }

  render() {
    return (
      <Container>
      
          <ProfileHeader title='设置'/>

          <View style={styles.container}>
            <Row
              title='允许推荐日记'
              showSwitch={true}
              switchValue={this.state.allowRecommend}
              onValueChange={value => this.setState({allowRecommend: value})}
            />

            <Row
              title='反馈'
              onPress={() => Actions.jump(SCENE_PROFILE_FEEDBACK)}
            />
          </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
  }
})
