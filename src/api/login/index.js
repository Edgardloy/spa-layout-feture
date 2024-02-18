import request from '@/axios'

export function loginApi (data) {
  return request.api.post({
      url: '/api/struttura/login',
      data
  })
}

export function loginOutApi (data) {
}

export function impersonate (login) {
  return request.api.post({
      url: `/impersonate/${login}/take`,
  })
}

export function leaveImpersonate () {
  return request.api.post({
      url: `/impersonate/leave`,
  })
}
