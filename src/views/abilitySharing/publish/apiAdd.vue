<template>
  <div class="content-wrap">
    <div class="content">
      <div class="title">Api详情</div>
      <div class="api-add">
        <el-steps :active="active" align-center>
          <el-step title="基本信息">
            <i class="common-icon iconfont icon-cart" slot="icon"></i>
          </el-step>
          <el-step title="定义API请求">
            <i class="common-icon iconfont icon-login" slot="icon"></i>
          </el-step>
          <el-step title="定义API后端服务">
            <i class="common-icon iconfont icon-wallet" slot="icon"></i>
          </el-step>
          <el-step title="定义返回结果">
            <i class="common-icon iconfont icon-check-circle" slot="icon"></i>
          </el-step>
        </el-steps>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form">
          <div v-show="active === 1">
            <el-form-item label="API名称" prop="apiName">
              <el-input show-word-limit maxlength="32" size="small" v-model="ruleForm.apiName"
                placeholder="请输入API名称"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="groupId">
              <el-select size="small" v-model="ruleForm.groupId" placeholder="请选择所属分类">
                <el-option v-for="item in options" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述信息" prop="describe">
              <el-input size="small" show-word-limit maxlength="128" v-model="ruleForm.describe" type="textarea" :rows="2"
                placeholder="请输入描述信息"></el-input>
            </el-form-item>
          </div>
          <div v-show="active === 2">
            <el-form-item label="请求Path" prop="outputPath">
              <el-input size="small" show-word-limit maxlength="225" v-model="ruleForm.outputPath"
                placeholder="请输入请求Path"></el-input>
              <div class="tip">请求Path必须包含请求参数中的Parameter Path，包含在[]中，比如/getuserlnfo/[userld]</div>
            </el-form-item>
            <el-form-item label="HTTP Method" prop="outputMethod">
              <el-radio-group size="small" v-model="ruleForm.outputMethod">
                <el-radio-button label="GET"></el-radio-button>
                <el-radio-button label="POST"></el-radio-button>
                <el-radio-button label="DELETE"></el-radio-button>
                <el-radio-button label="PUT"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div v-show="active === 3">
            <el-form-item label="后端服务协议" prop="insideProtocol">
              <el-radio-group size="small" v-model="ruleForm.insideProtocol">
                <el-radio-button label="HTTP"></el-radio-button>
                <el-radio-button label="HTTPS"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="后端服务地址" prop="insideAddress">
              <el-input size="small" show-word-limit maxlength="64" v-model="ruleForm.insideAddress"
                placeholder="请输入后端服务地址"></el-input>
              <div class="tip">后端服务地址指API网关调用底层服务时的域名或者IP，不包含Path</div>
              <div class="tip">不填写时，默认为本系统后端服务路由</div>
            </el-form-item>
            <el-form-item label="后端请求Path" prop="insidePath">
              <el-input size="small" show-word-limit maxlength="225" v-model="ruleForm.insidePath"
                placeholder="请输入后端请求Path"></el-input>
              <div class="tip">请求Path必须包含请求参数中的Parameter Path，包含在[]中，比如/getuserlnfo/[userld]</div>
            </el-form-item>
            <el-form-item label="后端超时时间" prop="timeout">
              <el-input size="small" placeholder="请输入内容" v-model.number="ruleForm.timeout">
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>

          </div>
          <div v-show="active === 4">
            <el-form-item label="返回结果示例" prop="retSuccess">
              <el-input size="small" show-word-limit maxlength="225" v-model="ruleForm.retSuccess" type="textarea"
                :rows="2" placeholder="返回结果示例"></el-input>
            </el-form-item>
            <el-form-item label="失败返回结果示例" prop="retFail">
              <el-input size="small" show-word-limit maxlength="225" v-model="ruleForm.retFail" type="textarea" :rows="2"
                placeholder="失败返回结果示例"></el-input>
            </el-form-item>
          </div>
          <el-form-item class="form-btn">
            <el-button size="small" v-if="apiDetailBtnConfig[active].includes('prev')" @click="prev">上一步</el-button>
            <el-button size="small" v-if="apiDetailBtnConfig[active].includes('next')" @click="next"
              type="primary">下一步</el-button>
            <el-button size="small" v-if="apiDetailBtnConfig[active].includes('submit')" @click="submitForm('ruleForm')"
              type="primary">立即创建</el-button>
            <el-button size="small" @click="cancle">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import config from "./config";
