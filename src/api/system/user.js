import request from "@/utils/request";
import { encrypt } from "@/utils/jsencrypt";

const pubKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwxC0VAfhsbNHbUia+d3g7PxIOFPIw1crKnLE9rix28r5ogGzD0toS11bFq+ZUKHSJHX6fsXUmwBBxSCV6czdJr1CFllNf72VMBHGk11uKl9IbsCuR1BGoWQThi9UDomxTgbNvs6VypTkFifp23VZ6kniyt72iJk2X10yz4XIU9wIDAQAB";
// 查询用户列表
export function listUser(query) {
  return request({
    url: "/jxict-project-sso/user/list/page",
    method: "post",
    data: query,
  });
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: "/jxict-project-sso/user/info",
    method: "post",
    params: { userId },
  });
}

// 新增用户
export function addUser(data) {
  data.password = encrypt(data.password, pubKey);
  return request({
    url: "/jxict-project-sso/user/add",
    method: "post",
    data: data,
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: "/jxict-project-sso/user/update",
    method: "post",
    data: data,
  });
}

// 删除用户
export function delUser(userId) {
  return request({
    url: "/jxict-project-sso/user/delete",
    method: "post",
    params: { userId },
  });
}

// 删除用户
export function batchDelUser(ids) {
  return request({
    url: "/jxict-project-sso/user/delete/batch",
    method: "post",
    data: { ids },
  });
}

// 用户密码重置
export function resetUserPwd(userId, newPassword) {
  const data = {
    userId,
    newPassword,
  };
  data.newPassword = encrypt(data.newPassword, pubKey);
  return request({
    url: "/jxict-project-sso/user/resetPassword",
    method: "post",
    data: data,
  });
}

// 用户密码修改
export function changePassword({ authType, newPassword, smsCode }) {
  const data = {
    authType,
    newPassword,
    smsCode,
  };
  data.newPassword = encrypt(data.newPassword, pubKey);
  // data.oldPassword = encrypt(data.oldPassword,pubKey);
  return request({
    url: "/jxict-project-sso/LoginAccount/changePassword",
    method: "post",
    data: data,
  });
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: "/jxict-project-sso/user/install/roles",
    method: "post",
    data,
  });
}

// 保存授权角色
export function getUserListByOrg(data) {
  return request({
    url: "/jxict-project-sso/user/list/orgs",
    method: "post",
    data,
  });
}

export function userSwitchTenant(tenantId) {
  return request({
    url: "/jxict-project-sso/user/switchTenant",
    method: "post",
    params: { tenantId },
  });
}
