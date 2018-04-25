import axios from 'axios'

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
