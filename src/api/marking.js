import request from '@/utils/request'

/**
 * 添加评分
 *
 * @param {Object} marking
 * @returns Promise
 */
function addMarking(marking) {
  return request({
    url: '/addMarking',
    method: 'post',
    data: marking
  })
}

function getMarking(query) {
  return request({
    url: '/getMarking',
    method: 'get',
    params: query
  })
}

function updateMarking(data) {
  return request({
    url: '/updateMarking',
    method: 'post',
    data
  })
}

function deleteMarking(query) {
  return request({
    url: 'deleteMarking',
    method: 'post',
    data: query
  })
}

export default {
  getMarking,
  addMarking,
  updateMarking,
  deleteMarking
}
