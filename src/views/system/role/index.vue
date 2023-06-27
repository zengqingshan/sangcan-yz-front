<template>
  <div class="app-container sys-content">
    <div class="fusion-resources-video-monitor-title-bar-container">
      <span class="title-bar-title">角色与权限</span>
    </div>

    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      style="margin-top: 20px"
    >
      <el-form-item label="" prop="name" style="float: left">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
        >重置</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="handleQuery"
        style="width: 4%"
        >搜索</el-button
      >

      <el-form-item style="float: right">
        <el-button
          v-hasPermi="['system:role:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          >添加角色</el-button
        >
      </el-form-item>
    </el-form>

    <div class="table">
      <el-table v-loading="loading" stripe border :data="roleList">
        <div slot="empty">
          <el-empty description="暂无角色" />
        </div>
        <!--<el-table-column label="角色编号" prop="id" />-->
        <el-table-column
          label="角色名称"
          width="160"
          prop="name"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          label="创建时间"
          width="180"
          align="center"
          prop="createTime"
        />
        <el-table-column label="描述" align="center" prop="remark" />
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template v-if="scope.row.id !== 1" slot-scope="scope">
            <!--
                            <el-button size="small" type="text" icon="el-icon-edit" @click="handleAuth(scope.row)" v-hasPermi="['system:role:auth']"><span class="text">设备授权</span></el-button>
                        -->
            <el-button
              v-hasPermi="['system:role:edit']"
              size="small"
              type="text"
              icon="iconfont icon-pen"
              @click="handleUpdate(scope.row)"
              ><span class="text">编辑</span></el-button
            >
            <el-button
              v-hasPermi="['system:role:remove']"
              size="small"
              type="text"
              icon="iconfont icon-delete"
              @click="handleDelete(scope.row)"
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
    <!-- 添加或编辑角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="form.name"
            maxlength="32"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="菜单权限" prop="appMenuIds">
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event, 'menu')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
            >全选/全不选</el-checkbox
          >
          <el-checkbox
            v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
            >父子联动</el-checkbox
          >
          <el-tree
            ref="menu"
            v-model="form.appMenuIds"
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            node-key="appMenuId"
            :default-checked-keys="selectedId"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="暂无数据"
            :props="defaultProps"
          />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="form.remark"
            maxlength="200"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-drawer title="设备授权" :visible.sync="drawerOpen">
      <auth-equipment
        v-if="drawerOpen"
        :checked-devices="checkedDevices"
        :edit-row="editRow"
        @cancel="cancel"
      />
    </el-drawer>
  </div>
</template>

<script>
import {
  pageRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  roleDeviceAuthGet,
} from "@/api/system/role";
import { treeMenuByRole } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { dealTree } from "@/utils/deal-tree";

export default {
  name: "Role",
  components: { Treeselect },
  data() {
    return {
      editRow: {},
      checkedDevices: [],
      activeName: "1",
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 应用列表数据
      applicationList: undefined,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示侧边弹出层
      drawerOpen: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      orgExpand: true,
      orgNodeAll: false,
      // 日期范围
      dateRange: [],
      // 菜单列表
      menuOptions: [],
      // 机构列表
      orgOptions: [],
      // 查询参数
      queryParams: {
        appIds: undefined,
        current: 1,
        pageSize: 10,
        name: undefined,
        roleKey: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "blur",
          },
          {
            pattern: /[0-9a-zA-Z\u4e00-\u9fa5]{1,32}$/,
            message: "请输入正确的角色名称",
            trigger: "blur",
          },
        ],
      },
      selectedId: [],
    };
  },
  created() {
    // this.getAPPList();
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      pageRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.roleList = response.records;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.drawerOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      (this.menuExpand = false),
        (this.menuNodeAll = false),
        (this.orgExpand = true),
        (this.orgNodeAll = false),
        (this.form = {
          id: undefined,
          name: undefined,
          roleKey: undefined,
          rank: 0,
          status: "0",
          appMenuIds: [],
          orgIds: [],
          remark: undefined,
        });
      this.resetForm("form");
    },
    /** 点击树节点 */
    handleNodeClick(item, node) {
      if (node.isLeaf) {
        this.queryParams.appCode = item.appCode;
        this.getList();
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      const treeList = this.menuOptions;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      this.form.menuCheckStrictly = !!value;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      treeMenuByRole().then((response) => {
        dealTree(response);
        this.menuOptions = response;
        this.open = true;
        this.title = "添加角色";
      });
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      treeMenuByRole().then((menuRsp) => {
        dealTree(menuRsp);
        this.menuOptions = menuRsp;

        getRole(row.id).then((response) => {
          this.selectedId = response.appMenuIds;
          this.form = response;
          this.open = true;
          this.title = "编辑角色";
        });
      });
    },
    /** 编辑按钮操作 */
    handleAuth(row) {
      this.editRow = { ...row };
      this.drawerOpen = true;
      roleDeviceAuthGet({
        resourceType: "1",
        roleId: row.id,
        treeType: "platform",
      }).then((data) => {
        this.checkedDevices = data;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.appMenuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then((response) => {
              this.msgSuccess("编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.appMenuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除所选的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (row && row.id) {
            return delRole({ roleId: row.id });
          }
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-pagination {
  text-align: right;
}
::v-deep .pagination-container {
  padding: 0;
}
.sys-content {
  display: flex;
  flex-direction: column;
  .table {
    // flex: 1;
  }
  .text {
    font-size: 14px;
    margin-left: 4px;
  }
}

.fusion-resources-video-monitor-title-bar-container {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #e3e8f1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 36px;
  justify-content: space-between;
  padding-left: var(--frvm-space-level-5);
  padding-right: var(--frvm-space-level-3);
  width: 100%;
}
.fusion-resources-video-monitor-title-bar-container .title-bar-title {
  color: black;
  font-size: var(--frvm-font-size-body);
  font-weight: 700;
  margin-left: 15px;
}
// .fusion-resources-video-monitor-title-bar-container .title-bar-title:before {
//   // border-left:3px solid #46a0fc;
//   content: "";
//   display: inline-block;
//   height: 10px;
//   margin-right: 0.52vw;
//   width: 0;
// }
.el-button--text {
  padding-left: 5%;
}
.el-button + .el-button {
  padding-right: 5%;
}
</style>
