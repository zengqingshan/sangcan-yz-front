<template>
  <div style="position: relative">
    <div class="left-menu">
      <el-dropdown trigger="click" style="margin-left: 30px">
        <div>
          <div>
            <span style="color: white">
              {{ tenantName }}
            </span>
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" style="margin-left: 2%">
          <!-- <el-input style="margin-bottom: 20px; margin-top: 20px;" v-model="input" placeholder="请输入关键字"></el-input> -->
          <template v-for="(item, index) in $store.getters.tenantList">
            <el-dropdown-item
              style="width: 300px"
              @click.native="switchTenant(item)"
            >
              <div style="position: relative">
                <span v-if="item.isLogined">
                  <svg
                    style="
                      color: rgb(36, 26, 229);
                      position: absolute;
                      top: 20%;
                      left: -2%;
                    "
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="check"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                    />
                  </svg>
                </span>
                <span style="margin-left: 20px">{{ item.tenant.name }}</span>
                <span style="float: right; color: #c8c8c8">{{
                  getRoleName(item)
                }}</span>
              </div>
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="navbar">
      <breadcrumb
        v-if="!topNav"
        id="breadcrumb-container"
        class="breadcrumb-container"
      />

      <top-nav id="topmenu-container" class="topmenu-container" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Cookies from "js-cookie";
import { userSwitchTenant } from "@/api/system/user";
export default {
  components: {
    Breadcrumb,
    TopNav,
  },

  computed: {
    ...mapGetters(["sidebar", "name", "device"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    tenantName: {
      get() {
        return sessionStorage.getItem("tenantName");
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  data() {
    return {
      input: "",
    };
  },
  watch: {
    tenantName: {
      handler: (newValue) => {},
      immediate: true,
    },
  },
  methods: {
    getRoleName(item) {
      if (!item.role) {
        return "未知";
      }
      if (item.tenant.adminUser == this.$store.getters.user.userName) {
        return "超级管理员";
      }
      return item.role.name;
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => {});
    },

    switchTenant(tenant) {
      userSwitchTenant(tenant.tenant.id).then((ret) => {
        this.$router.go(0);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep
  [data-v-35f3a2c1]
  .el-menu--horizontal
  > .el-submenu
  .el-submenu__title {
  line-height: 43px;
  // display: flex;
  // flex-direction: row-reverse
}
::v-deep #dropdown-menu-6351 {
  margin-left: 10%;
}
.left-menu {
  float: left;
  height: 100%;
  line-height: 50px;
  background-color: #00a99c;

  &:focus {
    outline: none;
  }

  .left-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 14px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #00a99c;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    // line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
