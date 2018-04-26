import axios from 'axios'
import { Buffer } from 'buffer'
import HttpUtils from '../network/HttpUtils'
import { UTILS } from '../network/Urls'

const URL_qiniu_token = UTILS.qiniu_token
const URL_qiniu_host = 'http://upload.qiniu.com/putb64/-1/key/'
// const URL_qiniu_host = 'http://upload-z2.qiniup.com/putb64/-1/key/'
const BASE_IMG_URL = 'https://airing.ursb.me/'

export const isDev = global.process.env.NODE_ENV === 'development'

// 2011-01-11
export function getToday () {
	const date = new Date()
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
export function getMonth (month) {
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
			chinese_month = '腊月'
			break
	}
	return chinese_month
}

/**
 * 获取几号,周几
 * @param {Number} timestamp
 */
export function getDay (timestamp) {
	const date = new Date(timestamp)
	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
	const weekDay = date.getDay()
	let EngWeekDay = ''
	switch(weekDay) {
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
 * 获取 hh:mm
 * @param {Number} timestamp
 * @returns {String} // hh:mm
 */
export function getTime (timestamp) {
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
export function diaryClassify (arr) {
	let oldArr = arr.map(dairy => {
		dairy.formDate = new Date(dairy.date).toLocaleDateString()
		return dairy
	})

	let newArr = []
	let formDateList = []

	for(let i = 0; i < oldArr.length; i++) {
		if (i === 0) {
			formDateList.push(oldArr[i].formDate)
			newArr.push([oldArr[i]])
		}

		if (i > 0) {
			for(let j = 0; j < formDateList.length; j++) {
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
 * 
 * @param {Number} longitude 经度
 * @param {Number} latitude 纬度
 * @returns {String}
 */
export async function getLocation (longitude, latitude) {
	const url = 'https://restapi.amap.com/v3/geocode/regeo?'
	const params = {
		key: '9d6935d546e2b3ec1ee3b872c1ee9bbe',
		location: `${longitude},${latitude}`
	}
	const res = await axios.get(url, {params})
	let city = ''
	let province = ''
	let country = ''
	if (res.data.info === 'OK') {
		city = res.data.regeocode.addressComponent.city
		province = res.data.regeocode.addressComponent.province
		country = res.data.regeocode.addressComponent.country
	}
	return (`${city}，${province}，${country}`)
}

/**
 * 上传base64至七牛
 * @param {Array of String} base64List
 * @param {Object} obj
 * @returns {String} 图片链接 img_url&img_url...
 */
export async function postImgToQiniu (base64List, obj) {
	const { type, user_id } = obj
	if (!type && !user_id) return

	// 并发上传图片
	const qiniuPromises = base64List.map(async (base64, index) => {
		let filename
		if (type === 'note') {
			filename = `2life/user/${user_id}/img_${Date.now()}.png`
		}
		if (type === 'prifile') {
			filename = `2life/user/${user_id}/prifile_${Date.now()}.png`
		}
		const res_token = await HttpUtils.get(URL_qiniu_token, { filename })
		const key_base64 = Buffer.from(filename).toString('base64')

		if (res_token.code === 0) {
			const qiniu_token = res_token.data   //七牛token

			const res_qiniu = await fetch(URL_qiniu_host + key_base64, {
				method: 'post',
				headers: {
					'Content-Type': 'application/octet-stream',
					'Authorization': 'UpToken ' + qiniu_token
				},
				body: base64List[index]
			})

			return res_qiniu
		}
	})

	let imgUrls = []
	for(let i = 0; i < qiniuPromises.length; i++) {
		const res = await qiniuPromises[i]
		if (res.status === 200) {
			const body = JSON.parse(res._bodyText)
			imgUrls.push(BASE_IMG_URL + body.key)
		}
	}
	return imgUrls.join('&')
}
