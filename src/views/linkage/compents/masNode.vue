<template>
  <div>
    <div class="topSearch">
      <el-form>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="发送时间"
              label-width="80px"
              style="width: 100%"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :disabled="!searchForm.startTime"
                :content="searchForm.startTime"
                placement="bottom"
              >
                <el-date-picker
                  class="datePicker"
                  v-model="searchForm.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择开始时间"
                  style="width: 45%"
                >
                </el-date-picker>
              </el-tooltip>
              <span style="color: black"> &nbsp; - </span>
              <el-tooltip
                class="item"
                effect="dark"
                :disabled="!searchForm.endTime"
                :content="searchForm.endTime"
                placement="bottom"
              >
                <el-date-picker
                  class="datePicker"
                  v-model="searchForm.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择结束时间"
                  style="width: 45%"
                >
                </el-date-picker>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="接收人" label-width="80px" style="width: 100%">
              <el-input
                placeholder="请输入接收人名称"
                v-model="searchForm.receiver"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item
              label="接收人手机号"
              label-width="100px"
              style="width: 100%"
            >
              <el-input
                placeholder="请输入接收人手机号"
                v-model="searchForm.receiverPhone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item
              label="发送状态"
              label-width="80px"
              style="width: 100%"
            >
              <el-select
                v-model="searchForm.sendStatus"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="学生姓名"
              label-width="80px"
              style="width: 100%"
            >
              <el-input
                placeholder="请输入学生姓名"
                v-model="searchForm.studentName"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="学生证号码"
              label-width="80px"
              style="width: 100%"
            >
              <el-input
                placeholder="请输入学生证号码"
                v-model="searchForm.studentId"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align: right">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="searchStudents"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <el-button
          type="success"
          icon="el-icon-chat-dot-square"
          plain
          @click="openNodeManagement"
          >短信内容管理</el-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div>
      <el-table
        style="width: 100%"
        height="550"
        v-loading="loading"
        :data="tableData"
      >
        <div slot="empty">
          <el-empty description="暂无数据" />
        </div>
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" width="200">
        </el-table-column>
        <el-table-column prop="sendContent" label="发送内容" width="500">
          <template slot-scope="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.sendContent"
              placement="bottom"
            >
              <div class="cell-with-tooltip">
                {{ row.sendContent }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="receiver" label="接收人"> </el-table-column>
        <el-table-column
          prop="receiverPhone"
          label="接收人手机号码"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="studentName" label="对应学生姓名" width="150">
        </el-table-column>
        <el-table-column prop="studentId" label="学生证号码" width="150">
        </el-table-column>
        <el-table-column prop="sendStatus" label="发送状态">
          <template slot-scope="{ row }">
            <span>{{ row.sendStatus === "0" ? "未发送" : "已发送" }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.pageSize"
        @pagination="getSmsLogList"
        :hide-on-single-page="false"
      />
    </div>

    <!-- 短信内容管理弹窗 -->
    <el-dialog
      title="短信内容管理"
      :visible.sync="nodeManagementDialog"
      width="40%"
      append-to-body
      @open="openManagementDialog"
    >
      <div style="margin-bottom: 11px">配置短信内容</div>
      <el-input style="margin-bottom: 13px" v-model="content"> </el-input>
      <div style="color: #c0c4cc; font-size: 12px">
        短信样例:
        <el-tag size="mini">所属组织</el-tag>
        的
        <el-tag size="mini">学生姓名</el-tag>
        同学正在
        <el-tag size="mini">所在区域</el-tag>
        旁玩耍,水边玩耍很危险,请家长及时处理!
        <div style="color: red">*高亮区域为必填项</div>
      </div>
      <div style="text-align: end; margin-top: 150px">
        <el-button
          @click="
            nodeManagementDialog = false;
            content = null;
          "
          >取消</el-button
        >
        <el-button type="primary" @click="commitChangesOrg">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  smsLogList,
  smsTemplateList,
  editTemplate,
} from "@/api/linkage/index.js";
export default {
  name: "MasNode",

  data() {
    return {
      options: [
        {
          value: "0",
          label: "未发送",
        },
        {
          value: "1",
          label: "已发送",
        },
      ],
      loading: false, //遮罩层
      total: 0, //分页的条数
      tableData: [],
      nodeManagementDialog: false, //短信弹窗
      searchForm: {
        receiver: null,
        receiverPhone: null,
        sendStatus: null,
        studentName: null,
        studentId: null,
        startTime: null,
        endTime: null,
        pageSize: 10, //条数
        current: 1, //页码
      },
      content: null, //输入框绑定的值
      contentId: null, //输入框id
    };
  },
  computed: {},
  created() {
    this.getSmsLogList();
  },
  methods: {
    //打开修改弹窗
    openNodeManagement() {
      this.nodeManagementDialog = true;
    },
    //获取列表数据
    async getSmsLogList() {
      this.loading = true;
      smsLogList(this.searchForm).then((response) => {
        this.total = response.total;
        this.tableData = response.records;
        this.loading = false;
      });
    },
    //点击搜索
    searchStudents() {
      this.getSmsLogList();
    },
    //点击重置
    resetQuery() {
      this.searchForm = {
        receiver: null,
        receiverPhone: null,
        sendStatus: null,
        studentName: null,
        studentId: null,
        startTime: null,
        endTime: null,
        pageSize: 10, //条数
        current: 1, //页码
      };
      this.getSmsLogList();
    },
    //打开消息弹窗
    async openManagementDialog() {
      const res = await smsTemplateList();
      console.log(res);
      this.content = res[0].content;
      this.contentId = res[0].id;
    },
    //提交修改
    async commitChangesOrg() {
      editTemplate({
        content: this.content,
        id: this.contentId,
      }).then((res) => {
        this.$message({
          message: "修改短信模板成功",
          type: "success",
        });
        this.nodeManagementDialog = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.topSearch {
  padding: 15px 0px;
}
.cell-with-tooltip {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
::v-deep .el-input__inner {
  font-size: 12px;
  padding: 0px 10px;
}
::v-deep .el-range-editor--medium .el-range-input {
  font-size: 12px;
}

::v-deep .el-dialog__body {
  padding: 19px 32px 24px;
}
::v-deep .el-dialog__header {
  height: 54px;
  padding: 17px 32px;
  font-weight: 500;
  line-height: 20px;
}
::v-deep .el-table .el-table__header-wrapper th {
  background-color: #f0f0f0;
  color: #73767b;
}
::v-deep .datePicker .el-input__inner {
  padding: 0 30px;
}
</style>
