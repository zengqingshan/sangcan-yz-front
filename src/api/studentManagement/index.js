import request from "@/utils/request";

// 查询学生机构列表
export function studentList(data) {
  return request({
    url: "/jxict-project-sso/student/list/page",
    method: "post",
    data: data,
  });
}
// 新增学生信息
export function addStudents(data) {
  return request({
    url: "/jxict-project-sso/student/add",
    method: "post",
    data: data,
  });
}
// 修改学生信息
export function updateStudents(data) {
  return request({
    url: "/jxict-project-sso/student/update",
    method: "post",
    data: data,
  });
}

//删除学生信息
export function deleteStudents(id) {
  return request({
    url: "/jxict-project-sso/student/delete?id=" + id,
    method: "post",
  });
}

//批量删除 学生
export function batchDeletestudents(data) {
  return request({
    url: "/jxict-project-sso/student/delete/batch",
    method: "post",
    data: data,
  });
}
//获取指定的机构树
export function getTreeList(data) {
  return request({
    url: `/jxict-project-sso/student/org/tree?id=${data.id || ""}&orgName=${
      data.orgName || ""
    }`,
    method: "get",
  });
}
//查询机构列表
// export function getTreeList() {
//   return request({
//     url: "/jxict-project-sso/student/org/list",
//     method: "post",
//   });
// }
//修改机构
export function updateOrg(data) {
  return request({
    url: "/jxict-project-sso/student/org/update",
    method: "post",
    data: data,
  });
}
//添加机构
export function addOrganization(data) {
  return request({
    url: "/jxict-project-sso/student/org/add",
    method: "post",
    data: data,
  });
}
//删除机构
export function deleteOrganization(id) {
  return request({
    url: "/jxict-project-sso/student/org/delete?id=" + id,
    method: "post",
  });
}
//图片上传
export function uploadPhotos(data) {
  return request({
    url: "/jxict-project-sso/student/avatar/upload?fileKey=" + data.fileKey,
    method: "post",
    data: data.file,
  });
}
//照片预览
export function previewPhotos(key) {
  return request({
    url: "/jxict-project-sso/student/avatar/preview?fileKey=" + key,
    method: "get",
  });
}
//照片删除
export function deletePhotos(key) {
  return request({
    url: "/jxict-project-sso/student/avatar/delete?fileKey=" + key,
    method: "POST",
  });
}
//导入
//导出
export function exportStudentInfo(id) {
  return request({
    url: "/jxict-project-sso/student/exportExcel?studentOrgId=" + id,
    method: "POST",
    // 改变接收数据的类型
    responseType: "blob", // 使用blob接收二进制文件流
  });
}
