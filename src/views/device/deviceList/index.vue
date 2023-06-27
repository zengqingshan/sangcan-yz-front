<template>
  <div class="app-container">
    <!-- <el-row :gutter="20"> -->
    <div id="dev-tree-left" class="col-md-2">
      <div autocomplete="off" spellcheck="false" class="container-left">
        <!-- <div class="form-group form-group-sm"> -->
        <!-- <label>搜索</label> -->
        <el-input
          ref="q"
          v-model.trim="q"
          prefix-icon="el-icon-search"
          type="text"
          class="form-control"
          placeholder="搜索组织机构"
          clearable
          @clear="clearSearch"
          @keyup.enter.native="searchOrg"
        />
      </div>
      <div id="tab-tree-wrapper" class="tab-content" style="margin: 10px 0">
        <div id="dev-tree-wrapper" ref="devTreeWrapper" class="tab-pane active">
          <el-tree
            v-if="showTree"
            v-show="showQueryDevTree"
            id="dev-tree"
            ref="devTree"
            highlight-current
            node-key="id"
            :props="treeProps"
            :load="treeLoad"
            lazy
            :empty-text="treeEmptyText"
            :default-expanded-keys="defExpandDevs"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>
                <i :class="['fa', 'fa-folder']" style="color: #9ed9f2" />
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="node.label"
                  placement="top"
                  :open-delay="0"
                >
                  <span
                    class="ellipsis"
                    style="user-select: none; margin-left: 4px"
                    :title="node.label"
                  >{{ node.label }}</span>
                </el-tooltip>
              </span>
            </span>
          </el-tree>
        </div>
      </div>

      <el-tabs v-show="!showQueryDevTree" v-model="activeName1">
        <el-tab-pane label="机构" name="first">
          <searchjigou ref="searchJigou" @searchedOrgClick="searchedOrgClick" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- dev-tree-left -->
    <!--用户数据-->
    <el-col :span="24" :xs="24" class="sys-content">
      <div>
        <div class="info">
          <span class="span">设备列表： {{ currentSelectedOrgName }}</span>
          <span>({{ total }}个)</span>
        </div>

        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="68px"
        >
          <el-form-item style="marginright: 10px" label="设备名称:">
            <el-input
              v-model="queryParams.name"
              style="width: 130px"
              size="small"
              placeholder="设备名称"
              clearable
            />
          </el-form-item>
          <el-form-item style="marginright: 10px" label="SIP ID:">
            <el-input
              v-model="queryParams.serviceId"
              style="width: 130px"
              size="small"
              placeholder="SIP ID"
              clearable
            />
          </el-form-item>
          <el-form-item style="marginright: 10px" label="设备状态:">
            <el-select
              v-model="queryParams.status"
              style="width: 130px"
              clearable
              size="small"
              placeholder="设备状态"
            >
              <el-option label="在线" :value="true">在线</el-option>
              <el-option label="离线" :value="false">离线</el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="marginright: 10px" label="设备类型:">
            <el-select
              v-model="queryParams.devCategory"
              style="width: 130px"
              clearable
              size="small"
              placeholder="设备类型"
            >
              <el-option
                v-for="item in $dt('dev_category')"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              />
            </el-select>
          </el-form-item>

          <el-form-item style="float: right">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleQuery"
            >搜索</el-button>
            <el-button
              icon="el-icon-refresh"
              size="small"
              @click="resetQuery"
            >重置</el-button>
          </el-form-item>
        </el-form>

        <div class="table">
          <el-table
            v-loading="loading"
            border
            stripe
            :data="deviceList"
            height="600px"
            @selection-change="handleSelectionChange"
          >
            <div slot="empty">
              <el-empty description="暂无设备" />
            </div>
            <!-- <el-table-column  width="50" align="center" :selectable="selectEnable" /> -->
            <el-table-column
              label="快照"
              align="center"
              prop="coverUrl"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div>
                  <img
                    class="img"
                    :src="scope.row.coverUrl"
                    alt=""
                    style="width: 100%; height: 80px; object-fit: contain"
                  >
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="设备名称"
              align="center"
              prop="name"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="所在监控节点"
              align="center"
              width="120"
              prop="orgName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="设备型号"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ getConnetType(scope.row.connetType) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="设备标识"
              align="center"
              prop="serviceId"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="设备状态"
              align="center"
              prop="status"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  v-if="scope.row.status"
                  style="background: #67c23a"
                />
                <span v-else style="background: #606266" />
                <span> {{ scope.row.status ? "在线" : "离线" }} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="套餐详情"
              align="center"
              prop="orgName"
              :show-overflow-tooltip="true"
            >
              <span
                style="cursor: pointer; color: rgb(24, 144, 255)"
                @click="openPackageDialog"
              >
                7天云存储
              </span>
            </el-table-column>

            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="170"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="200"
              class-name="small-padding fixed-width"
            >
              <template v-if="scope.row.id !== 1" slot-scope="scope">
                <!-- <el-button
                  v-hasPermi="['system:user:edit']"
                  size="small"
                  type="text"
                  icon="iconfont icon-pen"
                  @click="handleUpdate(scope.row)"
                ><span class="text">设置</span></el-button> -->
                <el-button
                  v-hasPermi="['system:user:remove']"
                  size="small"
                  type="text"
                  icon="iconfont icon-delete"
                  @click="handleDelete(scope.row)"
                ><span class="text">删除</span></el-button>
                <el-button
                  v-hasPermi="['system:user:edit']"
                  size="small"
                  type="text"
                  icon="iconfont icon-pen"
                  @click="showsettinginfo(scope.row)"
                >
                  <span class="text">设置</span></el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="handlePlay(scope.row)"
                >
                  <span><svg
                    viewBox="0 0 1024 1024"
                    focusable="false"
                    data-icon="caret-right"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"
                    />
                  </svg>
                  </span>
                  播放
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.current"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </el-col>

    <!-- </el-row> -->

    <!-- 添加或编辑参数配置对话框 -->

    <!-- 位置+设置的弹窗 -->
    <settingDialog
      ref="settingDialogRef"
      @refreshData="refreshData"
    />

    <el-dialog
      :title="playTitle"
      :visible.sync="playDlgOpen"
      width="60%"
      append-to-body
    >
      <!-- <iframe id="videoPlayer" :src="playerPath" frameborder="0" width="100%" height="100%" /> -->
      <VideoPlayers id="videoPlayers" ref="hlsVideoPlayer" />
    </el-dialog>

    <!-- 套餐弹窗 -->
    <packageDialog ref="packageDialogRef" />
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import settingDialog from '@/views/videomonitor/playback/components/settingDialog'
import packageDialog from '@/views/device/code/components/packageDialog'
import VideoPlayers from '../../videomonitor/playback/components/videosAllVideos.vue'
import { listPageDevice } from '@/api/system/device'

