<template>
  <div style="height: 100%">
    <div id="screen-sticky" style="display: flex; height: 100%">
      <div class="video-show col-md-9 col-lg-10" style="flex: 1">
        <el-row>
          <el-col :span="12" style="margin-top: 15px">
            <i
              :class="{
                'el-icon-star-off': !starFlag,
                'el-icon-star-on': starFlag,
              }"
              @click="collectionvedio"
            />

            <span style="color: rgb(255, 255, 255)">
              <span v-if="starFlag">已关注节点</span>
              <span v-else>关注节点</span>
            </span>
            <!-- <el-tooltip class="item" effect="light" content="设备监控" placement="top"> -->
            <span style="margin-left: 13px">{{ orgPath }}</span>
            <!-- </el-tooltip> -->
          </el-col>
          <el-col :span="12">
            <div class="text-center">
              <el-button-group class="player-btn-group">
                <el-button
                  v-if="layoutNum != 1 && layoutNum != 99"
                  type="primary"
                  size="medium"
                  title="全屏显示"
                  @click.prevent="fullscreen"
                >
                  <i class="fa fa-arrows-alt" />
                </el-button>

                <el-dropdown trigger="click">
                  <el-button type="primary">
                    {{ getPlayerLengthDisplayName()
                    }}<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="list in playerBtnGroup"
                      :key="list.num"
                      :command="list.command || 's'"
                    >
                      <el-button
                        size="medium"
                        :class="{ active: layoutNum == list.num }"
                        @click.prevent="changeLayout(list)"
                        >{{ list.name }}</el-button
                      >
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="showcovers" class="elrows">
          <el-col style="height: 100%">
            <div style="height: 85%">
              <VideoPlayers
                id="videoPlayers"
                ref="hlsVideoPlayer"
                style="width: 100%; height: 100%"
                @starpoill="pollingstart"
                @activeclose="activeclose"
              />
            </div>
          </el-col>
        </el-row>
        <div
          v-else
          class="video-show col-md-9 col-lg-10"
          style="flex: 1; width: 100%"
        >
          <covervedio ref="videoList" style="width: 90%" />
        </div>
      </div>
    </div>
    <!-- screen-sticky -->
    <!-- 定位按钮 -->
    <span
      v-show="layoutnumtoo < allvediolist.length && pagenext"
      class="pos-right"
      @click="nextvedio"
    >
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="right"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
        />
      </svg>
    </span>
    <span v-show="i > layoutNum && pagenext" class="pos-left" @click="prevedio">
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="left"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
        />
      </svg>
    </span>
  </div>
</template>

<script>
import { orgStarDelete, orgStarAdd } from "@/api/system/org";

import "font-awesome/css/font-awesome.css";
import "admin-lte/dist/css/skins/_all-skins.css";
import "vue-resize/dist/vue-resize.css";
import "leaflet/dist/leaflet.css";
import "@penggy/leaflet.fullscreen/Control.FullScreen.css";
import "@penggy/leaflet-contextmenu/dist/leaflet.contextmenu.css";
import "leaflet";
import "@penggy/leaflet.fullscreen";
import "@penggy/leaflet-contextmenu/dist/leaflet.contextmenu.js";

import $ from "jquery";
import VideoPlayers from "./components/videosAllVideos.vue";
import "./assets/js/jquery-sticky.js";
import "jquery-ui/ui/widgets/draggable";

