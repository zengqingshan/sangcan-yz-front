<template>
  <div style="background-color: #00a99c; width: 100%; height: 42vw" class="row">
    <div class="view-list" style="padding-left: 15px; height: 97%">
      <div class="row" style="width: 100%; display: flex">
        <div v-show="showleft" class="left-side">
          <LeftSide
            @deviceNodeClicked="leftSideDeviceNodeClicked"
            @orgNodeClicked="leftSideOrgNodeClicked"
          />
        </div>
        <div class="middle-side" :style="{ width: calcWidthMiddle }">
          <i
            :class="{
              'el-icon-d-arrow-left': showleft,
              'el-icon-d-arrow-right': !showleft,
              'icon-left': true,
            }"
            @click="showvedio"
          />
          <MiddleSide
            ref="middleSide"
            style="width=95%"
            @switchDeviceListLayout="switchDeviceListLayout"
            @showRightSide="showRightSide"
          />
          <i
            v-show="showRightBar"
            :class="{
              'el-icon-d-arrow-right': showright,
              'el-icon-d-arrow-left': !showright,
              'icon-right': true,
            }"
            @click="showvedior"
          />
        </div>
        <div
          v-show="showright"
          class="right-side"
          :style="{ width: calcWidthRight }"
        >
          <RightDeviceImageList
            ref="rightDeviceList"
            @deviceClicked="rightDeviceItemClicked"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parentOrgTreeList, listPageStarOrg } from "@/api/system/org";
import { deviceParentOrgTreeList } from "@/api/system/device";
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

import { component as VueContextMenu } from "@penggy/vue-context-menu";

