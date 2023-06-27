import request from '@/utils/request'
import { encrypt } from '@/utils/jsencrypt';
const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwxC0VAfhsbNHbUia+d3g7PxIOFPIw1crKnLE9rix28r5ogGzD0toS11bFq+ZUKHSJHX6fsXUmwBBxSCV6czdJr1CFllNf72VMBHGk11uKl9IbsCuR1BGoWQThi9UDomxTgbNvs6VypTkFifp23VZ6kniyt72iJk2X10yz4XIU9wIDAQAB'
// 查询第三方应用列表
export function listShareApp() {
  return request({
    url: '/jxict-project-sso/shareApp/list',
    method: 'post',
    data: {}
  })
}
// 查询第三方应用列表-分页
export function pageShareApp(data) {
  return request({
    url: '/jxict-project-sso/shareApp/list/page',
    method: 'post',
    data
  })
}
// 新增第三方应用
export function addShareApp(data) {
  if(data.adminPassword !== undefined){
	data.adminPassword = encrypt(data.adminPassword,pubKey);
	}
  return request({
    url: '/jxict-project-sso/shareApp/add',
    method: 'post',
    data
  })
}
// 更新第三方应用
export function updateShareApp(data) {
	  if(data.adminPassword !== undefined){
	data.adminPassword = encrypt(data.adminPassword,pubKey);
	}
  return request({
    url: '/jxict-project-sso/shareApp/update',
    method: 'post',
    data
  })
}
// 删除第三方应用
export function delShareApp(params) {
  return request({
    url: '/jxict-project-sso/shareApp/delete',
    method: 'post',
    params
  })
}
// 获取第三方应用
export function getShareApp(params) {
  return request({
    url: '/jxict-project-sso/shareApp/info',
    method: 'post',
    params
  })
}

// 查询第三方应用设备授权的企业或设备列表
export function shareAppResourceGrantInfoList(params) {
  return request({
    url: '/jxict-project-sso/shareApp/resourceGrantInfoList',
    method: 'post',
    params
  })
}

// 第三方应用授权设备
export function shareAppGrantResource(data) {
  return request({
    url: '/jxict-project-sso/shareApp/grantResource',
    method: 'post',
    data
  })
}

// 角色授权设备
export function shareAppDeviceAuthGet(data) {
  return request({
    url: '/jxict-project-sso/shareApp/resource/gain',
    method: 'post',
    data
  })
}

// 能力授权--查询第三方应用接口信息
export function getAbilityTree(data) {
  return request({
    url: `/jxict-project-sso/share/info/shareApp/tree?shareAppId=${data}`,
    method: 'POST',
  })
}
// 能力授权--修改接口信息
export function shareRel(data){
  return request({
    url:'/jxict-project-sso/share/info/shareApp/rel',
    method:"POST",
    data
  })
}

