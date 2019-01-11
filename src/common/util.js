import { Platform, DeviceEventEmitter } from 'react-native'
import axios from 'axios'
import { Buffer } from 'buffer'
import RNFetchBlob from 'rn-fetch-blob'
import HttpUtils from '../network/HttpUtils'
import { UTILS, USERS, NOTES } from '../network/Urls'
import store from '../redux/store'
import Storage from './storage'
import { fetchProfileSuccess } from '../redux/modules/user'

const URL_QINIU_BASE = 'http://upload.qiniu.com'
const URL_QINIU_BASE64 = `${URL_QINIU_BASE}/putb64/-1/key/`
const BASE_IMG_URL = 'https://airing.ursb.me/'
// const URL_QINIU_BASE = 'http://upload-z2.qiniup.com'
// const URL_QINIU_BASE64 = `${URL_QINIU_BASE}/putb64/-1/key/`
// const BASE_IMG_URL = 'http://p3nr2tlc4.bkt.clouddn.com/'

export let SYNC_TIMEOUT_ID = null

export const isDev = global.process.env.NODE_ENV === 'development'

export function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

/**
 * 返回 yyyy-mm-hh
 * @param {Number} timestamp 时间戳
 */
export function getFormDay(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  return `${year}-${month}-${day}`
}

/**
 * 获取中文月份
 * @param {Number} month
 * @returns {String}
 */
export function getMonth(month) {
  let chinese_month = ''
  switch (month) {
    case 0:
      chinese_month = '一月'
      break
    case 1:
      chinese_month = '二月'
      break
    case 2:
      chinese_month = '三月'
      break
    case 3:
      chinese_month = '四月'
      break
    case 4:
      chinese_month = '五月'
      break
    case 5:
      chinese_month = '六月'
      break
    case 6:
      chinese_month = '七月'
      break
    case 7:
      chinese_month = '八月'
      break
    case 8:
      chinese_month = '九月'
      break
    case 9:
      chinese_month = '十月'
      break
    case 10:
      chinese_month = '十一月'
      break
    case 11:
      chinese_month = '十二月'
      break
  }
  return chinese_month
}

/**
 * 获取几号,周几
 * @param {Number} timestamp
 */
export function getDay(timestamp) {
  const date = new Date(timestamp)
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const weekDay = date.getDay()
  let EngWeekDay = ''
  switch (weekDay) {
    case 0:
      EngWeekDay = '周日'
      break
    case 1:
      EngWeekDay = '周一'
      break
    case 2:
      EngWeekDay = '周二'
      break
    case 3:
      EngWeekDay = '周三'
      break
    case 4:
      EngWeekDay = '周四'
      break
    case 5:
      EngWeekDay = '周五'
      break
    case 6:
      EngWeekDay = '周六'
      break
  }
  return `${day}\n${EngWeekDay}`
}

/**
 * 获取几号,几月
 * @param {Number} timestamp
 */
export function getMonthDay(timestamp) {
  const date = new Date(timestamp)
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const chinese_month = getMonth(date.getMonth())
  return `${day}\n${chinese_month}`
}

/**
 * 获取 hh:mm
 * @param {Number} timestamp
 * @returns {String} // hh:mm
 */
export function getTime(timestamp) {
  const date = new Date(timestamp)
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  return `${hour}:${min}`
}

/**
 * 日记按照日期分类
 * @param {Array of Object} arr
 * @returns {Array}
 */
export function diaryClassify(arr) {
  let oldArr = arr.map(dairy => {
    dairy.formDate = getFormDay(dairy.date)
    return dairy
  })

  let newArr = []
  let formDateList = []

  for (let i = 0; i < oldArr.length; i++) {
    if (i === 0) {
      formDateList.push(oldArr[i].formDate)
      newArr.push([oldArr[i]])
    }

    if (i > 0) {
      for (let j = 0; j < formDateList.length; j++) {
        if (oldArr[i].formDate === formDateList[j]) {
          newArr[j].push(oldArr[i])
          break
        }
        if (j === formDateList.length - 1) {
          formDateList.push(oldArr[i].formDate)
          newArr.push([oldArr[i]])
          break
        }
      }
    }
  }

  for (let i = 0; i < newArr.length; i++) {
    newArr[i].sort((a, b) => b.date - a.date)
  }
  return newArr
}

