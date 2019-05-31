import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/user/login',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function deleteUser(query) {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    data: query
  })
}

export function getUser(query) {
  return request({
    url: '/user/getUser',
    method: 'get',
    params: query
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}