import Searchjigou from "./components/searchjigou.vue";
import Searchshebei from "./components/searchshebei.vue";
import Covervedio from "./components/covervedio.vue";
import RightDeviceImageList from "./right.vue";
import LeftSide from "./left.vue";
import MiddleSide from "./middle.vue";
export default {
  components: {
    VueContextMenu,
    VideoPlayers,
    Searchjigou,
    Searchshebei,
    Covervedio,
    RightDeviceImageList,
    LeftSide,
    MiddleSide,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.query.protocol) {
        vm.protocol = to.query.protocol;
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  data() {
    return {
      showleft: true,
      showright: true,
      showRightBar: true,
      currentOrgId: undefined,

      currentOrgId: undefined,
      pnode: null,

      level: 0,
    };
  },
  computed: {
    calcWidthMiddle(item) {
      if (this.showleft && this.showright) {
        return "calc(100% - 300px - 240px)";
      } else if (!this.showleft && this.showright) {
        return "calc(100% - 300px)";
      } else if (this.showleft && !this.showright) {
        return "calc(100% - 220px)";
      } else if (!this.showleft && !this.showright) {
        return "100%";
      }
    },
    calcWidthLeft() {
      if (this.showleft) {
        return "300px";
      }
    },
    calcWidthRight(item) {
      if (this.showright) {
        return "240px";
      }
    },
  },

  watch: {},
  mounted() {
    $(document).on("expanded.pushMenu collapsed.pushMenu", this.updateSticky);
    // $('#screen-sticky').sticky({ bottomSpacing: 40 })

    this.$dragging.$on("dragend", (res) => {});

    // 此事件总线沿用右侧组件菜单逻辑
    this.$bus.$on("playhistoryvedio", (serviceId, deviceName) => {
      this.$refs.middleSide.requestPlay(serviceId, deviceName);
    });
  },

  created() {
    this.currentOrgId = this.rootOrgId;
  },
  beforeDestroy() {
    $('a[href="#group-tree-wrapper"').off("shown.bs.tab").off("hidden.bs.tab");

    $(document).off("expanded.pushMenu collapsed.pushMenu", this.updateSticky);
    $("#screen-sticky").unstick();
  }, // -- methods
  methods: {
    showRightSide() {
      this.showright = true;
      this.showRightBar = true;
      this.showcovers = true;
    },
    switchDeviceListLayout() {
      this.showright = false;
      this.showRightBar = false;
      this.showcovers = false;
    },
    leftSideDeviceNodeClicked(seviceId, deviceName) {
      const param = { serviceId: seviceId };
      deviceParentOrgTreeList(param).then((ret) => {
        let fullParentOrgPath = "";

        if (ret.length > 0) {
          for (let i = 0; i < ret.length; i++) {
            if (i != 0) {
              fullParentOrgPath += ">";
            }
            const org = ret[i];

            fullParentOrgPath += org.name;
          }

          this.$refs.middleSide.switchOrg(
            ret[ret.length - 1].id,
            ret[ret.length - 1].starFlag,
            fullParentOrgPath
          );
        }
      });

      this.$refs.middleSide.requestPlay(seviceId, deviceName);
    },
    leftSideOrgNodeClicked(orgId, onlineNum, deviceNum) {
      const param = { orgId: orgId };
      parentOrgTreeList(param).then((ret) => {
        let fullParentOrgPath = "";
        let onlineNum = 0;
        let deviceNum = 0;
        let starFlag = false;
        if (ret.length > 0) {
          for (let i = 0; i < ret.length; i++) {
            if (i != 0) {
              fullParentOrgPath += ">";
            }
            const org = ret[i];
            if (org.id == orgId) {
              onlineNum = org.onelineNum;
              deviceNum = org.deviceNum;
              starFlag = org.starFlag;
            }

            fullParentOrgPath += org.name;
          }

          this.$refs.middleSide.switchOrg(orgId, starFlag, fullParentOrgPath);
          this.$refs.rightDeviceList.init(orgId, onlineNum, deviceNum);
        }
      });
    },

    showvedio() {
      if (this.showleft == true) {
        this.showleft = false;
      } else {
        this.showleft = true;
      }
    },
    showvedior() {
      if (this.showright == true) {
        this.showright = false;
      } else {
        this.showright = true;
      }
    },

    rightDeviceItemClicked(serviceId, deviceName) {
      this.$refs.middleSide.requestPlay(serviceId, deviceName);
    },
  },
};
</script>

<style lang="less" scoped>
.icon-left {
  margin: auto;
  z-index: 99;
  position: absolute;
  cursor: pointer;
  left: -17px;
  top: 50%;
  color: white;
  padding: 10px 0px;
  background-color: #414549;
  border-top-left-radius: 7px;
  border-bottom-left-radius: 7px;
}

.icon-right {
  z-index: 999;
  position: absolute;
  cursor: pointer;
  right: -16px;
  color: white;
  margin: auto;
  top: 50%;
  padding: 10px 0px;
  background-color: #414549;
  border-top-right-radius: 7px;
  border-bottom-right-radius: 7px;
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

.icon-seting {
  display: flex;
  justify-content: space-around;
  color: white;
  font-size: 18px;
  width: 90%;
  margin-top: 15px;
}

.left-side {
  position: relative;
  height: 100%;
  margin-right: 20px;
  background-color: #2c2d2f !important;
}

.middle-side {
  position: relative;
  flex: 1;
}

.right-side {
  margin-top: 14px;
  margin-left: 20px;
  float: left;
  position: relative;
}

// ::v-deep .el-input--medium .el-input__inner {
//   margin-top: -8px;
//   margin-left: -15px;
//   height: 35px;
//   width: 200px;
// }

// ::v-deep .el-input__prefix {
//   position: absolute;
//   height: 100%;
//   left: -9px;
//   top: -9px;
// }

.clearfix {
  color: white;
  margin-top: 5px;

  .cleardiv {
    display: flex;
    justify-content: space-between;

    .right {
      width: 25%;
      display: flex;
      justify-content: space-around;

      span {
        i {
          margin-right: 3px;
        }
      }
    }
  }
}

#app .main-container {
  height: 100%;
}

::v-deep .app-main {
  min-height: calc(97vh - 50px);
  height: 90%;
}

::v-deep .text-center .player-btn-group .el-button--primary {
  color: #feffff;
  /* background: #ffffff; */
  border: 1px solid #00a99c !important;
  background-color: #00a99c;
}

.text-center {
  text-align: right;
  width: 81.4%;
  /* margin-left: 56%; */
}

.video {
  height: 60%;
}

.scroll-list {
  ::v-deep .el-button--medium {
    margin-left: 20%;
  }
}

.list {
  width: 14vw;
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

.app-main {
  background-color: #272727;
}

.row-left {
  //width: 13%;
  font-size: 16px;
  //position: absolute;
  //left: 17%;
  //z-index: 999;
  color: white;
  top: 41px;
  //display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.hidden-xs {
  margin-bottom: -98px;
  margin-top: -25px;
}

.showvedio {
  position: absolute;
  left: 63vw;
  width: 15vw;
  margin-top: -24px;
}

.showvedio .vedio-top {
  text-align: right;
  margin-bottom: 5px;
  color: white;
}

.showvedio .vedio-bottom div {
  height: 120px;
  border: 1px solid gray;
  position: relative;
  margin-bottom: 10px;
  background: url("./assets/images/bgo.jpg");
  background-size: cover;
}

.vedio-bottom div .el-icon-upload {
  position: absolute;
  left: 2%;
  top: 2%;
  color: #7474ef;
  font-size: 18px;
}

.vedio-bottom div .el-icon-star-on {
  position: absolute;
  right: 2%;
  bottom: 2%;
  color: #ffffff;
  font-size: 16px;
}

.vedio-bottom div span {
  position: absolute;
  bottom: 0;
  left: 3%;
  color: white;
}

// 右侧标签样式

::v-deep .root .demo-tools {
  height: 0;
}

.right-menu {
  position: fixed;
  background: #fff;
  border: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 999;
  display: none;
}

.right-menu a {
  width: 100px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: #1a1a1a;
}

.right-menu a:hover {
  background: #eee;
  color: #fff;
}

.right-menu {
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
}

a {
  text-decoration: none;
}

.right-menu a {
  padding: 2px;
}

.right-menu a:hover {
  background: #337ab7;
}

.view-list {
  display: flex;
  justify-content: flex-start;

  .row {
    margin-left: 0;
    margin-right: 0;
  }

  .nav.nav-tabs > li {
    a {
      background-color: transparent;
    }

    &.active {
      a {
        background-color: darken(#ecf0f5, 5%);
      }
    }
  }
}
</style>
