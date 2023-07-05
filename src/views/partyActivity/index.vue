<template>
  <div class="app-container" style="display: block;">
    <el-card class="box-card">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="标题" prop="activityName">
          <el-input
            v-model="queryParams.activityName"
            placeholder="请输入标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="资讯类型" prop="activityName">
          <el-select
            v-model="queryParams.activityType"
            placeholder="请输入资讯类型"
            clearable
            style="width: 240px"
          >
            <!-- <el-option v-for="dict in dict.type.party_activity_type" :key="dict.value" :label="dict.label"
            :value="dict.value" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" prop="activityName">
          <el-select
            v-model="queryParams.activityType"
            placeholder="请输入发布状态"
            clearable
            style="width: 240px"
          >
            <!-- <el-option v-for="dict in dict.type.party_activity_type" :key="dict.value" :label="dict.label"
            :value="dict.value" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="beginTime">
          <el-date-picker
            clearable
            v-model="queryParams.beginTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发布时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-row
        :gutter="10"
        class="mb8"
        style="border-bottom: 1px solid #e9edf3; padding-bottom: 15px"
      >
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['community:partyActivity:add']"
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
          v-hasPermi="['community:partyActivity:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['community:partyActivity:remove']"
        >删除</el-button>
      </el-col> 
    
        <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
      </el-row>
      <el-table v-loading="loading" :data="partyActivityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="partyActivityId" v-if="false"/>
      <el-table-column label="所属村（社区）" align="center" prop="activityName" />
      <el-table-column label="标题" align="center" prop="activityType" />
      <el-table-column label="内容" align="center" prop="activityType" />
      <el-table-column label="资讯类型" align="center" prop="activityType" />
   
      <el-table-column label="发布时间" align="center" prop="beginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览次数" align="center" prop="participation" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:partyActivity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:partyActivity:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 添加或修改党务活动对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="900px"
        class="custom-dialog-class"
        append-to-body
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="活动名称" prop="activityName">
            <el-input
              v-model="form.activityName"
              placeholder="请输入活动名称"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="活动类型" prop="activityType">
                <el-select
                  v-model="form.activityType"
                  placeholder="活动类型"
                  clearable
                  style="width: 100%"
                >
                  <!-- <el-option v-for="dict in dict.type.party_activity_type" :key="dict.value" :label="dict.label"
                  :value="dict.value" /> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开始时间" prop="beginTime">
                <el-date-picker
                  clearable
                  style="width: 100%"
                  v-model="form.beginTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择开始时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  clearable
                  style="width: 100%"
                  v-model="form.endTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择结束时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="参与人员" prop="participation">
            <el-input
              v-model="form.participation"
              placeholder="请输入参与人员"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="活动纪要">
            <editor v-model="form.content" :min-height="192" />
          </el-form-item>
          <el-form-item label="轮播图" prop="cyclePicture">
            <image-upload v-model="form.cyclePicture" :limit="3" />
            <!--          <el-input v-model="form.cyclePicture" placeholder="请输入轮播图地址" />-->
          </el-form-item>
          <el-form-item label="封面图" prop="coverPicture">
            <image-upload v-model="form.coverPicture" :limit="1" />
            <!--          <el-input v-model="form.coverPicture" placeholder="请输入封面图地址" />-->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// import {
//   listPartyActivity,
//   getPartyActivity,
//   delPartyActivity,
//   addPartyActivity,
//   updatePartyActivity
// } from "@/api/community/partyActivity";

