import request from "@/utils/request";

export const group = (data) => {
  return request({
    url: "/jxict-project-sso/device/group/tree/node",
    method: "post",
    data,
  });
};
export const platform = (data) => {
  return request({
    url: "/jxict-project-sso/device/platform/tree/node",
    method: "post",
    data,
  });
};

export const city = (data) => {
  return request({
    url: "/jxict-project-sso/device/info/area/node",
    method: "post",
    data,
  });
};

export const groupnode = () => {
  return request({
    url: "/jxict-project-sso/device/group/tree",
    method: "get",
  });
};

export const platformnode = () => {
  return request({
    url: "/jxict-project-sso/device/platform/tree",
    method: "get",
  });
};

export const citynode = () => {
  return request({
    url: "/jxict-project-sso/device/info/area",
    method: "get"
  });
};
//新增分组
export const addGroup = (data) => {
  return request({
    url: "/jxict-project-sso/device/group/add",
    method: "post",
    data
  });
};

export const getgrouplist = (data) => {
  return request({
    url: "/jxict-project-sso/device/group/list",
    method: "post",
    data
  });
};
//删除分组
export const deleteGroup = (id) => {
  return request({
    url: `/jxict-project-sso/device/group/delete?id=${id}`,
    method: "post",
  });
}
//获取分组设备
export const getGroupingEquipment = (data) => {
  return request({
    url: `/jxict-project-sso/device/info/rel `,
    method: "post",
    data
  });
};
//设备分组编辑
export const equipmentGroupEditing = (data) => {
  return request({
    url: `/jxict-project-sso/device/group/edit`,
    method: "post",
    data,
  });
};
//媒体网关树
export const mediaGatewayTree = async (params) => {
  return await request({
    url: `/jxict-project-sso/device/platform/mgw`,
    method: "get",
    params,
  });
};
//设备平台列表
export const equipmentPlatformList = async (data) => {
  return await request({
    url: `/jxict-project-sso/device/platform/list`,
    method: "post",
    data,
  });
};
//+++++++++++++++++++++++++++++++++++++++++++++
//新增平台
export const addPlatform = async (data) => {
  return await request({
    url: `/jxict-project-sso/device/platform/add`,
    method: "post",
    data,
  });
};
//编辑平台
export const editPlatform = async (data) => {
  return await request({
    url: `/jxict-project-sso/device/platform/edit`,
    method: "post",
    data,
  });
};
//设备申请
export const Application = async (data) => {
  return await request({
    url: `/jxict-project-sso/device/info/apply`,
    method: "post",
    data,
  });
};
//+++++++++++++++++++++++++++++++++++++++++++++
//平台级联

//平台级联列表
export const cascadelist = async (data) => {
  return await request({
    url: `/jxict-project-sso/device/cascade/list`,
    method: "post",
    data,
  });
};
//平台级联列表
export const cascadeadd = async (data) => {
  return await request({
    url: `/jxict-project-sso/device/cascade/add`,
    method: "post",
    data,
  });
};
//级联下设备
export const cascadedEquipment = async (data) => {
  return await request({
    url: `/jxict-project-sso/device/platform/tree/node`,
    method: "post",
    data,
  });
};
//级联下设备 /device/cascade/rel
export const getcascadelist = async (id) => {
  return await request({
    url: `/jxict-project-sso/device/cascade/rel?id=${id}`,
    method: "get",
  });
};
//级联删除
export const cascading = async (id) => {
  return await request({
    url: `/jxict-project-sso/device/cascade/delete?id=${id}`,
    method: "post",
  });
};
//平台级联编辑
export const cascadeedit = async (data) => {
  return await request({
    url: `/jxict-project-sso/device/cascade/edit`,
    method: "post",
    data,
  });
};
//平台级联密码
export const respassword = async (id) => {
  return await request({
    url: `/jxict-project-sso/device/cascade/password?id=${id}`,
    method: "get",
  });
};
//+++++++++++++++++++++++++++++++++++++++++++++
export const deletePlatform = async (id) => {
  return await request({
    url: `/jxict-project-sso/device/platform/delete?id=${id}`,
    method: "post",
  });
};
//平台级联启用
export const PlatformStart = async ({id}) => {
  return await request({
    url: `/jxict-project-sso/device/cascade/start?id=${id}`,
    method: "post",
  });
};
//平台级联启用
export const PlatformStop = async ({id}) => {
  return await request({
    url: `/jxict-project-sso/device/cascade/stop?id=${id}`,
    method: "post",
  });
};
//__________________________________________________________
export const getPassword = async (id) => {
  return await request({
    url: `/jxict-project-sso/device/platform/password?id=${id}`,
    method: "get",
  });
};
//平台级联配置下发
export const PlatformProof = async () => {
  return await request({
    url: `/jxict-project-sso/device/cascade/deploy`,
    method: "get",
  });
};
// 虚拟平台树
export const platformVirtualTree = async () => {
  return await request({
    url: `/jxict-project-sso/device/platform/virtual`,
    method: "get",
  });
};