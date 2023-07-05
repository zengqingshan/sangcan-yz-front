<template>
  <div>
    <!-- //右侧展示监控设备 -->
    <div style="height: 32px">
      <div v-if="showmessage" style="margin-bottom: 11px">
        设备数: {{ onlineNum }}/{{ deviceNum }}
      </div>
    </div>
    <div class="infinite-list-wrapper">
      <div
        ref="mianscroll"
        v-infinite-scroll="loadMoreDevice"
        class="record-list scroll-list vedio-bottom"
        infinite-scroll-throttle-delay="500"
        infinite-scroll-disabled="deviceListFinished || loading"
        infinite-scroll-immediate="false"
        infinite-scroll-distance="10"
        style="height: 34.5vw; overflow-y: inherit"
      >
        <div
          v-for="(item, index) in DeviceImagelist"
          :key="index"
          :draggable="true"
          class="list"
          @dragstart="dragstart($event, item)"
        >
          <div
            :ref="'divs' + index"
            :class="{ activevlass: activeclass == index }"
          >
            <img
              v-if="item.status"
              style="width: 210px; height: 116px"
              :src="item.coverUrl"
              @click="deviceNodeClick(item, index)"
            />
            <img
              v-else
              style="width: 210px; height: 116px"
              src="@/assets/images/device_offline.png"
            />
            <i class="el-icon-upload" />
            <i
              :class="{
                'el-icon-star-off': !item.starFlag,
                'el-icon-star-on': item.starFlag,
              }"
              @click="starDevice(item, index)"
            />
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div v-if="loadingError" class="floor">
          <div class="floor text" style="color: red">加载失败</div>
        </div>
        <el-button
          v-if="showmessage"
          type="primary"
          size="medium"
          :loading="loadings"
          :disabled="disbtn"
          @click="loadMoreDevice"
        >
          {{ btninner }}</el-button
        >
      </div>

      <div v-if="showmessage" class="icon-seting" style="color: white">
        <el-tooltip
          class="item"
          effect="dark"
          content="回到当前"
          placement="top"
        >
          <i class="el-icon-aim" style="cursor: pointer" @click="onedivtop" />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="返回顶部"
          placement="top"
        >
          <i class="el-icon-top" style="cursor: pointer" @click="divscolltop" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="筛选" placement="top">
          <el-dropdown
            trigger="click"
            :hide-on-click="true"
            @command="filtertype"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-files" style="cursor: pointer" />
            </span>
            <el-dropdown-menu slot="dropdown" class="filtlers">
              <el-dropdown-item
                v-for="(item, index) in dropdownlist"
                :key="index"
                :command="item.com"
                :disabled="item.type"
              >
                <!-- <i :class="{'el-icon-check':true,'coloractive':iconindex = index}" /> -->
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listPageDevice,
  deviceStarDelete,
  deviceStarAdd,
} from "@/api/system/device";

import _ from "lodash";

