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

export default {
  getMarking,
  addMarking
}