/**
 * 根据经纬度获取地理位置
 * @param {Number} longitude 经度
 * @param {Number} latitude 纬度
 * @returns {String}
 */
export async function getLocation(longitude, latitude) {
  const url = 'https://restapi.amap.com/v3/geocode/regeo?'
  const params = {
    key: '9d6935d546e2b3ec1ee3b872c1ee9bbe',
    location: `${longitude},${latitude}`
  }
  const res = await axios.get(url, { params })
  let city = ''
  let province = ''
  let country = ''
  if (res.data.info === 'OK') {
    city = res.data.regeocode.addressComponent.city
    province = res.data.regeocode.addressComponent.province
    country = res.data.regeocode.addressComponent.country
  }
  return { city, province, country }
}

/**
 * 根据经纬度获取天气预报
 * @param {String}  region 地名
 * @returns {Object}
 */
export async function getWeather(region) {
  const url = 'http://restapi.amap.com/v3/weather/weatherInfo'
  const params = {
    key: '9d6935d546e2b3ec1ee3b872c1ee9bbe',
    city: region
  }
  try {
    const res = await axios.get(url, { params })
    return res.data.lives[0]
  } catch (e) {
    console.log(e)
  }
}

// ios文件路径每次访问后都会变化，需要特别处理
export function getPath(uri) {
  let filePath = uri
  if (Platform.OS === 'ios') {
    let arr = uri.split('/')
    const dirs = RNFetchBlob.fs.dirs
    filePath = `${dirs.DocumentDir}/${arr[arr.length - 1]}`
  }
  if (Platform.OS == 'android') {
    if (filePath.indexOf('http') != 0 && filePath.indexOf('file') != 0) {
      let arr = uri.split('/')
      const dirs = RNFetchBlob.fs.dirs
      filePath = `file://${dirs.DocumentDir}/${arr[arr.length - 1]}`
    }
  }
  return filePath
}

/**
 * 上传图片至七牛
 * @param {Array of String} 图片链接数组
 * @param {Object}
 * @param {Boolean} shouldUseGetPath 是否使用 getPath 方法
 * @returns {String} 图片链接 img_url,img_url...
 */
export async function postImgToQiniu(uriList, obj, shouldUseGetPath = true) {
  if (uriList.length === 0) return ''
  const { type, user_id } = obj
  if (!type && !user_id) return

  const uriBase64ListPromises = uriList.map(async uri => {
    let filePath = shouldUseGetPath ? getPath(uri) : uri
    return await RNFetchBlob.fs.readFile(filePath, 'base64')
  })

  let uriBase64List = []
  for (let uriBase64ListPromise of uriBase64ListPromises) {
    uriBase64List.push(await uriBase64ListPromise)
  }

  // 并发上传图片
  const qiniuPromises = uriBase64List.map(async (base64) => {
    let filename
    if (type === 'note') {
      filename = `2life/user/${user_id}/img_${Date.now()}.png-2life_note.jpg`
    }
    if (type === 'profile') {
      filename = `2life/user/${user_id}/profile_${Date.now()}.png-2life_face.jpg`
    }
    if (type === 'share') {
      filename = `2life/share/${user_id}/${Date.now()}.jpg`
    }

    // 向后台获取七牛token
    const res_token = await HttpUtils.get(UTILS.qiniu_token, { filename })
    // 图片名称转base64
    const key_base64 = Buffer.from(filename).toString('base64')

    if (res_token.code === 0) {
      const qiniu_token = res_token.data // 七牛token

      if (Platform.OS === 'android') {
        let xmlPromise = new Promise(function (resolve, reject) {
          let request = new XMLHttpRequest()
          request.onreadystatechange = handler
          request.open('POST', URL_QINIU_BASE64 + key_base64, true)
          request.setRequestHeader('Content-Type', 'application/octet-stream')
          request.setRequestHeader('Authorization', 'UpToken ' + qiniu_token)
          request.send(base64)

          function handler() {
            if (request.readyState !== 4) {
              return
            }
            if (request.status === 200) {
              console.log('success', request.responseText)
              let res = {}
              res._bodyText = request.responseText
              res.status = 200
              resolve(res)
            } else {
              reject('error')
            }
          }
        })
        return xmlPromise
      } else {
        const res_qiniu = await fetch(URL_QINIU_BASE64 + key_base64, {
          method: 'post',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': 'UpToken ' + qiniu_token
          },
          body: base64
        })
        return res_qiniu
      }
    }
  })
  let imgUrls = []
  for (let i = 0; i < qiniuPromises.length; i++) {
    const res = await qiniuPromises[i]
    //alert(JSON.stringify(res))
    if (res.status === 200) {
      const body = JSON.parse(res._bodyText)
      //alert(body.key)
      imgUrls.push(BASE_IMG_URL + body.key)
    }
  }
  return imgUrls.join(',')
}

