<template>
  <div class="app-container" style="display: block;padding: 15px;">
    <!-- <div > -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="90px"
      >
        <el-form-item label="党支部名称" prop="partyBranchName">
          <el-input
            v-model="queryParams.partyBranchName"
            placeholder="请输入党支部名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="支部书记" prop="secretaryName">
          <el-input
            v-model="queryParams.secretaryName"
            placeholder="请输入支部书记"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="secretaryPhone">
          <el-input
            v-model="queryParams.secretaryPhone"
            placeholder="请输入联系方式"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['community:partyBranch:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['community:partyBranch:edit']"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['community:partyBranch:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['community:partyBranch:export']"
            >导出</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        v-loading="loading"
        :data="partyBranchList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="党支部ID"
          align="center"
          prop="partyBranchId"
          v-if="false"
        />
        <el-table-column
          label="党支部名称"
          align="center"
          prop="partyBranchName"
        />
        <el-table-column
          label="成立时间"
          align="center"
          prop="establishTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.establishTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支部书记" align="center" prop="secretaryName" />
        <el-table-column
          label="联系方式"
          align="center"
          prop="secretaryPhone"
        />
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['community:partyBranch:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['community:partyBranch:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    <!-- </div> -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改党支部信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      class="custom-dialog-class"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="名称" prop="partyBranchName">
          <el-input
            v-model="form.partyBranchName"
            placeholder="请输入名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="成立时间" prop="establishTime">
          <el-date-picker
            clearable
            v-model="form.establishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择成立时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支部书记" prop="secretaryName">
          <el-input
            v-model="form.secretaryName"
            placeholder="请输入支部书记"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="secretaryPhone">
          <el-input
            v-model="form.secretaryPhone"
            placeholder="请输入联系方式"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :controls="false"
            placeholder="请输入排序"
            :min="0"
            :max="9999"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { listPartyBranch, getPartyBranch, delPartyBranch, addPartyBranch, updatePartyBranch } from "@/api/community/partyBranch";

export default {
  name: "PartyBranch",
  data() {
    return {
      // 遮罩层
      loading: false,
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
      // 党支部信息表格数据
      partyBranchList: [1],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        partyBranchName: null,
        establishTime: null,
        secretaryName: null,
        secretaryPhone: null,
        sort: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        partyBranchName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        establishTime: [
          { required: true, message: "请选择成立时间", trigger: "blur" },
        ],
        secretaryName: [
          { required: true, message: "请输入支部书记", trigger: "blur" },
        ],
        secretaryPhone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
      },
    };
  },
  // created() {
  //   this.getList();
  // },
  methods: {
    /** 查询党支部信息列表 */
    getList() {
      this.loading = true;
      listPartyBranch(this.queryParams).then((response) => {
        this.partyBranchList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        partyBranchId: null,
        partyBranchName: null,
        establishTime: null,
        secretaryName: null,
        secretaryPhone: null,
        sort: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.partyBranchId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加党支部信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const partyBranchId = row.partyBranchId || this.ids;
      getPartyBranch(partyBranchId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改党支部信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.partyBranchId != null) {
            updatePartyBranch(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPartyBranch(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const partyBranchIds = row.partyBranchId || this.ids;
      this.$modal
        .confirm("此操作将永久删除该记录, 您确认删除?")
        .then(function () {
          return delPartyBranch(partyBranchIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "community/partyBranch/export",
        {
          ...this.queryParams,
        },
        `partyBranch_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
