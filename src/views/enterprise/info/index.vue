<template>
  <div class="contron">
    <!-- 左侧菜单栏 -->
    <div class="left">
      <ul>
        <li
          v-for="(item, index) in lilist"
          :key="index"
          :class="{ activecls: activeindex == index }"
          @click="postion(index)"
        >
          <a id="hard">{{ item }}</a>
        </li>
      </ul>
    </div>
    <!-- 右侧详情 -->
    <div class="right">
      <!-- 注册信息 -->
      <div class="right-direct">
        <div>
          <p>注册信息</p>
          <div class="line" />
          <div class="right-name">
            <span class="name-spano">企业名称</span>
            <div class="name-info">
              <div v-if="showedit">
                <span>{{ value }}</span>
                <el-button @click="editqyinfo">修改</el-button>
              </div>
              <div v-else style="display: flex">
                <el-input v-model="valuecopy" />
                <el-button type="primary" @click="editqy">确定</el-button>
                <el-button @click="showedit = true">取消</el-button>
              </div>
            </div>
          </div>
          <!--<div class="right-code">
            <span class="code-one">企业编码</span>
            <p>{{ qycode }}</p>
          </div>-->
          <div class="right-code">
            <span class="code-one">创建时间</span>
            <p>{{ createtime }}</p>
          </div>
          <div class="right-code dirs">
            <span class="code-one">创建人</span>
            <p>{{ user }}</p>
          </div>
        </div>
      </div>

      <!-- 集客编码 -->
      <div v-if="false" class="right-direct">
        <div>
          <p style="position: relative">
            集客编码
            <el-tooltip
              class="item"
              effect="dark"
              content="中国移动集团客户编码，企业套餐开通后归属集客编码名下，关联到当前企业后，即可以绑定关联套餐到指定设备。默认情况系统自动关联。"
              placement="right"
            >
              <span style="position: absolute; top: 3px; left: 85px">
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="info-circle"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                  />
                  <path
                    d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
                  />
                </svg>
              </span>
            </el-tooltip>
          </p>
          <div class="line" />
          <div class="right-name">
            <span class="name-spano">集客编码</span>
            <div class="name-info">
              <span>无</span>
              <el-button type="primary" @click="relevancy = true"
                >手动关联</el-button
              >
            </div>
          </div>
          <div class="right-code">
            <span class="code-one">超管</span>
            <p>
              125****3214
              <el-button @click="transfer = true">转给他人</el-button>
            </p>
          </div>
          <div class="tip">
            中国移动集团客户业务开通后，集客编码将自动关联到同手机号企业，并自动关联套餐到设备，并发送到您的手机。若开通手机号码与当前超管号码不一致，您也可以手动完成关联。
          </div>
        </div>
      </div>

      <!-- 业务信息 -->
      <div class="right-direct">
        <div>
          <p>业务信息</p>
          <div class="line" />
          <div class="right-name">
            <span class="name-spano">归属地区</span>
            <div class="name-info">
              <div v-if="showeditt">
                <span>{{ value1 }}</span>
                <el-button @click="showeditt = false">修改</el-button>
              </div>
              <div v-else style="display: flex">
                <el-cascader
                  v-model="addressvalue"
                  style="width: 100%"
                  clearable
                  size="mini"
                  :props="props"
                  :options="$dt('division')"
                />
                <!-- :props="props" -->

                <el-button type="primary" @click="editcountry">确定</el-button>
                <el-button @click="showeditt = true">取消</el-button>
              </div>
            </div>
          </div>
          <div class="right-code">
            <span class="code-one">用户总数</span>
            <p>{{ usercount }}</p>
          </div>
          <div class="right-code" style="margin-bottom: 20px">
            <span class="code-one">监控数量</span>
            <p>在线:{{ activedev }}, 总数:{{ alldev }}, 在线率:{{ bdev }}</p>
          </div>
        </div>
      </div>

      <!-- 位置坐标 -->
      <div class="right-direct">
        <div>
          <p>位置坐标</p>
          <div class="line" />
          <div class="right-name">
            <span class="name-spano">企业坐标</span>
            <div class="name-info">
              <span>(经度 {{ coor[0] }}; 纬度 {{ coor[1] }})</span>
              <el-button @click="editmappoint">修改</el-button>
            </div>
          </div>
          <div class="right-code" style="margin-bottom: 20px">
            <span class="code-one">企业地址</span>
            <p>{{ qyaddress }}</p>
          </div>
        </div>
      </div>

      <!-- 开放授权 -->
      <div v-if="false" class="right-direct">
        <div>
          <p style="position: relative">
            开放授权
            <el-tooltip
              class="item"
              effect="dark"
              content="视频能力开放平台授权信息，授权后开发者可基于鉴权信息访问企业组织、设备等数据，调取设备直播回放视频、设置及控制设备交互功能。"
              placement="right"
            >
              <span style="position: absolute; top: 3px; left: 85px">
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="info-circle"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                  />
                  <path
                    d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
                  />
                </svg>
              </span>
            </el-tooltip>
          </p>
          <div class="line" />
          <div style="display: flex">
            <div class="right-name" style="width: 60%">
              <span class="name-spano">已授权应用</span>
              <div class="name-info">
                <span style="font-size: 12px; color: rgba(0, 0, 0, 0.85)"
                  >视频能力开放平台授权信息，授权后开发者可基于鉴权信息访问企业组织、设备等数据，调取设备直播回放视频、设置及控制设备交互功能。</span
                >
              </div>
            </div>
            <div class="openas">
              <a href="https://open.andmu.cn/" target="_blank"
                >什么是视频能力开放平台？</a
              >
              <a
                href="https://open.andmu.cn/doc/manual/oauth-manual.html"
                target="_blank"
                >如何在三方应用中授权登录移动千里眼？</a
              >
              <a
                href="https://open.andmu.cn/doc/manual/starweb-manual.html"
                target="_blank"
                >如何基于开放平台做深度定制二次开发？</a
              >
            </div>
          </div>
          <div class="deleteqiye">
            <el-button type="primary">删除企业</el-button>
            <span
              >删除企业后，企业所有数据都会被删除，不可恢复，成员将无法进入，请谨慎操作</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 手动关联的弹框 -->
    <el-dialog
      title="关联集客编码"
      :visible.sync="relevancy"
      width="35%"
      center
    >
      <el-form label-position="right" label-width="80px" :model="form">
        <el-form-item label="集客编码">
          <el-input v-model="form.code" placeholder="请输入集客编码" />
        </el-form-item>
        <el-form-item label="预留手机号">
          <el-input
            v-model="form.phone"
            placeholder="请输入办理业务预留手机号"
          />
        </el-form-item>
        <el-form-item label="短信验证码" class="formitem">
          <el-input v-model="form.smscode" placeholder="请输入短信验证码" />
          <el-button>获取验证码</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relevancy = false">取 消</el-button>
        <el-button type="primary" @click="relevancy = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 转给他人的弹框 -->
    <el-dialog title="验证身份" :visible.sync="transfer" width="30%" center>
      <el-form label-position="right" label-width="80px" :model="form">
        <el-form-item label="预留手机号">
          <el-input
            v-model="formtransfer.phone"
            :disabled="true"
            placeholder="请输入预留手机号"
          />
        </el-form-item>
        <el-form-item label="短信验证码" class="formitem">
          <el-input
            v-model="formtransfer.smscode"
            placeholder="请输入短信验证码"
          />
          <el-button>获取验证码</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transfer = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="!formtransfer.smscode.trim()"
          @click="transfer = false"
          >下一步</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改坐标 -->
    <el-dialog
      title="修改坐标"
      class="pos"
      style="margin-top: 0px"
      :visible.sync="dialogVisible"
      width="70%"
      append-to-body
    >
      <Map
        ref="map"
        mapid="disposemap"
        :new-style="newStyle"
        :type="type"
        @click-marker-coor="clickMarkerCoor"
      />
      <span slot="footer" class="dialog-footer">
        <div class="tip">
          请点击拖动定位图标，进行经纬度的选择：<span v-if="coor.length"
            >{{ coor[0] }}，{{ coor[1] }}</span
          >
        </div>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editcoor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateTenant, getTenant } from "@/api/system/tenant";
