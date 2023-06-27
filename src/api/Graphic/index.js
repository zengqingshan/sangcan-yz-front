import request from "@/utils/request";

//以图搜车
export const GraphsearchCar = (data) => {
  return request({
    url: "/jxict-project-retrieval/theme/vehicle",
    method: "post",
    data,
  });
};
//以图搜非机动车
export const GraphsearchunCar = (data) => {
  return request({
    url: "/jxict-project-retrieval/theme/nonVehicle",
    method: "post",
    data,
  });
};
//以图搜脸
export const Graphsearchface = (data) => {
  return request({
    url: "/jxict-project-retrieval/theme/face",
    method: "post",
    data,
  });
};
//以图搜体
export const Graphsearchbody = (data) => {
  return request({
    url: "/jxict-project-retrieval/theme/person",
    method: "post",
    data,
  });
};
//上传图片
export const uploadimg = (type,data) => {
  return request({
    url: `/jxict-project-retrieval/theme/upload?type=${type}`,
    method: "post",
    data,
  });
};
