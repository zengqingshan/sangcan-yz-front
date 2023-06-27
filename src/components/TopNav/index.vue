<template>
  <div>
    <div style="text-align: center; margin: 0 auto; padding-left: 7%">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        @select="handleSelect"
      >
        <template v-for="(item, index) in topMenus">
          <el-submenu
            v-if="item.hidden == false && item.children.length > 0"
            :key="index"
            :index="item.path"
          >
            <template slot="title">{{ item.meta.title }} </template>

            <template v-for="(item2, index2) in item.children">
              <el-menu-item
                v-if="item2.hidden == false"
                :key="index2"
                :index="item2.path"
              >
                <svg-icon
                  :icon-class="item2.meta.icon"
                  v-if="item2.meta.icon"
                />
                {{ item2.meta.title }}
              </el-menu-item>
            </template>
          </el-submenu>

          <el-menu-item v-else :key="item.path" :index="item.path">
            <svg-icon :icon-class="item.meta.icon" v-if="item.meta.icon" />
            {{ item.meta.title }}
          </el-menu-item>
        </template>
        <!--
   <template v-for="(item, index) in topMenus">
      <el-menu-item :style="{'--theme': theme}" :index="item.path" :key="index" v-if="index < visibleNumber"
        ><svg-icon :icon-class="item.meta.icon" />
        {{ item.meta.title }}
		</el-menu-item >
    </template>-->

        <!-- 顶部菜单超出数量折叠 -->
        <!--<el-submenu index="more" v-if="topMenus.length > visibleNumber">
      <template slot="title">更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          :index="item.path"
          :key="index"
          v-if="index >= visibleNumber"
          ><svg-icon :icon-class="item.meta.icon" />
          {{ item.meta.title }}</el-menu-item
        >
      </template>
    </el-submenu>-->
      </el-menu>
    </div>

    <div style="padding-bottom: 1%; padding-right: 1.4%" class="handle">
      <i class="el-icon-bell" style="color: #fff" @click="openDialog" />
      <el-dialog
        width="60%"
        :visible.sync="dialogVisible"
        :close-on-click-modal="true"
        :show-close="true"
      >
        <el-tabs
          v-model="activeName"
          style="height: 500px"
          @tab-click="handleClick"
        >
          <el-tab-pane label="消息通知" name="first">
            <div
              style="
                font-size: 10px;
                color: rgb(64, 153, 188);
                margin-bottom: 10px;
                margin-left: 88%;
              "
              @click="doReadAllNotification"
            >
              全部已读
            </div>
            <template>
              <div>
                <el-table
                  :data="tableData"
                  border
                  style="width: 90%; margin: 0 auto"
                  height="300px"
                >
                  <el-table-column
                    prop="deviceName"
                    label="设备名称"
                    align="center"
                    width="150"
                  />
                  <el-table-column
                    prop="notificationType"
                    label="通知类型"
                    align="center"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <span>{{
                        getNotificationType(scope.row.notificationType)
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="content"
                    label="通知内容"
                    align="center"
                    width="150"
                  >
                    <template slot-scope="{ row }">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="row.content"
                        placement="bottom"
                      >
                        <div
                          class="cell-with-tooltip"
                          style="
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          "
                        >
                          {{ row.content }}
                        </div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="detectTime"
                    align="center"
                    label="	告警时间"
                    width="180"
                  />
                  <el-table-column prop="readFlag" align="center" label="状态">
                    <template slot-scope="scope">
                      <span>{{
                        scope.row.readFlag === false ? "未读" : "已读"
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.row.readFlag === false"
                        type="text"
                        @click="readNotification(scope.row)"
                        >读取</el-button
                      >
                      <el-button v-else type="text">已读</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div>
                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="messageParameter.current"
                  :limit.sync="messageParameter.pageSize"
                  @pagination="getMessageList"
                />
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="通知开关" name="second">
            <template>
              <div class="message-switch-header">
                <span>监控点</span>
                <div class="switch-title">
                  <span>设备告警通知</span>
                  <span>设备离线通知</span>
                </div>
              </div>
              <div>
                <el-tree
                  id="dev-tree"
                  ref="devTree"
                  node-key="id"
                  :props="treeProps"
                  :load="treeLoad"
                  lazy
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  :empty-text="treeEmptyText"
                  :default-expanded-keys="defExpandDevs"
                  @node-click="storeNodeClick"
                  @node-contextmenu="treeNodeRightClick"
                >
                  <div
                    slot-scope="{ node, data }"
                    class="custom-tree-node"
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 100%;
                    "
                  >
                    <span style="padding: 0 5px">
                      <span>
                        <!--机构图标-->
                        <svg
                          viewBox="64 64 896 896"
                          focusable="false"
                          data-icon="folder"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32z"
                          />
                        </svg>
                      </span>

                      <span
                        class="ellipsis"
                        style="user-select: none; margin-left: 4px"
                        :title="node.label"
                        >{{ node.label }}</span
                      >
                    </span>
                    <span
                      style="
                        width: 320px;
                        display: flex;
                        justify-content: space-around;
                      "
                    >
                      <el-switch
                        v-if="node.data.children.length === 0"
                        v-model="node.data.alarmSwitch"
                        @change="changeAlarmSwitch(node, data)"
                      />
                      <el-switch
                        v-if="node.data.children.length === 0"
                        v-model="node.data.offlineSwitch"
                        @change="changeOfflineSwitch(node, data)"
                      />
                    </span>
                  </div>
                </el-tree>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>

    <div style="padding-bottom: 1%; padding-right: 1.5%" class="handle">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <i class="el-icon-question" style="color: white" />
        </span>
        <el-dropdown-menu
          slot="dropdown"
          style="background-color: #2c2d2f; border: #2c2d2f"
        >
          <el-dropdown-item style="text-align: center; color: #fff"
            >操作手册</el-dropdown-item
          >
          <el-dropdown-item
            style="text-align: center; color: #fff"
            icon="el-icon-phone"
            >400-110-0868</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div>
      <div class="right-menu">
        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <div>
              <el-divider direction="vertical" />
              <span class="avatar-name-icon">
                {{ name.slice(0, 1) }}
              </span>
              <span class="avatar-name">
                {{ name }}
              </span>
            </div>
          </div>
          <el-dropdown-menu
            style="background-color: rgb(44, 45, 47); border: #2c2d2f"
          >
            <el-dropdown-item style="color: rgb(255, 255, 255)">
              <div @click="dialogVisible1 = true">个人中心</div>
            </el-dropdown-item>

            <el-dropdown-item
              style="color: rgb(255, 255, 255)"
              @click.native="logout"
            >
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dialog
          title="个人中心"
          :visible.sync="dialogVisible1"
          width="50%"
          :close-on-click-modal="true"
          :show-close="true"
        >
          <el-tabs :tab-position="tabPosition" style="height: 420px">
            <el-tab-pane label="账号信息">
              <div
                style="
                  display: flex;
                  flex-wrap: nowrap;
                  justify-content: space-between;
                  border-bottom: 1px solid #bbb9b9;
                "
              >
                <div style="margin-left: 2%; font-weight: 900; font-size: 16px">
                  账号信息
                </div>
                <div style="margin-right: 2%">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="
                      (innerVisible = true), (changePasswordForm.phone = name)
                    "
                    >修改密码</el-button
                  >
                </div>
              </div>

              <el-dialog
                style="margin-top: 4%"
                width="30%"
                title="修改密码"
                :visible.sync="innerVisible"
                append-to-body
              >
                <el-form label-width="120px">
                  <el-form-item label="当前手机号:">
                    <el-input
                      v-model="changePasswordForm.phone"
                      :disabled="true"
                      :placeholder="changePasswordForm.phone"
                      style="width: 76%"
                    />
                  </el-form-item>
                  <el-form-item label="输入验证码" prop="code">
                    <el-input
                      v-model="changePasswordForm.smsCode"
                      placeholder="请输入验证码"
                      style="width: 42%; margin-right: 2%"
                    />
                    <el-button
                      v-show="SmsShow"
                      class="code"
                      @click.prevent="getSmsCodeMethod"
                      >获取短信验证码</el-button
                    >
                    <el-button v-show="!SmsShow" type="text" class="code"
                      >{{ smsCount }}秒后重试</el-button
                    >
                  </el-form-item>
                  <el-form-item label="输入新密码" prop="password">
                    <el-input
                      v-model="changePasswordForm.newpsd"
                      placeholder="请输入密码"
                      show-password
                      style="width: 76%"
                    />
                  </el-form-item>
                  <el-form-item label="确认新密码" prop="newpassword">
                    <el-input
                      v-model="changePasswordForm.repeatPassword"
                      placeholder="请输入密码"
                      show-password
                      style="width: 76%"
                    />
                  </el-form-item>
                  <el-form-item>
                    <div style="display: flex; justify-content: flex-start">
                      <el-button @click="changePassword">确认</el-button>
                      <el-button
                        @click="
                          (innerVisible = false), (changePasswordForm = {})
                        "
                        >取消</el-button
                      >
                    </div>
                  </el-form-item>
                </el-form>
              </el-dialog>
              <div style="font-size: 10px; height: 30px">
                <span style="margin-left: 2%; color: #9c9898">手机号</span>
                <span style="margin-left: 14%; color: #2c2d2f">{{ name }}</span>
              </div>

              <div style="font-size: 10px">
                <span style="margin-left: 2%; color: #9c9898">注册时间</span>
                <span style="margin-left: 12.2%; color: #2c2d2f">{{
                  this.userInfo.tenant.createTime
                }}</span>
              </div>

              <div
                style="
                  display: flex;
                  flex-wrap: nowrap;
                  justify-content: space-between;
                  border-bottom: 1px solid #bbb9b9;
                  margin-top: 2%;
                "
              >
                <div style="margin-left: 2%; font-weight: 900; font-size: 16px">
                  企业信息
                </div>
                <div style="margin-right: 2%">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="
                      $router.push('/enterprise/orgInfo');
                      dialogVisible1 = false;
                    "
                    >企业管理</el-button
                  >
                </div>
              </div>

              <div style="font-size: 10px; height: 30px">
                <span style="margin-left: 2%; color: #9c9898">企业名称</span>
                <span style="margin-left: 12.2%; color: #2c2d2f">{{
                  this.userInfo.tenant.name
                }}</span>
              </div>
              <!--<div style="font-size: 10px; height: 30px">
                <span style="margin-left: 2%; color: #9c9898">企业编码</span>
                <span style="margin-left: 12.2%; color: #2c2d2f">{{
                  this.userInfo.tenant.region
                }}</span>
              </div>-->
              <div style="font-size: 10px; height: 30px">
                <span style="margin-left: 2%; color: #9c9898">地区</span>
                <span style="margin-left: 15.8%; color: #2c2d2f">{{
                  setpcount(this.userInfo.tenant.division)
                }}</span>
              </div>
              <!--<div style="font-size: 10px; border-bottom: 1px solid #bbb9b9">
                <span style="margin-left: 2%; color: #9c9898">集客编码</span>
                <span style="margin-left: 12.2%; color: #2c2d2f" />
              </div>-->

              <div style="font-size: 10px">
                <span style="margin-left: 2%; color: #9c9898">我的角色</span>
                <span style="margin-left: 12.2%; color: #2c2d2f">{{
                  getCurTenantRoleName()
                }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="企业列表">
              <div>
                <div
                  style="
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    border-bottom: 1px solid #bbb9b9;
                  "
                >
                  <div
                    style="margin-left: 2%; font-weight: 900; font-size: 16px"
                  >
                    企业列表
                  </div>
                  <!--<div style="margin-right: 2%">
                    <el-button type="primary" size="mini"
                      >注册新的组织</el-button
                    >
                  </div>-->
                </div>
              </div>

              <el-table :data="tenantList" border style="width: 100%">
                <el-table-column prop="tenant.name" label="名称" />
                <el-table-column width="250px" label="地区">
                  <template slot-scope="scope">
                    <span>{{ setpcount(scope.row.tenant.division) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="角色">
                  <template slot-scope="scope">
                    <span>{{ getRoleName(scope.row) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { getSmsCode } from "@/api/login";

import { listLocaLevelOrgDevice } from "@/api/system/device";
import { orginfoAndSubOrgInfo } from "@/api/system/org";
import {
  doread,
  subscribe,
  subscribeOrgList,
  unreadlist,
} from "@/api/system/information"; // 消息请求
import user from "../../../src/store/modules/user";
import { constantRoutes } from "@/router";
import { getInfo } from "@/api/login";
import { changePassword } from "@/api/system/user";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      changePasswordForm: {
        smsCode: "",
        phone: null,
        repeatPassword: null,
        newpsd: null,
      },
      total: 0,
      smsCount: null,
      SmsShow: true, // 验证码
      subscribeOrgList: [],
      // 未读消息列表
      messageParameter: {
        current: 1,
        pageSize: 10,
      },
      innerVisible: false,
      dialogVisible1: false,
      mobilePhoneNo: "", // 手机号
      verificationCode: "",
      newpsd: "",
      repeatPassword: "",

      tabPosition: "left",
      xihaxi: "",
      // 顶部栏初始数
      visibleNumber: 7,
      // 是否为首次加载
      isFrist: false,
      // 当前激活菜单的 index
      currentIndex: undefined,
      dialogVisible: false,
      activeName: "first",
      tableData: [],
      tenantList: [],
      userInfo: [],
      defExpandDevs: [],
      value: true,
      value1: true,
      // 树结构
      treeProps: {
        label: (data, node) => {
          return data.name;
        },
        isLeaf: (data, node) => {
          return this.treeLeaf(data);
        },
        disabled: (data, node) => {
          return this.treeLeaf(data);
        },
      },
    };
  },
  computed: {
    treeEmptyText() {
      return this.treeLoading ? "加载中..." : "暂无通知数据";
    },
    ...mapGetters(["sidebar", "name", "device"]),
    theme() {
      return this.$store.state.settings.theme;
    },

    // 顶部显示菜单
    topMenus() {
      const topMenus = [];
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          // 兼容顶部栏一级菜单内部跳转
          if (menu.path === "/") {
            topMenus.push(menu.children[0]);
          } else {
            topMenus.push(menu);
          }
        }
      });
      // console.log('222', topMenus)
      return topMenus;
    },
    // 所有的路由信息
    routers() {
      return this.$store.state.permission.topbarRouters;
    },
    // 设置子路由
    childrenMenus() {
      var childrenMenus = [];
      this.routers.map((router) => {
        for (var item in router.children) {
          if (router.children[item].parentPath === undefined) {
            if (router.path === "/") {
              router.children[item].path =
                "/redirect/" + router.children[item].path;
            } else {
              if (!this.ishttp(router.children[item].path)) {
                router.children[item].path =
                  router.path + "/" + router.children[item].path;
              }
            }
            router.children[item].parentPath = router.path;
          }
          childrenMenus.push(router.children[item]);
        }
      });
      return constantRoutes.concat(childrenMenus);
    },
    // 默认激活的菜单
    activeMenu() {
      const path = this.$route.path;
      let activePath = this.routers[0].path;
      if (path.lastIndexOf("/") > 0) {
        const tmpPath = path.substring(1, path.length);
        activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
      } else if (path == "/index" || path == "") {
        if (!this.isFrist) {
          this.isFrist = true;
        } else {
          activePath = "index";
        }
      }
      var routes = this.activeRoutes(activePath);
      if (routes.length === 0) {
        activePath = this.currentIndex || this.routers[0].path;
        this.activeRoutes(activePath);
      }
      return activePath;
    },
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
  beforeMount() {
    window.addEventListener("resize", this.setVisibleNumber);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setVisibleNumber);
  },
  mounted() {
    this.setVisibleNumber();
  },
  created() {
    this.userInfo = user.state.all.userInfo;
    this.tenantList = user.state.tenantList;
  },
  methods: {
    doicon(item) {
      console.log(111, item);
    },
    // 修改密码
    async changePassword() {
      if (this.validatePhone() && this.validatePhonePassword()) {
        const res = await changePassword({
          authType: 0,
          newPassword: this.changePasswordForm.repeatPassword,
          smsCode: this.changePasswordForm.smsCode,
        });
        this.innerVisible = false;
        this.dialogVisible1 = false;
      }
    },
    // 验证码倒计时
    vaTime() {
      this.smsCount = 10;
      this.SmsShow = false;
      let timer = 0;
      timer = setInterval(() => {
        if (this.smsCount > 0 && this.smsCount <= 120) {
          this.smsCount--;
        } else {
          this.SmsShow = true;
          clearInterval(timer);
          timer = 0;
        }
      }, 1000);
    },
    // 判断手机号是否合法
    validatePhone() {
      if (this.changePasswordForm.phone == "admin") {
        return true;
      }
      if (!this.changePasswordForm.phone) {
        this.$message({
          message: "手机号码不能为空",
          type: "error",
        });
      } else if (
        !/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.changePasswordForm.phone)
      ) {
        this.$message({
          message: "请输入正确是手机号",
          type: "error",
        });
      } else {
        return true;
      }
    },
    // 判断是否输入密码
    validatePhonePassword() {
      if (!this.changePasswordForm.newpsd) {
        this.$message({
          message: " 密码不能为空",
          type: "error",
        });
        return false;
      } else if (!this.changePasswordForm.repeatPassword) {
        this.$message({
          message: "请再次输入密码",
          type: "error",
        });
        return false;
      } else if (
        this.changePasswordForm.newpsd !==
        this.changePasswordForm.repeatPassword
      ) {
        this.$message({
          message: "两次密码不一致",
          type: "error",
        });
        return false;
      } else {
        return true;
      }
    },
    // 获取短信验证码
    getSmsCodeMethod() {
      if (this.validatePhone()) {
        this.vaTime();
        const params = { phone: this.changePasswordForm.phone, type: "1" };
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
    setpcount(params) {
      if (params == undefined || params == null) {
        return "";
      }

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
        datacont = datacont.substr(0, datacont.length - 1);
      }
      return datacont;
    },
    // 打开消息弹窗
    openDialog() {
      this.dialogVisible = true;
      this.getMessageList(); // 未读消息列表
      this.hasOpenedSubscriptionList(); // 已订阅消息列表
    },
    // 获取消息列表
    async getMessageList() {
      const res = await unreadlist(this.messageParameter);
      this.tableData = res.records;
      this.total = res.total;
    },
    // //已打开消息订阅开关列表
    async hasOpenedSubscriptionList(orgList) {
      this.subscribeOrgList = await subscribeOrgList();
    },
    async doReadAllNotification() {
      const idsArray = [];
      this.tableData.forEach((item) => {
        idsArray.push(item.id);
      });

      if (idsArray.length == 0) {
        return;
      }

      const param = { notificationIds: idsArray };
      const res = await doread(param);
      if (res && res.code == 0) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.$set(this.tableData[i], "readFlag", true);
        }
      }
    },
    // 读取消息
    async readNotification(row) {
      const idsArray = [];
      idsArray.push(row.id);

      const param = { notificationIds: idsArray };
      const res = await doread(param);
      if (res && res.code == 0) {
        row.readFlag = true;
      }
    },
    // 离线通知方法
    async changeSubscribe(id) {
      const res = await subscribe(id);
    },
    async changeAlarmSwitch(node, data) {
      const param = {
        operType: node.data.alarmSwitch ? 1 : 0,
        orgId: node.data.id,
        notificationType: 2,
      };
      const res = subscribe(param);
      if (res && res.code === 0) {
        node.data.alarmSwitch = !node.data.alarmSwitch;
      }
    },
    async changeOfflineSwitch(node, data) {
      const param = {
        operType: node.data.offlineSwitch ? 1 : 0,
        orgId: node.data.id,
        notificationType: 1,
      };
      const res = subscribe(param);
      if (res && res.code === 0) {
        node.data.offlineSwitch = !node.data.offlineSwitch;
      }
    },
    // 树方法
    treeLeaf(data) {
      if (
        data.children == undefined ||
        data.children == null ||
        data.children.length == 0
      ) {
        return true;
      }
      return false;
    },
    treeLoad(node, resolve) {
      this.treeLoadOrg(node, resolve);
    },

    checkSwitch(org) {
      org.alarmSwitch = false;
      org.offlineSwitch = false;
      this.subscribeOrgList.forEach((item) => {
        if (item.orgId == org.id) {
          if (item.notificationType == 2) {
            org.alarmSwitch = true;
          } else if (item.notificationType == 1) {
            org.offlineSwitch = true;
          }
        }
      });
    },
    // 请求树节点信息
    treeLoadOrg(node, resolve) {
      let orgId;
      if (node.data) {
        orgId = node.data.id;
      }
      orginfoAndSubOrgInfo({ orgId: orgId })
        .then((org) => {
          let orgList = [];

          this.checkSwitch(org);
          if (node.level == 0) {
            this.defExpandDevs.push(org.id);
            orgList.push(org);
          } else {
            orgList = org.children || [];
          }
          orgList.forEach((childOrg) => {
            this.checkSwitch(childOrg);
          });
          resolve(orgList);
        })
        .catch(() => {})
        .then(() => {
          this.treeLoading = false;
        });
    },
    treeNodeRightClick(event, data, node, c) {
      this.contextMenuNodeData = data;
      this.contextMenuNode = node;
      this.pnode = node.parent;
      var new_event;
      if (typeof MouseEvent === "function") {
        new_event = new MouseEvent(event.type, event);
      } else {
        new_event = document.createEvent("MouseEvents");
        new_event.initMouseEvent(
          event.type,
          true,
          true,
          event.view,
          event.detail,
          event.screenX,
          event.screenY,
          event.clientX,
          event.clientY,
          event.ctrlKey,
          event.altKey,
          event.shiftKey,
          event.metaKey,
          event.button,
          event
        );
      }
      this.contextMenuTarget.dispatchEvent(new_event);
    },
    // 节点点击事件
    storeNodeClick() {},
    getCurTenantRoleName() {
      if (!this.userInfo.role) {
        return "未知";
      }
      if (this.userInfo.isTenantSuperAdmin) {
        return "超级管理员";
      }
      return this.userInfo.role.name;
    },
    getRoleName(item) {
      if (!item.role) {
        return "未知";
      }
      if (item.tenant.adminUser == this.$store.getters.user.userName) {
        return "超级管理员";
      }
      return item.role.name;
    },
    // handleClose (done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done()
    //     })
    //     .catch(_ => { })
    // },
    handleClick(tab, event) {},
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
    // 根据宽度计算设置显示栏数
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width / 3;
      this.visibleNumber = parseInt(width / 85);
    },
    // 菜单选择事件
    handleSelect(key, keyPath) {
      this.currentIndex = key;
      if (this.ishttp(key)) {
        // http(s):// 路径新窗口打开
        window.open(key, "_blank");
      } else if (key.indexOf("/redirect") !== -1) {
        // /redirect 路径内部打开
        this.$router.push({ path: key.replace("/redirect", "") });
      } else {
        // 显示左侧联动菜单
        this.$router.push({ path: key.replace("/redirect", "") });
        // this.activeRoutes(key);
      }
    },
    // 当前激活的路由
    activeRoutes(key) {
      var routes = [];
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (key == item.path || (key == "index" && item.path == "")) {
            routes.push(item);
          }
        });
      }
      if (routes.length > 0) {
        this.$store.commit("SET_SIDEBAR_ROUTERS", routes);
      }
      return routes;
    },
    ishttp(url) {
      return url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1;
    },
    //通知类型
    getNotificationType(notificationType) {
      let value = "";
      this.$store.getters.dict["notification_type"].forEach((item) => {
        if (notificationType == item.dictKey) {
          value = item.dictValue;
        }
      });
      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  zoom: 1;
}
::v-deep .el-submenu__icon-arrow {
  display: none;
}
.el-dialog__headerbtn {
  z-index: 999;
}

