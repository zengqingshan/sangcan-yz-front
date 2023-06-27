<template>
  <div>
    <div>
      <div class="devposabs">
        <div class="dev-top">
          <span>{{ deviceobj.name }}</span>
          <div>
            <el-tooltip class="item" effect="dark" content="点击关注" placement="top">
              <i style="font-size: 18px;margin-right: 15px;" :class="{'el-icon-star-on':true,'concerndev':isconcern}" @click="concerndevice" />
            </el-tooltip>
            <!-- <el-tooltip class="item" effect="dark" content="点击标注地址" placement="top">
              <i class="el-icon-location" style="color: #1a94ff;margin-left: 10px;" />
            </el-tooltip> -->
          </div>
        </div>
        <div class="dev-img">
          <img style="width: 100%;height: 100%;" src="../../views/videomonitor/playback/assets/images/bgo.jpg" alt="">
        </div>
        <div class="dev-info">
          <p class="p-one">
            <span class="tops">状态：</span>
            <span class="value">{{ lodigstatus }}<span :class="{'point':true,'openpoint':deviceobj.status,'closepoint':!deviceobj.status}" /></span>
          </p>
          <p style="font-size: 13px;margin-bottom: 5px;">
            <span>组织:</span>
            <span>{{ deviceobj.orgName }}</span>
          </p>
          <p style="font-size: 13px;margin-bottom: 5px;">
            <span>地址:</span>
            <span>{{ deviceobj.address }}</span>
          </p>
        </div>
        <div v-if="!deviceobj.longitude" class="dev-medthods">
          <i class="el-icon-warning" />
          <span>未标注经纬度</span>
          <span class="biaozhu">标注</span>
        </div>
        <div class="dev-gn">
          <div @click="playvdeio"><i class="el-icon-caret-right" /> 预览</div>
          <div @click="showsetting = true"> <i class="el-icon-setting" /> 设置</div>
        </div>
      </div>
    </div>

    <!-- //预览弹窗 -->
    <el-dialog
      v-if="showvedioplay"
      title="预览"
      :visible.sync="showvedioplay"
      width="55%"
      center
      append-to-body
    >
      <div style="height: 450px;">
        <VideoPlayers id="videoPlayers" ref="hlsVideoPlayer" style="width: 100%; height: 100%" />
      </div>

    </el-dialog>

    <!-- 设置弹窗 -->
    <el-dialog
      v-if="showsetting"
      :visible.sync="showsetting"
      width="60%"
      center
      append-to-body
    >
      <el-tabs v-model="activeName" class="tabsetting" @tab-click="handleClick">
        <el-tab-pane label="基本设置" name="first">
          <div class="normalset">
            <div class="nor-top">
              <span>国标设备接入：</span>
              <span style="margin-left: 16%;">{{ deviceobj.name }}</span>
            </div>
            <div class="nor-cen">
              <span>接入许可：</span>
              <div>
                <span>国标许可</span>
                <span>生效时间：2022-03-09 00:00:00</span>
                <span>到期时间：2024-03-09 00:00:00</span>
              </div>
            </div>
            <div class="nor-bom">
              <span>云存储套餐：</span>
              <div>
                <span>7天云存储</span>
                <span>生效时间：2022-03-09 00:00:00</span>
                <span>到期时间：2024-03-09 00:00:00</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="告警设置" name="second">
          <div>
            <span>国际视频告警：</span>
            <el-radio v-model="radio" label="1">开启</el-radio>
            <el-radio v-model="radio" label="2">关闭</el-radio>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备经纬度" name="third">
          <div class="dia1">
            <div class="dia-left">
              <el-input v-model="devicelon" />
            </div>
            <div class="dia-right">
              <el-input v-model="devicelat" />
            </div>
            <el-input v-model="deviceaddress" style="width: 37%;" />
            <el-button type="primary" size="mini" @click="updatadispose">保存</el-button>
          </div>
          <Map
            ref="maps"
            mapid="settimgmap"
            :longitude="longitude"
            :latitude="latitude"
            :new-style="newStyle"
            :type="type1"
            @click-marker-coor="clickMarkerCoor"
          />

        </el-tab-pane>
      </el-tabs>

    </el-dialog>
  </div>
</template>
<script>
import {
  orginfoAndSubOrgInfo,
  orgStarDelete,
  orgStarAdd
} from '@/api/system/org'
import {
  listLocaLevelOrgDevice,
  listDevice

} from '@/api/system/device'
import {
  updateTenant
} from '@/api/system/tenant'
import VideoPlayers from '@/views/videomonitor/playback/components/videosAllVideos.vue'
import Map from '@/components/Map/index'

// import VedioModal from "@/components/videocomponent/VedioModal";

