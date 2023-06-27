<template>
  <div class="login-form">
    <h3 class="title"></h3>
    <el-tabs v-model="activeName">
      <el-tab-pane label="密码登录" name="first">
        <el-form
          ref="passwdLoginForm"
          :model="passwdLoginForm"
          :rules="passwdLoginRules"
        >
          <el-form-item prop="username">
            <el-input
              v-model="passwdLoginForm.username"
              type="text"
              auto-complete="off"
              placeholder="请输入用户名"
            >
              <img
                slot="prefix"
                src="../assets/images/user1.png"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="passwdLoginForm.password"
              type="password"
              auto-complete="off"
              placeholder="请输入密码"
              @keyup.enter.native="handlePasswdLogin"
            >
              <img
                slot="prefix"
                src="../assets/images/pwd1.png"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
          <el-form-item v-if="captchaOnOff" prop="code" style="border: ">
            <el-input
              v-model="passwdLoginForm.code"
              auto-complete="off"
              placeholder="请输入验证码"
              style="width: 100%; margin-bottom: 24px"
              @keyup.enter.native="handlePasswdLogin"
            >
              <img
                slot="prefix"
                src="../assets/images/code1.png"
                class="el-input__icon input-icon"
              />
              <template #suffix>
                <div class="login-code">
                  <img :src="codeUrl" class="login-code-img" @click="getCode" />
                </div>
              </template>
            </el-input>
          </el-form-item>
          <el-checkbox
            v-if="configList.remember_me === 'true'"
            v-model="passwdLoginForm.rememberMe"
            style="margin: 0px 0px 25px 0px"
            >记住密码</el-checkbox
          >
          <el-form-item style="width: 100%; height: 60px">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="
                width: 100%;
                font-size: 24px;
                border-radius: 100px;
                height: 60px;
              "
              @click.native.prevent="handlePasswdLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
          <div style="font-size: 16px">
            没有账号？

            <el-button
              type="text"
              @click.native.prevent="handleRegisterPage"
              style="font-size: 16px"
            >
              <span>去注册</span>
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="验证码登录" name="second">
        <el-form
          ref="smsLoginForm"
          :model="smsLoginForm"
          :rules="smsLoginRules"
        >
          <el-form-item prop="phone">
            <el-input
              v-model="smsLoginForm.phone"
              type="text"
              auto-complete="off"
              placeholder="请输入手机号"
            >
              <img
                slot="prefix"
                src="../assets/images/user1.png"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>

          <el-form-item prop="smscode">
            <el-input
              v-model="smsLoginForm.smscode"
              auto-complete="off"
              placeholder="请输入短信验证码"
              style="width: 100%"
              oninput="value=value.replace(/[^\d]/g,'')"
              @keyup.enter.native="handleSmsLogin"
            >
              <img
                slot="prefix"
                src="../assets/images/code1.png"
                class="el-input__icon input-icon"
              />
              <template #suffix>
                <el-button
                  style="line-height: 50px"
                  v-show="loginSmsShow"
                  type="text"
                  class="code"
                  @click.prevent="getSmsCodeMethod()"
                  >获取短信验证码</el-button
                >
                <el-button
                  v-show="!loginSmsShow"
                  type="text"
                  class="code"
                  style="line-height: 50px"
                  >{{ smsCount }}秒后重试</el-button
                >
              </template>
            </el-input>
          </el-form-item>

          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="
                width: 100%;
                font-size: 24px;
                margin-top: 20px;
                border-radius: 100px;
                height: 60px;
              "
              @click.native.prevent="handleSmsLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>

          <div style="font-size: 16px">
            没有账号？

            <el-button
              type="text"
              @click.native.prevent="handleRegisterPage"
              style="font-size: 16px"
            >
              <span>去注册</span>
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InitializationDictionary from "@/utils/DictionaryManagement";
import { getCodeImg, getSmsCode } from "@/api/login";
import { getConfigList } from "@/api/system/config";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import register from "./register";
import store from "@/store";

