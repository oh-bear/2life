import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import Swiper from 'react-native-swiper'
import ImagePicker from 'react-native-image-picker'

import { View } from 'react-native-animatable'

import CommonNav from '../../components/CommonNav'

import {
  WIDTH,
  getResponsiveWidth
} from '../../common/styles'

export default class DiaryBanner extends Component {
  static propTypes = {}

  state = {
    sources: [],
    base64List: [],
    imgIndex: 0,
    imgListComponent: [],
  }

  componentDidMount() {
    this._setImgList()
  }

  async _addImg() {
    const options = {
      title: '',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍摄',
      chooseFromLibraryButtonTitle: '从相册选择',
      cameraType: 'back',
      mediaType: 'photo',
      maxWidth: 375,
      maxHeight: 282,
      quality: 1,
      allowsEditing: true,
      storageOptions: {
        skipBackup: true,
        cameraRoll: true,
        waitUntilSaved: true
      }
    }
    ImagePicker.showImagePicker(options, res => {
      console.log(res)
      if (!res.didCancel) {
        let source = { uri: res.uri }
        let { sources, base64List } = this.state
        sources.push(source)
        base64List.push(res.data)
        this.setState({ sources, base64List })
        this._setImgList()
        this.props.getBase64List(base64List)
      }
    })
  }

  _removeImg() {
    let { sources, base64List } = this.state
    sources.splice(this.state.imgIndex, 1)
    base64List.splice(this.state.imgIndex, 1)
    this.setState({ sources, base64List })
    this._setImgList()
    this.props.getBase64List(base64List)
  }

  _setImgList() {
    if (this.props.imageList && this.props.imageList.length !== 0) {
      imgListComponent = this.props.imageList.map((item, index) => {
        return (
          <Image key={index} style={styles.img} resizeMode='cover' source={{ uri: item }}/>
        )
      })
      this.setState({ imgListComponent })
      return
    }

    let imgListComponent = []

    if (this.state.sources.length !== 0) {
      imgListComponent = this.state.sources.map((item, index) => {
        return (
          <Image key={index} style={styles.img} resizeMode='cover' source={item}/>
        )
      })
    } else {
      imgListComponent[0] = (
        <TouchableOpacity
          style={[styles.img_container, { display: this.state.source ? 'none' : 'flex' }]}
          onPress={() => this._addImg()}
          key={0}
        >
          <Image source={require('../../../res/images/home/icon_add_photo.png')}/>
        </TouchableOpacity>
      )
    }
    this.setState({ imgListComponent })
  }

  render() {
    return (
      <View style={[styles.container, { display: this.props.showBanner ? 'flex' : 'none' }]} animation='fadeIn'>
        <CommonNav
          navStyle={[styles.nav_style, { display: this.props.showNav ? 'flex' : 'none' }]}
          navBarStyle={styles.navbar_style}
          onPressBack={this.props.onPressBack}
          rightButton={this.props.rightButton}
        />

        <Swiper
          width={WIDTH}
          height={getResponsiveWidth(282)}
          style={styles.swiper}
          onIndexChanged={(index) => {
            this.setState({ imgIndex: index })
          }}
        >
          {this.state.imgListComponent}
        </Swiper>

        <View
          style={[styles.bottom_bar, { display: (this.props.showBottomBar && this.state.sources.length) ? 'flex' : 'none' }]}>
          <TouchableOpacity style={styles.icon_container} onPress={() => this._removeImg()}>
            <Image source={require('../../../res/images/home/icon_remove_photo.png')}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._addImg()}>
            <Image source={require('../../../res/images/home/icon_add_photo2.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
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
  },
  img: {
    width: '100%',
    height: '100%',
  },
  bottom_bar: {
    width: WIDTH,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: getResponsiveWidth(24),
    marginBottom: getResponsiveWidth(24),
  },
  icon_container: {
    marginRight: getResponsiveWidth(24)
  }
})
