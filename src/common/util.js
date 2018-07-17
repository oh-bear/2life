import { Platform } from 'react-native'
import axios from 'axios'
import { Buffer } from 'buffer'
import RNFetchBlob from 'rn-fetch-blob'
import HttpUtils from '../network/HttpUtils'
import { UTILS, USERS } from '../network/Urls'
import store from '../redux/store'
import { fetchProfileSuccess } from '../redux/modules/user'

const URL_qiniu_token = UTILS.qiniu_token
const URL_qiniu_host = 'http://upload.qiniu.com/putb64/-1/key/'
const BASE_IMG_URL = 'https://airing.ursb.me/'
// const URL_qiniu_host = 'http://upload-z2.qiniup.com/putb64/-1/key/'
// const BASE_IMG_URL = 'http://p3nr2tlc4.bkt.clouddn.com/'

export const isDev = global.process.env.NODE_ENV === 'development'

/**
 * 返回 yyyy-mm-hh
 * @param {Number} timestamp 时间戳
 */
export function getFormDay(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth()
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
    EngWeekDay = 'Sun'
    break
  case 1:
    EngWeekDay = 'Mon'
    break
  case 2:
    EngWeekDay = 'Tue'
    break
  case 3:
    EngWeekDay = 'Wed'
    break
  case 4:
    EngWeekDay = 'Thu'
    break
  case 5:
    EngWeekDay = 'Fri'
    break
  case 6:
    EngWeekDay = 'Sat'
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

/**
 * 上传图片至七牛
 * @param {Array of String} 图片链接数组
 * @param {Object}
 * @returns {String} 图片链接 img_url,img_url...
 */
export async function postImgToQiniu(uriList, obj) {
  if (uriList.length === 0) return ''
  const { type, user_id } = obj
  if (!type && !user_id) return

  const uriBase64ListPromises = uriList.map(async uri => {
    let filePath = uri
    // ios绝对路径每次都会变化，需要特别处理
    if (Platform.OS === 'ios' && type === 'profile') {
      let arr = uri.split('/')
      const dirs = RNFetchBlob.fs.dirs
      filePath = `${dirs.DocumentDir}/${arr[arr.length - 1]}`
    }
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

    // 向后台获取七牛token
    const res_token = await HttpUtils.get(URL_qiniu_token, { filename })
    // 图片名称转base64
    const key_base64 = Buffer.from(filename).toString('base64')

    if (res_token.code === 0) {
      const qiniu_token = res_token.data // 七牛token

      // 上传到七牛
      const res_qiniu = await fetch(URL_qiniu_host + key_base64, {
        method: 'post',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Authorization': 'UpToken ' + qiniu_token
        },
        body: base64
      })

      return res_qiniu
    }
  })

  let imgUrls = []
  for (let i = 0; i < qiniuPromises.length; i++) {
    const res = await qiniuPromises[i]
    if (res.status === 200) {
      const body = JSON.parse(res._bodyText)
      imgUrls.push(BASE_IMG_URL + body.key)
    }
  }
  return imgUrls.join(',')
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
export async function downloadImg(url) {
  const config = {
    fileCache: true,
    appendExt : 'jpg'
  }
  const res = await RNFetchBlob.config(config).fetch('get', url)
  return res.path()
}

/**
 * 删除文件
 * @param {String} path 文件路径
 */
export async function deleteFile(path) {
  RNFetchBlob.fs.unlink(path)
  .then(res => console.log(res))
}