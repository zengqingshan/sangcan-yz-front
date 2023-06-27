import Vue from 'vue'

import VeeValidate, { Validator } from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
Validator.localize('zh_CN', zh_CN)
Vue.use(VeeValidate, {
  locale: 'zh_CN',
  dictionary: {
    zh_CN: {
      messages: {
        required: field => `${field} 不能为空`,
        integer: field => `${field} 不是有效值`,
        confirmed: (field, targetField) => `${field} 和 ${targetField} 不匹配`,
        regex: field => `${field} 不符合要求格式`
      }
    }
  }
})
import $ from 'jquery'
Vue.prototype.$ = $

import VueDND from 'awe-dnd'
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

Vue.use(VueDND)
import { mapState, mapActions } from 'vuex'
// import VCharts from 'v-charts'
import VueClipboards from 'vue-clipboards'
// import fullscreen from 'vue-fullscreen'
import VueResize from 'vue-resize'
import '@penggy/jquery.nicescroll'
import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/iconfont/iconfont.css' // iconfont
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import InitializationDictionary from './utils/DictionaryManagement'
import initdata from './initdic.js'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from '@/utils/ruoyi'
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from '@/components/Editor'
// 文件上传组件
import FileUpload from '@/components/FileUpload'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 引入自定义图标字体
import '@/assets/styles/font12.scss'
// message组件
import BaseMessage from '@/components/Message/BaseMessage'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.baseMessage = BaseMessage
Vue.prototype.$eventbus = new Vue()

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}

Vue.prototype.hasAnyRole = (serverInfo, userInfo, ...roles) => {
  return true
}
// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)

Vue.use(directive)
Vue.use(VueMeta)
// 初始化字典
Vue.use(InitializationDictionary, initdata)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
const windowHeight = window.innerHeight

const mainHeight = windowHeight - 50 - 48 - 10 // 主页面高度（包含页面头部header高度($(.admin-header).height())）

// 定义全局变量
Vue.prototype.GlobalVaris = {
  showMoreTabs: false, // 显示多tab页
  btnSize: 'mini',
  tableSize: 'mini',
  formSize: 'mini',
  formLabelWidth: '100px',
  asideWidth: '250px',
  mainHeight: mainHeight,
  mainCardTbHeight: mainHeight - 160,
  mainTbHeight: mainHeight - 100,
  ApiCallType: '0' // 接口访问类型 0-免登陆 1-需登陆
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  render: h => h(App)
})