/**
 *
 * @param {Number} user_id 用户ID
 */
export async function postFileToQiniu(user_id) {
  const now = Date.now()
  const filename = `2life/file/${user_id}_${now}.json`
  // 向后台获取七牛token
  const res_token = await HttpUtils.get(UTILS.qiniu_token, { filename })

  if (res_token.code === 0) {
    // 读取文件内容
    const content = await RNFetchBlob.fs.readFile(getPath(`user_${user_id}_config.json`))

    const res = await RNFetchBlob.fetch('POST', URL_QINIU_BASE, {
      'Content-Type': 'multipart/form-data'
    }, [
      {
        name: 'file',
        data: content
      },
      {
        name: 'token',
        data: res_token.data
      },
      {
        name: 'fileName',
        data: `user_${user_id}_config.json`
      },
      {
        name: 'key',
        data: filename
      },

    ])
    console.log(res.data)

    return now
  }
}

/**
 * 获取首页天气图标和描述
 * @param {Object} weather getWeather函数返回的天气预报
 */
export function getWeatherDesc(weather) {
  let weather_text, weather_icon
  if (weather.weather.includes('晴')) {
    weather_text = `${weather.weather} ${weather.temperature}℃`
    weather_icon = require('../../res/images/home/icon_sunny.png')
  }
  if (weather.weather.includes('多云') || weather.weather.includes('阴')) {
    weather_text = `${weather.weather} ${weather.temperature}℃`
    weather_icon = require('../../res/images/home/icon_cloud.png')
  }
  if (weather.weather.includes('雨')) {
    weather_text = `${weather.weather} ${weather.temperature}℃`
    weather_icon = require('../../res/images/home/icon_rainy.png')
  }
  if (weather.weather.includes('雪')) {
    weather_text = `${weather.weather} ${weather.temperature}℃`
    weather_icon = require('../../res/images/home/icon_snow.png')
  }
  if (weather.weather.includes('雾') || weather.weather.includes('尘') || weather.weather.includes('沙') || weather.weather.includes('霾')) {
    weather_text = `${weather.weather} ${weather.temperature}℃`
    weather_icon = require('../../res/images/home/icon_fly_ash.png')
  }
  return { weather_text, weather_icon }
}

/**
 * 更新用户信息
 * @param {object} user 用户数据
 * @param {object} obj 要更新的数据
 */
export function updateUser(user, obj) {
  const { sex, name, face, status, latitude, longitude, badge_id, badges } = user
  return HttpUtils.post(USERS.update, Object.assign({
    sex,
    name,
    face,
    status,
    latitude,
    longitude,
    badge_id: -1,
    badges
  }, obj))
}

/**
 * 更新redux用户信息
 */
export async function updateReduxUser(user_id) {
  const res = await HttpUtils.get(USERS.user, { user_id })
  if (res.code === 0) {
    store.dispatch(fetchProfileSuccess(res.data))
  }
}

/**
 * @param {Number} ms 等待时间
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 下载or复制图片到本地
 * @param {String} url 网络图片URL
 * @returns {String} 图片保存路径
 */
export async function downloadImg(url, user_id = 0) {
  if (Platform.OS === 'android') {
    if (url.indexOf('file://') == 0) {
      return url
    }
  }
  const filename = `id_${user_id}_${Math.round(Math.pow(Math.random() * 10, 10))}.jpg`
  const config = {
    fileCache: true,
    path: `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`
  }
  const res = await RNFetchBlob.config(config).fetch('get', url)
  return filename
}

