<template>
  <div class="controin">
    <div class="left">
      <el-menu
        :default-active="menuIndex"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="selectMenu"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-sunrise-1" />
            <span style="font-weight: 600">告警事件</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">全部事件</el-menu-item>
            <el-menu-item index="1-2">入侵告警</el-menu-item>
            <el-menu-item index="1-3">人脸告警</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="2">
          <template slot="title">
            <i class="el-icon-chat-dot-square" />
            <span style="font-weight: 600">MAS短信</span>
          </template>
        </el-menu-item>

        <el-menu-item index="3" @click="showAlarmSetting = true">
          <template slot="title">
            <i class="el-icon-setting" />
            <span style="font-weight: 600">告警设置</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <div class="right-top">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>事件联动</el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="
              breadCrumbs == '1-1' ||
              breadCrumbs == '1-2' ||
              breadCrumbs == '1-3'
            "
            >告警事件</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="breadCrumbs == '1-1'">
            全部事件</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="breadCrumbs == '1-2'">
            入侵告警</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="breadCrumbs == '1-3'">
            人脸告警</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="breadCrumbs == '2'"
            >MAS短信</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="breadCrumbs == '3'"
            >告警设置</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <warning v-if="showMenu == '1-1'" ref="warn" />
      <masNode v-if="showMenu == '2'" />
      <alarmSetting v-if="showMenu == '3'" />
    </div>
  </div>
</template>

<script>
import warning from "./compents/warning.vue";
import masNode from "./compents/masNode.vue";
import alarmSetting from "./compents/alarmSetting.vue";
export default {
  components: { warning, masNode, alarmSetting },
  data() {
    return {
      showMenu: "1-1", // 当前展示
      menuIndex: "1-1",
      breadCrumbs: "1-1", // 面包屑
    };
  },
  computed: {},
  created() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose() {},
    // 菜单激活回调
    selectMenu(index) {
      this.breadCrumbs = index;
      if (index == "1-1") {
        // 全部告警
        this.showMenu = "1-1";
        this.$refs.warn.resetState();
        this.$refs.warn.ruleForm.warnType = "";
        this.$refs.warn.searchlist();
      } else if (index == "1-2") {
        // 入侵告警
        this.showMenu = "1-1";
        this.$refs.warn.resetState();
        this.$refs.warn.ruleForm.warnType = "1";
        this.$refs.warn.searchlist();
      } else if (index == "1-3") {
        // 人脸告警
        this.showMenu = "1-1";
        this.$refs.warn.resetState();
        this.$refs.warn.ruleForm.warnType = "2";
        this.$refs.warn.searchlist();
      } else if (index == "2") {
        this.showMenu = "2";
      } else if (index == "3") {
        this.showMenu = "3";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.controin {
  display: flex;
  min-height: calc(100vh - 50px);
  background-color: #fff;
  .left {
    width: 15%;
    .el-menu-vertical-demo {
      background-color: #fff !important;
      height: 100%;
      li {
        .el-menu--inline {
          .el-menu-item-group {
            background-color: #fff;
            ::v-deep .el-menu-item-group__title {
              padding: 0;
            }
            .el-menu-item {
              padding-left: 60px !important;
            }
          }
        }
      }
    }
  }
  .right {
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px 10px;
  }
  ::v-deep .el-menu-item.is-active {
    background-color: #f1f3fd;
    color: #1790ff;
  }
}
::v-deep .el-menu {
  overflow: hidden;
}
</style>