import Covervedio from "./components/covervedio.vue";
export default {
  components: {
    VideoPlayers,
    Covervedio,
  },
  data() {
    return {
      starFlag: false,
      shownodeicon: false,
      activeclass: null,
      showcovers: true,
      isFull: false, // 是否是全屏的状态

      layoutName: "1×1", // 分栏管理的选中值
      layoutNum: 1, // 分栏窗口数
      activeName: "",

      currentOrgId: undefined,
      orgPath: "",

      players: [],
      playerIdx: 0,
      playerLength: 1,

      fullscreenFlag: false,
      pnode: null,

      level: 0,

      playerBtnGroup: [
        {
          num: 1,
          name: "单屏",
          command: "s",
        },
        {
          num: 4,
          name: "4分屏",
          command: "s",
        },
        {
          num: 6,
          name: "6分屏",
          command: "s",
        },
        {
          num: 9,
          name: "9分屏",
          command: "s",
        },
        {
          num: 16,
          name: "16分屏",
          command: "s",
        },
        {
          num: 25,
          name: "25分屏",
          command: "s",
        },
        {
          num: 99,
          name: "平铺",
          command: "a",
        },
      ],
      allvediolist: [],
      i: 0, // 播放监控的起始索引
      layoutnumtoo: 1, // 分屏数的中转，用作轮巡切换
      pagenext: false, // 控制分页按钮
      pollgropcontrol: null, // 控制分屏播放
    };
  },
  computed: {},
  watch: {
    // 监听分屏数，变化时重新播放
    layoutNum(newval) {
      if (this.pollgropcontrol) {
        this.layoutnumtoo = newval;
        this.i = 0;
        for (this.i; this.i < newval; this.i++) {
          this.$bus.$emit(
            "playhistoryvedio",
            this.allvediolist[this.i].serviceId,
            this.allvediolist[this.i].name
          );
        }
      }
    },
  },
  mounted() {
    // 只在轮巡状态下监听分屏的变化
    this.$bus.$on("pollcontrol", (control) => {
      this.pollgropcontrol = control;
    });
    this.$bus.$on("playvedio", (serviceId, deviceName) => {
      this.$nextTick(() => {
        this.$refs.hlsVideoPlayer.requestPlay(serviceId, deviceName);
      });
    });
    // 轮巡播放
    this.$bus.$on("pollvedio", (arr) => {
      // 拿到所有的轮巡播放设备
      this.allvediolist.splice(0);
      this.allvediolist.push(...arr);
    });
    this.$bus.$on("playallvedio", () => {
      // 开始轮巡播放
      // this.layoutNum 分屏数

      // 播放监控
      for (this.i = 0; this.i < this.layoutNum; this.i++) {
        this.$bus.$emit(
          "playhistoryvedio",
          this.allvediolist[this.i].serviceId,
          this.allvediolist[this.i].name
        );
      }
    });
    this.changeLayout(this.playerBtnGroup[0]);

    this.contextMenuTarget = document.querySelector("#tab-tree-wrapper");

    $(document).on("expanded.pushMenu collapsed.pushMenu", this.updateSticky);
    // $('#screen-sticky').sticky({ bottomSpacing: 40 })

    this.$dragging.$on("dragend", (res) => {});
  },

  created() {},

  methods: {
    // 切换下一组监控
    nextvedio() {
      // 全部播完监控之后，从头开始出现轮巡
      if (this.layoutnumtoo == this.allvediolist.length) {
        this.i = 0;
        this.layoutnumtoo = this.layoutNum;
        for (this.i = 0; this.i < this.layoutNum; this.i++) {
          this.$bus.$emit(
            "playhistoryvedio",
            this.allvediolist[this.i].serviceId,
            this.allvediolist[this.i].name
          );
        }
        return;
      }
      this.i = this.layoutnumtoo; // 赋值，切换起始播放索引
      this.layoutnumtoo = this.layoutnumtoo + this.layoutNum; // 赋值，切换起始播放索引最大值
      if (this.layoutnumtoo >= this.allvediolist.length) {
        this.layoutnumtoo = this.allvediolist.length; // 防止超出最大值
      }
      // 播放下一组
      for (this.i; this.i < this.layoutnumtoo; this.i++) {
        this.$bus.$emit(
          "playhistoryvedio",
          this.allvediolist[this.i].serviceId,
          this.allvediolist[this.i].name
        );
      }
    },
    // 切换到上一组监控
    prevedio() {
      this.i = this.i - this.layoutNum * 2;
      if (this.i <= 0) {
        this.i = 0;
      } // 防止出现负数索引
      this.layoutnumtoo = this.layoutnumtoo - this.layoutNum;
      if (this.layoutnumtoo <= this.layoutNum) {
        this.layoutnumtoo = this.layoutNum;
      }
      // 播放下一组
      for (this.i; this.i < this.layoutnumtoo; this.i++) {
        this.$bus.$emit(
          "playhistoryvedio",
          this.allvediolist[this.i].serviceId,
          this.allvediolist[this.i].name
        );
      }
    },
    // 开始轮巡
    pollingstart(time) {
      window.timer = setInterval(() => {
        this.nextvedio();
      }, time * 1000);
    },
    // 删除/添加 平铺
    activeclose(bol) {
      this.pagenext = bol;
      let i = 0;
      if (bol) {
        // 删除平铺
        this.playerBtnGroup.pop();
      } else {
        this.playerBtnGroup.forEach((item) => {
          if (item.name == "平铺") {
            i = 1;
          }
        });
        if (i == 0) {
          // 表示没有有平铺选项，需添加
          this.playerBtnGroup.push({
            num: 99,
            name: "平铺",
            command: "a",
          });
        }
      }
    },

    switchOrg(orgId, starFlag, fullParentPath) {
      this.currentOrgId = orgId;
      this.orgPath = fullParentPath;
      this.starFlag = starFlag;
    },
    collectionvedio() {
      console.log(222, this.currentOrgId);
      const param = { orgId: this.currentOrgId };
      if (!this.starFlag) {
        orgStarAdd(param).then(() => {
          this.starFlag = true;
          // 投递事件给关注列表重新拉取数据
          this.$bus.$emit("againconcerninfo");
        });
      } else {
        orgStarDelete(param).then(() => {
          this.starFlag = false;
          // 投递事件给关注列表重新拉取数据
          this.$bus.$emit("againconcerninfo");
        });
      }
    },
    requestPlay(serviceId, deviceName) {
      if (!this.showcovers) {
        return;
      }

      this.$nextTick(() => {
        this.$refs.hlsVideoPlayer.requestPlay(serviceId, deviceName);
      });
    },

    // 双击全屏
    fullscreen() {
      var el = document.getElementById("videoPlayers");
      if (this.isFull) {
        this.isFull = false;
        if (el.exitFullscreen) {
          el.exitFullscreen();
        } else if (el.mozCancelFullScreen) {
          el.mozCancelFullScreen();
        } else if (el.webkitCancelFullScreen) {
          el.webkitCancelFullScreen();
        }
      } else {
        this.isFull = true;
        if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        } else if (el.requestFullscreen) {
          el.requestFullscreen();
        }
      }
    },

    // 分栏管理选中改变
    changeLayout({ name, num }) {
      this.layoutName = name;
      this.layoutNum = num;
      if (num == 99) {
        this.showcovers = false;

        this.$emit("switchDeviceListLayout");
        this.$nextTick(() => {
          this.$refs.videoList.init(this.currentOrgId);
        });
      } else {
        this.showcovers = true;
        // 当前分栏重复选择
        this.$emit("showRightSide");

        // 赋值页面的窗口数
        this.$nextTick(() => {
          this.$refs.hlsVideoPlayer.layoutNum = num;
        });
      }
    },

    getPlayerLengthDisplayName() {
      var displayName = "unkown";
      this.playerBtnGroup.forEach((element) => {
        if (element.num == this.layoutNum) {
          displayName = element.name;
        }
      });
      return displayName;
    },
  }, // -- methods
};
</script>

