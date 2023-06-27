import request from "@/utils/request";

export const getDeviceDataSet = async (data = {}) => {
  return await request({
    url: "/jxict-project-sso/device/map/list",
    method: "POST",
    data,
  });
};
export function getDeviceList_Api(query) {
  return request({
    url: "/device/api/equipmentTopology/getDeviceList",
    method: "get",
    params: query,
  });
}
//设备信息删除
export function deviceInformationdelete(id) {
  return request({
    url: `/jxict-project-sso/device/info/delete?id=${id}`,
    method: "post",
  });
}
//设备下发
export function Equipment() {
  return request({
    url: `/jxict-project-sso/device/info/deploy`,
    method: "get",
  });
}
//设备信息密码
export function devicePassword(id) {
  return request({
    url: `/jxict-project-sso/device/info/password?id=${id}`,
    method: "get",
  });
}
//设备信息编辑
export function equipmentInformationEditing(data) {
  return request({
    url: `/jxict-project-sso/device/edit`,
    method: "post",
    data,
  });
}

//设备数量统计
export function Equipmentstatistics() {
  return request({
    url: `/jxict-project-sso/device/stats/count`,
    method: "get",
  });
}