import { shareAdd, shareGroup } from "@/api/abilitySharing/index";
import { isChinese } from "@/utils/validate.js";

export default {
  created () {
    this.getShareGroup();
  },
  data () {
    return {
      apiDetailBtnConfig: config.apiDetailBtnConfig,
      active: 1, // 第一步
      ruleForm: {
        apiName: null,
        groupId: null,
        describe: null,
        outputPath: null,
        outputMethod: "GET",
        insideProtocol: "HTTP",
        insideAddress: null,
        insidePath: null,
        timeout: null,
        retSuccess: null,
        retFail: null,
      },
      options: [],
      rules: {
        apiName: [
          {
            required: true,
            message: "请输入api名称",
            trigger: "change",
          },
          {
            validator: (rule, value, callback) => {
              var reg = /^\S*$/;
              if (!reg.test(value)) {
                return callback(new Error("禁止输入空格"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        groupId: [
          {
            required: true,
            message: "请选择所属分类",
            trigger: "change",
          },
        ],
        describe: [
          {
            required: true,
            message: "请填写描述信息",
            trigger: "change",
          },
        ],
        outputPath: [
          {
            required: true,
            message: "请输入请求Path",
            trigger: "change",
          },
          {
            validator: this.validPath,
            trigger: "change",
          },
        ],
        outputMethod: [
          {
            required: true,
            message: "请输入HTTP Method",
            trigger: "change",
          },
        ],
        insideProtocol: [
          {
            required: true,
            message: "请输入后端服务协议",
            trigger: "change",
          },
        ],
        insideAddress: [
          {
            validator: this.validChinese,
            trigger: "change",
          },
        ],
        insidePath: [
          {
            required: true,
            message: "请输入后端请求Path",
            trigger: "change",
          },
          {
            validator: this.validPath,
            trigger: "change",
          },
        ],
        timeout: [
          {
            required: true,
            message: "请输入后端超时时间",
            trigger: "change",
          },
          { type: "number", message: "时间必须为数字值" },
        ],
      },
    };
  },
  methods: {
    // path校验
    validPath (rule, value, callback) {
      if (isChinese(value)) {
        return callback(new Error("禁止输入汉字"));
      } else if (value[0] !== "/") {
        return callback(
          new Error("格式错误，例：/getUserInfo/[userId]")
        );
      } else {
        callback();
      }
    },
    // 中文校验
    validChinese (rule, value, callback) {
      if (isChinese(value)) {
        return callback(new Error("禁止输入汉字"));
      } else {
        callback();
      }
    },
    // 所属分类列表
    async getShareGroup () {
      const list = await shareGroup({});
      if (!list) return [];
      this.options = list;
    },
    // 上一步
    prev () {
      if (this.active-- < 2) this.active = 4;
    },
    // 下一步
    next () {
      if (this.active++ > 3) this.active = 1;
    },
    // 立即创建
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 创建
          const res = await shareAdd(this.ruleForm);
          if (!res) return {};
          this.msgSuccess("修改成功");
          this.$router.push({
            name: "Publish",
          });
        } else {
          this.msgError("请填写必填项");
          return false;
        }
      });
    },
    //  返回
    cancle () {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.content-wrap {
  height: calc(100vh - 50px);
  background: #f2f3f5;
  padding: 16px;

  .content {
    background: #fff;
    height: 100%;
    padding: 8px 0;
    overflow: auto;
    display: flex;
    flex-direction: column;

    .title {
      color: #262626;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
      padding: 0 16px 8px 16px;
    }

    .api-add {
      padding: 24px 0;

      .common-icon {
        font-size: 25px;
      }

      .form {
        width: 500px;
        margin: 0 auto;
        padding: 50px 0;

        .tip {
          color: #c0c4cc;
          font-size: 12px;
        }

        .form-btn {
          position: absolute;
          bottom: 0;
          padding-bottom: 44px;
        }
      }
    }
  }
}
</style>
<style scoped>
/deep/.el-step__icon.is-text {
  border: none;
}

/deep/.el-step__title.is-process {
  font-weight: normal;
}

/deep/.el-step__title.is-finish {
  font-weight: bold;
}

/deep/.el-step__line {
  margin: 0 70px !important;
  background-color: #d9d9d9;
}

/deep/.el-step__title.is-wait {
  color: #bfbfbf;
}

/deep/.el-step__title.is-process {
  color: #bfbfbf;
}

/deep/.el-step__head.is-process {
  color: #bfbfbf;
}</style>