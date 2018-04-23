export const isDev = global.process.env.NODE_ENV === 'development'

// 2011-01-11
export function getToday () {
	const date = new Date()
	const year = date.getFullYear()
	const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth()
	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
	return `${year}-${month}-${day}`
}

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