<style lang="less" scoped>
.pos-right {
  position: absolute;
  right: 38px;
  top: 310px;
  font-size: 25px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #000000;
  text-align: center;
  line-height: 48px;
  opacity: 0.5;
  cursor: pointer;
  z-index: 999;
}
.pos-left {
  position: absolute;
  left: 38px;
  top: 310px;
  font-size: 25px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #000000;
  text-align: center;
  line-height: 48px;
  opacity: 0.5;
  cursor: pointer;
  z-index: 999;
}
.elrows {
  height: 100%;
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

::v-deep .text-center .player-btn-group .el-button--primary {
  color: #feffff;
  /* background: #ffffff; */
  border: 1px solid #00a99c !important;
  background-color: #00a99c;
}

::v-deep .el-dropdown-menu__item .el-button {
  background-color: #3b3b3d;
  color: white;
  border: 0;
  border-radius: 0;
  width: 100%;

  &:hover {
    color: #3bb0e4;
  }
}

.el-popper {
  background-color: #3b3b3d !important;
  border: 0 !important;
  ::v-deep .popper__arrow {
    border-bottom-color: #3b3b3d;
  }

  ::v-deep .popper__arrow::after {
    border-bottom-color: #3b3b3d !important;
  }
}

.el-dropdown-menu--medium {
  width: 85px;
  .el-dropdown-menu__item {
    padding: 0;
  }
  .popper__arrow {
    border-bottom-color: #3b3b3d;
  }
}

.el-dropdown-menu__item {
  padding: 0;
}

.text-center {
  text-align: right;
  // width: 81.4%;
  /* margin-left: 56%; */
}

.video {
  height: 60%;
}

.list {
  width: 14vw;
  position: relative;
  margin-bottom: 10px;
}

.list div {
  overflow: hidden;
}

// 右侧标签样式

::v-deep .root .demo-tools {
  height: 0;
}

a {
  text-decoration: none;
}

.fullscreen {
  width: 100% !important;
}

.player-btn-group {
  margin: 5px 0;

  .el-button--primary {
    color: #337ab7;
    background: #ffffff;
    border: 1px solid #dcdfe6 !important;
  }

  .active {
    background-color: darken(#567, 10%);
    color: #ffffff;
  }
}

#tab-tree-wrapper {
  @media screen and (max-width: 992px) {
    min-height: 200px;
  }
}

#screen-sticky > #screen-sticky-bottom {
  display: none;
}