/**
 * 删除文件
 * @param {String} path 文件路径
 */
export async function deleteFile(path) {
  RNFetchBlob.fs.unlink(getPath(path))
    .then(res => console.log(res))
}

export async function createFile(obj) {
  const fs = RNFetchBlob.fs
  const FILE_PATH = fs.dirs.DocumentDir + `/user_${obj.user_id}_config.json`

  const isExist = await fs.exists(FILE_PATH)
  if (!isExist) {
    await fs.createFile(FILE_PATH, JSON.stringify(obj.data), 'utf8')
  }
}

export async function readFile(user_id = 0) {
  const fs = RNFetchBlob.fs
  const FILE_PATH = fs.dirs.DocumentDir + `/user_${user_id}_config.json`

  // 读取配置文件内容
  try {
    const content = JSON.parse(await fs.readFile(FILE_PATH, 'utf8'))
    return content.diaryList.filter(diary => diary.op !== 3)
  } catch (err) {
    return []
  }
}

/**
 * 读取完整的配置文件，不过滤删除的部分
 * @param {Number} user_id 用户ID
 */
export async function readFullFile(user_id = 0) {
  const fs = RNFetchBlob.fs
  const FILE_PATH = fs.dirs.DocumentDir + `/user_${user_id}_config.json`

  // 读取配置文件内容
  try {
    const content = JSON.parse(await fs.readFile(FILE_PATH, 'utf8'))
    return content.diaryList
  } catch (err) {
    return []
  }
}

/**
 * 日记配置文件的增删改
 * @param {Object} obj
 */
// obj 参数说明
// user_id: Number, 用户ID，用于查找配置文件名称
// action: String, 操作类型，有 add, delete, delete_other, update
// data: Array | Object, 日记内容
export async function updateFile(obj) {
  const fs = RNFetchBlob.fs
  const FILE_PATH = fs.dirs.DocumentDir + `/user_${obj.user_id}_config.json`

  // 读取配置文件内容
  const content = JSON.parse(await fs.readFile(FILE_PATH, 'utf8'))
  let { diaryList } = content

  if (obj.action === 'add') {
    if (obj.data instanceof Array) {
      diaryList = [...diaryList, ...obj.data]
    } else {
      diaryList.push(obj.data)
    }
  }

  // update: 更新日记新的内容
  if (obj.action === 'update') {
    if (obj.data instanceof Array) {
      for (let i = 0; i < obj.data.length; i++) {
        for (let j = 0; j < diaryList.length; j++) {
          if (obj.data[i].uuid === diaryList[j].uuid) {
            diaryList[j] = obj.data[i]
            break
          }
        }
      }
    } else {
      // for (let i = 0; i < diaryList.length; i++){
      //   if (obj.data.uuid === diaryList[i].uuid) {
      //     diaryList[i] = obj.data
      //     break
      //   }
      // }
      diaryList = diaryList.filter(diary => diary.uuid !== obj.data.uuid)
      diaryList.push(obj.data)
    }
  }

  // 不用同步直接删除日记
  if (obj.action === 'delete') {
    if (obj.data instanceof Array) {
      for (let i = 0; i < obj.data.length; i++) {
        diaryList = diaryList.filter(diary => diary.uuid !== obj.data[i].uuid)
      }
    } else {
      diaryList = diaryList.filter(diary => diary.uuid !== obj.data.uuid)
    }
  }

  // 删除匹配对象到日记
  if (obj.action === 'delete_other') {
    diaryList = diaryList.filter(diary => diary.user_id === obj.user_id)
  }

  const newContent = {
    ...content,
    lastModified: Date.now(),
    diaryList
  }

  await fs.writeFile(FILE_PATH, JSON.stringify(newContent), 'utf8')
  console.log(obj.action)
  console.log(obj.data)
  DeviceEventEmitter.emit('flush_local_note')
}

/**
 * 上传文件到七牛，通知后台更新数据库
 * @param {Number} user_id 用户ID
 */
