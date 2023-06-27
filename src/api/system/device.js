import request from "@/utils/request";

// 查询全部设备列表，不分页
export function listDevice(query) {
  return request({
    url: "/jxict-project-sso/device/list",
    method: "post",
    data: query,
  });
}

export function listLocaLevelOrgDevice(params) {
  return request({
    url: "/jxict-project-sso/device/listLocaLevelOrgDevice",
    method: "post",
    params,
  });
}

// 查询某个企业下的所有设备列表
export function listTenanDevice(params) {
  return request({
    url: "/jxict-project-sso/device/listTenanDevice",
    method: "post",
    params,
  });
}

// 查询设备列表
export function listPageDevice(query) {
  return request({
    url: "/jxict-project-sso/device/list/page",
    method: "post",
    data: query,
  });
}

// 查询关注设备列表
export function listPageStarDevice(query) {
  return request({
    url: "/jxict-project-sso/device/star/list/page",
    method: "post",
    data: query,
  });
}

// 查询关注设备列表
export function listPageDevicePlayRecord(query) {
  return request({
    url: "/jxict-project-sso/device/playrecord/list/page",
    method: "post",
    data: query,
  });
}

// 查询关注设备列表
export function playrecordAdd(query) {
  return request({
    url: "/jxict-project-sso/device/playrecord/add",
    method: "post",
    data: query,
  });
}

// 关注设备
export function deviceStarAdd(query) {
  return request({
    url: "/jxict-project-sso/device/star/add",
    method: "post",
    data: query,
  });
}

// 取消关注设备
export function deviceStarDelete(query) {
  return request({
    url: "/jxict-project-sso/device/star/delete",
    method: "post",
    data: query,
  });
}

// 所有父节点
export function deviceParentOrgTreeList(params) {
  return request({
    url: "/jxict-project-sso/device/parentTreeList",
    method: "post",
    params,
  });
}

// 设备信息申请接口入参
export function getInfoParameter(data) {
  return request({
    url: "/jxict-project-sso/device/apply",
    method: "post",
    data,
  });
}
export function getInfoWithParams(params) {
  
  return request({
    url: "/jxict-project-sso/device/info",
    method: "get",
    params
  });
}

// 设备信息详情接口
export function getInfo(id) {
  let params = {id:id}
  return getInfoWithParams(params)
}



// 设备信息详情接口
export function getInfoserve(id) {
  let params = {serviceId:id}
  return getInfoWithParams(params)
}

export function getPlayParameter(serviceId) {
  return request({
    url: "/jxict-project-sso/device/getPlayParameter?serviceId=" + serviceId,
    method: "get",
  });
}
// 修改监控设备名称
export function editdevicename(data) {
  return request({
    url: "/jxict-project-sso/device/edit",
    method: "post",
    data,
  });
}
// 删除监控设备
export function deletedevicename(id) {
  return request({
    url: `/jxict-project-sso/device/delete?id=` + id,
    method: "post"
  });
}
export function editdevicenode(data) {
  return request({
    url: "/jxict-project-sso/device/editOrgRel",
    method: "post",
    data,
  });
}
