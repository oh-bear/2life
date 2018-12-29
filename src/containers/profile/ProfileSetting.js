import React, { Component } from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import RNFetchBlob from 'rn-fetch-blob'

import Container from '../../components/Container'
import ProfileHeader from './components/ProfileHeader'
import Row from './components/Row'
import Storage from '../../common/storage'
import { VERSION } from '../../constants/config'

import {
  SCENE_PROFILE_FEEDBACK,
  SCENE_PROFILE_PRIVACY,
  SCENE_PROFILE_THANKS,
  SCENE_PROFILE_VERSION,
  SCENE_APP_AUTH,
} from '../../constants/scene'

import {
  getResponsiveWidth, WIDTH,
} from '../../common/styles'
import { readFile, updateFile }  from '../../common/util'

export default class ProfileSetting extends Component {

  state = {
    allowRecommend: true,
    size: '',
    openAppAuth: false
  }

  async componentDidMount() {
    const allowRecommend = await Storage.get('allowRecommend', true)
    let openAppAuth = await Storage.get('openAppAuth', false)

    this.setState({ allowRecommend, openAppAuth })

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
          if (fn.includes('.jpg') && !fn.includes(`id_`)) {
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

    // 筛选重复日记
    let content = await readFile(id)
    let deleteDiary = []
    for (let i = 0; i < content.length; i++) {
      for (let j = i + 1; j < content.length; j++) {
        if (content[i].id === content[j].id)
          deleteDiary.push(content[j])
      }
    }

    updateFile({
      user_id: id,
      action: 'delete',
      data: deleteDiary
    })

    this.setState({
      size: '0M',
      fileList: []
    })

  }

  async authChange(value) {
    if (value) {
      Actions.jump(SCENE_APP_AUTH, {cb: () => this.setState({ openAppAuth: true })})
    } else {
      Actions.jump(SCENE_APP_AUTH, {
        cancelValidate: true,
        cb: () => {
          Storage.set('openAppAuth', false)
          this.setState({ openAppAuth: false })
        }
      })
    }
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
            title='开启密码和Touch Id/Face Id'
            showSwitch={true}
            switchValue={this.state.openAppAuth}
            onValueChange={value => this.authChange(value)}
          />

          <Row
            title='清除缓存'
            textRight={this.state.size}
            onPress={() => this.clearCache()}
          />

          <Row
            title='反馈'
            onPress={() => Actions.jump(SCENE_PROFILE_FEEDBACK)}
          />

          <Row
            title='隐私协议'
            onPress={() => Actions.jump(SCENE_PROFILE_PRIVACY)}
          />

          <Row
            title='关于双生'
            textRight={`版本${VERSION}`}
            onPress={() => Actions.jump(SCENE_PROFILE_VERSION)}
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