::v-deep.el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: rgb(44, 45, 47) !important;
}

.el-dropdown-menu--medium .el-dropdown-menu__item :hover {
  color: #1f8dff !important;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

::v-deep[data-v-d16d6306]
  .el-menu--horizontal
  > .el-submenu
  .el-submenu__title {
  color: white;
}

::v-deep .el-menu--horizontal > .el-submenu .el-submenu__title {
  line-height: 42px;
  color: #fff !important;
}

::v-deep .el-menu--horizontal > .el-menu-item {
  line-height: 42px;
  color: #fff !important;
}
::v-deep .el-menu-item:hover,
.el-menu-item:focus {
  background-color: #409eff !important;
}
.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 50px;
  line-height: 42px;
  margin: 0;
  border-bottom: 3px solid transparent;
  // color: #ffffff;
  padding: 0 20px;
  margin: 0 10px;
}

el-menu--horizontal {
  color: rgba(0, 0, 0, 0.85);
  background-color: rgb(55, 55, 55);
}

.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
  color: #ffffff;
}

.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-submenu__title {
  color: #ffffff;
  background-color: rgb(55, 55, 55);
}

// .el-menu--horizontal .el-menu .el-submenu__title:hover
.el-menu--horizontal .el-menu .el-menu-item:hover {
  background-color: #409eff;
}

.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  &:hover {
    color: #2f86d6;
  }
}

.el-menu--horizontal > .el-menu-item:hover {
  background-color: #409eff;
}

/* submenu item */

.el-menu--horizontal > .el-submenu :hover {
  background-color: #409eff !important;
  color: #fff;
}

.right-menu {
  height: 100%;
  line-height: 50px;

  &:focus {
    outline: none;
  }

  .right-menu-item {
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
  .cell-with-tooltip {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      position: relative;

      .avatar-name-icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 22px;
        font-size: 16px;
        text-align: center;
        color: #ffffff;
        border-radius: 50%;
        margin: 0 5px;
        background-color: #1f8dff;
      }

      .avatar-name {
        color: #606266;
      }

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}

.handle:hover {
  cursor: pointer;
}

.el-dropdown-menu--medium .el-dropdown-menu__item:hover {
  background-color: #484545;
}

.pptv:hover {
  color: red;
}

.message-switch-header {
  display: flex;
  align-items: center;
  background: #f5f9fc;
  border: 1px solid #eee;
  height: 40px;
  padding-left: 28px;
  justify-content: space-between;
}

.switch-title {
  display: flex;
  justify-content: space-around;
  width: 320px;
}
</style>
