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
    imgPathList: [], // 本地图片资源链接
    imgIndex: 0,
    imgListComponent: [],
  }

  componentDidMount() {
    this.setState({
      imgPathList: this.props.imgPathList || [],
    })
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
      if (!res.didCancel) {
        let { imgPathList } = this.state
        imgPathList.push(res.uri)
        this.setState({ imgPathList })
        this._setImgList()

        // 传递原图uri到父页面
        this.props.getImgPathList(imgPathList)
      }
    })
  }

  _removeImg() {
    let { imgPathList, imgIndex } = this.state
    imgPathList.splice(imgIndex, 1)
    this.setState({ imgPathList })
    this._setImgList()
    this.props.getImgPathList(imgPathList)
  }

  _setImgList() {
    let imgListComponent = []

    // 日记图片
    if (this.props.imgPathList && this.props.imgPathList.length) {
      imgListComponent = this.props.imgPathList.map((path, index) => {
        return (
          <Image key={index} style={styles.img} resizeMode='cover' source={{uri: path}}/>
        )
      })
    } else {
      imgListComponent[0] = (
        <TouchableOpacity
          style={[styles.img_container, { display: this.props.source ? 'none' : 'flex' }]}
          onPress={() => this._addImg()}
          key={0}
        >
          <Image source={require('../../../res/images/home/icon_add_photo.png')}/>
        </TouchableOpacity>
      )
    }
    this.setState({ imgListComponent })
  }

  _onImgChanged(index) {
    this.setState({imgIndex: index})
    console.log(index)
  }

  render() {
    return (
      <View style={[styles.container, { display: this.props.showBanner ? 'flex' : 'none' }]} animation='fadeIn'>
        <CommonNav
          navStyle={[styles.nav_style, { display: this.props.showNav ? 'flex' : 'none'}]}
          navBarStyle={styles.navbar_style}
          onPressBack={this.props.onPressBack}
          rightButton={this.props.rightButton}
        />

        <Swiper
          width={WIDTH}
          height={getResponsiveWidth(282)}
          style={styles.swiper}
          loop={false}
          dot={<View style={styles.swiper_dot}></View>}
          activeDot={<View style={[styles.swiper_dot, styles.swiper_active_dot]}></View>}
          bounces={true}
          onIndexChanged={this._onImgChanged.bind(this)}
        >
          {this.state.imgListComponent}
        </Swiper>

        <View
          style={[styles.bottom_bar, { display: this.props.showBottomBar ? 'flex' : 'none',
          position: this.props.showBottomBar ? 'absolute' : 'relative'  }]}>
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
  swiper_dot: {
    width: 8,
    height: 8,
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,.5)'
  },
  swiper_active_dot: {
    backgroundColor: 'rgba(255,255,255,1)'
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
