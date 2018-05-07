import { AsyncStorage } from 'react-native'

export default class Storage {
  static async get(key, defaultValue) {
    let result = await AsyncStorage.getItem(key)
    if (!result) {
      return defaultValue
    }
    try {
      return JSON.parse(result)
    } catch (error) {
      console.log(error)
      return defaultValue || undefined
    }
  }

  static async set(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  }

  static async remove(key) {
    await AsyncStorage.removeItem(key)
  }

}
