import request from '@/utils/request'
import { encrypt } from '@/utils/jsencrypt';
const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwxC0VAfhsbNHbUia+d3g7PxIOFPIw1crKnLE9rix28r5ogGzD0toS11bFq+ZUKHSJHX6fsXUmwBBxSCV6czdJr1CFllNf72VMBHGk11uKl9IbsCuR1BGoWQThi9UDomxTgbNvs6VypTkFifp23VZ6kniyt72iJk2X10yz4XIU9wIDAQAB'
// 查询租户列表
export function listTenant() {
  return request({
    url: '/jxict-project-sso/tenant/list',
    method: 'post',
    data: {}
  })
}
// 查询租户列表-分页
export function pageTenant(data) {
  return request({
    url: '/jxict-project-sso/tenant/list/page',
    method: 'post',
    data
  })
}
// 新增租户
export function addTenant(data) {
  if(data.adminPassword !== undefined){
	data.adminPassword = encrypt(data.adminPassword,pubKey);
	}
  return request({
    url: '/jxict-project-sso/tenant/add',
    method: 'post',
    data
  })
}
// 更新租户
export function updateTenant(data) {
	  if(data.adminPassword !== undefined){
	data.adminPassword = encrypt(data.adminPassword,pubKey);
	}
  return request({
    url: '/jxict-project-sso/tenant/update',
    method: 'post',
    data
  })
}
// 删除租户
export function delTenant(params) {
  return request({
    url: '/jxict-project-sso/tenant/delete',
    method: 'post',
    params
  })
}
// 获取租户
export function getTenant(params) {
  return request({
    url: '/jxict-project-sso/tenant/info',
    method: 'post',
    params
  })
}

// 角色授权设备
export function tenantDeviceAuth(data) {
  return request({
    url: '/jxict-project-sso/sys/tenant/resource/auth',
    method: 'post',
    data
  })
}

// 角色授权设备
export function tenantDeviceAuthGet(data) {
  return request({
    url: '/jxict-project-sso/sys/tenant/resource/gain',
    method: 'post',
    data
  })
}

// 能力授权--查询租户接口信息
export function getAbilityTree(data) {
  return request({
    url: `/jxict-project-sso/share/info/tenant/tree?tenantId=${data}`,
    method: 'POST',
  })
}
// 能力授权--修改接口信息
export function shareRel(data){
  return request({
    url:'/jxict-project-sso/share/info/tenant/rel',
    method:"POST",
    data
  })
}
// 个性化--修改
export function updateKvList(data){
  return request({
    url:'/jxict-project-sso/sys/tenant/config/update',
    method:"POST",
    data
  })
}
// 业务参数--修改
export function updateKvListBusi(data){
  return request({
    url:'/jxict-project-sso/sys/tenant/config/update/busi',
    method:"POST",
    data
  })
}
// 个性化--获取列表
export function getKvList(data){
  return request({
    url:'/jxict-project-sso/sys/tenant/config/kvList',
    method:"POST",
    data
  })
}
// 业务参数--获取列表
export function getKvListBusi(data){
  return request({
    url:'/jxict-project-sso/sys/tenant/config/kvList/busi',
    method:"POST",
    data
  })
}
// 个性化--上传图片
export function upload(data){
  return request({
    url:'/jxict-project-sso/sys/tenant/config/upload',
    method:"POST",
    data
  })
}
