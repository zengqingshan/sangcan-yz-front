<template>
  <div class="contron">
    <el-dialog
      :visible.sync="showsetting"
      width="750px"
      center
      top="2%"
      style="margin-bottom: 2%"
      @close="closeDialog"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <div class="setting">
            <div class="setting-pan">
              <span>设备名称:</span>
              <span v-if="showedit"
                >{{ dialongData.name || "暂无" }}
                <el-button
                  style="margin-left: 10px"
                  size="mini"
                  type="primary"
                  plain
                  @click="editorName"
                  >编辑</el-button
                >
              </span>
              <div v-else style="display: flex">
                <el-input v-model="dialongData.name" />
                <el-button
                  type="primary"
                  style="margin-left: 10px"
                  plain
                  size="mini"
                  @click="commitChanges"
                  >确定</el-button
                >
                <el-button type="primary" plain size="mini" @click="cancel"
                  >取消</el-button
                >
              </div>
            </div>
            <div class="setting-pan">
              <span>国际设备编码:</span>
              <span>{{ dialongData.serviceId || "暂无" }}</span>
            </div>
            <div class="setting-pan">
              <span>国标通道编码:</span>
              <span>{{ dialongData.serviceId || "暂无" }}</span>
            </div>
            <div class="setting-pan">
              <span>设备平台ID:</span>
              <span>{{ dialongData.platformId || "暂无" }}</span>
            </div>
            <div class="setting-pan">
              <span>设备厂商:</span>
              <span>{{ vendorcom || "暂无" }}</span>
            </div>
            <div class="setting-pan">
              <span>注册时间:</span>
              <span>{{ dialongData.createTime || "暂无" }}</span>
            </div>
            <div class="setting-pan">
              <span>许可证到期时间:</span>
              <span>{{ dialongData.createTime || "暂无" }}</span>
            </div>
            <div class="setting-pan">
              <span>设备所属节点:</span>
              <span v-if="chooseTree"
                >{{ orgName || "暂无" }}
                <el-button
                  style="margin-left: 10px"
                  size="mini"
                  type="primary"
                  plain
                  @click="chooseTree = false"
                  >编辑</el-button
                >
              </span>

              <div v-else style="display: flex">
                <treeselect
                  v-model="dialongData.orgId"
                  no-options-text="无数据"
                  :flat="true"
                  :auto-select-descendants="true"
                  :multiple="false"
                  style="line-height: 16px; width: 200px"
                  :limit="1"
                  :options="orgOptions"
                  :show-count="true"
                  placeholder="请选择归属机构"
                />

                <el-button
                  type="primary"
                  style="margin-left: 10px"
                  plain
                  size="mini"
                  @click="updataInstitutions"
                  >确定</el-button
                >
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="(chooseTree = true), (dialongData.orgId = oldorgId)"
                  >取消</el-button
                >
              </div>
            </div>
            <div class="setting-pan">
              <span>云存储套餐:</span>
              <span style="display: flex"
                ><el-button type="text" @click="packageDialog = true"
                  >7天云储存</el-button
                ><el-button
                  type="primary"
                  style="margin-left: 10px"
                  size="mini"
                  plain
                  >解除关联</el-button
                ></span
              >
            </div>
            <div class="setting-pan">
              <span>AI套餐:</span>
              <el-button
                plain
                style="margin-left: 10px"
                size="mini"
                type="primary"
                @click="packagedialog = true"
                >关联套餐</el-button
              >
            </div>
            <div class="setting-pan">
              <span>设备位置:</span>
              <span
                >{{ valueleft || "暂无" }}
                <el-button
                  style="margin-left: 10px"
                  size="mini"
                  type="primary"
                  plain
                  @click="showaddress(dialongData.serviceId)"
                  >查看地图</el-button
                ></span
              >
            </div>

            <div style="float: right; margin-top: 5%; margin-right: 16px">
              <el-button
                type="primary"
                plain
                size="mini"
                @click="solutionToCamera"
                >解绑摄像机</el-button
              >
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 坐标 -->
    <el-dialog
      style="margin-top: 0px"
      :visible.sync="dialogVisible"
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

      <div class="selectinput">
        <el-select v-model="values" placeholder="请选择">
          <el-option
            v-for="(item, index) in disivions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <Map
        ref="map"
        mapid="settingDlgMap"
        :type="type"
        :newStyle="newStyle"
        @click-marker-coor="clickMarkerCoor"
      />
      <span slot="footer" class="dialog-footer">
        <!-- <div class="tip">
          请点击拖动定位图标，进行经纬度的选择：<span
            v-if="coor.length"
          >{{ coor[0] }}，{{ coor[1] }}</span>
        </div> -->
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updataAddressAndLlongLat(locationdata)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 关联套餐 -->
    <el-dialog append-to-body :visible.sync="packagedialog" title="关联套餐">
      <el-table :data="gridData" border>
        <el-table-column property="date" label="选择" align="center" />
        <el-table-column property="name" label="套餐名称" align="center" />
        <el-table-column property="name" label="开始时间" align="center" />
        <el-table-column property="name" label="结束时间" align="center" />
        <el-table-column property="name" label="数量" align="center" />
      </el-table>
    </el-dialog>

    <!-- 套餐详情 -->
    <el-dialog
      title="套餐详情"
      :visible.sync="packageDialog"
      width="500px"
      append-to-body
    >
      <div style="padding: 24px">
        <div style="margin-bottom: 10px">套餐名称:{{ name }}</div>
        <div style="margin-bottom: 10px">生效时间:{{ effectOfTime }}</div>
        <div style="margin-bottom: 10px">到期时间:{{ dueToTime }}</div>
      </div>
      <div>
        <div
          style="display: flex; justify-content: flex-end; padding: 10px 16px"
        >
          <el-button type="primary" @click="packageDialog = false"
            >知道了</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import { dealTree } from "@/utils/deal-tree";