import Map from "@/components/Map/index";
export default {
  components: {
    Map,
  },
  data() {
    return {
      props: {
        label: "name",
        value: "id",
        checkStrictly: true,
      },
      lilist: ["注册信息", "业务信息", "位置坐标"],
      activeindex: -1,
      contron: null,
      value: "",
      valuecopy: "",
      qycode: null,
      createtime: null,
      user: null,
      showedit: true,
      showeditt: true,
      value1: null, // 归属省份
      usercount: null, // 用户总数
      activedev: null, // 在线设备
      alldev: null, // 设备总数
      bdev: null, // 在线率
      qyaddress: null, // 企业地址
      relevancy: false, // 关联的弹框
      form: {
        code: "",
        phone: "",
        smscode: "",
      },
      transfer: false, // 转让他人的弹框
      formtransfer: {
        phone: "153****1234",
        smscode: "",
      },
      dialogVisible: false,
      newStyle: {
        height: "500px",
      },
      coor: [],
      addressvalue: [],
      type: ["cluster", "geocoder"], // 显示地图类型
    };
  },
  created() {
    this.gettanentinfo();
  },
  methods: {
    // 修改坐标
    editmappoint() {
      this.dialogVisible = true;
      // setTimeout(() => {
      //   var point = new BMap.Point(this.coor[0], this.coor[1]) // 创建点坐标
      //   this.$refs.map.map.centerAndZoom(point, 15)
      //   this.$refs.map.map.enableScrollWheelZoom(true)
      //   var point1 = new BMap.Point(this.coor[0], this.coor[1])
      //   var marker = new BMap.Marker(point1, { enableDragging: true }) // 创建标注
      //   this.$refs.map.map.addOverlay(marker) // 将标注添加到地图中
      // }, 100)
    },
    editqyinfo() {
      this.valuecopy = this.value;
      this.showedit = false;
    },
    setpcount(params) {
      let datacont = "";
      let step = 0;
      const contdivsion = [2, 4, 6].reduce((previousValue, currentValue) => {
        return previousValue.concat(
          params.slice(0, currentValue).padEnd(6, 0) * 1
        );
      }, []);
      const duringFun = (e) => {
        e.forEach((el) => {
          if (el.id == contdivsion[step]) {
            datacont = datacont + el.name + "-";
            step++;
            if (step < 3 && "children" in el && el.children) {
              duringFun(el.children);
            }
          }
        });
      };
      duringFun(this.$dt("division"));
      if (datacont.length > 0 && datacont[datacont.length - 1] == "-") {
        datacont = datacont.substring(0, datacont.length - 1);
      }
      return datacont;
    },
    // 获取企业信息
    async gettanentinfo() {
      const res = await getTenant({
        tenantId: localStorage.getItem("tanentId"),
      });
      this.value = res.name;
      this.qycode = res.division;
      this.createtime = res.createTime;
      this.user = res.adminUser;
      this.usercount = res.userCount;
      this.activedev = res.onlineNum;
      this.alldev = res.deviceNum;
      this.bdev = res.onlineRatio;
      this.coor.push(res.longitude, res.latitude);
      this.qyaddress = res.address;
      this.addressvalue.push(res.division);
      this.value1 = this.setpcount(res.division);
      console.log(this.value1);
    },
    // 修改企业
    async editqy() {
      await updateTenant({ name: this.valuecopy });
      this.$message({
        type: "success",
        message: "修改成功",
      });
      this.value = this.valuecopy;
      this.showedit = true;
    },

    // 修改省份
    async editcountry() {
      await updateTenant({
        division: this.addressvalue[this.addressvalue.length - 1],
      });
      this.$dt("division").forEach((item) => {
        if (item.id == this.addressvalue[0]) {
          this.value1 = item.name;
          if (this.addressvalue[1]) {
            item.children.forEach((item1) => {
              if (item1.id == this.addressvalue[1]) {
                this.value1 = this.value1 + "/" + item1.name;
                if (this.addressvalue[2]) {
                  item1.children.forEach((item2) => {
                    if (item2.id == this.addressvalue[2]) {
                      this.value1 = this.value1 + "/" + item2.name;
                    }
                  });
                }
              }
            });
          }
        }
      });
      this.$message({
        type: "success",
        message: "修改成功",
      });
      this.showeditt = true;
    },

    // 修改坐标
    async editcoor() {
      await updateTenant({
        longitude: this.coor[0],
        latitude: this.coor[1],
        address: this.coor[2],
      });
      this.$message({
        type: "success",
        message: "修改成功",
      });
      this.qyaddress = this.coor[2];
      this.dialogVisible = false;
    },
    postion(index) {
      var a;
      this.activeindex = index;
      if (index == 0) {
        // 点击注册信息
        a = document.querySelector(".contron");
        a.scrollTop = 0;
      }
    },

    clickMarkerCoor(e) {
      this.coor = e;
    },
    lalongChange(e) {
      const laglong = e.split(",");
      if (laglong.length !== 2) {
        this.$message({
          type: "error",
          message: "请输入正确的经纬度",
        });
        return;
      }
      this.clickMarkerCoor(laglong);
    },
  },
};
</script>

