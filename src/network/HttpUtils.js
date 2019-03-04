import axios from 'axios'

import { VERSION, VERSION_NUMBER } from '../constants/config'

let defaultData = {
  uid: '',
  token: '',
  timestamp: ''
}

export function setToken(data) {
  defaultData = {
    ...defaultData,
    ...data
  }
}

// let baseUrl = 'http://localhost:3002'
let baseUrl = 'https://2life.api.ursb.me'

axios.defaults.timeout = 20000

export default class HttpUtils {

  static get(url, data = {}) {
    url = baseUrl + url
    data = {
      version: VERSION,
      v: VERSION_NUMBER,
      ...defaultData,
      ...data
    }
    return axios.get(url, {params: data}).then(response => response.data)
  }

  static post(url, data, config) {
    const query = `?uid=${defaultData.uid}&timestamp=${defaultData.timestamp}&token=${defaultData.token}&version=${VERSION}&v=${VERSION_NUMBER}`
    url = baseUrl + url + query

    data = {
      ...defaultData,
      ...data
    }
    return axios.post(url, data, {
      timeout: 3500,
      ...config
    })
      .then(response => response.data)
      .catch(error => console.dir(error))
  }
}
