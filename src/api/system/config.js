import request from '@/utils/request'

// 查询参数列表
export function listConfig(data) {
  return request({
    url: '/jxict-project-sso/sysParam/list/page',
    method: 'post',
    data
  })
}

// 查询参数详细
export function getConfigList() {
  return request({
    url: `/jxict-project-sso/sysParam/kvlist`,
    method: 'post',
    data:{}
  })
}

// 根据参数键名查询参数值
export function getConfigKey(id) {
  return request({
    url: '/jxict-project-sso/sysParam/info/',
    method: 'post',
    params: id
  })
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: '/system/config',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/jxict-project-sso/sysParam/update',
    method: 'post',
    data: data
  })
}

// 删除参数配置
export function delConfig(configId) {
  return request({
    url: '/system/config/' + configId,
    method: 'delete'
  })
}

// 刷新参数缓存
export function refreshCache() {
  return request({
    url: '/system/config/refreshCache',
    method: 'delete'
  })
}

// 导出参数
export function exportConfig(query) {
  return request({
    url: '/system/config/export',
    method: 'get',
    params: query
  })
}