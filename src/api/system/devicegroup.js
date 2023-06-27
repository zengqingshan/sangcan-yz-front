import request from '@/utils/request'

// 查询设备分组列表
export function listDeviceGroup(params) {
  return request({
    url: '/jxict-project-sso/device/group/list',
    method: 'post',
    data: params
  })
}

// 添加设备分组列表
export function addDeviceGroup(params) {
  return request({
    url: '/jxict-project-sso/device/group/add',
    method: 'post',
    data: params
  })
}

// 修改设备分组列表
export function editDeviceGroup(params) {
  return request({
    url: '/jxict-project-sso/device/group/edit',
    method: 'post',
    data: params
  })
}

// 删除设备分组列表
export function deleteDeviceGroup(params) {
  return request({
    url: '/jxict-project-sso/device/group/delete',
    method: 'post',
    params
  })
}

export function getDeviceGroupinfo(params) {
  return request({
    url: '/jxict-project-sso/device/group/info',
    method: 'post',
    params
  })
}
