import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/jxict-project-sso/role/list',
    method: 'post',
    data: query
  })
}
// 查询角色列表
export function pageRole(query) {
  return request({
    url: '/jxict-project-sso/role/list/page',
    method: 'post',
    data: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/jxict-project-sso/role/info',
    method: 'post',
    params: {roleId}
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/jxict-project-sso/role/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/jxict-project-sso/role/update',
    method: 'post',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(params) {
  return request({
    url: '/jxict-project-sso/role/delete',
    method: 'post',
    params
  })
}

// 批量删除角色
export function delRoleBatch(data) {
  return request({
    url: '/jxict-project-sso/role/delete/batch',
    method: 'post',
    data
  })
}

// 角色授权设备
export function roleDeviceAuth(data) {
  return request({
    url: '/jxict-project-sso/sys/role/resource/auth',
    method: 'post',
    data
  })
}

// 角色授权设备
export function roleDeviceAuthGet(data) {
  return request({
    url: '/jxict-project-sso/sys/role/resource/gain',
    method: 'post',
    data
  })
}


