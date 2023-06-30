<template>
  <div>
    <div class="right-cn">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="告警时间" class="times">
          <el-form-item style="margin-right: 5px">
            <el-date-picker
              v-model="ruleForm.startTime"
              type="datetime"
              placeholder="选择起始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <span style="color: black"> &nbsp; - </span>
          <el-form-item>
            <el-date-picker
              v-model="ruleForm.endTime"
              type="datetime"
              placeholder="选择结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="区域" style="margin-left: 40px">
          <el-input
            v-model="ruleForm.address"
            placeholder="请输入事件所在区域"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="ruleForm.status" placeholder="请选择事件处理状态">
            <el-option label="已处理" value="1" />
            <el-option label="未处理" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="短信" class="smscodes">
          <el-select v-model="ruleForm.isSendSms" placeholder="是否触发MAS短信">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          style="margin-left: 5px"
          @click="searchlist"
          >确定</el-button
        >
        <el-button icon="el-icon-refresh-right" @click="restform"
          >重置</el-button
        >
      </el-form>
    </div>
    <div class="right-bom">
      <div class="bom-t">
        <el-button
          class="btnchuli"
          :disabled="disposeing"
          type="success"
          plain
          icon="el-icon-document-checked"
          @click="disposerow"
          >标记为已处理</el-button
        >
        <el-button
          class="importclass"
          type="warning"
          plain
          icon="el-icon-upload2"
          @click="exportlist"
          >导出</el-button
        >
      </div>
      <div class="bom-b" />
    </div>
    <div class="right-tab">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column label="告警时间" min-width="120px">
          <template slot-scope="scope">{{ scope.row.warnTime }}</template>
        </el-table-column>
        <el-table-column label="所在区域" min-width="200px">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.address"
              placement="bottom"
            >
              <span>
                {{ scope.row.address }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="事件类型" show-overflow-tooltip>
          <template slot-scope="scope">{{
            warntype(scope.row.warnType)
          }}</template>
        </el-table-column>
        <el-table-column label="是否触发短信" show-overflow-tooltip>
          <template slot-scope="scope">{{
            inorsms(scope.row.isSendSms)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="事件处理状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope"
            ><span :class="{ thingtype: scope.row.status == 0 }">{{
              statutype(scope.row.status)
            }}</span></template
          >
        </el-table-column>
        <el-table-column
          prop="handleInfo"
          label="处理意见"
          show-overflow-tooltip
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.warnType == 1"
              type="text"
              icon="el-icon-tickets"
              @click="handleEdit(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="listtotal > 0"
      :total="listtotal"
      :page.sync="ruleForm.current"
      :limit.sync="ruleForm.pageSize"
      :hide-on-single-page="false"
      @pagination="getwarninglist"
    />
    <!-- 详情弹窗 -->
    <el-dialog title="事件详情" :visible.sync="showinfo" width="50%">
      <div class="info">
        <div class="info-top">
          <div class="top-lef">
            <span>识别信息</span>
            <div class="leftinfo">
              <div class="info-img">
                <el-image
                  :src="captureBigImage"
                  style="width: 50%; height: 210px"
                >
                  <div slot="error" class="image-slot">
                    <img
                      src="../../../assets/images/300.jpg"
                      style="width: 100%; height: 210px"
                    />
                  </div>
                </el-image>
                <el-image
                  :src="imgurl"
                  style="width: 50%; height: 210px"
                  alt=""
                >
                  <div slot="error" class="image-slot">
                    <img
                      src="../../../assets/images/300.jpg"
                      style="width: 100%; height: 210px"
                    />
                  </div>
                </el-image>
                <div class="vocers">
                  <div>
                    <span>相似度</span>
                    <h4>
                      {{ (listinfo.recognitionRate * 100).toFixed(2) || 0 }}%
                    </h4>
                  </div>
                </div>
              </div>
              <div class="info-msg">
                <p>识别结果</p>
                <div v-if="listinfo.student" class="result">
                  <div>
                    <span style="margin-right: 5px">姓名:</span>
                    <span>{{ listinfo.student.studentName || "" }}</span>
                  </div>
                  <div>
                    <span style="margin-right: 5px">姓别:</span
                    ><span>{{
                      listinfo.student.sex == 0 ? "男" : "女" || ""
                    }}</span>
                  </div>
                  <div>
                    <span style="margin-right: 5px">学校:</span
                    ><span v-if="listinfo.student.studentOrg"
                      >{{ listinfo.student.studentOrg.orgName }} /
                      {{ listinfo.student.studentClass || "" }}</span
                    >
                  </div>
                </div>
                <p v-else style="margin: 0">未识别到相似度较高的学生</p>
              </div>
            </div>
          </div>
          <div class="top-rig">
            <span>告警信息</span>
            <div class="listinfo">
              <div class="riginfo">
                <p>
                  <span>告警时间:</span>
                  <span>{{ listinfo.warnTime || "" }}</span>
                </p>
                <p>
                  <span>所在区域:</span>
                  <span>{{ listinfo.address || "" }}</span>
                </p>
                <p>
                  <span>触发短信:</span>
                  <span>{{ inorsms(listinfo.isSendSms) }}</span>
                </p>
                <p v-if="listinfo.recognitionRate">
                  <span>短信内容:</span>
                  <span v-if="listinfo.smsLog">{{
                    listinfo.smsLog.sendContent || ""
                  }}</span>
                </p>
              </div>
              <div class="device">
                <VideoPlayers id="videoPlayers" ref="hlsVideoPlayer" />
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="点击全屏"
                  placement="top-start"
                >
                  <span class="span" style="" @click="windowfullscreen"
                    ><i class="el-icon-full-screen"
                  /></span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="info-bom">
          <el-form
            ref="numberValidateForm"
            :model="numberValidateForm"
            label-width="100px"
          >
            <el-form-item
              label="处理状态"
              prop="thingactive"
              :rules="[{ required: true, message: '请选择事件的处理状态' }]"
            >
              <el-select
                v-model="numberValidateForm.thingactive"
                placeholder="请选择事件处理状态"
                disabled
              >
                <el-option label="已处理" value="1" />
                <el-option label="未处理" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="处理意见" prop="msg">
              <el-input
                v-model.number="numberValidateForm.msg"
                autocomplete="off"
                disabled
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showinfo = false">取 消</el-button>
        <el-button type="primary" @click="showinfo = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import { previewPhotos } from "@/api/studentManagement";
import {
  previewImage,
  studentmessage,
  handlerwarn,
  msginfo,
  exportStudentInfo,
} from "@/api/linkage/warning";
import VideoPlayers from "../../../views/videomonitor/playback/components/videosAllVideos.vue";
export default {
  components: {
    VideoPlayers,
  },
  data() {
    return {
      disposeing: false,
      ruleForm: {
        startTime: "",
        endTime: "", // 时间
        address: "", // 地区
        warnType: "", // 处理状态
        isSendSms: "", // 短信
        pageSize: 10,
        current: 1,
        status: "",
      },
      tableData: [],
      multipleSelection: [], // 表格选中项
      showinfo: false, // 详情弹窗
      numberValidateForm: {
        thingactive: "",
        msg: "",
      },
      listtotal: 0, // 信息总数
      listinfo: {
        student: {},
        smsLog: {},
      }, // 弹窗信息对象
      imgurl: "", // 图片路径
      captureBigImage: "",
      testscroll: false,
    };
  },
  watch: {
    showinfo(newval) {
      if (!newval) {
        this.$refs.hlsVideoPlayer.closePlayer(0);
      }
    },
  },
  created() {
    this.getwarninglist();
  },
  methods: {
    // 导出
    async exportlist() {
      const res = await exportStudentInfo();
      FileSaver.saveAs(res, "学生信息表.xlsx");
    },
    // 监控框全屏
    windowfullscreen() {
      if (this.testscroll) {
        // 判断是否全屏
        this.exitFullscreen();
        this.testscroll = false;
      } else {
        const ele = document.querySelector(".device");
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
          console.log(11);
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        }
        this.testscroll = true;
      }
    },
    isFullScreen() {
      const ele = document.querySelector(".device");
      return !!(
        ele.fullscreen ||
        ele.mozFullScreen ||
        ele.webkitIsFullScreen ||
        ele.webkitFullScreen ||
        ele.msFullScreen
      );
    },
    exitFullscreen() {
      // 退出全屏
      const ele = document.querySelector(".device");
      if (ele.exitFullScreen) {
        ele.exitFullScreen();
      } else if (ele.mozCancelFullScreen) {
        ele.mozCancelFullScreen();
      } else if (ele.webkitExitFullscreen) {
        ele.webkitExitFullscreen();
      } else if (ele.msExitFullscreen) {
        ele.msExitFullscreen();
        console.log(4);
        ele.msExitFullscreen();
      }
    },
    // 获取告警信息
    async getwarninglist() {
      const res = await studentmessage(this.ruleForm);
      // this.tableData.push(...res.records);
      this.tableData = res.records;
      this.listtotal = res.total;
    },
    // 处理图片
    async chuimg(img, type) {
      if (type === 1) {
        const res = await previewPhotos(img);
        this.imgurl = res;
        console.log(res);
      } else {
        const res = await previewImage(img);
        this.captureBigImage = res;
      }
    },

    // 重置按钮
    restform() {
      this.ruleForm.status = "";
      this.ruleForm.startTime = "";
      this.ruleForm.endTime = "";
      this.ruleForm.address = "";
      this.ruleForm.isSendSms = "";
      this.getwarninglist();
    },
    resetState() {
      this.ruleForm.status = "";
      this.ruleForm.startTime = "";
      this.ruleForm.endTime = "";
      this.ruleForm.address = "";
      this.ruleForm.isSendSms = "";
    },
    // 条件搜索
    async searchlist() {
      const res = await studentmessage(this.ruleForm);
      this.tableData = res.records;
      this.listtotal = res.total;
    },
    // 标记为已处理
    async disposerow() {
      const arr = [];
      this.multipleSelection.forEach((item) => {
        arr.push(item.id);
      });
      await handlerwarn({ warnIds: arr, handleInfo: "已喊话处理" });
      this.$message({
        type: "success",
        message: "已标记为已处理",
      });
      this.getwarninglist();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 选中事件
    handleSelectionChange(val) {
      this.disposeing = false;
      val.forEach((item) => {
        if (item.status == 1) {
          this.$message({
            type: "warning",
            message: "存在已处理事件，请勿重复操作",
          });
          this.disposeing = true;
        }
      });
      this.multipleSelection = val;
    },
    // 表单详情
    async handleEdit(row) {
      const res = await msginfo(row.id);
      console.log(res);
      this.listinfo = res;
      this.numberValidateForm.thingactive = res.status;
      this.numberValidateForm.msg = res.handleInfo;
      this.chuimg(res?.student?.avatar, 1);
      this.chuimg(res?.captureBigImage, 2);
      this.showinfo = true;
      this.$nextTick(() => {
        this.$bus.$emit("changehide", true);
        // this.$bus.$emit('changehide', true)
        this.$refs.hlsVideoPlayer.requestPlay(res.deviceInfo.serviceId, "");
      });
    },
    // 事件状态
    warntype(type) {
      if (type == 1) {
        return "入侵告警";
      }
      if (type == 2) {
        return "人脸告警";
      }
    },
    // 是否触发短信
    inorsms(type) {
      if (type) {
        return "是";
      } else {
        return "无";
      }
    },
    // 事件处理状态
    statutype(type) {
      if (type == 1) {
        return "已处理";
      }
      if (type == 0) {
        return "未处理";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__wrapper .el-dialog {
  margin-top: 3vw !important;
  overflow: auto;
  max-height: 90vh;
}
.info {
  padding: 20px;
}
.el-pagination {
  text-align: right;
  margin-top: 10px;
}
.thingtype {
  color: red;
}
.info-top {
  min-height: 20vw;
  display: flex;
  margin-left: 25px;
  .top-lef {
    width: 50%;
    .leftinfo {
      height: 96%;
      padding: 10px 13px;
      background: #f5f5f5;
      border-radius: 4px;
      border: 1px solid #dddfe6;
      width: 95%;
      // height: 361px;
      margin-right: 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      .info-img {
        .vocers {
          position: absolute;
          top: 84px;
          left: 43%;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #ff1559;
          div {
            text-align: center;
            margin-top: 13px;
            span {
              color: #fff;
              font-size: 12px;
            }
            h4 {
              margin: 0;
              font-size: 15px;
              color: #fff;
              line-height: 25px;
            }
          }
        }
      }
      .info-msg {
        .result {
          div {
            margin-bottom: 8px;
          }
        }
      }
    }
  }
  .top-rig {
    width: 50%;
    .riginfo {
      margin-bottom: 10px;
      width: 100%;
      // height: 174px;
      flex: 1;
      min-height: 120px;
      background: #f5f5f5;
      border-radius: 4px;
      border: 1px solid #dddfe6;
      padding: 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      p {
        font-size: 13px;
        margin: 0;
        span:nth-child(1) {
          margin-right: 5px;
        }
      }
    }
    .listinfo {
      display: flex;
      flex-direction: column;
      height: calc(99% - 16px);
    }
    .device {
      width: 100%;
      height: 174px;
      position: relative;
      #videoPlayers {
        width: 100%;
        height: 100% !important;
      }
      .span {
        position: absolute;
        top: 2%;
        right: 2%;
        font-style: 14px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
.info-bom {
  .el-form-item {
    ::v-deep .el-form-item__content {
      margin-left: 25px !important;
      .el-select {
        width: 100%;
      }
    }
  }
}
::v-deep .el-table .el-table__header-wrapper th {
  background-color: #f0f0f0;
  color: #73767b;
}
.right-cn {
  margin-top: 15px;
  .demo-ruleForm {
    display: flex;
    ::v-deep .el-input__inner {
      padding-right: 0;
      &::placeholder {
        font-size: 12px;
      }
    }
    ::v-deep .el-form-item__label {
      width: 60px !important;
      // min-width: 60px;
    }
    ::v-deep .el-form-item__content {
      display: flex;
      margin-left: 5px !important;
    }
    .el-form-item {
      .el-form-item__label {
        width: 65px !important;
      }
    }
    .times {
      .el-input {
        width: 150px;
        font-size: 12px;

        ::v-deep .el-input__inner {
          padding-right: 0;
        }
      }
    }

    .smscodes {
      ::v-deep .el-input__inner {
        padding-right: 0;
        &::placeholder {
          font-size: 12px;
        }
      }
      .el-form-item__label {
        width: 50px;
      }
    }
    .el-button {
      width: 85px;
      height: 35px;
      line-height: 12px;
      font-size: 13px;
    }
  }
}
.right-bom {
  .bom-t {
    .btnchuli {
      width: 130px;
      height: 32px;
      font-size: 12px;
    }
    .importclass {
      height: 32px;
      font-size: 12px;
    }
  }
}
.right-tab {
  margin-top: 11px;
}
</style>
