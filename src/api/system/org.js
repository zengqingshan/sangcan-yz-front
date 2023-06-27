import request from '@/utils/request'

// 查询机构列表
export function listOrg(query) {
  return request({
    url: '/jxict-project-sso/org/list',
    method: 'post',
    data: query
  })
}

//获取本级组织及子组织列表
export function orginfoAndSubOrgInfo(data) {

  return request({
    url: '/jxict-project-sso/org/orginfoAndSubOrgInfo',
    method: 'post',
    data: data
  })
}




// 查询机构详细
export function getOrg(params) {
  return request({
    url: '/jxict-project-sso/org/info',
    method: 'post',
    params
  })
}



// 新增机构
export function addOrg(data) {
  return request({
    url: '/jxict-project-sso/org/add',
    method: 'post',
    data: data
  })
}

// 修改机构
export function updateOrg(data) {
  return request({
    url: '/jxict-project-sso/org/update',
    method: 'post',
    data: data
  })
}

// 删除机构
export function delOrg(params) {
  return request({
    url: '/jxict-project-sso/org/delete/',
    method: 'post',
    params
  })
}

// 查询机构下拉树结构
export function treeselect(params) {
  return request({
    url: '/jxict-project-sso/org/tree',
    method: 'post',
    params
  })
}

// 所有父节点
export function parentOrgTreeList(params) {
  return request({
    url: '/jxict-project-sso/org/parentTreeList',
    method: 'post',
    params
  })
}

// 查询关注机构列表
export function listPageStarOrg(query) {
  return request({
    url: '/jxict-project-sso/org/star/list/page',
    method: 'post',
    data: query
  })
}

// 关注机构
export function orgStarAdd(query) {
  return request({
    url: '/jxict-project-sso/org/star/add',
    method: 'post',
    data: query
  })
}


// 取消关注机构
export function orgStarDelete(query) {
  return request({
    url: '/jxict-project-sso/org/star/delete',
    method: 'post',
    data: query
  })
}

// 导出
export function getInfos(orgId) {
  return request({
    url: '/jxict-project-sso/org/export?orgId=' + orgId,
    method: 'post',
    responseType: 'blob'
  })
}

// 导入
export function getIndex(data) {
  return request({
    url: '/jxict-project-sso/org/import',
    method: 'post',
    data,

    headers: { 'Content-Type': 'multipart/form-data' }

  })
}
export function deldevice(id) {
  return request({
    url: `/jxict-project-sso/device/delete?id=${id}`,
    method: 'post'
  })
}
