import request from "@/utils/request";

// 短信日志分页查询
export function smsLogList(data) {
  return request({
    url: "/jxict-project-sso/sms/log/list/page",
    method: "post",
    data: data,
  });
}

// 短信模板查询接口
export function smsTemplateList() {
  return request({
    url: "/jxict-project-sso/sms/template/list",
    method: "get",
  });
}

// 短信日志分页查询
export function editTemplate(data) {
  return request({
    url: "/jxict-project-sso/sms/template/edit",
    method: "post",
    data: data,
  });
}

//告警设置设备列表分页查询
export function warnSettingList(data) {
  return request({
    url: "/jxict-project-sso/device/warn/list/page",
    method: "post",
    data: data,
  });
}
//告警设备声光/AI人脸开关接口
export function editSettingSwitch(data) {
  return request({
    url: "/jxict-project-sso/device/setting/edit",
    method: "post",
    data: data,
  });
}