import { treeselect } from "@/api/system/org";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Map from "@/components/Map/index";
import {
  getInfoserve,
  editdevicename,
  deletedevicename,
} from "@/api/system/device";
export default {
  name: "SettingDialog",
  components: {
    Map,
    Treeselect,
  },
  data() {
    return {
      name: "7天云存储",
      effectOfTime: "2022-06-06 00:00:00",
      dueToTime: "2022-06-08 00:00:00",
      packageDialog: false,
      dialongData: {},
      gridData: [],
      activeName: "first",
      showedit: true, // 编辑设备
      showsetting: false, // 弹窗
      // 设置弹窗数据
      orgOptions: undefined,
      chooseTree: true,
      orgName: null,
      neworgId: null,
      oldorgId: null,
      oldName: null,
      setname: null, // 设备名称
      id: null,
      dialogVisible: false,
      packagedialog: false,
      newStyle: {
        height: "500px",
      },
      coor: [],
      type: ["cluster", "geocoder"], // 显示地图类型

      values: "",
      disivions: [
        {
          label: "北京市",
          value: "北京市",
        },
        {
          label: "天津市",
          value: "天津市",
        },
        {
          label: "河北省",
          value: "河北省",
        },
        {
          label: "山西省",
          value: "山西省",
        },
        {
          label: "内蒙古自治区",
          value: "内蒙古自治区",
        },
        {
          label: "辽宁省",
          value: "辽宁省",
        },
      ],
      valueright: null,
      valueleft: null,
      oldvalueleft: null,
      oldvalueright: null,
      i: 0,
      locationdata: {},
    };
  },
  computed: {
    vendorcom() {
      let ven;
      this.$dt("vendor").forEach((item) => {
        if (this.dialongData.vendor == item.dictKey) {
          ven = item.dictValue;
        }
      });
      return ven;
    },
  },
  created() {},
  methods: {
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
    /** 查询机构下拉树结构 */
    async getTreeselect(orgId) {
      const response = await treeselect();
      dealTree(response);
      this.orgOptions = response;
      this.disableNotLeaf(response);
      this.orgName = this.getOrgName(orgId, response);
    },
    disableNotLeaf(options) {
      options.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.isDisabled = true;
          this.disableNotLeaf(item.children);
        } else {
          item.isDisabled = false;
        }
      });
    },
    // 解绑摄像头
    solutionToCamera() {
      this.$confirm("此操作将解绑摄像头, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          await deletedevicename(this.dialongData.id);
          this.showsetting = false;
          this.$message({
            type: "success",
            message: "解绑成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑",
          });
        });
    },
    // 编辑设备名称修改
    editorName() {
      this.showedit = false;
      // this.setname = this.dialongData.name;
    },
    // 消息提示
    messagePrompt(str) {
      if ((str = "编辑成功")) {
        this.$message({
          message: "编辑成功",
          type: "success",
        });
        // this.showsetting = false;
      } else {
        this.$message.error("编辑失败");
      }
      this.showedit = true;
    },
    async commitChanges() {
      this.oldName = this.dialongData.name;
      const res = await editdevicename({
        id: this.dialongData.id,
        name: this.dialongData.name,
      });
      this.messagePrompt(res);
      this.refreshData();
    },
    // 修改机构
    async updataInstitutions() {
      const res = await editdevicename({
        id: this.dialongData.id,
        orgId: this.dialongData.orgId,
      });
      this.chooseTree = true;
      this.oldorgId = this.dialongData.orgId;
      this.getTreeselect(this.dialongData.orgId);
      this.messagePrompt(res);
      this.refreshData();
    },

    // 取消
    cancel() {
      this.showedit = true;
      this.dialongData.name = this.oldName;
      this.valueright = this.oldvalueright;
      this.valueleft = this.oldvalueleft;
    },
    closeDialog() {
      this.showedit = true;
      this.chooseTree = true;
    },
    // 刷新数据
    refreshData() {
      this.$emit("refreshData");
    },
    // 展示位置弹框
    async showDeviceInfo(serviceId) {
      const res = await getInfoserve(serviceId);
      this.coor.splice(0);
      this.dialongData = res;
      await this.getTreeselect(res.orgId);

      this.oldName = res.name;
      this.oldorgId = res.orgId;
      this.coor.push(res.longitude, res.latitude);
      this.address = res.address;
      this.valueright = "经度:" + this.coor[0] + ",纬度:" + this.coor[1];
      this.oldvalueright = "经度:" + this.coor[0] + ",纬度:" + this.coor[1];
      this.valueleft = res.address || "暂无";
      this.oldvalueleft = res.address || "暂无";

      this.showsetting = true;
    },
    async showaddress(serviceId) {
      const res = await getInfoserve(serviceId);
      this.dialongData = res;
      this.dialogVisible = true;
      this.coor.push(res.longitude, res.latitude);
      this.valueleft = res.address || "暂无";
      this.valueright = "经度:" + this.coor[0] + ",纬度:" + this.coor[1];
      this.$nextTick(() => {
        var point = new BMap.Point(res.longitude, res.latitude); // 创建点坐标
        this.$refs.map.map.centerAndZoom(point, 15);
        var point1 = new BMap.Point(res.longitude, res.latitude);
        var marker = new BMap.Marker(point1); // 创建标注
        this.$refs.map.map.addOverlay(marker); // 将标注添加到地图中
      });
    },
    async updataAddressAndLlongLat(param) {
      const res = await editdevicename({
        id: this.dialongData.id,
        longitude: param.longitude,
        latitude: param.latitude,
        address: param.address,
      });
      this.valueleft = param.address;
      this.valueright = "经度:" + param.longitude + ",纬度:" + param.latitude;
      this.dialogVisible = false;
    },

    clickMarkerCoor(e) {
      this.coor = e;
      const param = {
        id: this.dialongData.id,
        longitude: e[0],
        latitude: e[1],
        address: e[2],
      };
      this.valueleft = param.address;
      this.valueright = "经度:" + param.longitude + ",纬度:" + param.latitude;
      this.locationdata = param;
    },
    // 进入后修改中心点坐标
    addoverlaypoint() {},
  },
};
</script>
<style lang="scss" scoped>
.selectinput {
  position: absolute;
  z-index: 11;
  right: 26px;
  top: 122px;
}
</style>
