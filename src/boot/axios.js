// import Vue from 'vue'
import axios from 'axios'
import { LocalStorage, Dialog } from 'quasar'
// axios.defaults.withCredentials = true
export default ({ router, Vue }) => {
  const http = axios.create({
    baseURL: 'https://8696123.iidingyun.com',
    timeout: 15000
  })
  // request拦截器
  http.interceptors.request.use(config => {
    config.headers = { 'Content-Type': 'application/json;charset=UTF-8' }
    let token = LocalStorage.getItem('token') || ''
    if (token !== '') {
      config.headers['Authorization'] = token // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
  }, error => {
    throw new Error(error)
  })

  // response拦截器
  http.interceptors.response.use(
    response => {
      // console.log(response)
      if (response.data.code === 'jwt_token_expired') {
        Dialog.create({
          title: '登录信息已过期',
          message: '请重新登录',
          cancel: false,
          persistent: true
        }).onOk(() => {
          LocalStorage.clear()
          router.push({ name: 'login' })
        })
      } else if (response.status === 200) {
        return response.data
      }
    },
    error => {
      throw new Error(error)
    }
  )
  const httpPost = function (url, data) {
    return http({
      method: 'post',
      url: url,
      data: { ...data }
    })
  }

  const httpGet = function (url, data) {
    return http({
      method: 'post',
      url: url,
      params: { ...data }
    })
  }

  Vue.prototype.$axios = httpPost
  Vue.prototype.$normalAxios = axios
  Vue.prototype.$axiosGet = httpGet
}
