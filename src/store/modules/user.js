import { login, logout, getInfo ,smslogin, register} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes } from '@/router'
import Layout from '@/layout/index'
import AppMain from '@/layout/components/AppMain'
import ParentView from '@/components/ParentView'


const user = {
  state: {
    token: getToken(),
	tenantList:[],
	tenantName:'',
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
	
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },


	SET_TENANT_NAME: (state, tenantName) => {
      state.tenantName = tenantName
    },
	SET_TENANT_LIST: (state, tenantList) => {
      state.tenantList = tenantList
    },
	
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_USER: (state, user) => {
      state.all = user
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res)
          commit('SET_TOKEN', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
	
	// 登录
    smsLogin({ commit }, userInfo) {
	  let param = {};
      param.phone = userInfo.phone.trim()
      param.smscode = userInfo.smscode.trim()

      return new Promise((resolve, reject) => {
        smslogin(param).then(res => {
          setToken(res)
          commit('SET_TOKEN', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
	
	
	// 注册
    Register({ commit }, userInfo) {

	  
      return new Promise((resolve, reject) => {
        register(userInfo.phone.trim(), userInfo.password.trim(), userInfo.smscode.trim()).then(res => {
      
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(location.search).then(res => {
          if(!res){
            return;
          }
          const user = res
		  	  if(user.tenantList.length == 0){
				alert('当前用户未加入企业，请联系企业管理员')
				 reject('当前用户未加入企业，请联系企业管理员')
		  }

          const avatar = !user.avatar ? require('@/assets/images/profile.jpg') : process.env.VUE_APP_BASE_API + user.avatar

          if (res.userInfo.role ) { 
            commit('SET_ROLES', res.userName)
            commit('SET_PERMISSIONS', res.userInfo.permissions)
          } else {
            reject('当前用户未分配角色，请联系企业管理员')
          }
          localStorage.setItem('userId', user.userInfo.user.id)
          localStorage.setItem('userName', user.userName)
          setToken(res.ssoSessionId)
	
		  var tenantName = user.userInfo.tenant.name;
		  sessionStorage.setItem("tenantName", tenantName);
		  commit('SET_TENANT_NAME',tenantName)
		
		  
		  sessionStorage.setItem("currentTenantUserId", user.userInfo.user.userId);
		  sessionStorage.setItem("currentTenantId", user.userInfo.user.tenantId);

		
		
		  
		  commit('SET_TENANT_LIST',user.tenantList)

          commit('SET_NAME', user.userName)
          commit('SET_ID', user.userInfo.user.id)
          commit('SET_USER', user)
          commit('SET_AVATAR', avatar)
		  
		  
		  let qlyToken = "eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZGVudGlmaWNhdGlvbiI6Im5vbmUiLCJ1c2VySWQiOiI3MTkxMTEzNzczOTQwNjU0MDgiLCJwbGF0Zm9ybVR5cGUiOiJXRUIiLCJhcHBJZCI6IjdiYTE1YjUxNTBmMmU4ZjAxYmczMjQ0YWFiZDE5YTdiIiwianRpIjoiMTQ5ODUzNjQ0MDA3OTU1ODczNiIsImlhdCI6MTY4NTQyNjcwOSwic3ViIjoiNzE5MTExMzc3Mzk0MDY1NDA4IiwiZXhwIjoxNjg2NzIyNzA5fQ.6w6ucObsBag6VAHIj6FJtI475kAlsNIfb_GAnxFDc5I";
		  
		  sessionStorage.setItem("qlyToken", qlyToken);
	

		
          const { menuRouterList, tenantConfigMap } = res.userInfo

          //const favicon = document.querySelector('link[rel="icon"]');
          //favicon.href = `${tenantConfigMap.logo}`;
          //const title = document.querySelector('title');
          //title.innerText = tenantConfigMap.index_page_top_left_title;
          if (menuRouterList && menuRouterList.length) {
            const sdata = JSON.parse(JSON.stringify(menuRouterList))
            const rdata = JSON.parse(JSON.stringify(menuRouterList))
            const sidebarRoutes = filterAsyncRouter(sdata)
            const rewriteRoutes = filterAsyncRouter(rdata, false, true)
            // rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
            commit('SET_ROUTES', rewriteRoutes)
            commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
            commit('SET_DEFAULT_ROUTES', sidebarRoutes)
            commit('SET_TOPBAR_ROUTES', sidebarRoutes)
            resolve(rewriteRoutes)
          }else{
          resolve([])
		  }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(()=>{
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        // if(!route.children)return;
        // 修改三层菜单
        route.children.forEach(item=>{
          if(item.component === 'Layout'){
            item.hasParent = true;
          }
        })
        if(route.hasParent){
          route.component = AppMain;
        }else{
          route.component = Layout
        }
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
     // delete route['children']
     // delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default user
