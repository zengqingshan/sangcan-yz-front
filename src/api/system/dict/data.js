import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(type) {
  return request({
    url: '/jxict-project-sso/dict/kvinfo/',
    method: 'post',
    params:{type}
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/system/dict/data/export',
    method: 'get',
    params: query
  })
}

// 获取字典值
export function getDictionary() {
  return request({
    url: `/jxict-project-sso/dict/map`,
    method: 'post',
  })
}

// 获取设备列表
export function getDevice() {
  return request({
    url: '/jxict-project-video/device/platform/tree/node',
    method: 'post',
    data: {}
  })
}