<style lang="scss" scoped>
.pos {
  ::v-deep .el-dialog {
    margin-top: 3vh !important;
  }
}
.el-dialog__body {
  .el-form {
    .formitem {
      .el-form-item__content {
        margin-left: 80px;
        display: flex;
        .el-input {
          width: 73%;
        }
        .el-button {
          width: 24%;
          margin-left: 3%;
          height: 36px;
          font-size: 13px;
          color: rgb(24, 144, 255);
        }
      }
    }
  }
}
.dialog-footer {
  .el-button {
    width: 15%;
    height: 30px;
  }
}
.app-main {
  background-color: #eeeeee !important;
}
* {
  padding: 0;
  margin: 0;
}
li {
  list-style-type: none;
}
.contron {
  background-color: white;
  height: 44vw;
  display: flex;
  .left {
    width: 200px;
    background-color: #fafafa;
    color: rgba(0, 0, 0, 0.85);
    height: 100%;

    ul {
      li {
        height: 40px;
        font-size: 16px;
        padding-left: 30px;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          color: #69b9ff;
        }
      }
    }
  }
  .right {
    padding: 12px 24px;
    color: black;
    flex: 1;
    max-height: 652px;
    overflow: auto;
    .right-direct {
      .line {
        background-color: #d4d4d4;
        height: 1px;
        width: 100%;
        margin-bottom: 16px;
      }
      p {
        font-size: 16px;
        font-weight: 500;
        margin-block: 8px;
      }
      .right-name {
        display: flex;
        height: 32px;
        align-items: center;
        .name-spano {
          min-width: 115px;
          text-align: left;
          color: rgb(126 121 121);
        }
        .name-info {
          display: flex;
          align-items: center;
          ::v-deep .el-input__inner {
            height: 30px;
          }
          span {
            max-width: 800px;
            min-width: 115px;
            font-size: 14px;
            color: #323333;
          }
          .el-button {
            width: 90px;
            height: 30px;
            margin-left: 12px;
            span {
              font-size: 12px;
              color: #1890ff;
            }
          }
        }
      }
      .right-code {
        display: flex;
        align-items: center;

        .code-one {
          min-width: 115px;
          text-align: left;
          color: rgb(126 121 121);
        }
        .el-button {
          width: 90px;
          height: 30px;
          margin-left: 47px;
          span {
            font-size: 12px;
            color: #1890ff;
          }
        }
        p {
          flex: 1;
          font-size: 14px;
          color: #323333;
        }
      }
      .openas {
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        height: 92px;
        justify-content: space-evenly;
        margin-top: -10px;
        a {
          text-decoration: underline;
          color: #1890ff;
        }
      }
      .deleteqiye {
        display: flex;
        width: 53%;
        justify-content: space-between;
        align-items: center;
        .el-button {
          width: 90px;
          height: 30px;
        }
        span {
          color: #2d2626;
        }
      }
      .dirs {
        margin-bottom: 20px;
      }
    }
  }
}
.activecls {
  background-color: #46a0fc;
  color: white;
}
.tip {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  text-align: center;
  margin-bottom: 20px;
}
</style>
