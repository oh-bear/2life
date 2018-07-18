import { createAction, handleActions } from 'redux-actions'

const SAVE_DIARY_TO_LOCAL = 'SAVE_DIARY_TO_LOCAL'
const DELETE_DIARY_TO_LOCAL = 'DELETE_DIARY_TO_LOCAL'
const CLEAN_DIARY = 'CLEAN_DIARY'

const initialState = []

export const saveDiaryToLocal = createAction(SAVE_DIARY_TO_LOCAL)
export const deleteDiaryToLocal = createAction(DELETE_DIARY_TO_LOCAL)
export const cleanDiary = createAction(CLEAN_DIARY)

export default userReducer = handleActions({
	[SAVE_DIARY_TO_LOCAL](state, action) {
		return [
			...state,
			action.payload
		]
	},
	[DELETE_DIARY_TO_LOCAL](state, action) {
		// 根据date时间戳删除
		return state.filter(diary => diary.date !== action.payload)
	},
	[CLEAN_DIARY]() {
		return []
	}
}, initialState)
