<template>
  <div class="app-container">
    <!-- <el-row :gutter="20"> -->
    <div id="dev-tree-left" class="col-md-2">
      <div class="top-left">
        <span>机构人员管理</span>
        <el-popover placement="bottom-end" width="140" trigger="hover">
          <div class="unloadup">
            <span style="margin-bottom: 18px" @click="dialogVisible = true"
              >机构人员批量导入</span
            >
            <span @click="exportlist">机构人员列表导出</span>
          </div>
          <span slot="reference" class="left-right">导入/导出</span>
        </el-popover>
      </div>
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
            class="aaa"
            :highlight-current="true"
            node-key="id"
            :props="treeProps"
            :load="treeLoad"
            lazy
            :empty-text="treeEmptyText"
            :default-expanded-keys="defExpandDevs"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <i
                  :class="[
                    'fa',
                    {
                      'fa-folder': true,
                    },
                  ]"
                  style="color: #9ed9f2"
                />
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
                    >{{ node.label }}</span
                  >
                </el-tooltip>
                <el-popover
                  placement="right"
                  width="200"
                  trigger="hover"
                  style="margin-left: 20px"
                >
                  <div class="prover">
                    <el-button @click="handleAddOrg">
                      <i class="el-icon-plus" /> 修改组织名称</el-button
                    >
                    <el-button @click="handleEditOrg(data)">
                      <i class="el-icon-edit" /> 添加下级组织</el-button
                    >
                    <el-button @click="handleDeleteOrg(data)">
                      <i class="el-icon-delete-solid" />移动到</el-button
                    >
                  </div>
                  <!-- 1 -->
                  <i slot="reference" class="el-icon-more" />
                </el-popover>
              </span>
            </span>
          </el-tree>
        </div>
      </div>

      <el-tabs v-show="!showQueryDevTree" v-model="activeName1">
        <el-tab-pane label="机构" name="first">
          <Searchjigou ref="searchJigou" @searchedOrgClick="searchedOrgClick" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- dev-tree-left -->

    <!-- 弹出层标题 -->
    <el-dialog
      title="批量导入组织机构/用户"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div
        style="
          background-color: rgb(239, 242, 244);
          margin: 20px;
          padding: 10px;
        "
      >
        <div style="margin-bottom: 10px; font-weight: 800; color: black">
          1. 下载导入模板
        </div>
        <div style="margin-bottom: 10px; color: black">
          按照要求完善表格内容
        </div>
        <el-button type="primary" icon="el-icon-download" @click="btn(data)"
          >下载模板表格</el-button
        >
      </div>

      <div
        style="
          background-color: rgb(239, 242, 244);
          margin: 20px;
          padding: 10px;
        "
      >
        <div style="font-weight: 800; color: black">2. 上传完善后的表格</div>

        <el-upload
          class="upload-demo"
          drag
          :action="uploadurl()"
          multiple
          style="margin-left: 22%"
          :show-file-list="false"
          accept="'.xlsx','.xls'"
          :auto-upload="true"
          :headers="headers"
          :on-success="importsuccess"
        >
          <!-- <el-button size="mini" type="primary">导入</el-button> -->
          <i class="el-icon-upload" />
          <div class="el-upload__text" style="font-weight: 900">
            点击上传或拖拽文件到这里
          </div>
          <div slot="tip" class="el-upload__tip" style="margin-left: -15%">
            支持的文件类型：XLS、XLSX，每次只能上传一个文件且大小不超过2M，上传记录不超过2000条
          </div>
        </el-upload>
      </div>
    </el-dialog>

    <!-- <el-dialog title="机构人员信息导出" :visible.sync="dialogFormVisible" style="width: 50%; margin: 0 auto;">
      <el-form :model="form">
        <el-form-item label="请使用短信验证码确认管理员身份">
          <el-input v-model="form1.phone" autocomplete="off" style="width: 80%; margin-left: 10%;" placeholder="18307071986" :disabled="true" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="form1.codes" autocomplete="off" placeholder="请输入短信验证码" style="width: 45%; margin-left: 10%;" />
          <el-button type="primary" plain style="margin-left: 18px; ">获取验证码</el-button>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="daochu()">确 定</el-button>
      </div>
    </el-dialog> -->
    <!--用户数据-->
    <el-col :span="24" :xs="24" class="sys-content">
      <div>
        <div class="info">
          <span class="span">{{ currentSelectedOrgName }}</span>
          <span>({{ total }}人)</span>
        </div>

        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="" prop="cnName">
            <el-input
              v-model="queryParams.cnName"
              placeholder="请输入姓名"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入手机号"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="" prop="roleId">
            <el-select v-model="queryParams.roleId" placeholder="人员角色">
              <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                style="width: 180px"
              />
            </el-select>
          </el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            style="margin-top: 0.4%"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >

          <el-form-item style="float: right; margin-top: 0.4%">
            <!-- <el-button type="primary" plain icon="el-icon-plus" size="small" @click="handleAddOrg">添加监控节点</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="small" @click="handleEditOrg">修改监控节点</el-button> -->
            <el-button
              v-hasPermi="['system:user:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAddUser"
              >新增人员</el-button
            >
          </el-form-item>
        </el-form>

        <div class="table">
          <el-table
            v-loading="loading"
            border
            stripe
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <div slot="empty">
              <el-empty description="暂无用户" />
            </div>
            <!-- <el-table-column  width="50" align="center" :selectable="selectEnable" /> -->
            <el-table-column
              v-if="columns[1].visible"
              key="userName"
              label="手机号"
              align="center"
              prop="userName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="columns[2].visible"
              key="cnName"
              label="用户姓名"
              align="center"
              prop="cnName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="columns[3].visible"
              key="roleId"
              label="角色"
              align="center"
              prop="role.name"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="columns[3].visible"
              key="orgList"
              label="机构"
              align="center"
              prop="org.name"
              :show-overflow-tooltip="true"
            />

            <el-table-column
              v-if="columns[5].visible"
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
                <el-button
                  v-hasPermi="['system:user:edit']"
                  size="small"
                  type="text"
                  icon="iconfont icon-pen"
                  @click="handleUpdateUser(scope.row)"
                  ><span class="text">编辑</span></el-button
                >
                <el-button
                  v-hasPermi="['system:user:remove']"
                  size="small"
                  type="text"
                  icon="iconfont icon-delete"
                  @click="handleDeleteUser(scope.row)"
                  ><span class="text">删除</span></el-button
                >
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
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="userName">
              <el-input
                v-model="form.userName"
                :disabled="form.id !== undefined"
                placeholder="请输入手机号"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="cnName">
              <el-input
                v-model="form.cnName"
                placeholder="请输入用户姓名"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属机构" prop="orgId">
              <treeselect
                v-model="form.orgId"
                no-options-text="无数据"
                :flat="true"
                :auto-select-descendants="true"
                :multiple="false"
                style="line-height: 16px"
                :limit="1"
                :options="orgOptions"
                :show-count="true"
                placeholder="请选择归属机构"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select
                v-model="form.roleId"
                :max-height="30"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="orgTitle"
      :visible.sync="orgDlgOpen"
      width="600px"
      append-to-body
    >
      <el-form
        ref="orgForm"
        :model="orgForm"
        :rules="orgRules"
        label-width="80px"
      >
        <el-row>
          <el-col v-if="orgDlgEditFlag && orgForm.parentId" :span="12">
            <el-form-item label="上级机构">
              <!-- <treeselect
                v-model="orgForm.parentId"
                :disabled="orgDlgEditFlag"
                :options="orgOptions"
                placeholder="选择上级机构"
              /> -->
              <treeselect
                v-model="orgForm.parentId"
                :options="orgOptions"
                placeholder="选择上级机构"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构名称">
              <el-input
                v-model="orgForm.name"
                maxlength="32"
                placeholder="请输入机构名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOrgForm">确 定</el-button>
        <el-button @click="cancelOrgForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "font-awesome/css/font-awesome.css";
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  batchDelUser,
} from "@/api/system/user";
import $ from "jquery";
import {
  listOrg,
  getOrg,
  delOrg,
  getInfos,
  addOrg,
  updateOrg,
  treeselect,
  orginfoAndSubOrgInfo,
  getIndex,
  ppt,
} from "@/api/system/org";
import { getToken } from "@/utils/auth";
import { listRole } from "@/api/system/role";
import { dealTree } from "@/utils/deal-tree";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Searchjigou from "./searchjigou.vue";
export default {
  name: "User",
  components: { Treeselect, Searchjigou },
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() }, // 导入文件头
      showmore: false,
      value: "", // 下拉框的值
      options: [
        {
          value: "选项1",
          label: "全部人员角色",
        },
      ],
      showSearchRes: false,
      orgDlgOpen: false,
      orgDlgEditFlag: false,
      currentSelectedOrgName: "",
      currentTotalNum: undefined,
      treeProps: {
        label: (data, node) => {
          var label = data.name;

          return label;
        },
        isLeaf: (data, node) => {
          return this.treeLeaf(data);
        },
        disabled: (data, node) => {
          return this.treeLeaf(data);
        },
      },

      q: "", // 左侧搜索框的值
      activeTab: "dev",
      queryDevTreeDataList: [], // 树形组件的数据
      queryDevTreeLoading: false, // 树形组件loading
      defExpandDevs: [], // 默认展开
      activeName1: "first",
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
      dialogFormVisible: false,
      dialogVisible: false,
      form: {
        name: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      userList1: [],
      // 弹出层标题
      title: "",
      orgTitle: "",
      // 机构树选项
      orgOptions: undefined,
      // 是否显示弹出层
      open: false,
      pptvs: "",
      // 机构名称
      orgName: undefined,
      // 角色选项
      roleOptions: [],
      // 表单参数
      form1: {
        phone: "", // 导出弹窗的电话
        codes: "", // 导出弹窗验证码
      },
      orgForm: {
        id: undefined,
        parentId: undefined,
        name: undefined,
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 查询参数
      queryParams: {
        current: 1,
        pageSize: 10,
        userName: undefined,
        status: undefined,
        orgId: undefined,
        roleId: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户姓名`, visible: true },
        { key: 3, label: `机构`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `创建时间`, visible: true },
      ],
      orgRules: {
        parentId: [
          {
            required: true,
            message: "上级机构不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "机构名称不能为空",
            trigger: "blur",
          },
        ],
      },
      // 表单校验
      rules: {
        userName: [
          {
            required: true,
            message: "用户名称不能为空",
            trigger: "blur",
          },
          {
            pattern: /[a-zA-Z0-9\u4e00-\u9fa5_-]{4,16}$/,
            message: "请输入正确的用户名",
            trigger: "blur",
          },
        ],
        cnName: [
          {
            required: true,
            message: "用户姓名不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    showQueryDevTree() {
      if (this.q.length == 0) return true;
      if (this.activeTab == "dev" && this.devLevelFilter) {
        // this.queryDevTreeLoading = true
        return true;
      }
      if (this.showSearchRes) {
        return false;
      }
      return true;
    },
    queryDevTreeEmptyText() {
      return this.queryDevTreeLoading ? "搜索中..." : " ";
    },
    treeEmptyText() {
      return this.treeLoading ? "加载中..." : "未查询到组织机构";
    },
  },
  watch: {
    // 根据名称筛选机构树
    orgName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getRoleList();
    this.currentSelectedOrgName = sessionStorage.getItem("tenantName");

    this.queryParams.orgId = undefined;
    this.getTreeselect();

    this.getRoleList();
  },
  methods: {
    uploadurl() {
      return process.env.VUE_APP_BASE_API + "/jxict-project-sso/org/import";
    },
    importsuccess(response, file, filelist) {
      // 导入成功的回调
    },
    // 导入表格
    handleExcel(file) {
      const formData = new FormData(); // 声明一个FormDate对象
      formData.append("file", file.raw); // 把文件信息放入对象中

      // 调用后台导入的接口
      getIndex(formData)
        .then((res) => {
          if (res.Status && res.Data) {
            this.$message.success("导入成功");
            this.getList(); // 导入表格之后可以获取导入的数据渲染到页面，此处的方法是获取导入的数据
          } else {
            this.$message.error(res.Message);
          }
        })
        .catch((err) => {
          that.$message({
            type: "error",
            message: "导入失败",
          });
        });
    },

    // 人员导出
    exportlist() {
      var that = this;
      getInfos(this.queryParams.orgId).then((res) => {
        setTimeout(() => {
          that.download0(res, "人员列表导出表.xlsx");
        }, 300);
      });
    },
    download0(data, fileName) {
      // 创建 blob
      const blob = new Blob([data], { type: "application/vnd.ms-excel" });

      // 创建 href 超链接，点击进行下载
      window.URL = window.URL || window.webkitURL;
      const href = URL.createObjectURL(blob);
      const downA = document.createElement("a");
      downA.href = href;
      downA.download = fileName;
      downA.click();
      // 销毁超连接
      window.URL.revokeObjectURL(href);
    },

    searchedOrgClick(orgId, orgName) {
      this.queryParams.current = 1;
      this.queryParams.orgId = orgId;
      this.getList();
    },
    searchOrg() {
      const queryParams = { name: this.q };
      listOrg(queryParams).then((res) => {
        this.$refs.searchJigou.heightLight(res, this.q);
        this.$refs.searchJigou.orgList = res;
        this.$nextTick(() => {
          this.showSearchRes = true;
        });
      });
    },
    clearSearch() {
      this.$nextTick(() => {
        this.showSearchRes = false;
      });
    },
    orgRefresh() {},
    cancelOrgInfoDlg() {
      this.orgDlgOpen = false;
    },

    treeLeaf(data) {
      if (
        data.children != undefined &&
        data.children != null &&
        data.children.length == 0
      ) {
        return true;
      } else {
        return false;
      }
    },

    // tree
    treeLoad(node, resolve) {
      let orgId;
      if (node.data) {
        orgId = node.data.id;
      }
      orginfoAndSubOrgInfo({ orgId: orgId })
        .then((ret) => {
          if (node.level == 0) {
            this.defExpandDevs.push(ret.id);
            this.getList();
          }
          let orgList = [];
          if (node.level == 0) {
            orgList.push(ret);
          } else {
            orgList = ret.children || [];
          }

          if (!node.level && !this.devLevelFilter) {
            if (orgList.length > 100) {
              this.devLevelFilter = true;
            } else if (orgList.length > 1000) {
              this.devLevelFilter = true;
            }
          }

          resolve(orgList);
          if (this.q && !node.matched) {
            this.$refs["devTree"].filter(this.q);
          }
        })
        .catch(() => {})
        .then(() => {
          if (
            this.q &&
            !this.q.endsWith(" ") &&
            this.q.split(/\s+/).length === node.level &&
            this.devLevelFilter
          ) {
            this.q += " ";
            this.$refs["q"].focus();
          }
        });
    },

    switchTab(tab) {
      if (this.activeTab != tab) {
        this.q = "";
        this.$nextTick(() => {
          this.activeTab = tab;
        });
      }
    },

    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.userList = response.records;
        this.total = response.total;
        this.loading = false;
        // this.userList1 = response.records
        // this.userList1.forEach(row => {

        // })
      });
    },
    /** 查询机构下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        dealTree(response);
        this.orgOptions = response;
      });
    },
    /** 查询角色列表 */
    getRoleList() {
      listRole({}).then((response) => {
        this.roleOptions = response;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data, node, c) {
      this.queryParams.orgId = data.id;

      this.currentSelectedOrgName = data.orgName;

      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        orgId: undefined,
        userName: undefined,
        cnName: undefined,
        roleId: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    resetOrgFrom() {
      this.orgForm = {
        parentId: undefined,
        name: undefined,
      };
    },

    handleAddOrg() {
      this.orgDlgEditFlag = false;
      this.orgDlgOpen = true;
      this.orgTitle = "添加机构";

      this.resetOrgFrom();
    },
    handleEditOrg(data) {
      // 将当前点击的id传入节点里面
      this.queryParams.orgId = data.id;
      if (
        this.queryParams.orgId == undefined ||
        this.queryParams.orgId == null
      ) {
        alert("请选择需要编辑的监控节点");
        return;
      }
      this.orgDlgEditFlag = true;
      this.orgDlgOpen = true;
      this.orgTitle = "编辑机构";
      /** 编辑按钮操作 */
      this.resetOrgFrom();
      getOrg({ orgId: this.queryParams.orgId }).then((response) => {
        this.orgForm = response;
        this.title = "编辑机构";
      });
    },
    /** 新增人员按钮操作 */
    handleAddUser() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    /** 编辑按钮操作 */
    handleUpdateUser(row) {
      this.reset();
      getUser(row.id).then((response) => {
        this.form = response;
        dealTree(response.tenantOrgList);
        this.orgOptions = response.tenantOrgList;
        this.roleOptions = response.tenantRoleList;

        this.open = true;
        this.title = "编辑用户";
      });
    },
    handleDeleteUser(row) {
      this.$confirm("是否确认删除所选的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (row && row.id) {
            return delUser(row.id);
          } else {
            return batchDelUser(this.ids);
          }
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    cancelOrgForm() {
      this.resetOrgFrom();
      this.orgDlgOpen = false;
    },
    /** 提交按钮 */
    submitOrgForm: function () {
      this.$refs["orgForm"].validate((valid) => {
        if (valid) {
          if (this.orgForm.id != undefined) {
            updateOrg(this.orgForm).then((response) => {
              this.msgSuccess("编辑监控节点成功");
              this.showTree = false;
              this.$nextTick(() => {
                this.showTree = true;
              });
              this.getTreeselect();
              this.getList();
              this.orgDlgOpen = false;
            });
          } else {
            addOrg(this.orgForm).then((response) => {
              this.msgSuccess("新增监控节点成功");
              this.showTree = false;
              this.$nextTick(() => {
                this.showTree = true;
              });
              this.getTreeselect();
              this.getList();
              this.orgDlgOpen = false;
            });
          }
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then((response) => {
              this.msgSuccess("用户信息编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
              this.msgSuccess("新增用户信息成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDeleteOrg(row) {
      this.$confirm("是否确认删除所选的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // debugger
          if (row && row.orgId) {
            const param = { orgId: row.orgId };
            return delOrg(param);
          }
        })
        .then(() => {
          this.showTree = false;
          this.$nextTick(() => {
            this.showTree = true;

            this.currentSelectedOrgName = sessionStorage.getItem("tenantName");
            this.getTreeselect();
            this.queryParams.current = 1;
            this.queryParams.orgId = undefined;

            this.getList();
            this.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },
    /** 表格勾选判断 */
    selectEnable(row) {
      return row.id !== 1;
    },
  },
};
</script>
<style lang="scss" scoped>
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
  // display: block;
  opacity: 0;
}
::v-deep .el-tree-node__content:hover .el-icon-more {
  opacity: 1;
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
  margin-top: -10px;

  .el-pagination {
    text-align: right;
  }
}
.app-container {
  .el-tree {
    overflow: auto;
    width: 13vw;
    height: 35vw;
    font-size: 13px;
  }
  justify-content: space-between !important;

  .top-left {
    height: 45px;
    width: 22vw;
    padding-left: 3vw;
    margin-left: -3vw;
    margin-top: -16px;
    margin-bottom: 10px;
    line-height: 45px;
    background-color: #e3e8f1;
    display: flex;

    .left-right {
      margin-left: 70px;
      font-size: 13px;
      color: #409eff;
      cursor: pointer;
      font-weight: normal;
    }

    span {
      color: rgb(4, 3, 3);
      font-weight: 700;
    }
  }
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
    color: rgb(0, 0, 0);
    font-weight: 700;

    .span {
      margin-left: 10px;
    }
  }
}

.container-left {
  margin-bottom: 10px;
  margin-right: 18%;

  .form-control {
    padding: 0;
    border: 0;
  }
}
::v-deep.el-dialog__header {
  background-color: skyblue;
}

::v-deep .el-table {
  font-size: 13px;
}
</style>
