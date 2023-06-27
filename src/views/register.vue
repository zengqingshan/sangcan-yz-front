<template>
  <div class="login-form">
    <h3 class="title"></h3>
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
      <el-form-item prop="phone">
        <el-input
          v-model="registerForm.phone"
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
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          show-password
          auto-complete="off"
          placeholder="请输入密码"
        >
          <img
            slot="prefix"
            src="../assets/images/pwd1.png"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          show-password
          auto-complete="off"
          placeholder="请确认密码"
        >
          <img
            slot="prefix"
            src="../assets/images/pwd1.png"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="smscode">
        <el-input
          v-model="registerForm.smscode"
          auto-complete="off"
          placeholder="请输入短信验证码"
          @keyup.enter.native="handleSmsLogin"
          oninput="value=value.replace(/[^\d]/g,'')"
        >
          <img
            slot="prefix"
            src="../assets/images/code1.png"
            class="el-input__icon input-icon"
          />
          <template #suffix>
            <el-button
              style="line-height: 50px"
              type="text"
              class="code"
              v-show="registerSmsShow"
              @click.prevent="getSmsCodeMethod()"
              >获取短信验证码</el-button
            >
            <el-button
              type="text"
              class="code"
              v-show="!registerSmsShow"
              style="line-height: 50px"
              >{{ smsCount }}秒后重试</el-button
            >
          </template>
        </el-input>
      </el-form-item>

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
            margin-top: 20px;
          "
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注册中...</span>
        </el-button>
      </el-form-item>
      <div style="font-size: 16px">
        已有账号，

        <el-button
          type="text"
          @click.native.prevent="handleJumpLoginPage"
          style="font-size: 16px"
        >
          去登录
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import InitializationDictionary from "@/utils/DictionaryManagement";
import { getCodeImg, getSmsCode } from "@/api/login";
import { getConfigList } from "@/api/system/config";
import { encrypt, decrypt } from "@/utils/jsencrypt";

import store from "@/store";

export default {
  name: "Login",
  data() {
    return {
      registerSmsShow: true,
      smsCount: "",

      registerForm: {
        smscode: "",
        password: "",
        phone: "15279153209",
        confirmPassword: "",
      },

      registerRules: {
        phone: [
          {
            required: true,
            trigger: "blur",
            message: "手机号不能为空",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "密码不能为空",
          },
        ],
        confirmPassword: [
          {
            required: true,
            trigger: "blur",
            message: "确认密码不能为空",
          },
        ],
        smscode: [
          {
            required: true,
            trigger: "change",
            message: "短信验证码不能为空",
          },
        ],
      },

      loading: false,
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
  created() {},
  methods: {
    // 获取短信验证码
    getSmsCodeMethod() {
      if (this.validatePhone() && this.validatePassword()) {
        this.vaTime();
        let params = { phone: this.registerForm.phone, type: "0" };
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
      if (!this.registerForm.phone) {
        this.$message({
          message: "手机号码不能为空",
          type: "error",
        });
      } else if (!/^1\d{10}$/.test(this.registerForm.phone)) {
        this.$message({
          message: "请输入正确是手机号",
          type: "error",
        });
      } else {
        return true;
      }
      return false;
    },
    // 判断密码是否合法
    validatePassword() {
      let pattern = new RegExp(
        "^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,16}$"
      );
      if (!this.registerForm.confirmPassword || !this.registerForm.password) {
        this.$message({
          message: "密码和确认密码不能为空",
          type: "error",
        });
      } else if (
        this.registerForm.password != this.registerForm.confirmPassword
      ) {
        this.$message({
          message: "密码与确认密码不一致，请重新输入",
          type: "error",
        });
      } else if (
        !pattern.test(this.registerForm.password) ||
        !pattern.test(this.registerForm.confirmPassword)
      ) {
        this.$message({
          message: "密码长度限制8~16位且必须包含大小写字母、数字及特殊符号",
          type: "error",
        });
      } else {
        return true;
      }
      return false;
    },
    // 验证码倒计时
    vaTime() {
      this.smsCount = 10;
      this.registerSmsShow = false;
      let timer = 0;
      timer = setInterval(() => {
        if (this.smsCount > 0 && this.smsCount <= 120) {
          this.smsCount--;
        } else {
          this.registerSmsShow = true;
          clearInterval(timer);
          timer = 0;
        }
      }, 1000);
    },

    handleJumpLoginPage() {
      this.$emit("jumpLogin");
    },
    handleRegister() {
      if (!this.validatePhone || !this.validatePassword) {
        return;
      }
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          this.$store
            .dispatch("Register", this.registerForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {
                this.loading = false;
              });
              InitializationDictionary.dictData;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    handleSmsLogin() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("smsLogin", this.registerForm)
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
