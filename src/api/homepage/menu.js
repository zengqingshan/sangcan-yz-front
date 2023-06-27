import request from '@/utils/request'

// 查询门户列表
export function getMenuList() {
  return request({
    url: '/getApps',
    method: 'get',
  })
}

// 其他session设置
export function setSession(params) {
  return request({
    url: '/adapter/doLogin',
    method: 'get',
    params
  })
}

// 设备统计接口
export function getCount() {
  return request({
    url: '/jxict-project-video/device/stats/count',
    method: 'get',
  })
}
// 设备类别统计
export function getType() {
  return request({
    url: '/jxict-project-video/device/stats/type',
    method: 'get',
  })
}
// 设备异常统计
export function getAbnormal(params) {
  return request({
    url: '/jxict-project-video/device/stats/abnormity',
    method: 'get',
    params
  })
}
// 资源统计接口
export function getUtilization() {
  return request({
    url: '/jxict-project-sso/sys/resource/stat/utilization',
    method: 'get',
  })
}
