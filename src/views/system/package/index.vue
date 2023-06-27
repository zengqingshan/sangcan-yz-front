<template>
  <div class="app-container sys-content">
    <div class="fusion-resources-video-monitor-title-bar-container">
      <span class="title-bar-title">套餐管理</span>
    </div>
    <!-- 搜索 -->
    <el-form
      class="searchBar"
      style="margin-top: 20px; display: flex"
      ref="queryForm"
      :model="queryParams"
    >
      <el-form-item>
        <el-select v-model="queryParams.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          style="margin: 0px 12px"
          v-model="queryParams.value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          style="padding-right: 20px"
          @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- tabs -->
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="使用中" name="first"></el-tab-pane>
        <el-tab-pane label="待关联" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column
          prop="date"
          label="办理时间"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="套餐类型"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="address" label="套餐类型" align="center">
        </el-table-column>
        <el-table-column prop="address" label="生效时间" align="center">
        </el-table-column>
        <el-table-column prop="address" label="失效时间" align="center">
        </el-table-column>
        <el-table-column prop="address" label="支付方式" align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="关联设备"
          align="center"
          v-if="activeName === 'first'"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="设备标识"
          align="center"
          v-if="activeName === 'first'"
        >
        </el-table-column>
        <el-table-column label="操作" align="center"> </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.current"
        :limit.sync="queryParams.pageSize"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Package",
  components: {},
  data() {
    return {
      queryParams: {
        value: null,
        value1: null,
        pageSize: 10,
        current: 1,
      },
      total: 0, // 总条数
      tableData: [],
      options: [
        {
          value: "1",
          label: "全部套餐类型",
        },
        {
          value: "2",
          label: "全天存储-7天云存储",
        },
      ],

      activeName: "first",
    };
  },
  created() {},
  methods: {
    //获取列表数据
    async getList() {
      const res = await getList();
      this.total = res.total;
      this.tableData = res;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      // this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {};
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },

    handleClick(tab, event) {},
  },
};
</script>
<style lang="scss" scoped>
.sys-content {
  display: flex;
  flex-direction: column;
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
  margin-left: 15px;
  width: 100%;
  color: black;
  font-size: var(--frvm-font-size-body);
  font-weight: 700;
}
// .fusion-resources-video-monitor-title-bar-container .title-bar-title:before {
//   // border-left: 3px solid #46a0fc;
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
