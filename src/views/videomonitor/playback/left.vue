<template>
  <div class="contron-left " style="height: 100%;">

    <!-- 左侧tab标签页 -->

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="first" class="alls">
        <div autocomplete="off" spellcheck="false">
          <el-input
            ref="q"
            v-model="q"
            prefix-icon="el-icon-search"
            type="text"
            placeholder="搜索组织机构摄像头"
            @clear="clearSearch"
            @keyup.enter.native="searchOrgOrDevice"
          />
        </div>

        <div v-if="showTree" v-show="!showQueryDevTree" id="tab-tree-wrapper" class="tab-content" style="margin: 10px 0;">
          <div id="dev-tree-wrapper" ref="devTreeWrapper" class="tab-pane active">

            <div class="vvtv">
              <el-tree
                id="dev-tree"
                ref="devTree"
                node-key="key"
                :props="treeProps"
                :load="treeLoad"
                lazy
                :highlight-current="true"
                :expand-on-click-node="false"
                :empty-text="treeEmptyText"
                :default-expanded-keys="defExpandDevs"
                @node-click="storeNodeClick"
                @node-contextmenu="treeNodeRightClick"
              >
                <span slot-scope="{node, data}" class="custom-tree-node">
                  <span style="padding: 0 5px;">
                    <span v-if="data.type == 'org'"><!--机构图标-->
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="folder"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32z"
                        />
                      </svg>
                    </span>

                    <!--设备图标-->
                    <span
                      v-if="data.type == 'device'"
                      :class="[{
                        'icon-video-camera-offline': !data.deviceStatus,
                        'icon-video-camera-online': data.deviceStatus,
                      }]"
                    ><svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="video-camera"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560zm176-167l-104-59.8V458.9L888 399v226zM208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
                      />
                    </svg></span>

                    <span class="ellipsis" style="user-select:none;margin-left:4px;" :title="node.label">{{ node.label
                    }}</span>
                    <span v-if="data.type == 'device'" style="color: rgb(70, 160, 252); margin-left: 5px;"><svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 12"
                      version="1.1"
                    >
                      <g stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
                        <g transform="translate(-1636.000000, -103.000000)" fill="currentColor" fill-rule="nonzero">
                          <g transform="translate(1621.777778, 93.000000)">
                            <g transform="translate(14.222222, 10.000000)">
                              <path
                                d="M8.01918093,0 C10.4756092,0 12.5018332,1.62450168 13.3429121,3.88859453 C14.9104541,4.35557595 16,5.87841525 16,7.64492813 C16,9.81752484 14.3464767,11.584071 12.2533818,11.584071 L3.74683753,11.584071 L3.74683753,11.584071 C1.70144043,11.584071 0,9.81752484 0,7.64492813 C0,5.88859813 1.13749436,4.34539308 2.65707228,3.88857789 C3.49821378,1.62450168 5.58194141,0 8.01918093,0 Z M8.0191966,4.06136013 C7.7993795,4.06136013 7.5987355,4.13563879 7.45525053,4.27470986 L7.45525053,4.27470986 L5.19006766,6.68660777 C5.10394535,6.82569404 5.01801101,6.98338798 5.01801101,7.19672251 C5.01801101,7.57702442 5.36210865,7.91101997 5.75401373,7.91105038 C5.9738465,7.91105038 6.18407704,7.79970839 6.32735838,7.66065253 L6.32735838,7.66065253 L7.28320954,6.64940763 L7.28320954,9.28568734 C7.28320954,9.72167544 7.58914895,10 8.0191966,10 C8.43029045,10 8.7648172,9.72166023 8.7648172,9.28568734 L8.7648172,9.28568734 L8.7648172,6.64939242 L9.72044906,7.66063732 C9.86393403,7.79972359 10.0263885,7.91103518 10.2462056,7.91103518 C10.6954733,7.91103518 11.0300001,7.57705482 11.0300001,7.19672251 C11.0300001,7.00199565 10.9534486,6.82566363 10.8101673,6.68660777 L10.8101673,6.68660777 L8.59276055,4.27470986 C8.41110168,4.13563879 8.23902936,4.06136013 8.0191966,4.06136013 Z"
                              />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg></span>
                    <el-popover
                      placement="right-end"
                      width="180"
                      trigger="click"
                    >
                      <div class="elpopoevr">
                        <p @click="editdeviceinfo(data,node)"><i class="el-icon-edit" />修改摄像机名称</p>
                        <p @click="editjigouinfo(data,node)"><i class="el-icon-edit" />修改摄像机所在机构</p>
                      </div>
                      <i
                        slot="reference"
                        :class="{ 'el-icon-more-outline': data.type == 'device','icon-more':true }"
                        @mouseenter="treeNodeRightClick($event, data, node)"
                      />
                    </el-popover>
                  <!-- </el-popover> -->
                  </span>
                </span>
              </el-tree>
            </div>

          </div>

        </div>
        <el-tabs v-show="showQueryDevTree" v-model="searchActiveName">
          <el-tab-pane label="机构" name="searchOrgTab">
            <Searchjigou ref="searchJigou" @searchedOrgClick="searchedOrgClick" />
          </el-tab-pane>
          <el-tab-pane label="设备" name="searchDeviceTab">
            <Searchshebei ref="searchShebei" @searchedDeviceClick="searchedDeviceClick" />
          </el-tab-pane>

        </el-tabs>

        <VueContextMenu
          class="right-menu"
          :target="contextMenuTarget"
          :show="contextMenuVisible"
          @update:show="(show) => contextMenuVisible = show"
        >

          <a v-show="contextMenuNodeData" role="button" @click="treeNodeRefresh(pnode)">
            <i class="fa fa-refresh" /> 刷新节点
          </a>

          <a
            v-show="contextMenuNodeData && !(contextMenuNodeData.custom && !contextMenuNodeData.code)"
            role="button"
            @click="showNodeEditDlg"
          >
            <i class="fa fa-edit" /> 编辑名称
          </a>

        </VueContextMenu>

      </el-tab-pane>
      <el-tab-pane label="关注" name="second">
        <concern :rightinfo="concerninfo" />
      </el-tab-pane>
      <el-tab-pane label="历史" name="threed">
        <history :hisright="concerninfo" />
      </el-tab-pane>
      <el-tab-pane label="轮巡" name="foured">
        <Polling ref="Polling" :polling="concerninfo" />
      </el-tab-pane>
    </el-tabs>

    <!-- 修改设备名称 -->
    <el-dialog
      title="修改摄像机名称"
      :visible.sync="showeditvedioinfo"
      width="35%"
      center
    >
      <div class="dialog">
        <p style="margin-top:30px;">
          <span style="font-size: 13px;margin-left: 14px;">摄像机现有名称：</span>
          <span>{{ deviceObj.name }}</span>
        </p>
        <p class="p-form">
          <el-form ref="numberValidateForm" :model="numberValidateForm" label-width="110px" class="demo-ruleForm">
            <el-form-item
              label="摄像机新的名称"
              prop="name"
              :rules="[
                { required: true, message: '名称不能为空'}
              ]"
            >
              <el-input v-model.number="numberValidateForm.name" autocomplete="off" />
            </el-form-item>
          </el-form></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showeditvedioinfo = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('numberValidateForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改摄像机所在机构 -->
    <el-dialog
      title="修改摄像机所在机构"
      :visible.sync="editjigou"
      width="35%"
      center
    >
      <div class="dialog">
        <p style="margin-top:30px;">
          <span style="font-size: 13px;margin-left: 14px;">摄像机现有名称：</span>
          <span>{{ deviceObj.name }}</span>
        </p>
        <p class="jigouclass">
          <span style="line-height: 34px;margin-right: 3%;">摄像机父级节点：</span>
          <treeselect
            v-model="deviceObj.orgId"
            no-options-text="无数据"
            :flat="true"
            :auto-select-descendants="true"
            :multiple="false"
            style="line-height: 16px;width: 50%;"
            :limit="1"
            :options="orgOptions"
            :show-count="true"
            placeholder="请选择归属机构"
          />
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editjigou = false">取 消</el-button>
        <el-button type="primary" @click="editnodesinfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import concern from './components/concern.vue'
import history from './components/history.vue'
import Polling from './components/Polling.vue'
import 'font-awesome/css/font-awesome.css'
import 'admin-lte/dist/css/skins/_all-skins.css'
import 'vue-resize/dist/vue-resize.css'
import 'leaflet/dist/leaflet.css'

import '@penggy/leaflet-contextmenu/dist/leaflet.contextmenu.css'
import 'leaflet'

import '@penggy/leaflet-contextmenu/dist/leaflet.contextmenu.js'

import $ from 'jquery'
import VideoPlayers from './components/videosAllVideos.vue'
import './assets/js/jquery-sticky.js'
import 'jquery-ui/ui/widgets/draggable'

import { mapState } from 'vuex'
import { component as VueContextMenu } from '@penggy/vue-context-menu'

import {
  editdevicename, getInfo, listLocaLevelOrgDevice, getInfoserve

} from '@/api/system/device'
import {
  treeselect,
  orginfoAndSubOrgInfo
} from '@/api/system/org'
import { dealTree } from '@/utils/deal-tree'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Searchjigou from './components/searchjigou.vue'
import Searchshebei from './components/searchshebei.vue'
export default {
  components: {
    VueContextMenu,
    Searchjigou,
    Searchshebei,
    concern,
    history,
    Polling,
    Treeselect
  },
  data() {
    return {

      concerninfo: '', // 是否开始向右right组件传递数据
      searchActiveName: 'searchOrgTab',
      showSearchRes: false,
      activeName: 'first',
      currentOrgId: undefined,
      q: '',
      showTree: true,
      treeLoading: false,
      defExpandDevs: [],
      defExpandGroups: [],
      pnode: null,
      contextMenuTarget: null,
      contextMenuVisible: false,
      contextMenuNodeData: null,
      conntextMenuNode: null,
      treeProps: {
        label: (data, node) => {
          var label = data.name

          if (data.type == 'org' && data.onelineNum != null && data.deviceNum != null) {
            label += ` [${data.onelineNum}/${data.deviceNum}]`
          }
          return label
        },
        isLeaf: (data, node) => {
          return this.treeLeaf(data)
        },
        disabled: (data, node) => {
          return this.treeLeaf(data)
        }
      },

      level: 0,
      showeditvedioinfo: false,
      numberValidateForm: {
        name: ''
      },
      devid: null,
      nowname: '',
      editjigou: false,
      deviceObj: {

      },
      node: {},

      // 机构树选项
      orgOptions: undefined,
      nodeId: null // 节点id
    }
  },
  computed: {
    treeEmptyText() {
      return this.treeLoading ? '加载中...' : '暂无数据'
    },

    showQueryDevTree() {
      if (this.q.length > 0 && this.showSearchRes) {
        return true
      }
      return false
    }
  },
  watch: {
    q: function(newVal, oldVal) {
      if (!newVal) {
        // this.treeRefresh()
        return
      }
    }
  },
  mounted() {
    this.contextMenuTarget = document.querySelector('#tab-tree-wrapper')

    $(document).on('expanded.pushMenu collapsed.pushMenu', this.updateSticky)

    this.$dragging.$on('dragend', (res) => {

    })
  },

  created() {

  },

  methods: {
    // 修改
    async editnodesinfo() {
      await editdevicename({ id: this.deviceObj.id, orgId: this.deviceObj.orgId })
      // 删除节点
      this.treeRefresh()
      this.$message({
        type: 'success',
        message: '修改成功'
      })
      this.editjigou = false
    },
    /** 查询机构下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        dealTree(response)
        this.disableNotLeaf(response)
        this.orgOptions = response
      })
    },
    disableNotLeaf(options) {
      options.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.isDisabled = true
          this.disableNotLeaf(item.children)
        } else {
          item.isDisabled = false
        }
      })
    },
    async editjigouinfo(data, node) {
      this.nodeId = node.id
      this.deviceObj = await getInfo(data.id)

      this.getTreeselect()

      this.editjigou = true
    },
    // 修改设备名称的数据回显
    async editdeviceinfo(data, node) {
      this.node = node
      this.deviceObj = await getInfo(data.id)

      this.showeditvedioinfo = true
    },
    // 保存修改
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          await editdevicename({ id: this.deviceObj.id, name: this.numberValidateForm.name })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.node.data.name = this.numberValidateForm.name

          this.showeditvedioinfo = false
          this.numberValidateForm.name = ''
        } else {
          return false
        }
      })
    },
    // tab页切换方法
    handleClick() {
      if (this.activeName == 'first') { // 全部
        this.concerninfo = ''
        this.$bus.$emit('startinfo', true)
        this.$bus.$emit('hideicon', false)
        // 投递事件，确保只在轮巡状态下分屏播放
        this.$bus.$emit('pollcontrol', false)
        // --------------------
      } else if (this.activeName == 'second') { // 关注
        this.concerninfo = 'concern'
        this.$bus.$emit('hideicon', false)
        // 投递事件，确保只在轮巡状态下分屏播放
        this.$bus.$emit('pollcontrol', false)
        // ---------------------------
      } else if (this.activeName == 'threed') { // 历史
        this.concerninfo = 'history'
        this.$bus.$emit('hideicon', false)
        // 投递事件，确保只在轮巡状态下分屏播放
        this.$bus.$emit('pollcontrol', false)
        // --------------------------------------
      } else if (this.activeName == 'foured') { // 轮巡
        this.concerninfo = 'polling'
        this.$refs.Polling.activeicon = -1
        // 投递事件，通知中间组件隐藏样式
        this.$bus.$emit('hideicon', true)
        // this.$bus.$emit('showedit', true)
        // 投递事件，确保只在轮巡状态下分屏播放
        this.$bus.$emit('pollcontrol', true)
        // 通知middle组件播放监控
        this.$bus.$emit('playallvedio')
      }
    },
    searchedDeviceClick(seviceid, deviceName) {
      this.$emit('deviceNodeClicked', seviceid, deviceName)
    },
    searchedOrgClick(orgId, orgName, onlineNum, deviceNum) {
      this.$emit('orgNodeClicked', orgId, onlineNum, deviceNum)
    },

    searchOrgOrDevice() {
      this.$refs.searchJigou.current = 1
      this.$refs.searchJigou.searchKey = this.q
      this.$refs.searchShebei.current = 1
      this.$refs.searchShebei.searchKey = this.q
      this.$refs.searchJigou.searchOrg()
      this.$refs.searchShebei.searchDevice()
      this.$nextTick(() => {
        this.showSearchRes = true
      })
    },

    clearSearch() {
      this.showSearchRes = false
    },

    // 请求树节点信息
    treeLoadOrg(node, resolve) {
      let orgId
      if (node.data) {
        orgId = node.data.id
      }
      orginfoAndSubOrgInfo({ orgId: orgId	}).then((org) => {
        let orgList = []
        org.type = 'org'
        org.key = 'org_' + org.id

        if (node.level == 0) {
          orgList.push(org)
          this.defExpandDevs.push(org.key)
          this.$emit('orgNodeClicked', org.id, org.onelineNum, org.deviceNum)
        } else {
          orgList = (org.children || [])
          orgList.forEach((childOrg) => {
            childOrg.type = 'org'
            childOrg.key = 'org_' + childOrg.id
          })
        }

        resolve(orgList)
      }).catch(() => { })
        .then(() => {
          this.treeLoading = false
        })
    },
    treeLoadDevice(node, resolve) {
      let orgId
      if (node.data) {
        orgId = node.data.id
      }
      listLocaLevelOrgDevice({ orgId: orgId }).then((ret) => {
        const deviceList = ret
        deviceList.forEach((device) => {
          device.type = 'device'
          device.key = 'device_' + device.id
        })
        resolve(deviceList)
      })
    },
    // tree
    treeLoad(node, resolve) {
      
      if (node.level === 0) {
		 this.treeLoadOrg(node, resolve)
      } else {
        if (node.data.type = 'org') {
          if (node.data.children.length > 0) {
            this.treeLoadOrg(node, resolve)
          } else {
            if (node.data.deviceNum > 0) {
              this.treeLoadDevice(node, resolve)
            }else{
              resolve([])
            }
          }
        }
      }
    },

    // 刷新节点
    treeNodeRefresh(node) {
      if (!node || !node.level) {
        this.treeRefresh()
        return
      }
      this.contextMenuVisible = false
      node.loaded = false
      node.expand()
    },
    treeNodeRightClick(event, data, node, c) {
      this.contextMenuNodeData = data
      this.contextMenuNode = node
      this.pnode = node.parent
      var new_event
      if (typeof (MouseEvent) === 'function') {
        new_event = new MouseEvent(event.type, event)
      } else {
        new_event = document.createEvent('MouseEvents')
        new_event.initMouseEvent(event.type, true, true, event.view, event.detail,
          event.screenX, event.screenY, event.clientX, event.clientY,
          event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event)
      }
      this.contextMenuTarget.dispatchEvent(new_event)
    },
    getAllParentNodeName(node, path) {
      if (node.parent) {
        if (path.length == 0) {
          path = node.data.nodeName
        } else {
          path = node.data.nodeName + '>' + path
        }
        path = this.getAllParentNodeName(node.parent, path)
      }
      return path
    },
    storeNodeClick(data, node, c) {
      if (data.type == 'org') {
        this.currentOrgId = data.id
        this.$emit('orgNodeClicked', data.id, data.onelineNum, data.deviceNum)
      } else if (data.type == 'device') {
        this.$emit('deviceNodeClicked', data.serviceId, data.deviceName)
      }
    },

    showNodeEditDlg() {
      this.contextMenuVisible = false
      if (!this.contextMenuNodeData) return
      var data = Object.assign({}, this.contextMenuNodeData, { parent: this.getParentData(), add: false })
      this.$refs['nodeEditDlg'].show(data)
    },

    treeRefresh() {
      this.contextMenuVisible = false

      if (this.showQueryDevTree) {
        alert('need todo')
      } else {
        this.showTree = false
        this.$nextTick(() => {
          this.showTree = true
        })
      }
    },
    treeLeaf(data) {
      if (data.type == 'device') {
        return true
      } else if (data.type == 'org' && data.children != undefined && data.children != null && data.children.length == 0) {
        if (data.deviceNum > 0) {
          return false
        } else {
          return true
        }
	  } else {
        return false
      }
    },
    getParentData() {
      if (!this.contextMenuNodeData) return null
      var ref = 'devTree'

      if (!this.$refs[ref]) return null
      var pNode = this.$refs[ref].getNode(this.contextMenuNodeData)
      if (!pNode) return null
      if (!pNode.parent) return null
      return pNode.parent.data
    }

  } // -- methods
}
</script>
<style lang="less">
::v-deep  .el-tabs__item {
  color: #5e3d3d;
}
.vvtv {
  .el-tree-node__content:hover{
  background-color: #2c2d2f
}
.el-tree-node:focus>.el-tree-node__content{
  background-color: #2c2d2f
}
.el-tree-node{
  color: #e5e5e5;
    font-size: 13px;
}
}

</style>

<style lang="less" scoped>
.jigouclass{
  font-size: 13px;
  margin-left: 13px;
  margin-top: 20px;
  display: flex;
}
.p-form{
  margin-top: 30px;
  .el-form{
    .el-form-item{
      ::v-deep .el-form-item__content{
        margin-left: 110px !important;
        .el-input__inner{
          margin-left: 3px;
          background-color: #fff;
        }
      }
    }
  }
  }
.el-popover{
  padding-bottom: 4px;
}
.elpopoevr{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    p{
      cursor: pointer;
      width: 100%;
      color: #464646;
      padding: 3px 5px;
      margin: 0;
    }
}
.elpopoevr p:hover{
   color: #487ce2;
   background-color: #dadbdc;
}
.icon-more{
  display: none;
}
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background-color: #2c2d2f;
}
 .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .custom-tree-node{
  background-color: #000000;
}
 .el-tree--highlight-current .custom-tree-node:hover{
  background-color: #505152;
  .icon-more{
    display: inline-block;
  }
}
::v-deep .el-tree-node:focus > .el-tree-node__content{
  background-color: #2c2d2f;
}
::v-deep .el-tree-node.is-current {

  outline: none;
}

::v-deep .el-tree-node>.el-tree-node__children {
  overflow: inherit !important;
}

.activevlass {
  border: 2px solid blue;
}

::v-deep .el-icon-more-outline {
  color: #978e8e;
  transform: rotateZ(0deg);
  font-size: 13px;
  //  display: none;
}

::v-deep .el-tabs__header {
  margin: 3px 0 15px;
  .el-tabs__nav-wrap {
    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }
  }
}
.contron-left{
  .el-input {
  border-radius: 5px;
  overflow: hidden;
 ::v-deep .el-input__inner {
  margin-top: -1px;
  margin-left: -9px;
  height: 35px;
  width: 235px;
  background-color: #373737;
  border: 1px solid #2b2a2a;
}
}

}

::v-deep .el-input__prefix {
  position: absolute;
  height: 100%;
  left: -2px;
  top: -2px;
}

.clearfix {
  color: white;
  margin-top: 5px;

  .cleardiv {
    display: flex;
    justify-content: space-between;

    .right {
      width: 25%;
      display: flex;
      justify-content: space-around;

      span {
        i {
          margin-right: 3px;
        }
      }
    }
  }

}

.text-center {
  text-align: right;
  width: 81.4%;
  /* margin-left: 56%; */
}

.video {
  height: 60%;
}

.el-tree {
  color: #93969b;
  ;
}

::v-deep .el-tabs__item {
  color: #969393;
  font-size: 13px;
  padding: 0 14px;
}

.scroll-list {
  ::v-deep .el-button--medium {
    margin-left: 20%;
  }
}

.list {
  width: 14vw;
  position: relative;
  margin-bottom: 10px;
}

.list div {
  overflow: hidden;
}

.row-left {
  //width: 13%;
  font-size: 16px;
  //position: absolute;
  //left: 17%;
  //z-index: 999;
  color: white;
  top: 41px;
  //display: flex;
  align-items: center;
  justify-content: space-evenly;
}

::v-deep .el-tabs__nav-wrap::after {
  width: 0;
}

::v-deep .el-tabs--top {
  width: 16.5vw;
}

.right-menu {
  position: fixed;
  background: #fff;
  border: solid 1px rgba(0, 0, 0, .2);
  border-radius: 3px;
  z-index: 999;
  display: none;
}

.right-menu a {
  width: 100px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: #1a1a1a;
}

.right-menu a:hover {
  background: #eee;
  color: #fff;
}

.right-menu {
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, .1);
  border-radius: 1px;
}

a {
  text-decoration: none;
}

.right-menu a {
  padding: 2px;
}

.right-menu a:hover {
  background: #567;
}

#tab-tree-wrapper {
  @media screen and (max-width: 992px) {
    min-height: 200px;
  }
}

