import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseURL,
  // timeout
})

const redirectLogin = () => {
  router.push({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const refreshToken = () => {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log(config)
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
let isRefreshing = false // 控制刷新 token 的状态
let requests: any[] = [] // 存储刷新 token 期间过来的 401 请求
request.interceptors.response.use(function (response) { // 2xx 状态码
  // console.log('response--->', response)

  return response
}, async function (error) { // 超出 2xx 范围状态码
  // console.log('error--->', error)
  if (error.response) { // 请求发出去收到响应了，但是状态码超出了 2xx 范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      /**
       * token 失效
       * 如果有 refresh_token 则尝试使用 refresh_token 获取新的token
       * 如果没有，则直接跳转登录页
       */

      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      //  刷新 token
      if (!isRefreshing) {
        isRefreshing = true // 开启刷新状态

        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 token 失败')
          }

          // 刷新 token 成功
          store.commit('setUser', res.data.content)
          // 把 requests 队列中的请求发送出去
          requests.forEach(cb => {
            cb()
          })
          // 重置 requests
          requests = []
          // console.log('error config-->', error.config) // 失败请求的配置信息
          return request(error.config) // 第一个请求重新发送
        }).catch(err => {
          console.log('err-->', err)
          // 清除当前登录用户状态
          store.commit('setUser', null)
          // 回到登录页
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false // 重置刷新状态
        })

        return
      }

      // 刷新状态下，把请求挂起放到 requests 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })

      // try {
      //   // 尝试获取新的 token
      //   const { data } = await axios.create()({
      //     method: 'POST',
      //     url: '/front/user/refresh_token',
      //     data: qs.stringify({
      //       refreshtoken: store.state.user.refresh_token
      //     })
      //   })
      //   console.log('data:', data)
      //   /**
      //    * 把刷新拿到的新的 refresh_token 更新到容器和本地存储中
      //    * 获取新的 token 成功， 把失败的请求重新发送出去
      //    */
      //   store.commit('setUser', data.content)
      //   console.log('error config-->', error.config) // 失败请求的配置信息
      //   return request(error.config)
      // } catch (error) {
      //   // 清除当前登录用户状态
      //   store.commit('setUser', null)
      //   // 回到登录页
      //   redirectLogin()
      //   return Promise.reject(error)
      // }
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务器错误')
    }
  } else if (error.request) { // 请求发出去没收到响应
    Message.error('请求响应失败')
  } else { // 在设置请求是发生了一些事情，触发了一个错误
    Message.error(`请求失败: ${error.message}`)
  }

  return Promise.reject(error)
})

export default request
