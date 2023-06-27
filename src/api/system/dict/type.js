import request from '@/utils/request'

// 查询字典类型列表
export function listType(data) {
  return request({
    url: '/jxict-project-sso/dict/list/page',
    method: 'post',
    data
  })
}

// 查询字典类型详细
export function getType(params) {
  return request({
    url: '/jxict-project-sso/dict/info/',
    method: 'post',
    params
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/jxict-project-sso/dict/add',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/jxict-project-sso/dict/update',
    method: 'post',
    data: data
  })
}

// 删除字典类型
export function delType(params) {
  return request({
    url: '/jxict-project-sso/dict/delete',
    method: 'post',
    params
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/system/dict/type/refreshCache',
    method: 'delete'
  })
}

// 导出字典类型
export function exportType(query) {
  return request({
    url: '/system/dict/type/export',
    method: 'get',
    params: query
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/system/dict/type/optionselect',
    method: 'get'
  })
}