#dev-tree {
  width: 16.5vw;
  height: 34.5vw;
}

#dev-tree {
  min-height: 200px;
  overflow: auto;
  background-color: transparent;

  @media screen and (max-width: 992px) {
    max-height: 200px;
  }
}

.el-tree-node>.el-tree-node__children {
  overflow: inherit;
}

.el-tree-node.is-drop-inner>.el-tree-node__content .custom-tree-node {
   background-color: #343434 !important;

}

// ::v-deep .el-tree-node__content {
//   &:hover{
//  //background-color: #343434;
//  background-color:#2c2d2f !important;
//   }

// }
</style>

<style lang="less" >

/* 整个滚动条 */

.contron-left ::-webkit-scrollbar {
  /* 对应纵向滚动条的宽度 */
  width: 5px;
  /* 对应横向滚动条的宽度 */
  height: 4px;
}

/* 滚动条上的滚动滑块 */
.contron-left ::-webkit-scrollbar-thumb {
  background-color: #666768;
  border-radius: 32px;
  width: 3px;
}

/* 滚动条轨道 */
.left-side ::-webkit-scrollbar-track {
  background-color: #2d2d2e;
  border-radius: 32px;
  // margin-top: 100px;
}

.icon-video-camera-online {
  color: rgb(70, 160, 252);
}

.icon-video-camera-offline {
  color: rgb(96, 98, 102)
}

</style>
