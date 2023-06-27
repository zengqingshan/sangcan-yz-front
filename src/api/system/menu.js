import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/jxict-project-sso/menu/list',
    method: 'post',
    data: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/jxict-project-sso/menu/info',
    method: 'post',
    params: {menuId}
  })
}

// 查询菜单下拉树结构
export function treeMenuByRole() {
  return request({
    url: '/jxict-project-sso/menu/treeByRole',
    method: 'post'
  })
}



// 新增菜单
export function addMenu(data) {
  return request({
    url: '/jxict-project-sso/menu/add',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/jxict-project-sso/menu/update',
    method: 'post',
    data: data
  })
}

// 删除菜单
export function delMenu(params) {
  return request({
    url: '/jxict-project-sso/menu/delete',
    method: 'post',
    params
  })
}
