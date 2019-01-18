import { Dimensions } from 'react-native'
//import ExtraDimensions from 'react-native-extra-dimensions-android';

export const WIDTH = Dimensions.get('window').width
// export const HEIGHT = Platform.OS=='android'?
//   ExtraDimensions.get('REAL_WINDOW_HEIGHT'):Dimensions.get('window').height
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
 * @export
 * @param {number} width
 * @returns
 */
export function getResponsiveWidth(width) {
  return width / iPhone6Width * WIDTH
}

/**
 * 获取字体设置
 * @param {String} color 颜色
 * @param {Number} size 字体大小
 * @param {String} family 字体
 * @param {String} weight 字重
 * @returns {Object}
 */
export function font(color, size, weight, family) {
  return {
    color: color || '#fff',
    fontSize: size || 16,
    fontWeight: weight || '400',
    fontFamily: family || 'PingFang SC',
  }
}

export const Colors = {
  // 主色
  Primary: {
    EXTREMELY_DARK: '#15594C', //极暗色
    DARK: '#218e79', //暗色
    LIGHT: '#2DC3A6', //主色，亮色
    TINT: '#D8F4EE', //浅色
    EXTREMELY_TINT: '#F0F7F6', //极浅色
  },
  // 辅助色
  Secondary: {
    WARNING: '#FAA755', //警告色
    MALE: '#3594F2', //男性色
    FEMALE: '#E84AE9', //女性色
    DANGER: '#F54E4F', //危险、错误、点赞色
  },
  // 中性色
  Netural: {
    IMPORTANT: '#333', //重要文字
    NORMAL: '#666', //一般文字
    EXPLAN: '#AAA', //说明、不重要文字
    LINE: '#F1F1F1', //分割线
    TINT_BUTTON: '#F5F5F5', //浅色按钮
  }
}
