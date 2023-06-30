import request from "@/utils/request";
// 学生信息数据-分页
export function studentmessage(data) {
  return request({
    url: "/jxict-project-sso/warn/list/page",
    method: "post",
    data: data,
  });
}

// 处理告警（支持批量处理）
export function handlerwarn(data) {
  return request({
    url: "/jxict-project-sso/warn/handle",
    method: "post",
    data: data,
  });
}

// 信息详情
export function msginfo(id) {
  return request({
    url: "/jxict-project-sso/warn/info?id=" + id,
    method: "get",
  });
}
// 导出
export function exportStudentInfo(id) {
  return request({
    url: "/jxict-project-sso/warn/exportExcel",
    method: "POST",
    // 改变接收数据的类型
    responseType: "blob", // 使用blob接收二进制文件流
  });
}
// 导出
export function previewImage(key) {
  return request({
    url: "/jxict-project-sso/warn/imageUrl/preview?fileKey=" + key,
    method: "get",
  });
}