export default {
  name: "Login",
  props: {
    configList: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      loginSmsShow: true,

      smsCount: "",
      loginPageFlag: true,

      activeName: "first",
      codeUrl: "",
      cookiePassword: "",
      passwdLoginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      smsLoginForm: {
        smscode: "",
        phone: "admin",
      },

      passwdLoginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "用户名不能为空",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "密码不能为空",
          },
        ],
        code: [
          {
            required: true,
            trigger: "change",
            message: "验证码不能为空",
          },
        ],
      },
      smsLoginRules: {
        phone: [
          {
            required: true,
            trigger: "blur",
            message: "手机号不能为空",
          },
        ],
        smscode: [
          {
            required: true,
            trigger: "blur",
            message: "短信验证码不能为空",
          },
        ],
      },
      loading: false,
      captchaOnOff: true,
      redirect: undefined,
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
    this.getCode();
  },
  methods: {
    handleRegisterPage() {
      this.$emit("jumpRegister");
    },
    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff =
          res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.passwdLoginForm.uuid = res.uuid;
        }
      });
    },

    // 获取短信验证码
    getSmsCodeMethod() {
      if (this.validatePhone()) {
        this.vaTime();
        const params = { phone: this.smsLoginForm.phone, type: "1" };
        getSmsCode(params)
          .then((res) => {
            if (res.code === 200) {
              this.$message({
                message: "验证码已发送成功",
                type: "success",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    // 判断手机号是否合法
    validatePhone() {
      if (this.smsLoginForm.phone == "admin") {
        return true;
      }
      if (!this.smsLoginForm.phone) {
        this.$message({
          message: "手机号码不能为空",
          type: "error",
        });
      } else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.smsLoginForm.phone)) {
        this.$message({
          message: "请输入正确的手机号",
          type: "error",
        });
      } else {
        return true;
      }
    },
    // 验证码倒计时
    vaTime() {
      this.smsCount = 10;
      this.loginSmsShow = false;
      let timer = 0;
      timer = setInterval(() => {
        if (this.smsCount > 0 && this.smsCount <= 120) {
          this.smsCount--;
        } else {
          this.loginSmsShow = true;
          clearInterval(timer);
          timer = 0;
        }
      }, 1000);
    },

    getCookie() {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      const rememberMe = localStorage.getItem("rememberMe");
      this.passwdLoginForm = {
        username: username ? decrypt(username) : "",
        password: password ? decrypt(password) : "",
        rememberMe: rememberMe ? Boolean(rememberMe) : false,
      };
    },

    handlePasswdLogin() {
      this.$refs.passwdLoginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.passwdLoginForm.rememberMe) {
            localStorage.setItem(
              "username",
              encrypt(this.passwdLoginForm.username)
            );
            localStorage.setItem(
              "password",
              encrypt(this.passwdLoginForm.password)
            );
            localStorage.setItem("rememberMe", this.passwdLoginForm.rememberMe);
          } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            localStorage.removeItem("rememberMe");
          }
          this.$store
            .dispatch("Login", this.passwdLoginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {
                this.loading = false;
              });
              InitializationDictionary.dictData;
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
        }
      });
    },
    handleSmsLogin() {
      this.$refs.smsLoginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("smsLogin", this.smsLoginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {
                this.loading = false;
              });
              InitializationDictionary.dictData;
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  background-image: url(../assets/images/formIco.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 33px;
  margin-bottom: 20px;
}

.login-form {
  border-radius: 12px;
  background: #ffffff;
  background-size: cover;
  padding: 20px 47px 20px 43px;
  width: 100%;
  .el-input {
    height: 38px;
  }

  .input-icon {
    height: 24px;
    width: 24px;
    margin-left: 2px;
    margin-top: 22px;
    margin-right: 14px;
  }

  .el-checkbox__label {
    color: #ffffff;
  }

  .el-button--primary {
    background-color: #0080ff;
    border-color: #0080ff;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 36px;
}

.code {
  border: none !important;
}

::v-deep .el-form-item__content {
  line-height: 30px;
}

::v-deep .el-tabs__item {
  font-size: 20px;
  color: #1569ee;
}

::v-deep .el-tabs__nav-wrap::after {
  display: none;
}

::v-deep .el-input__inner {
  border: none;
  box-shadow: inset 0px -1px 0px 0px #e1e1e1;
  height: 72px;
  font-size: 20px;
  padding-left: 40px;
}
</style>
