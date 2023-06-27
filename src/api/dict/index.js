import request from "@/utils/request";

//全量字典
export const allDictionary = async () => {
  return await request({
    url: "/jxict-project-sso/dict/front",
    method: "get",
  });
};
//获取区域树
export const getZoneTree = async () => {
  return await request({
    url: "/jxict-project-sso/sys/division/list",
    method: "get",
  });
};
