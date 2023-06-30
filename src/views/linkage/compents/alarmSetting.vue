<template>
  <!-- tabs -->
  <div style="margin-top: 14px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="声光告警" name="first">
        <span style="font-size: 12px; color: #c0c4cc"
          >检测区域内出现人行或运动时,设备发出警示灯光或声音
        </span>
      </el-tab-pane>
      <el-tab-pane label="人脸告警" name="second">
        <span style="font-size: 12px; color: #c0c4cc"
          >检测到人脸时，将与系统人脸库匹配，并推送告警信息</span
        >
      </el-tab-pane>
    </el-tabs>
    <!-- 搜索栏 -->
    <el-row style="margin-top: 36px">
      <el-form label-width="80px" style="display: flex; flex-wrap: wrap">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="4">
          <el-form-item label="设备名称:">
            <el-input
              placeholder="请输入设备名称"
              v-model="searchForm.name"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="4">
          <el-form-item label="监控节点:">
            <treeselect
              v-model="searchForm.orgId"
              no-options-text="无数据"
              :flat="true"
              :auto-select-descendants="true"
              :multiple="false"
              style="line-height: 16px; width: 100%; color: #606266"
              :limit="1"
              :options="orgOptions"
              :show-count="true"
              placeholder="请选择所在监控节点"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="4">
          <el-form-item label="设备型号:">
            <el-select
              v-model="searchForm.connetType"
              style="width: 100%"
              clearable
              size="small"
              placeholder="请选择设备型号"
            >
              <el-option
                v-for="item in $dt('connet_type')"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col ::xs="24" :sm="24" :md="8" :lg="8" :xl="4">
          <el-form-item label="设备ID:">
            <el-input
              placeholder="请输入设备ID"
              v-model="searchForm.serviceId"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="8"
          :xl="4"
          style="text-align: right"
        >
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="search"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <!-- 表格上面的字 -->
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <p style="color: #606266; font-size: 12px">
        当前可配置
        <span>{{ searchForm.soundLightAlarmAbility ? "声光" : "人脸" }}</span>
        告警设备共<span style="color: #1790ff">{{ total }}</span> 台，已开启
        <span>{{ searchForm.soundLightAlarmAbility ? "声光" : "人脸" }}</span
        >告警设备共 <span style="color: #1790ff">{{ openTotal }}</span> 台
      </p>
      <div>
        <el-button
          icon="el-icon-switch-button"
          plain
          size="mini"
          type="success"
          @click="batchONorOFF(1)"
          >批量开启</el-button
        >
        <el-button
          icon="el-icon-remove-outline"
          plain
          size="mini"
          type="danger"
          @click="batchONorOFF(2)"
          >批量关闭</el-button
        >
      </div>
    </div>

    <!-- 表格 -->

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      height="500"
      @selection-change="handleSelectionChange"
    >
      <div slot="empty">
        <el-empty description="暂无用户" />
      </div>
      <el-table-column type="selection" width="50"></el-table-column>

      <el-table-column prop="name" label="设备名称"> </el-table-column>
      <el-table-column prop="orgName" label="所在监控节点"> </el-table-column>
      <el-table-column prop="studentClass" label="设备型号">
        <template slot-scope="scope">
          <span>{{ getConnetType(scope.row.connetType) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="serviceId" label="设备标识"> </el-table-column>
      <el-table-column prop="status" label="设备状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? "在线" : "离线" }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="switchName">
        <template slot-scope="scope">
          <div v-if="searchForm.soundLightAlarmAbility">
            <el-switch
              v-model="scope.row.soundLightAlarm"
              active-value="ON"
              inactive-value="OFF"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="soundLightAlarmChange(scope.row, $event)"
            >
            </el-switch>
            <span style="margin-left: 10px">{{
              scope.row.soundLightAlarm == "ON" ? "开" : "关"
            }}</span>
          </div>
          <div v-else>
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.aiAbilityFace"
              active-value="ON"
              inactive-value="OFF"
              @change="aiCaptureFaceAbilityChange(scope.row, $event)"
            />
            <span style="margin-left: 10px">{{
              scope.row.aiAbilityFace == "ON" ? "开" : "关"
            }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="searchForm.current"
      :limit.sync="searchForm.pageSize"
      @pagination="getList"
      :hide-on-single-page="false"
    />
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import { treeselect } from "@/api/system/org";
import { dealTree } from "@/utils/deal-tree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { warnSettingList, editSettingSwitch } from "@/api/linkage/index.js";
import LogoVue from "../../../layout/components/Sidebar/Logo.vue";
export default {
  name: "AlarmSetting",
  components: {
    Treeselect,
  },
  data() {
    return {
      openTotal: 0, //以开启开关的数量
      orgOptions: undefined,
      activeName: "first", //tabs 绑定的值
      total: 0, //分页绑定的值
      searchForm: {
        current: 1,
        pageSize: 10,
      },
      tableData: [], //表格绑定的值
      loading: false, //遮罩层
      searchForm: {
        current: 1,
        pageSize: 10,
        name: null, //设备名称
        orgId: null, //监控节点
        serviceId: null, //设备id
        connetType: null, //设备型号
        soundLightAlarmAbility: null, //声光
        aiCaptureFaceAbility: null, //人脸
        soundLightAlarm: null,
        aiAbilityFace: null,
      },
      switchList: [], //开关数组
    };
  },
  computed: {
    switchName() {
      if (this.activeName === "first") {
        return "开启声光报警";
      } else {
        return "开启人脸报警";
      }
    },
  },
  created() {
    this.searchForm.soundLightAlarmAbility = true;
    this.getList();
    this.getTreeselect();
  },
  methods: {
    //设备型号
    getConnetType(connetType) {
      let value = "";
      this.$store.getters.dict["connet_type"].forEach((item) => {
        if (connetType == item.dictKey) {
          value = item.dictValue;
        }
      });
      return value;
    },
    //tabs 点击
    handleClick(tab, event) {
      this.searchForm.current = 1;
      if (tab.index == 0) {
        this.searchForm.soundLightAlarmAbility = true;
        this.searchForm.aiCaptureFaceAbility = null;
      } else if (tab.index == 1) {
        this.searchForm.soundLightAlarmAbility = null;
        this.searchForm.aiCaptureFaceAbility = true;
      }
      this.getList();
    },
    //获取列表数据
    async getList() {
      this.searchForm.soundLightAlarm = null;
      this.searchForm.aiAbilityFace = null;
      try {
        this.loading = true;
        const response = await warnSettingList(this.searchForm);
        this.total = response.total;
        this.tableData = response.records;

        if (this.searchForm.soundLightAlarmAbility) {
          this.searchForm.soundLightAlarm = "ON";
          const response = await warnSettingList(this.searchForm);
          this.openTotal = response.total;
        } else {
          this.searchForm.aiAbilityFace = "ON";
          const response = await warnSettingList(this.searchForm);
          this.openTotal = response.total;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    //搜素
    search() {
      this.searchForm.current = 1;
      this.getList();
    },
    //重置
    resetQuery() {
      this.searchForm = {
        pageSize: 10,
        current: 1,
        name: null, //设备名称
        orgId: null, //监控节点
        serviceId: null, //设备id
        connetType: null, //设备型号
        soundLightAlarmAbility: this.searchForm.soundLightAlarmAbility, //声光
        aiCaptureFaceAbility: this.searchForm.aiCaptureFaceAbility, //人脸
      };
      this.getList();
    },
    //多选框
    handleSelectionChange(val) {
      let arr = val;
      this.switchList = arr.map((item) => {
        return item.id;
      });
    },
    //批量开关
    async batchONorOFF(type) {
      let state = "";
      if (type === 1) {
        state = "ON";
      } else {
        state = "OFF";
      }
      if (this.searchForm.soundLightAlarmAbility) {
        await editSettingSwitch({
          deviceIds: this.switchList,
          soundLightAlarm: state,
        });
      } else {
        await editSettingSwitch({
          deviceIds: this.switchList,
          aiAbilityFace: state,
        });
      }
      this.getList();
    },
    /** 查询机构下拉树结构 */
    getTreeselect(orgId) {
      treeselect().then((response) => {
        dealTree(response);
        this.orgOptions = response;
        this.orgName = this.getOrgName(orgId, response);
      });
    },
    getOrgName(orgId, orgList) {
      if (!orgId || !orgList || orgList.length == 0) {
        return "";
      }
      for (let i = 0; i < orgList.length; i++) {
        const item = orgList[i];
        if (item.id === orgId) {
          return item.name;
        }
        if (item.children && item.children.length > 0) {
          const orgName = this.getOrgName(orgId, item.children);
          if (orgName.length > 0) {
            return orgName;
          }
        }
      }
      return "";
    },
    //打开或关闭声光报警
    async soundLightAlarmChange(data, event) {
      const res = await editSettingSwitch({
        deviceIds: [data.id],
        soundLightAlarm: event,
      });

      this.getList();
    },
    //打开或关闭人脸报警
    async aiCaptureFaceAbilityChange(data, event) {
      const res = await editSettingSwitch({
        deviceIds: [data.id],
        aiAbilityFace: event,
      });

      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav-wrap::after {
  height: 0;
}
::v-deep .el-input__inner {
  font-size: 12px;
  padding-left: 10px;
}
::v-deep .vue-treeselect__placeholder {
  font-size: 12px;
}
</style>
