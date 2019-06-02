import request from '@/utils/request'

export function deleteOrg(query) {
  return request({
    url: 'deleteOrg',
    method: 'post',
    data: query
  })
}

export function getOrg(query) {
  return request({
    url: 'getOrg',
    method: 'get',
    params: query
  })
}

export function updateOrg(data) {
  return request({
    url: 'updateOrg',
    method: 'post',
    data
  })
}

export function addOrg(data) {
  return request({
    url: 'addOrg',
    method: 'post',
    data
  })
}
