import request from "@/utils/request";

export const platformTree = (data) => {
  return request({
    url: "/jxict-project-sso/device/platform/tree/node",
    method: "post",
    data,
  });
};
// 能力授权树
export const abilityTree = (data) => {
  return request({
    url: "/jxict-project-sso/share/info/tree",
    method: "post",
    data,
  });
};
