import request from '@/utils/request'

/**
 *
 * @param {Object} marking
 * @returns Promise
 */
function addStanderd(standerd) {
  return request({
    url: '/addStanderd',
    method: 'post',
    data: standerd
  })
}

function getStanderd(query) {
  return request({
    url: '/getStanderd',
    method: 'get',
    params: query
  })
}

function delStanderd(query) {
  return request({
    url: '/deleteStanderd',
    method: 'post',
    data: query
  })
}

function updateStanderd(data) {
  return request({
    url: '/updateStanderd',
    method: 'post',
    data
  })
}

export default {
  getStanderd,
  addStanderd,
  delStanderd,
  updateStanderd
}
