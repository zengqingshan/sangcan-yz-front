<template>
  <div class="app-container">
    <!--企业数据-->
    <el-col :span="24" :xs="24" class="sys-content">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="queryParams.name" maxlength="32" placeholder="请输入企业名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button v-hasPermi="['system:tenant:add']" type="primary" plain icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="table">
        <el-table v-loading="loading" stripe :data="tenantList" @selection-change="handleSelectionChange">
          <div slot="empty">
            <el-empty description="暂无数据" />
          </div>
          <el-table-column v-if="columns[0].visible" key="name" label="企业名称" align="center" prop="name" />
          <el-table-column v-if="columns[1].visible" label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template v-if="scope.row.id !== 1" slot-scope="scope">
              <el-button v-hasPermi="['system:tenant:edit']" size="small" type="text" icon="iconfont icon-pen" @click="handleUpdate(scope.row)"><span class="text">详情</span></el-button>
              <el-button v-hasPermi="['system:tenant:remove']" size="small" type="text" icon="iconfont icon-delete" @click="handleDelete(scope.row)"><span class="text">删除</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-col>

    <!-- 详情对话框 -->
    <el-dialog width="600px" :title="title" :visible.sync="open" append-to-body>
      <div class="right">
        <!-- 注册信息 -->
        <div class="right-direct">
          <div>
            <p>注册信息</p>
            <div class="line" />
            <div class="right-name">
              <span class="name-spano">企业名称</span>
              <div class="name-info">
                <div>
                  <span>{{ qyobj.name }}</span>
                </div>
              </div>
            </div>
            <div class="right-code">
              <span class="code-one">创建时间</span>
              <p>{{ qyobj.createTime }}</p>
            </div>
            <div class="right-code dirs">
              <span class="code-one">创建人</span>
              <p>{{ qyobj.adminUser }}</p>
            </div>
          </div>
        </div>

        <!-- 业务信息 -->
        <div class="right-direct">
          <div>
            <p>业务信息</p>
            <div class="line" />
            <div class="right-name">
              <span class="name-spano">归属地区</span>
              <div class="name-info">
                <div>
                  <span>{{ qyobj.valueaddress }}</span>
                  <!-- <el-cascader
                    v-model="qyobj.address"
                    style="width: 60%; marginright: 10px"
                    clearable
                    disabled
                    size="mini"
                    :props="divisionProps"
                    :options="$dt('division')"
                  /> -->
                </div>
              </div>
            </div>
            <div class="right-code">
              <span class="code-one">用户总数</span>
              <p>{{ qyobj.userCount }}</p>
            </div>
            <div class="right-code" style="margin-bottom: 20px;">
              <span class="code-one">监控数量</span>
              <p>在线:{{ qyobj.onlineNum }}, 总数:{{ qyobj.deviceNum }}, 在线率:{{ qyobj.onlineRatio }}</p>
            </div>
          </div>
        </div>

        <!-- 位置坐标 -->
        <div class="right-direct">
          <div>
            <p>位置坐标</p>
            <div class="line" />
            <div class="right-name">
              <span class="name-spano">企业坐标</span>
              <div class="name-info">
                <span>(经度 {{ qyobj.longitude }}; 纬度 {{ qyobj.latitude }})</span>
              </div>
            </div>
            <div class="right-code" style="margin-bottom: 20px;">
              <span class="code-one">企业地址</span>
              <p>{{ qyobj.address }}</p>
            </div>
          </div>
        </div>

      </div>
    </el-dialog>

    <!-- 添加或编辑参数配置对话框 -->
    <el-dialog width="600px" :title="title" :visible.sync="open1" append-to-body>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基础信息" name="first" style="padding: 20px">
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="企业名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入企业名称" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="企业管理员账号" prop="adminUser">
                  <el-input v-model="form.adminUser" placeholder="请输入企业管理员账号" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item v-if="form.id === undefined" label="企业管理员姓名" prop="adminUserCnName">
                  <el-input v-model="form.adminUserCnName" placeholder="请输入企业管理员姓名" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item v-if="form.id === undefined" label="企业管理员账号密码" prop="adminPassword">
                  <el-input v-model="form.adminPassword" type="password" placeholder="请输入企业管理员名称" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item v-if="form.id === undefined" label="所属区域" prop="adminaddress">
                  <el-cascader
                    v-model="cascvalue"
                    style="width: 60%; marginright: 10px"
                    clearable
                    size="mini"
                    :props="divisionProps"
                    :options="$dt('division')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item v-if="form.id === undefined" label="位置信息:" prop="adminpos">
                  <div style="display: flex; align-items: center">
                    <el-input v-model="form.address" />
                    <el-button
                      style="width: 120px; height: 35px"
                      type="primary"
                      plain
                      size="mini"
                      @click="showaddress"
                    >查看地图</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
          <div style="text-align: center">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-tab-pane>

      </el-tabs>
    </el-dialog>

    <!-- 坐标 -->
    <el-dialog
      class="posdia"
      :visible.sync="mapDialog"
      width="70%"
      append-to-body
    >
      <div class="dia">
        <div class="dia-left">
          <span>详细地址</span>
          <el-input v-model="valueleft" :disabled="true" />
        </div>
        <div class="dia-right">
          <span>地点坐标</span>
          <el-input v-model="valueright" :disabled="true" />
        </div>
      </div>

      <!-- <div class="selectinput">
        <el-select v-model="values" placeholder="请选择">
          <el-option
            v-for="(item, index) in disivions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div> -->
      <Map
        :new-style="newStyle"
        :type="type"
        @click-marker-coor="clickMarkerCoor"
      />
      <span slot="footer" class="dialog-footer">
        <!-- <div class="tip">
          请点击拖动定位图标，进行经纬度的选择：<span
            v-if="coor.length"
          >{{ coor[0] }}，{{ coor[1] }}</span>
        </div> -->
        <el-button @click="mapDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updataAddressAndLlongLat"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  pageTenant,
  addTenant,
  updateTenant,
  delTenant,
  getTenant,
  getAbilityTree
} from '@/api/system/tenant'
import moment from 'moment'
import Map from '@/components/Map/index'
export default {
  name: 'Tenant',
  components: {
    Map
  },
  data() {
    return {
      divisionProps: {
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      cascvalue: '', // 次级联选择器的值
      disivions: [
        {
          label: '北京市',
          value: '北京市'
        },
        {
          label: '天津市',
          value: '天津市'
        },
        {
          label: '河北省',
          value: '河北省'
        },
        {
          label: '山西省',
          value: '山西省'
        },
        {
          label: '内蒙古自治区',
          value: '内蒙古自治区'
        },
        {
          label: '辽宁省',
          value: '辽宁省'
        }
      ],
      values: '',
      newStyle: {
        height: '500px'
      },
      coor: [],
      type: ['cluster', 'geocoder'], // 显示地图类型
      valueleft: '',
      valueright: '',
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
      open1: false,
      activeName: 'first',
      // 企业列表
      tenantList: [],
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
        { key: 0, label: `企业名称`, visible: true },
        { key: 1, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: '企业名称不能为空',
            trigger: 'blur'
          }
        ],
        adminUser: [
          {
            required: true,
            message: '企业管理员手机号不能为空',
            trigger: 'blur'
          }
        ],
        adminUserCnName: [
          {
            required: true,
            message: '企业管理员姓名不能为空',
            trigger: 'blur'
          }
        ],
        adminPassword: [
          {
            required: true,
            message: '企业管理员密码不能为空',
            trigger: 'blur'
          }
        ]
        // adminaddress: [
        //   {
        //     required: true,
        //     message: '所属区域不能为空',
        //     trigger: 'blur'
        //   }
        // ],
        // adminpos: [
        //   {
        //     required: true,
        //     message: '位置信息不能为空',
        //     trigger: 'blur'
        //   }
        // ]
      },
      qyobj: {}, // 企业信息
      mapDialog: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    setpcount(params) {
      let datacont = ''
      let step = 0
      const contdivsion = [2, 4, 6].reduce(
        (previousValue, currentValue) => {
          return previousValue.concat(
            params
              .slice(0, currentValue)
              .padEnd(6, 0) * 1
          )
        },
        []
      )
      const duringFun = (e) => {
        e.forEach((el) => {
          if (el.id == contdivsion[step]) {
            datacont = datacont + el.name + '-'
            step++
            if (
              step < 3 &&
                      'children' in el &&
                      el.children
            ) {
              duringFun(el.children)
            }
          }
        })
      }
      duringFun(this.$dt('division'))
	  if (datacont.length > 0 && datacont[datacont.length - 1] == '-') {
        datacont = datacont.substring(0, datacont.length - 1)
	  }
      return datacont
    },
    clickMarkerCoor(e) {
      this.coor = e
      this.valueright = '经度:' + this.coor[0] + ',纬度:' + this.coor[1]
      this.valueleft = this.coor[2] || '暂无'
    },
    updataAddressAndLlongLat() {
      this.form.address = this.coor[2]
      this.mapDialog = false
    },
    showaddress(address, longitude, latitude) {
      this.mapDialog = true
    },
    /** 查询企业列表 */
    getList() {
      this.loading = true
      pageTenant(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.tenantList = response.records
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
        appSecret: undefined
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
      this.cascvalue = ''
      this.open1 = true
      this.title = '添加企业'
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.reset()
      getTenant({ tenantId: row.id }).then((response) => {
        this.qyobj = response
        this.qyobj.valueaddress = this.setpcount(response.division)
        this.open = true
        this.title = '企业详情信息'
      })

      this.editRow = row
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.cascvalue)
      this.$refs['form'].validate((valid) => {
        const params = {
          ...this.form,
          endTime:
          moment(this.form.endTime).format('YYYY-MM-DD') + ' 23:59:59',
          division: this.cascvalue[this.cascvalue.length - 1]
        }
        if (valid) {
          if (this.form.id != undefined) {
            updateTenant(params).then((response) => {
              this.msgSuccess('编辑成功')
              this.open1 = false
              this.getList()
            })
          } else {
            addTenant(params).then((response) => {
              this.msgSuccess(
                `新增成功，请前往角色管理为${response}添加菜单权限`
              )
              this.open1 = false
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
        .then(function() {
          return delTenant({ tenantId: row.id })
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
.posdia{
 ::v-deep .el-dialog{
    margin-top: 3vh !important;
  }
}
.dia{
  display: flex;
  justify-content: space-between;
  .dia-left,.dia-right{
    display: flex;
    align-items: center;
    width: 35%;
    span{
      white-space: nowrap;
      margin-right: 5px;
    }
  }
}
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
.right{
        padding: 12px 24px;
        color: black;
        flex: 1;
        max-height: 652px;
        overflow: auto;
        .right-direct{
            .line{
                background-color: #d4d4d4;
                height: 1px;
                width: 100%;
                margin-bottom: 16px;
            }
            p{
                font-size: 16px;
                font-weight: 500;
                margin-block:8px
            }
            .right-name{
               display: flex;
               height: 32px;
               align-items: center;
               .name-spano{
                   min-width: 115px;
                   text-align: left;
                   color: rgb(126 121 121);
               }
               .name-info{
                display: flex;
                align-items: center;
               ::v-deep .el-input__inner{
                  height: 30px;
                }
                 span{
                    max-width: 800px;
                    min-width: 115px;
                    font-size: 14px;
                    color: #323333;
                 }
                  .el-button{
                    width: 90px;
                    height: 30px;
                    margin-left: 12px;
                    span{
                        font-size: 12px;
                        color: #1890ff;
                    }
                  }
               }
            }
            .right-code{
                display: flex;
                align-items: center;

                .code-one{
                    min-width: 115px;
                   text-align: left;
                   color: rgb(126 121 121);
                }
                .el-button{
                    width: 90px;
                    height: 30px;
                    margin-left: 47px;
                    span{
                        font-size: 12px;
                        color: #1890ff;
                    }
                  }
                p{
                    flex: 1;
                    font-size: 14px;
                    color: #323333;
                }

            }
            .openas{
              margin-left: 40px;
              display: flex;
              flex-direction: column;
              height: 92px;
              justify-content: space-evenly;
              margin-top: -10px;
              a{
                text-decoration: underline;
                color: #1890ff;
              }
            }
            .deleteqiye{
              display: flex;
              width: 53%;
              justify-content: space-between;
              align-items: center;
              .el-button{
                width: 90px;
                height: 30px;
              }
              span{
                color:#2d2626;
              }
            }
            .dirs{
                margin-bottom: 20px;
            }
        }
    }
</style>
