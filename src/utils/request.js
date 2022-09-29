import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

export const baseurl = 'http://big-event-vue-api-t.itheima.net'

const myAxios = axios.create({
  baseURL: baseurl
})
// 请求拦截器 携带 token 值
myAxios.interceptors.request.use(
  function (config) {
    if (store.state.token) {
      config.headers.Authorization = store.state.token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      // 清空token
      store.commit('updataTolen', '')
      // 清空 userinfo 用户信息
      store.commit('updataUserInfo', {})
      // 轻质跳转至 login 页面
      router.push('/login')
      // 弹框提示错误信息
      Message.error('身份验证过期！')
    }
  }
)
export default myAxios
