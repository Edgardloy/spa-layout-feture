import { ElMessage } from 'element-plus'
import qs from 'qs'
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA } from '@/constants'
import { objToFormData } from '@/utils'
import { useUserStoreWithOut } from '@/store/modules/user'

const defaultRequestInterceptors = (config) => {
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data'
  ) {
    config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response) => {
  console.log("🚀 ~ defaultResponseInterceptors ~ response:", response)
  let message = response?.data?.message || response?.data?.message 
  if (response.status === SUCCESS_CODE) {
    message && ElMessage.error(message)
    return response
  } else {
    if (response?.data?.code === 401) {
      message = 'Utente non autorizzato'
      const userStore = useUserStoreWithOut()
      userStore.logout()
    }
    ElMessage.error(message)
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