import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  batchDelUser
} from '@/api/system/user'
import $ from 'jquery'
import {
  listOrg,
  getOrg,
  delOrg,
  addOrg,
  updateOrg,
  treeselect,
  deldevice,
  orginfoAndSubOrgInfo
} from '@/api/system/org'
import {
  getInfoserve,
  editdevicename,
  deletedevicename
} from '@/api/system/device'

import { listRole } from '@/api/system/role'
import { dealTree } from '@/utils/deal-tree'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Searchjigou from './searchjigou.vue'
import DeviceInfo from './components/deviceinfo.vue'
export default {
  name: 'DeviceList',
  components: {
    Treeselect,
    Searchjigou,
    DeviceInfo,
    VideoPlayers,
    settingDialog,
    packageDialog
  },
  data() {
    return {
      playerPath: process.env.BASE_URL + 'VnPlayer.html',
      deviceInfoDlgOpen: false,
      playTitle: '',
      playDlgOpen: false,
      showmore: false,
      value: '', // 下拉框的值
      options: [
        {
          value: '选项1',
          label: '全部人员角色'
        }
      ],
      showSearchRes: false,
      orgDlgOpen: false,
      orgDlgEditFlag: false,
      currentSelectedOrgId: undefined,
      currentSelectedOrgName: '',
      currentTotalNum: undefined,
      treeProps: {
        label: (data, node) => {
          var label = data.name

          if (data.onelineNum != null && data.deviceNum != null) {
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

      q: '', // 左侧搜索框的值
      activeTab: 'dev',
      queryDevTreeDataList: [], // 树形组件的数据
      defExpandDevs: [],
      activeName1: 'first',
      showTree: true,
      devLevelFilter: false,
      treeLoading: false,

      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      deviceList: null,
      // 弹出层标题
      title: '',
      orgTitle: '',
      // 机构树选项
      orgOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 机构名称
      orgName: undefined,
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 查询参数
      queryParams: {
        current: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        orgId: undefined,
        serviceId: undefined,
        devCategory: undefined
      },

      orgRules: {
        parentId: [
          {
            required: true,
            message: '上级机构不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '机构名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      // 表单校验
      rules: {}
    }
  },
  computed: {
    showQueryDevTree() {
      if (this.q.length == 0) return true
      if (this.activeTab == 'dev' && this.devLevelFilter) {
        return true
      }
      if (this.showSearchRes) {
        return false
      }
      return true
    },

    treeEmptyText() {
      return this.treeLoading ? '加载中...' : '未查询到组织机构'
    }
  },
  watch: {
    // 根据名称筛选机构树
    orgName(val) {
      this.$refs.tree.filter(val)
    },
    // 监听监控弹窗
    playDlgOpen(val) {
      if (!val) {
        this.$refs.hlsVideoPlayer.closePlayer(0)
      }
    }
  },
  created() {
    this.getRoleList()
    this.currentSelectedOrgName = sessionStorage.getItem('tenantName')

    this.getTreeselect()

    this.queryParams.orgId = undefined

    this.getRoleList()
  },
  methods: {
    // 打开套餐弹窗
    openPackageDialog() {
      this.$refs.packageDialogRef.packageDialog = true
    },
    getConnetType(connetType) {
      let value = ''
      this.$store.getters.dict['connet_type'].forEach((item) => {
        if (connetType == item.dictKey) {
          value = item.dictValue
        }
      })
      return value
    },
    // 设置弹窗事件
    showsettinginfo(row) {
      this.$refs.settingDialogRef.showDeviceInfo(row.serviceId)
    },
    // 弹窗关闭事件
    refreshData() {
      this.getList()
    },
    handlePlay(row) {
      this.playTitle = row.name + ' 直播中'
      this.playDlgOpen = true
      this.$nextTick(() => {
        const msgObj = {}
        // var playerName = 'videoPlayer'
        //  const _iframe = document.getElementById(playerName).contentWindow

        msgObj.type = 'startPlay'
        msgObj.deviceId = row.serviceId
        msgObj.showTools = '1'
        msgObj.deviceName = row.name
        setTimeout(() => {
          this.$refs.hlsVideoPlayer.requestPlay(
            msgObj.deviceId,
            msgObj.deviceName
          )
        }, 1000)
      })
    },

    searchedOrgClick(orgId, orgName) {
      this.queryParams.current = 1
      this.queryParams.orgId = orgId
      this.getList()
    },
    searchOrg() {
      const queryParams = { name: this.q }
      listOrg(queryParams).then((res) => {
        this.$refs.searchJigou.heightLight(res, this.q)
        this.$refs.searchJigou.orgList = res
        this.$nextTick(() => {
          this.showSearchRes = true
        })
      })
    },
    clearSearch() {
      this.$nextTick(() => {
        this.showSearchRes = false
      })
    },
    orgRefresh() {},
    cancelOrgInfoDlg() {
      this.orgDlgOpen = false
    },
    getRoleName(roleId) {
      let name = roleId
      if (this.roleOptions.length > 0) {
        this.roleOptions.forEach((item, index) => {
          if (item.id == roleId) {
            name = item.name

            return
          }
        })
      }
      return name
    },
    treeLeaf(data) {
      if (
        data.children != undefined &&
        data.children != null &&
        data.children.length == 0
      ) {
        return true
      } else {
        return false
      }
    },

    // tree
    treeLoad(node, resolve) {
      const nodeLevel = node.level
      let orgId
      if (node.data) {
        orgId = node.data.id
      }
      orginfoAndSubOrgInfo({ orgId: orgId })
        .then((ret) => {
          if (nodeLevel == 0) {
            this.defExpandDevs.push(ret.id)
            this.currentSelectedOrgId = ret.id
            this.getList()
          }
          let orgList = []
          if (node.level == 0) {
            orgList.push(ret)
          } else {
            orgList = ret.children || []
          }

          if (!node.level && !this.devLevelFilter) {
            if (orgList.length > 100) {
              this.devLevelFilter = true
            } else if (orgList.length > 1000) {
              this.devLevelFilter = true
            }
          }

          resolve(orgList)

          if (this.q && !node.matched) {
            this.$refs['devTree'].filter(this.q)
          }
        })
        .catch(() => {})
        .then(() => {
          if (
            this.q &&
            !this.q.endsWith(' ') &&
            this.q.split(/\s+/).length === node.level &&
            this.devLevelFilter
          ) {
            this.q += ' '
            this.$refs['q'].focus()
          }
        })
    },

    switchTab(tab) {
      if (this.activeTab != tab) {
        this.q = ''
        this.$nextTick(() => {
          this.activeTab = tab
        })
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true

      listPageDevice(this.queryParams).then((response) => {
        this.deviceList = response.records

        this.total = response.total
        this.loading = false
      })
    },
    /** 查询机构下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        dealTree(response)
        this.orgOptions = response
      })
    },
    /** 查询角色列表 */
    getRoleList() {
      const param = {}
      param.test = 'test'
      listRole(param).then((response) => {
        this.roleOptions = response
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data, node, c) {
      this.currentSelectedOrgId = data.id

      this.queryParams.orgId = data.id

      this.currentSelectedOrgName = data.name

      this.getList()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        orgIds: undefined,
        userName: undefined,
        cnName: undefined,
        roleIds: []
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        current: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        orgId: undefined,
        serviceId: undefined,
        devCategory: undefined
      }
      this.$refs.queryForm.resetFields()
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },

    /** 新增人员按钮操作 */
    handleAddUser() {
      this.reset()
      this.open = true
      this.title = '添加用户'
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.deviceInfoDlgOpen = true

      this.$nextTick(() => {
        this.$refs.deviceInfoRef.init(row)
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then((response) => {
              this.msgSuccess('用户信息编辑成功')
              this.open = false
              this.getList()
            })
          } else {
            addUser(this.form).then((response) => {
              this.msgSuccess('新增用户信息成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除所选的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // debugger
          if (row && row.id) {
            return deldevice(row.id)
          }
        })
        .then(() => {
          this.showTree = false
          this.$nextTick(() => {
            this.showTree = true
            this.currentSelectedOrgId = undefined
            this.getTreeselect()
            this.getList()
            this.msgSuccess('删除成功')
          })
        })
        .catch(() => {})
    },
    /** 表格勾选判断 */
    selectEnable(row) {
      return row.id !== 1
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-content{
  .tab-pane{
    .el-tree{
      font-size: 13px;
    }
  }
}
#videoPlayers {
  width: 100%;
  height: 488px !important;
}

::v-deep .bottom-bar {
  display: none;
}

.el-tree {
  width: 13vw;
  height: 37vw;
  overflow: auto;
}

.el-tree > .el-tree-node {
  display: inline-block;
  min-width: 100%;
}

.unloadup {
  display: flex;
  flex-direction: column;
  color: #409eff;
  text-align: center;

  span {
    cursor: pointer;
    font-size: 13px;
  }
}

.prover {
  display: flex;
  flex-direction: column;
  /* width: 10vw; */
  align-items: center;

  .el-button--medium {
    border: 0;
    width: 100%;
    display: flex;
    margin-left: 0;

    i {
      margin-right: 5px;
    }
  }
}

::v-deep .el-popover {
  width: 200px;
}

.el-icon-more {
  font-size: 13px;
  transform: rotateZ(90deg);
}

::v-deep .el-form-item--medium .el-input--medium .el-input__inner {
  height: 32px;
  line-height: 33px;
  border-radius: 5px;
}

::v-deep .el-tab-pane {
  .el-button--medium {
    padding: 10px 5px;
    font-size: 14px;
    /* border-radius: 4px; */
    width: 100%;
    border: 0;
    text-align: left;
  }
}

::v-deep .pagination-container {
  margin-top: -25px;

  .el-pagination {
    text-align: right;
  }
}

.app-container {
  justify-content: space-between !important;
}

.cell {
  button {
    i {
      font-size: 13px;
    }
  }
}

.sys-content {
  display: flex;
  flex-direction: column;
  width: 80%;

  .table {
    flex: 1;

    .text {
      font-size: 13px;
      margin-left: 4px;
    }
  }

  .info {
    height: 45px;
    margin-top: -16px;
    margin-bottom: 10px;
    width: 76vw;
    line-height: 45px;
    background-color: #e3e8f1;
    color: black;

    .span {
      margin-left: 10px;
    }
  }
}

.container-left {
  margin-bottom: 10px;

  .form-control {
    padding: 0;
    border: 0;
  }
}

::v-deep .el-table {
  font-size: 13px;
}
</style>
