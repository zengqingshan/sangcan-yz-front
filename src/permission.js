import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  // next()
  // return
  NProgress.start()
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetKvList').then(() => {
          // 判断当前用户是否已拉取完user_info信息
          store.dispatch('GetInfo').then(accessRoutes => {
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            store.dispatch('GetDictionary').then(() => {
              store.dispatch('GetDevice').then(() => {
                if (to.path === '/') {
                  // 防止渲染空白界面 默认渲染路由中第一个菜单
                  const getRoute = (route)=>{
                    return route.children && route.children.length ?
                      getRoute(route.children[0]) :
                      route.name;
                  }
                  next({
                    name: getRoute(accessRoutes[0]),
                    replace: true
                  });
                } else {
                  next({ ...to, replace: true })// hack方法 确保addRoutes已完成
                }
              })
            })
          }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
        })

      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
