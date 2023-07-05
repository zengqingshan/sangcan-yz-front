<template>
  <div class="app-container" style="display: block">
    <el-tabs type="border-card">
      <el-tab-pane label="党史资料">
        <el-form ref="queryForm" size="small" :inline="true" label-width="68px">
          <el-form-item
            label="所属村（社区）"
            prop="activityName"
            label-width="100px"
          >
            <el-input
              placeholder="请输所属村（社区）"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="标题" prop="activityName">
            <el-select placeholder="请输入标题" clearable style="width: 240px">
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" prop="activityName">
            <el-select
              placeholder="请输入发布时间"
              clearable
              style="width: 240px"
            >
            </el-select>
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
              v-hasPermi="['community:partyActivity:remove']"
              >删除</el-button
            >
          </el-col>
          <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
        <el-table
          v-loading="loading"
          :data="partyActivityList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            label="编号"
            align="center"
            prop="partyActivityId"
            v-if="false"
          />
          <el-table-column
            label="所属村（社区）"
            align="center"
            prop="activityName"
          />
          <el-table-column label="标题" align="center" prop="activityType" />
          <el-table-column
            label="发布时间"
            align="center"
            prop="activityType"
          />
          <el-table-column label="发布人" align="center" prop="activityType" />
          <el-table-column
            label="发布状态"
            align="center"
            prop="endTime"
            width="180"
          >
          </el-table-column>
          <el-table-column
            label="浏览次数"
            align="center"
            prop="endTime"
            width="180"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-refresh-right"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['community:partyActivity:edit']"
                >撤回</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['community:partyActivity:remove']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      /> -->
      </el-tab-pane>
      <el-tab-pane label="党史视频">
        <el-form ref="queryForm" size="small" :inline="true" label-width="68px">
          <el-form-item
            label="所属村（社区）"
            prop="activityName"
            label-width="100px"
          >
            <el-input
              placeholder="请输所属村（社区）"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="标题" prop="activityName">
            <el-select placeholder="请输入标题" clearable style="width: 240px">
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" prop="activityName">
            <el-select
              placeholder="请输入发布时间"
              clearable
              style="width: 240px"
            >
            </el-select>
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
              icon="el-icon-refresh-right"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['community:partyActivity:edit']"
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
              v-hasPermi="['community:partyActivity:remove']"
              >删除</el-button
            >
          </el-col>
          <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
        <el-row  v-if="videoData.length!==0">
        <el-col :span="5.5" v-for="item in videoData" style="margin-left: 40px;margin-top: 40px;" >
           <video style="border: 1px solid red;width: 300px;height: 200px;"></video>
          
        </el-col>
      </el-row>
        <el-empty description="暂无数据" v-else></el-empty>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加添加党史教育对话框 -->
    <el-dialog
      title="添加党史教育"
      :visible.sync="open"
      width="600px"
      class="custom-dialog-class"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="所属村（社区）" prop="partyBranchName">
          <el-input
            placeholder="请输入所属村（社区）"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标题" prop="secretaryName">
          <el-input placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="secretaryPhone">
          <editor v-model="form.content" :min-height="192" />
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
export default {
  data() {
    return {
      partyActivityList: [1],
      open: false,
      // 添加表单
      form: {},
      // 表单验证
      rules: [],
      videoData:[1,2,3,4]
    };
  },
  methods: {
    handleSelectionChange() {},

    // 点击新增
    handleAdd() {
      this.open = true;
    },
    // 搜索
    handleQuery() {},
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.partyBranchId != null) {
            // updatePartyBranch(this.form).then((response) => {
            //   this.$modal.msgSuccess("修改成功");
            //   this.open = false;
            //   this.getList();
            // });
          } else {
            // addPartyBranch(this.form).then((response) => {
            //   this.$modal.msgSuccess("新增成功");
            //   this.open = false;
            //   this.getList();
            // });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
  },
};
</script>

<style></style>