export default {
  name: "PartyActivity",
  // dicts: ['party_activity_type'],
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
      // 党务活动表格数据
      partyActivityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        activityName: null,
        activityType: null,
        beginTime: null,
        endTime: null,
        participation: null,
        content: null,
        cyclePicture: null,
        coverPicture: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        activityType: [
          { required: true, message: "请选择活动类型", trigger: "blur" },
        ],
        beginTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
        coverPicture: [
          { required: true, message: "请上传封面图", trigger: "blur" },
        ],
      },
      show: false,
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    mouseenter(item) {
      item.show = true;
      this.$forceUpdate();
    },
    mouseleave(item) {
      item.show = false;
      this.$forceUpdate();
    },
    /** 查询党务活动列表 */
    getList() {
      this.loading = true;
      listPartyActivity(this.queryParams).then((response) => {
        this.partyActivityList = response.rows;
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
        partyActivityId: null,
        activityName: null,
        activityType: null,
        beginTime: null,
        endTime: null,
        participation: null,
        content: null,
        cyclePicture: null,
        coverPicture: null,
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
      this.ids = selection.map((item) => item.partyActivityId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加党务活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const partyActivityId = row.partyActivityId || this.ids;
      getPartyActivity(partyActivityId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改党务活动";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.partyActivityId != null) {
            updatePartyActivity(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPartyActivity(this.form).then((response) => {
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
      const partyActivityIds = row.partyActivityId || this.ids;
      this.$modal
        .confirm("此操作将永久删除该记录, 您确认删除?")
        .then(function () {
          return delPartyActivity(partyActivityIds);
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
        "community/partyActivity/export",
        {
          ...this.queryParams,
        },
        `partyActivity_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style scoped>
.bg-purple .image {
  width: 286px;
  height: 175px;
  margin-top: 18px;
}
.baseImageCard {
  margin: 5px;
}

.height100 {
  height: 100%;
}

.bg-purple {
  border-radius: 6px;
  border-width: 1px;
  background: #fff;
  position: relative;
}

.bg-purple .custom-col {
  width: 25%;
  display: inline-block;
}

.bg-purple .contentZhezhao {
  color: #fff;
  z-index: 999;
  height: 100%;
  top: 0;
}

.bg-purple .contentZhezhao,
.bg-purple .zhezhao {
  width: 100%;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  position: absolute;
  left: 0;
}

.bg-purple .zhezhao {
  z-index: 1000;
  height: 40px;
  bottom: 0;
}

.bg-purple .zhezhao .editControl {
  flex: 1;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #fff;
}

.bg-purple .zhezhao .editControl:last-child {
  border-right: none;
}

.bg-purple .time {
  font-size: 12px;
  text-align: left;
  padding-left: 18px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #bfbfbf;
}

.bg-purple .name {
  font-size: 16px;
  text-align: center;
  color: #000;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bg-purple .images {
  overflow: hidden;
}

.bg-purple .address {
  font-size: 14px;
  text-align: left;
  padding: 16px 0;
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #636363;
}

.bg-purple .item-label {
  position: absolute;
  top: 5px;
  right: 2px;
  box-sizing: border-box;
  text-align: center;
}

.bg-purple .item-label span {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  border-radius: 5px;
  overflow: hidden;
  font-size: 14px;
  color: #fff;
}

.bg-purple .chart {
  height: 38px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: row;
}

.bg-purple .chart :not(:first-child) {
  border-left: 1px solid #e3e3e3;
}

.bg-purple .chart .btnChart2 {
  background-color: #409eff;
  color: #fff;
  cursor: pointer;
  margin-left: -1px;
  margin-right: -1px;
  border: 1px solid #409eff;
}

.bg-purple .chart .btnChart2,
.bg-purple .chart .btnchart {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
  margin: 24px 0 0;
}

.image {
  width: 100%;
  height: 242px;
  border-radius: 6px;
  transition: all 0.6s;
}

.image:hover {
  transform: scale(1.1);
}

.el-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 100%;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
  background-color: #e3e3e3;
}

@media only screen and (min-width: 1920px) {
  .custom-col {
    width: 20%;
    display: inline-block;
  }
}

@media only screen and (min-width: 1600px) and (max-width: 1919px) {
  .custom-col {
    width: 20%;
    display: inline-block;
  }
}

@media only screen and (min-width: 1280px) and (max-width: 1559px) {
  .custom-col {
    width: 25%;
    display: inline-block;
  }
}

@keyframes mymove-data-v-be1249dc {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.2);
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.2);
  }
}

@-webkit-keyframes mymove-data-v-be1249dc {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.2);
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.2);
  }
}
</style>