#screen-sticky-wrapper.sticky > #screen-sticky > #screen-sticky-bottom {
  display: block;
}
</style>

<!-- ptz style -->
<style lang="less" scoped>
.settings-block {
  margin: 30px auto;
  text-align: center;
}

.ptz-block {
  width: 150px;
  height: 180px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  font-size: 24px;

  .ptz-cell {
    width: 50px;
    height: 50px;
    line-height: 50px;
    position: absolute;
  }

  .ptz-cell.active {
    color: #ccc;
    font-size: 26px;
  }

  .ptz-cell.readonly {
    color: #ddd;
  }

  .fa-microphone,
  .fa-microphone-slash {
    padding: 10px 13px;
    border-radius: 25px;
  }

  .fa-microphone.active {
    color: #fff;
  }

  .fa-microphone.readonly {
    color: #ddd;
  }

  .fa-microphone-slash.readonly {
    color: #ddd;
  }

  .mic-level-bar {
    position: absolute;
    transform: rotate(-90deg);
    width: 100%;
    top: 70px;
    left: -80px;
  }

  .ptz-center {
    width: 50px;
    height: 50px;
    top: 50px;
    left: 50px;
    line-height: 50px;
    border-radius: 25px;
    background-color: #ccc;
  }

  .ptz-up {
    top: 0;
    left: 50px;
  }

  .ptz-left {
    top: 50px;
    left: 0;
  }

  .ptz-right {
    top: 50px;
    left: 100px;
  }

  .ptz-down {
    top: 100px;
    left: 50px;
  }

  .ptz-zoomin {
    top: 150px;
    left: 20px;
  }

  .ptz-zoomout {
    top: 150px;
    left: 80px;
  }

  .ptz-talk {
    top: 150px;
    left: 50px;
  }

  .ptz-up,
  .ptz-left,
  .ptz-right,
  .ptz-down,
  .ptz-center > .fa-microphone,
  .ptz-zoomin,
  .ptz-talk > .fa-microphone,
  .ptz-zoomout {
    cursor: pointer;

    &.readonly {
      cursor: auto;
    }
  }
}

.video-show {
  .el-icon-star-off {
    cursor: pointer;
    font-size: 17px;
  }

  .el-icon-star-on {
    cursor: pointer;
    color: rgb(196, 123, 35);
    font-size: 17px;
  }
}
</style>

<style lang="less">
.ptz-block {
  .mic-level-bar {
    .el-progress-bar__outer {
      background-color: #ddd !important;
    }
  }
}

.fullscreen {
  & > .video {
    &.col-sm-12 {
      height: 100%;
    }

    &.col-sm-6 {
      height: 50%;
    }

    &.col-sm-4 {
      height: 33.33%;
    }

    &.col-sm-3 {
      height: 25%;
    }

    & > .player-wrapper {
      height: 100%;

      .video-wrapper {
        padding-bottom: 0 !important;
        height: 100%;
      }
    }
  }
}

/* 整个滚动条 */
#screen-sticky ::-webkit-scrollbar {
  /* 对应纵向滚动条的宽度 */
  width: 4px;
  /* 对应横向滚动条的宽度 */
  height: 4px;
}

/* 滚动条上的滚动滑块 */
#screen-sticky ::-webkit-scrollbar-thumb {
  background-color: #666768;
  border-radius: 32px;
}

/* 滚动条轨道 */
#screen-sticky ::-webkit-scrollbar-track {
  background-color: #00a99c;
  border-radius: 32px;
  // margin-right: 10px;
}
</style>
