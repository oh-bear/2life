import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

import TextPingFang from '../../components/TextPingFang'
import Container from '../../components/Container'
import Popup from '../../components/Popup'
import ProfileHeader from './components/ProfileHeader'
import Row from './components/Row'
import Storage from '../../common/storage'

import {
  getResponsiveWidth, WIDTH,
} from '../../common/styles'
import { updateUser, syncFile } from '../../common/util'
import store from '../../redux/store'
import HttpUtils from '../../network/HttpUtils'
import { USERS } from '../../network/Urls'
import { fetchProfileSuccess } from '../../redux/modules/user'
import { cleanPartner } from '../../redux/modules/partner'

export default class ProfileSync extends Component {

  state = {
    isSync: true,
    showCloseSyncPopup: false,
    showOpenSyncPopup: false,
    size: 0
  }

  async componentDidMount() {
    const id = this.props.user.id
    const path = RNFetchBlob.fs.dirs.DocumentDir

    RNFetchBlob.fs.lstat(path)
      .then(files => {
        let size = 0
        for (let file of files) {
          if (file.filename.includes(`id_${id}_`) || file.filename.includes(`user_${id}_`)) {
            size += parseInt(file.size)
          }
        }
        this.setState({ size: (size / 1000000).toFixed(2) + 'M' })
      })

    const isSync = await Storage.get('isSync', true)
    this.setState({ isSync })
  }

  componentWillUnmount() {
    Storage.set('isSync', this.state.isSync)
  }

  async SyncChange(isSync) {
    if (!isSync) {
      return this.setState({ showCloseSyncPopup: true })
    } else {
      await Storage.set('isSync', true)
      syncFile(this.props.user.id)
      this.setState({ isSync: true })
    }
  }

  async closeSync() {

    this.setState({
      isSync: false,
      showCloseSyncPopup: false
    })

    // 解除匹配
    if (this.props.user.user_other_id !== -1) {
      const res = await HttpUtils.get(USERS.disconnect)
      if (res.code === 0) {
        // 更改用户status 为不可匹配999
        const res = await updateUser(this.props.user, { status: 999 })
        if (res.code === 0) {
          store.dispatch(fetchProfileSuccess(res.data.user))
          DeviceEventEmitter.emit('flush_note', {})
        }
  
        store.dispatch(cleanPartner())
      }
    } else {
      // 更改用户status 为不可匹配999
      const res = await updateUser(this.props.user, { status: 999 })
      if (res.code === 0) {
        store.dispatch(fetchProfileSuccess(res.data.user))
        DeviceEventEmitter.emit('flush_note', {})
      }
    }
  }

  render() {
    return (
      <Container>

        <ProfileHeader title='日记同步' />

        <View style={styles.container}>
          <Row
            title='同步'
            showSwitch={true}
            switchValue={this.state.isSync}
            onValueChange={isSync => this.SyncChange(isSync)}
          />

          <TextPingFang style={styles.text_close_sync}>关闭同步功能将不能匹配对象，已经匹配对象的将会被解除关系！请谨慎！</TextPingFang>

          {/* <View style={styles.row}>
              <TextPingFang style={styles.text_left}>同步间隔</TextPingFang>
              <TextPingFang style={styles.text_right}>15 Min</TextPingFang>
            </View> */}

          <View style={styles.row}>
            <TextPingFang style={styles.text_left}>储存</TextPingFang>
            <TextPingFang style={styles.text_right}>{this.state.size}</TextPingFang>
          </View>
        </View>


        <Popup
          showPopup={this.state.showCloseSyncPopup}
          popupBgColor='#ff5757'
          icon={require('../../../res/images/profile/icon_warning.png')}
          title='注意'
          content='关闭同步功能将不能匹配对象，已经匹配对象的将会被解除关系!'
          onPressLeft={() => this.setState({ showCloseSyncPopup: false })}
          onPressRight={() => this.closeSync()}
          textBtnLeft='不关闭'
          textBtnRight='确定关闭'
        />

        <Popup
          showPopup={this.state.showOpenSyncPopup}
          popupBgColor='#2DC3A6'
          icon={require('../../../res/images/profile/icon-popup-reward.png')}
          title='订阅成功'
          content='已经为您开启同步功能!'
          onPressLeft={() => this.setState({ showOpenSyncPopup: false })}
          textBtnLeft='好'
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
  },
  row: {
    height: getResponsiveWidth(44),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: getResponsiveWidth(1),
    borderBottomColor: '#f1f1f1'
  },
  text_left: {
    color: '#000',
    fontSize: 16,
    fontWeight: '300'
  },
  text_right: {
    color: '#444',
    fontSize: 16,
    fontWeight: '300'
  },
  text_close_sync: {
    marginTop: getResponsiveWidth(8),
    marginBottom: getResponsiveWidth(40),
    color: '#000',
    fontSize: 16,
    fontWeight: '300'
  }
})
