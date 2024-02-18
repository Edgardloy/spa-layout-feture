import axios from 'axios'
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config'

import { ElMessage, ElLoading } from 'element-plus'
import { REQUEST_TIMEOUT } from '@/constants'

const abortControllerMap = new Map()
let loadingInstance = null

const service = (PATH_URL) => {

  const axiosInstance = axios.create({
    timeout: REQUEST_TIMEOUT,
    baseURL: PATH_URL
  })

  axiosInstance.interceptors.request.use((res) => {
    const controller = new AbortController()
    const url = res.url || ''
    res.signal = controller.signal
    abortControllerMap.set(
      url,
      controller
    )

    if (res.reqLoading ?? true) {
      loadingInstance = ElLoading.service({
        lock: true,
        fullscreen: true,
        // spinner: 'CircleCheck',
        text: 'Caricamento...',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    }
    return res
  })

  axiosInstance.interceptors.response.use(
    (res) => {
      loadingInstance && loadingInstance.close()
      console.log("🚀 ~ res:", res)
      const url = res.config.url || ''
      abortControllerMap.delete(url)
      return Promise.resolve(res)
    },
    (error) => {
      loadingInstance && loadingInstance.close()
      console.log('err： ' + error)
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.request.use(defaultRequestInterceptors)
  axiosInstance.interceptors.response.use(defaultResponseInterceptors)

  return {
    request: (config) => {
      return new Promise((resolve, reject) => {
        if (config.interceptors?.requestInterceptors) {
          config = config.interceptors.requestInterceptors(config)
        }

        axiosInstance
          .request(config)
          .then((res) => {
            console.log("🚀 ~ .then ~ res:", res)
            resolve(res)
          })
          .catch((err) => {
            console.log("🚀 ~ returnnewPromise ~ err:", err)
            reject(err)
          })
      })
    },
    cancelRequest: (url) => {
      const urlList = Array.isArray(url) ? url : [url]
      for (const _url of urlList) {
        abortControllerMap.get(_url)?.abort()
        abortControllerMap.delete(_url)
      }
    },
    cancelAllRequest () {
      for (const [_, controller] of abortControllerMap) {
        controller.abort()
      }
      abortControllerMap.clear()
    }
  }
}
export default service
