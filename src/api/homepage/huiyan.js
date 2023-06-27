import request from "@/utils/request";

// 播放视频
export function startPlayNew({deviceId, platformServiceId}) {
  return request({
    url: `/jxict-project-hikvision/hikvision/video/startPlay`,
    params:{
      deviceId,
      platformServiceId
    }
  })
}
// 获取城管告警
export function getPersonStatistics(data) {
  return request({
    url: `/jxict-project-hikvision/hikvision/alarm/person/hour/statistics`,
    method: 'POST',
    data
  })
}
// 获取城管告警
export function getCityStatistics(data) {
  return request({
    url: `/jxict-project-hikvision/hikvision/alarm/city/hour/statistics`,
    method: 'POST',
    data
  })
}
// 获取城管告警
export function getCityAlarmList(data) {
  return request({
    url: `/jxict-project-hikvision/hikvision/alarm/city/list`,
    method: 'POST',
    data
  })
}
// 获取城管告警
export function getPersonAlarmList(data) {
  return request({
    url: `/jxict-project-hikvision/hikvision/alarm/person/list`,
    method: 'POST',
    data
  })
}
