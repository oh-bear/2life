import axios from 'axios'

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

let baseUrl = 'http://localhost:3002'

axios.defaults.timeout = 20000

export default class HttpUtils {

  static get(url, data = {}) {
    url = baseUrl + url
    data = {
      ...defaultData,
      ...data
    }
    return axios.get(url, {params: data}).then(response => response.data)
  }

  static post(url, data) {
    url = baseUrl + url

    data = {
      ...defaultData,
      ...data
    }
    return axios.post(url, data)
      .then(response => response.data)
      .catch(error => console.dir(error))
  }
}
