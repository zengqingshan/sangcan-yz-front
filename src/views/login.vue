<template>
  <div class="login">
    <div class="login-icon">
      <div class="login-icon-img"></div>
    </div>
    <div class="right-container">
      <!-- <div class="login-title">
        {{ configList.login_page_title }}
      </div>
      <div class="second-title">
        {{ configList.login_page_describe }}
      </div> -->
      <loginView
        v-if="loginPageFlag"
        v-on:jumpRegister="handleShowRegisterPage"
        :configList="configList"
        ref="login"
      />

      <register v-else v-on:jumpLogin="handleShowLoginPage"></register>
    </div>
    <!--  底部  -->
    <div v-if="configList.copyright_company" class="el-login-footer">
      <span>©{{ configList.copyright_company }} 版权所有</span>
    </div>
  </div>
</template>

<script>
import { getConfigList } from "@/api/system/config";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import register from "./register";
import loginView from "./loginView";
import store from "@/store";

export default {
  name: "Login",
  components: {
    register,
    loginView,
  },

  data() {
    return {
      loginPageFlag: true,

      redirect: undefined,
      configList: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getConfig();
  },
  methods: {
    handleShowLoginPage() {
      this.loginPageFlag = true;
    },
    handleShowRegisterPage() {
      this.loginPageFlag = false;
    },

    getConfig() {
      this.$store.dispatch("GetKvList").then(() => {
        this.configList = this.$store.state.dictionary.kvList;
        if (this.configList.rememberMe) {
          this.$refs.login.getCookie();
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  background-size: cover;
  overflow: auto;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100vh;
  background-image: url("../assets/images/login-video-bg1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .login-icon {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    width: 100%;
    height: 66px;

    padding-left: 43px;

    .login-icon-img {
      width: 100%;
      height: 33px;
      background-image: url(../assets/images/login-top.png);
      background-repeat: no-repeat;
    }
  }

  // .login-icon {
  //   height: 582px;
  //   width: 872px;
  //   margin-right: 295px;
  //   background-image: url("../assets/images/login-video-icon.png");
  //   background-size: 100% 100%;
  //   background-repeat: no-repeat;
  // }
}

.title {
  margin: 0px auto 20px auto;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
}

.right-container {
  padding-right: 185px;
  z-index: 99;

  .login-title {
    text-align: center;
    font-size: 52px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 4px 8px rgba(0, 33, 67, 0.3);
    margin-bottom: 10px;
  }

  .second-title {
    background-image: url("../assets/images/title.png");
    font-size: 28px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    line-height: 48px;
    letter-spacing: 2px;
    margin-bottom: 30px;
    text-align: center;
  }
}
</style>
