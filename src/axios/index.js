import service from './service'
import { CONTENT_TYPE } from '@/constants'
import { useUserStore } from '@/store/modules/user'

export const PATH_API_URL = import.meta.env.VITE_API_URL

const baseRequest = (option) => {
  const { url, method, params, data, headers, responseType } = option

  const { token } = useUserStore()
  return service(location.host).request({
    url: url,
    method,
    params,
    data: data,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      'Authorization': token,
      ...headers
    }
  })
}

const apiRequest = (option) => {
  const { url, method, params, data, headers, responseType } = option

  const { token } = useUserStore()
  return service(PATH_API_URL).request({
    url: url,
    method,
    params,
    data: data,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      'Authorization': token,
      ...headers
    }
  })
}

export default {
  api: {
    get: (option) => {
      return apiRequest({ method: 'get', ...option })
    },
    post: (option) => {
      return apiRequest({ method: 'post', ...option })
    },
    delete: (option) => {
      return apiRequest({ method: 'delete', ...option })
    },
    put: (option) => {
      return apiRequest({ method: 'put', ...option })
    },
    cancelRequest: (url) => {
      return service(PATH_API_URL).cancelRequest(url)
    },
    cancelAllRequest: () => {
      return service(PATH_API_URL).cancelAllRequest()
    }
  },
  get: (option) => {
    return baseRequest({ method: 'get', ...option })
  },
  post: (option) => {
    return baseRequest({ method: 'post', ...option })
  },
  delete: (option) => {
    return baseRequest({ method: 'delete', ...option })
  },
  put: (option) => {
    return baseRequest({ method: 'put', ...option })
  },
  cancelRequest: (url) => {
    return service(PATH_BASE_URL).cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service(PATH_BASE_URL).cancelAllRequest()
  }
}
