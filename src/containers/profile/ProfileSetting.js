import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import RNFetchBlob from 'rn-fetch-blob'

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
    allowRecommend: true,
    size: ''
  }

  async componentDidMount() {
    const allowRecommend = await Storage.get('allowRecommend', true)
    this.setState({ allowRecommend })

    this.checkCache()
  }

  componentWillUnmount() {
    Storage.set('allowRecommend', this.state.allowRecommend)
  }

  checkCache() {
    const id = this.props.user.id
    const path = RNFetchBlob.fs.dirs.DocumentDir

    RNFetchBlob.fs.lstat(path)
      .then(files => {
        let size = 0, fileList = []
        for (let file of files) {
          const fn = file.filename
          if (fn.includes('.jpg') && !fn.includes(`id_${id}_`)) {
            fileList.push(fn)
            size += parseInt(file.size)
          }
        }
        this.setState({
          size: (size / 1000000).toFixed(2) + 'M',
          fileList
        })
      })
  }

  async clearCache() {
    const id = this.props.user.id
    const path = RNFetchBlob.fs.dirs.DocumentDir

    for (let filename of this.state.fileList) {
      await RNFetchBlob.fs.unlink(`${path}/${filename}`)
    }
    this.setState({
      size: '0M',
      fileList: []
    })

  }

  render() {
    return (
      <Container>

        <ProfileHeader title='设置' />

        <View style={styles.container}>
          <Row
            title='允许推荐日记'
            showSwitch={true}
            switchValue={this.state.allowRecommend}
            onValueChange={value => this.setState({ allowRecommend: value })}
          />


          <Row
            title='反馈'
            onPress={() => Actions.jump(SCENE_PROFILE_FEEDBACK)}
          />

          <Row
            title='清除缓存'
            textRight={this.state.size}
            onPress={() => this.clearCache()}
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
