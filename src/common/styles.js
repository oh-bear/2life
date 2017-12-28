import React from 'react'
import {Dimensions} from 'react-native'

export const WIDTH = Dimensions.get('window').width
export const HEIGHT = Dimensions.get('window').height
export const INNERWIDTH = WIDTH - 16

const iPhone6Width = 375
const iPhone6Height = 667

/**
 *获取响应式高度
 *
 * @export
 * @param {number} height
 * @returns {number}
 */
export function getResponsiveHeight(height) {
  return height / iPhone6Height * HEIGHT
}

/**
 * 获取响应式宽度
 *
 * @export
 * @param {any} width
 * @returns
 */
export function getResponsiveWidth(width) {
  return width / iPhone6Width * WIDTH
}
