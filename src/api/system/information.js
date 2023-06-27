import request from "@/utils/request";

//设置消息为已读
export function doread(data) {
  return request({
    url: "/jxict-project-sso/device/notification/doread",
    method: "post",
    data,
  });
}

//消息开关
export function subscribe(params) {
  return request({
    url: "/jxict-project-sso/device/notification/subscribe",
    method: "post",
    data: params,
  });
}

//已打开消息订阅开关列表
export function subscribeOrgList(query) {
  return request({
    url: "/jxict-project-sso/device/notification/subscribeOrgList",
    method: "get",
    data: query,
  });
}

//设备未读消息列表
export function unreadlist(params) {
  return request({
    url: "/jxict-project-sso/device/notification/unreadlist",
    method: "post",
    data: params,
  });
}
