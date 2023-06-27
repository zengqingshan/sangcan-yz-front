import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { Loading } from 'element-ui'

var loadingObj = ''
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 60000
})
let dellist = []
const cancelToken = axios.CancelToken
// request拦截器
service.interceptors.request.use(

  (config) => {
    if (config?.loadobj) {
      loadingObj = Loading.service(config.loadobj)
    }

    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    config.headers['Authorization'] = localStorage.getItem('admin-token')
    config.headers['refreshAuthorization'] =
      localStorage.getItem('admin-token')
    config.cancelToken = new cancelToken((c) => {
      dellist.push({
        url: config.url,
        fn: c
      })
    })
    // config.url = config.url.replace('/jxict-project-sso/','/jxict-project-sso-new/')
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?'
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName]
        var part = encodeURIComponent(propName) + '='
        if (value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              const params = propName + '[' + key + ']'
              var subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[key]) + '&'
            }
          } else {
            url += part + encodeURIComponent(value) + '&'
          }
        }
      }

      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    if (loadingObj) {
      setTimeout(() => {
        loadingObj.close()
        loadingObj = ''
      }, 100)
    }

    // 未设置状态码则默认成功状态
    const code = res.data.code || 0
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    }
    if (code === 1100) {
      removeToken()
      if (process.env.NODE_ENV === 'development') {
        location.href = '/login'
        return Promise.reject(new Error(msg))
      } else {
        location.href = res.data.data.SSO_LOGIN_WAN_PATH
      }
    } else if (code !== 0) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data.data ||res.data
    }
  },
  (error) => {
    console.log('err' + error)
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
service.removePeddingRequest = () => {
  dellist.forEach((e, i) => {
    e.fn()
  })
  dellist = []
}
export default service