export default {
  components: {},
  data() {
    return {
      loadings: false,
      scrollHeight: 0,

      DeviceImagelist: [],
      DeviceImagelistcopy: [],

      activeclass: null,
      onlineNum: 0,
      deviceNum: 0,

      disbtn: false,
      btninner: "加载更多",

      loading: false,
      loadingError: false,
      loadingSuccess: false,
      deviceListFinished: false,
      deviceListPageNum: 1,

      deviceListPageSize: 5,

      orgId: undefined,
      showmessage: true,
      switcharr: [],
      dropdownlist: [
        { name: "全部", com: "a" },
        { name: "在线状态", com: "b", type: true },
        { name: "在线", com: "c" },
        { name: "离线", com: "d" },
        { name: "云储存", com: "e", type: true },
        { name: "已开通", com: "f" },
        { name: "未开通", com: "g" },
      ],
      iconindex: -1, // 图标索引
      devicestatus: null, // 设备状态(在线/离线)
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.$bus.$on("getconcerninfo", (arr, showinfo) => {
      this.DeviceImagelist.splice(0);
      this.DeviceImagelist.push(...arr);
      this.showmessage = showinfo; // 是否需要隐藏设备数
    });
    this.$bus.$on("startinfo", (showinfos) => {
      this.showmessage = showinfos;
      this.deviceListPageNum = 1;
      this.LoadDeviceByOrgId();
    });
    this.$bus.$on("historyarr", (arr) => {
      this.DeviceImagelist.push(...arr);
    });
    this.$bus.$on("bigpollinfo", (arr) => {
      this.DeviceImagelist.splice(0);
      this.DeviceImagelist.push(...arr);
      this.$bus.$emit("pollvedio", this.DeviceImagelist);
      this.$bus.$emit("playallvedio");
    });
    this.$bus.$on("switchlist", () => {
      this.switcharr.splice(0);
      this.switcharr.push(...this.DeviceImagelist); // 备份数组
      this.DeviceImagelist = this.DeviceImagelist.filter((item) => {
        return item.status == true;
      });
      // 通知中间组件更新数据
      this.$bus.$emit("pollvedio", this.DeviceImagelist);
    });
    this.$bus.$on("reback", () => {
      // 复原数据

      this.DeviceImagelist.splice(0);
      this.DeviceImagelist.push(...this.switcharr);

      // 通知中间组件更新数据
      this.$bus.$emit("pollvedio", this.DeviceImagelist);
    });
  },

  methods: {
    filtertype(command) {
      if (command == "a") {
        this.deviceListPageNum = 1;
        this.devicestatus = null;
        this.LoadDeviceByOrgId();
      } else if (command == "c") {
        // 在线
        // 重新拉取
        this.deviceListPageNum = 1;
        this.LoadDeviceByOrgId({ type: true });
        this.devicestatus = "true";
      } else if (command == "d") {
        // 离线
        this.deviceListPageNum = 1;
        this.LoadDeviceByOrgId({ type: false });
        this.devicestatus = "false";
      }
    },
    dragstart(ev, item) {
      ev.dataTransfer.setData("item", JSON.stringify(item));
    },

    // 关注设备
    starDevice(item, index) {
      const param = { deviceId: item.id };
      if (item.starFlag) {
        deviceStarDelete(param).then(() => {
          item.starFlag = false;
          this.$set(this.DeviceImagelist[index], "starFlag", false);
        });
      } else {
        deviceStarAdd(param).then(() => {
          item.starFlag = true;
          this.$set(this.DeviceImagelist[index], "starFlag", true);
        });
      }
      // 投递事件给关注列表重新拉取数据
      this.$bus.$emit("againgetinfo");
    },
    init(orgId, onlineNum, deviceNum) {
      this.deviceListPageNum = 1;
      this.loading = false;
      this.loadingError = false;
      this.loadingSuccess = false;
      this.deviceListFinished = false;
      this.orgId = orgId;
      this.disbtn = false;
      this.DeviceImagelist = [];
      this.DeviceImagelistcopy = [];
      this.activeclass = null;
      this.btninner = "加载更多";
      this.scrollHeight = 0;
      this.loadings = false;
      this.onlineNum = onlineNum;
      this.deviceNum = deviceNum;

      this.$nextTick(() => {
        this.LoadDeviceByOrgId();
      });
    },
    deviceNodeClick(item, index) {
      const scrollEl = this.$refs.mianscroll;
      this.scrollHeight = scrollEl.offsetHeight;

      this.activeclass = index;

      this.$emit("deviceClicked", item.serviceId, item.name);
    },
    loadMoreDevice() {
      this.loadings = true;
      if (this.devicestatus == "true") {
        this.LoadDeviceByOrgId({ type: true });
      } else if (this.devicestatus == "false") {
        this.LoadDeviceByOrgId({ type: false });
      } else {
        this.LoadDeviceByOrgId();
      }
    },

    // 滚动到顶部
    divscolltop() {
      this.$nextTick(() => {
        const scrollEl = this.$refs.mianscroll;
        scrollEl.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
    // 定位元素
    onedivtop() {
      const scrollEl = this.$refs.mianscroll;
      scrollEl.scrollTo({ top: this.scrollHeight, behavior: "smooth" });
    },

    LoadDeviceByOrgId(status) {
      this.loading = true;
      this.loadingError = false;
      this.deviceListFinished = false;
      const param = {};
      param.orgId = this.orgId;
      param.current = this.deviceListPageNum;
      param.pageSize = this.deviceListPageSize;
      if (status) {
        param.status = status.type;
      }
      if (this.deviceListPageNum == 1) {
        this.DeviceImagelist = [];
      }

      listPageDevice(param)
        .then((ret) => {
          this.loadings = false;
          this.deviceListPageNum++; // 成功，加1
          this.deviceListFinished = ret.finish;
          const deviceList = ret.records || [];
          if (deviceList.length == 0 || ret.finish == true) {
            this.btninner = "没有更多";
            this.disbtn = true;
          } else {
            this.btninner = "加载更多";
            this.disbtn = false;
          }
          this.DeviceImagelist = this.DeviceImagelist.concat(deviceList);
        })
        .catch(() => {})
        .then(() => {
          this.$nextTick(() => {
            this.loading = false;
          });
        });
    },
  }, // -- methods
};
</script>

<style lang="less" scoped>
.el-icon-check {
  color: #fff;
}
.coloractive {
  color: blue !important;
}
.infinite-list-wrapper {
  height: 38vw;
}

.activevlass {
  border: 2px solid blue;
}

::v-deep .el-icon-more-outline {
  color: #978e8e;
  transform: rotateZ(90deg);
  font-size: 13px;
  //  display: none;
}

// ::v-deep .el-icon-more-outline:hover{
//   display: block;
// }

.infinite-list-wrapper {
  .icon-seting {
    ::v-deep .el-dropdown {
      color: #ffffff;
    }
  }
}

.icon-seting {
  display: flex;
  justify-content: space-around;
  color: white;
  font-size: 18px;
  width: 90%;
  margin-top: 15px;
}

.video {
  height: 60%;
}

.scroll-list {
  ::v-deep .el-button--medium {
    margin-left: 26%;
  }
}

.list {
  width: 90%;
  position: relative;
  margin-bottom: 10px;
}

.list div {
  overflow: hidden;
}

.list div img:hover {
  // transform: scale(1.08);
  transform: perspective(400px) translateZ(50px);
}

.list div img {
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.vedio-bottom div .el-icon-upload {
  position: absolute;
  left: 2%;
  top: 2%;
  color: #7474ef;
  font-size: 18px;
}

.vedio-bottom div {
  .el-icon-star-on {
    position: absolute;
    right: 2%;
    bottom: 2%;
    color: rgb(70, 160, 252);
    font-size: 16px;
    z-index: 1999;
  }
  .el-icon-star-off {
    position: absolute;
    right: 2%;
    bottom: 3%;
    color: #ffffff;
    font-size: 16px;
    z-index: 1999;
  }
}

.vedio-bottom div span {
  position: absolute;
  bottom: 3px;
  left: 3%;
  color: white;
  font-size: 12px;
}

// 右侧标签样式

::v-deep .root .demo-tools {
  height: 0;
}
</style>

<!-- ptz style -->
<style lang="less" scoped>
.settings-block {
  margin: 30px auto;
  text-align: center;
}
</style>

<style lang="less">
.infinite-list-wrapper {
  overflow: auto;
  width: 100%;
}

/* 整个滚动条 */
.infinite-list-wrapper ::-webkit-scrollbar {
  /* 对应纵向滚动条的宽度 */
  width: 4px;
  /* 对应横向滚动条的宽度 */
  height: 4px;
}

/* 滚动条上的滚动滑块 */
.infinite-list-wrapper ::-webkit-scrollbar-thumb {
  background-color: #666768;
  border-radius: 32px;
}

/* 滚动条轨道 */
.infinite-list-wrapper ::-webkit-scrollbar-track {
  background-color: #00a99c;
  border-radius: 32px;
  // margin-right: 10px;
}
</style>