export default {
  components: {
    Map, VideoPlayers
    // VedioModal,
  },
  props: {
    deviceobj: {
      type: Object,
      default: function() {
        return { name: '', status: false, longitude: '', address: '', latitude: '' }
      }
    },
    latitude: String,
    longitude: String,
    address: String,
    orgname: String
  },
  data() {
    return {
      input2: '',
      zimulist: ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],

      infoData: {},
      showmessage: true, // 信息窗口
      showvedioplay: false, // 预览弹窗
      showsetting: false, // 设置弹窗
      activeName: 'first',
      radio: '2', // 国际视频告警
      newStyle: {
        height: '450px',
        width: '100%'
      },
      coor: [],
      type1: ['cluster', 'geocoder'], // 显示地图类型
      devicearr: null,
      type: ['cluster', 'tool', 'info'], // 显示地图类型
      deviceList: [], // 图例设备列表
      drawer: false, // 抽屉
      deviceDetail: {}, // 设备详情
      legendList: [], // 所有设备列表
      devicelon: '', // 设备经度
      devicelat: '', // 设备纬度
      deviceaddress: '', // 设备位置
      isconcern: false // 是否关注设备
    }
  },
  computed: {

    lodigstatus() {
      if (this.deviceobj.status) {
        return '在线'
      } else {
        return '离线'
      }
    }
  },
  watch: {
    input2(newval) {
      if (newval == '') {
        this.showres = true
      }
    },
    showvedioplay(newval) {
      if (!newval) {
        // 关闭监控
        this.$refs.hlsVideoPlayer.closePlayer(0)
      }
    }

  },

  mounted() {
    this.devicelon = this.longitude
    this.devicelat = this.latitude
    this.deviceaddress = this.address
    this.isconcern = this.deviceobj.starFlag
  },
  methods: {
    // 保存坐标
    async updatadispose() {
      await updateTenant({ longitude: this.devicelon, latitude: this.devicelat, address: this.deviceaddress })
      this.$message({
        type: 'success',
        message: '修改成功'
      })
    },
    // 关注设备
    async concerndevice() {
      const param = { orgId: this.deviceobj.orgId }
      if (!this.isconcern) {
        orgStarAdd(param).then(() => {
          this.isconcern = true
        })
      } else {
        orgStarDelete(param).then(() => {
          this.isconcern = false
        })
      }
    },
    // tab切换
    handleClick(tab) {

    },
    clickMarkerCoor(e) {
      this.devicelon = e[0]
      this.devicelat = e[1]
      this.deviceaddress = e[2]
    },
    // 预览
    playvdeio() {
      this.showvedioplay = true
      const deviceId = this.deviceobj.serviceId
      const vname = this.deviceobj.name || '' // 视频名称
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.hlsVideoPlayer.requestPlay(deviceId, vname)
        })
      }, 1000)
    }

  }
}
</script>
<style scoped lang="scss">
.el-tab-pane{
  .dia1 {
  display: flex;
  justify-content: space-around;
  padding: 0 15px;
  position: absolute;
  bottom: 1%;
  z-index: 9999;
  width: 100%;
  .dia-left {
    display: flex;
    flex-direction: column;

    .el-input__inner {
      width: 150px;
    }
  }

  .dia-right {
    display: flex;
    flex-direction: column;

    .el-input__inner {
      width: 150px;
    }
  }
}
}
.tabsetting{
  height: 30vw;
 ::v-deep .el-tabs__content{
    height: 85%;
    .el-tab-pane{
      height: 100%;
    }
  }
 ::v-deep .el-tabs__nav-wrap::after{
    height: 0;
  }
}
.normalset{
  height: 100%;
    display: flex;
    flex-direction: column;
  .nor-top{
    display: flex;
    align-items: center;
    height: 20%;
    border-bottom: 1px #e3e3e3 solid;
    margin-bottom: 10px;
  }
  .nor-cen{
    display: flex;
    height: 30%;
    border-bottom: 1px #e3e3e3 solid;
    div{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      margin-left: 20%;
      line-height: 30px;
    }
  }
  .nor-bom{
    display: flex;
    height: 30%;
    border-bottom: 1px #e3e3e3 solid;
    padding-top: 8px;
    div{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      margin-left: 18%;
      line-height: 30px;
    }
  }
}

.dev-gn{
        display: flex;
        padding: 0 13%;
        line-height: 29px;
        height: 9%;
        justify-content: space-between;
        div{
          cursor: pointer;
          &:hover{
            color: rgb(22, 120, 255);;
          }
        }
      }
      .dev-top{
        .concerndev{
          color: #c9c943 !important;
        }
        display: flex;
        padding: 6px 0;
        text-align: center;
        align-items: center;
        span{
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          text-align: left;
        }
        div{
          display: flex;
          justify-content: space-around;
          i{
            cursor: pointer;
            color: rgb(75, 74, 74);
          }
        }
      }
.selectinput {
  position: absolute;
  z-index: 11;
  right: 26px;
  top: 122px;
}

</style>
