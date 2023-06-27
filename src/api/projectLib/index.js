import request from "@/utils/request";
export const getTheme=(data)=>{
    return request({
        url:data.url,
        method:"POST",
        data:data.data
    })
}