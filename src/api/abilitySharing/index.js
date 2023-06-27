import request from '@/utils/request';


// 列表
export const getList = async (data = {}) => {
    return await request({
        url: data.url,
        method: 'POST',
        data: data.data
    })
}

// 列表删除
export const deleteRow = async (data) => {
    return await request({
        url: `/cmict-project-ai/alarm/task/delete?id=${data}`,
        method: 'POST',
    })
}

// 能力发布列表
export const shareGroup = async(data)=>{
    return await request({
        url:"/jxict-project-sso/share/group/list",
        method:'POST',
        data
    })
}
// api详情
export const shareInfo = async(data)=>{
    return await request({
        url:`/jxict-project-sso/share/info/info?id=${data}`,
        method:'POST',
    })
}
// api详情更新
export const shareUpdate = async(data)=>{
    return await request({
        url:'/jxict-project-sso/share/info/update',
        method:'POST',
        data
    })
}
// 新增api
export const shareAdd = async(data)=>{
    return await request({
        url:'/jxict-project-sso/share/info/add',
        method:'POST',
        data
    })
}
// 删除api
export const shareDelete = async(data)=>{
    return await request({
        url:`/jxict-project-sso/share/info/delete?id=${data}`,
        method:'POST',
        data
    })
}
// 发布api
export const sharePublish = async(data)=>{
    return await request({
        url:`/jxict-project-sso/share/info/publish?id=${data}`,
        method:'POST',
    })
}
// 取消发布
export const shareUnpublish = async(data)=>{
    return await request({
        url:`/jxict-project-sso/share/info/unpublish?id=${data}`,
        method:'POST',
    })
}