export async function syncFile(user_id) {
  const isSync = await Storage.get('isSync', true)
  if (!isSync) return

  const SYNC_PERIOD = 1000 // 同步延迟1秒

  clearTimeout(SYNC_TIMEOUT_ID)

  SYNC_TIMEOUT_ID = setTimeout(async () => {

    const fs = RNFetchBlob.fs
    const FILE_PATH = fs.dirs.DocumentDir + `/user_${user_id}_config.json`

    // 读取该用户配置文件内容
    const content = JSON.parse(await fs.readFile(FILE_PATH, 'utf8'))
    let diaryListAddUpdate = content.diaryList.filter(diary => {
      return diary.user_id === user_id && (diary.op === 1 || diary.op === 2)
    })

    // 上传图片
    for (let diary of diaryListAddUpdate) {
      const images = await postImgToQiniu(diary.imgPathList, {
        user_id: user_id,
        type: 'note'
      })
      diary.images = images
    }

    // 更新配置文件
    diaryListAddUpdate.length &&
    await updateFile({
      user_id,
      action: 'update',
      data: diaryListAddUpdate
    })

    // 上传文件到七牛
    const synctime = await postFileToQiniu(user_id)

    // 通知后台拉取文件进行更新
    const res = await HttpUtils.get(NOTES.sync, { synctime })

    if (res.code === 0) {
      const resDiaryList = res.data

      // 更新后台用户总日记数量
      HttpUtils.get(NOTES.refresh_total_notes)

      // 如果是新增日记，需要遍历本地日记增加返回的ID字段等数据
      const content = JSON.parse(await fs.readFile(FILE_PATH, 'utf8'))
      let { diaryList } = content

      for (let i = 0; i < diaryList.length; i++) {
        if (!diaryList[i].id) {
          for (let j = 0; j < resDiaryList.length; j++) {
            if (diaryList[i].uuid === resDiaryList[j].uuid) {
              diaryList[i] = {
                ...resDiaryList[j],
                ...diaryList[i]
              }
            }
          }
        }
      }

      // 过滤op为3的日记
      diaryList = diaryList.filter(diary => diary.op !== 3)

      // 重置所有op为0
      diaryList = diaryList.map(diary => {
        diary.op = 0
        return diary
      })

      // 更新配置文件
      const newContent = {
        ...content,
        lastModified: Date.now(),
        diaryList
      }

      await fs.writeFile(FILE_PATH, JSON.stringify(newContent), 'utf8')
      DeviceEventEmitter.emit('flush_local_note')

      SYNC_TIMEOUT_ID = null
    }

  }, SYNC_PERIOD)
}

async function getOCRSign() {
  let sign = await Storage.get('ocr_sign', '')

  if (!sign) {
    const res = await HttpUtils.get(UTILS.get_ocr_sign)

    if (res.code === 0) {
      sign = res.data
      Storage.set('ocr_sign', sign)
    }
  }
  return sign
}

/**
 * 手写日记识别
 * @param {String} base64 图片base64
 */
export async function OCR(base64) {
  const url = 'https://recognition.image.myqcloud.com/ocr/handwriting'
  const sign = await getOCRSign()

  const data = {
    appid: '1251705417',
    image: base64,
    // url: 'http://s10.sinaimg.cn/middle/520bb492t97963822a349&690'
  }

  try {
    let res = await axios.post(url, data, {
      headers: {
        'host': 'recognition.image.myqcloud.com',
        'Content-Type': 'application/json',
        'Authorization': sign
      }
    })
    res = res.data

    let title = '',
      content = '',
      message = ''

    if (res.code === 0 && res.data.items.length) {
      const itemsString = res.data.items

      title = itemsString[0].itemstring

      content = itemsString.reduce((accu, curr, idx) => {
        if (idx === 0)
          return ''

        return accu += curr.itemstring
      }, '')
    } else if (res.code === 9) {
      // 签名过期，重新获取
      getOCRSign()
      message = '识别失败 (╯﹏╰）'
    } else {
      message = '识别失败 (╯﹏╰）'
    }

    return { title, content, message }
  } catch (err) {
    console.log(err)
    return {
      title: '',
      content: '',
      message: '发生了错误，等下再试试吧>_<'
    }
  }
}
