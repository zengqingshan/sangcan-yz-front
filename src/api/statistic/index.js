import request from "@/utils/request";

// 结构化信息总量&总体数据流量趋势
export const infoTotal = (data) => {
    return request({
        url: '/jxict-project-retrieval/statistics/infoTotal',
        method: 'POST',
        data
    })
}
// 区域流量
export const region = (data) => {
    return request({
        url: '/jxict-project-retrieval/statistics/region',
        method: 'POST',
        data
    })
}
// 车辆信息
export const carInfo = (data) => {
    return request({
        url: '/jxict-project-retrieval/statistics/carInfo',
        method: 'POST',
        data
    })
}
// 类型统计
export const statsType = (data) => {
    return request({
        url: '/jxict-project-ai/alarm/stats/type',
        method: 'POST',
        data
    })
}
// 重点人统计
export const statsPerson = (data) => {
    return request({
        url: '/jxict-project-ai/alarm/stats/person',
        method: 'POST',
        data
    })
}
// 告警记录统计
export const statsRecord = (data) => {
    return request({
        url: '/jxict-project-ai/alarm/stats/record',
        method: 'POST',
        data
    })
}
// 重点车统计
export const statsVehicle = (data) => {
    return request({
        url: '/jxict-project-ai/alarm/stats/vehicle',
        method: 'POST',
        data
    })
}