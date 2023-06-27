<template>
  <div class="app-container">
    <!--第三方应用数据-->
    <el-col :span="24" :xs="24" class="sys-content">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="168px">
        <el-form-item label="第三方应用名称" prop="name">
          <el-input v-model="queryParams.name" maxlength="32" placeholder="请输入第三方应用名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button v-hasPermi="['system:shareApp:add']" type="primary" plain icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="table">
        <el-table v-loading="loading" stripe :data="shareAppList" @selection-change="handleSelectionChange">
          <div slot="empty">
            <el-empty description="暂无数据" />
          </div>
          <el-table-column v-if="columns[0].visible" key="name" label="第三方应用名称" align="center" prop="name" />
          <el-table-column v-if="columns[1].visible" key="appKey" label="appKey" align="center" prop="appKey" />
          <el-table-column v-if="columns[2].visible" label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-hasPermi="['system:shareApp:edit']" size="small" type="text" icon="iconfont icon-pen" @click="handleUpdate(scope.row)"><span class="text">编辑</span></el-button>
              <el-button v-hasPermi="['system:shareApp:remove']" size="small" type="text" icon="iconfont icon-delete" @click="handleDelete(scope.row)"><span class="text">删除</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-col>

    <!-- 添加或编辑参数配置对话框 -->
    <el-dialog width="1000px" height="600px" :title="title" :visible.sync="open" append-to-body>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基础信息" name="first" style="padding: 20px">
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="第三方应用名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入第三方应用名称" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="有效期至" prop="endTime">
                  <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="title === '编辑第三方应用'">
              <el-col :span="24">
                <el-form-item label="appKey" prop="appKey">
                  <el-input v-model="form.appKey" :disabled="form.id !== undefined" placeholder="请输入appKey" maxlength="30" />
                </el-form-item>
              </el-col>

            </el-row>
            <el-row v-if="title === '编辑第三方应用'">

              <el-col :span="24">
                <el-form-item label="appSecret" prop="appSecret">
                  <el-input v-model="form.appSecret" :disabled="form.id !== undefined" placeholder="请输入appSecret" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="text-align: center">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="title === '编辑第三方应用'" label="设备授权" name="second">

          <AuthEquipment :edit-share-app="editRow" />
        </el-tab-pane>
        <el-tab-pane v-if="title === '编辑第三方应用'" label="能力授权" name="third">
          <auth-ability :get-ability-tree="getAbilityTree" :edit-row="editRow" @cancel="cancel" />
        </el-tab-pane>

      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {
  pageShareApp,
  addShareApp,
  updateShareApp,
  delShareApp,
  getShareApp,
  shareAppDeviceAuthGet,
  getAbilityTree,
  shareAppResourceGrantTenantList
} from '@/api/abilitySharing/shareApp'

import AuthEquipment from './authEquipment.vue'
import AuthAbility from './authAbility.vue'
import moment from 'moment'

export default {
  name: 'ShareApp',
  components: { AuthEquipment, AuthAbility },
  data() {
    return {
      getAbilityTree: [],
      selectedDevices: [],
      editRow: {},
      // 遮罩层
      loading: true,
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      activeName: 'first',
      // 第三方应用列表
      shareAppList: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        current: 1,
        pageSize: 10,
        name: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `第三方应用名称`, visible: true },
        { key: 1, label: `appKey`, visible: true },
        { key: 2, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: '第三方应用名称不能为空',
            trigger: 'blur'
          }
        ],
        endTime: [
          {
            required: true,
            message: '有效期不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询第三方应用列表 */
    getList() {
      this.loading = true
      pageShareApp(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.shareAppList = response.records
        this.total = response.total
        this.loading = false
      })
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
        name: undefined,
        appKey: undefined,
        appSecret: undefined
      }
      this.resetForm('form')
    },
    handleRefresh() {
      this.open = false
      this.reset()
			 this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true

      this.title = '添加第三方应用'
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.editRow = row

      getShareApp({ shareAppId: row.id }).then((response) => {
        this.form = response

        this.title = '编辑第三方应用'

        this.open = true

        // 能力授权--查询第三方应用接口信息-树
        getAbilityTree(row.id).then((res) => {
          this.getAbilityTree = res
        })
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        const params = {
          ...this.form,
          endTime:
                        moment(this.form.endTime).format('YYYY-MM-DD') +
                        ' 23:59:59'
        }
        if (valid) {
          if (this.form.id != undefined) {
            updateShareApp(params).then((response) => {
              this.msgSuccess('编辑成功')
              // this.open = false;
              this.getList()
            })
          } else {
            addShareApp(params).then((response) => {
              this.msgSuccess('新增成功')
              // this.open = false;
              this.getList()
            })
          }
        }
      })
      this.open = false
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除所选的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delShareApp({ shareAppid: row.id })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.sys-content {
    display: flex;
    flex-direction: column;
    .table {
        flex: 1;
    }
    .text {
        font-size: 14px;
        margin-left: 4px;
    }
}
</style>
