<template>
  <div>

    <div class="infinite-list-wrapper">
      <!-- v-infinite-scroll="loadMoreDevice" -->

      <div class="record-list scroll-list vedio-bottom" infinite-scroll-throttle-delay="500"
        infinite-scroll-disabled="deviceListFinished" infinite-scroll-immediate="false" infinite-scroll-distance="10">
        <div v-for="(item, index) in DeviceImagelist" :key="index" class="list" @click="openvedio(item)">
          <div style=" position: relative;max-height: 150px;">
            <img :src="item.coverUrl" alt="" width="210px" height="116px">
            <!-- <img :key="item.coverUrl" width="210px" height="116px" :src="item.coverUrl"> -->
            <i class="el-icon-upload" />
            <i class="el-icon-star-on" />
            <i :class="{ 'el-icon-star-off': !item.starFlag, 'el-icon-star-on': item.starFlag }"
              @click="starDevice(item, index)" />

            <span>{{ item.name || '' }}</span>

          </div>
        </div>

        <div v-if="loadingError" class="floor">
          <div class="floor text" style="color:red">加载失败</div>
        </div>
     

      <el-button type="primary" size="medium" :loading="loadings" :disabled="disbtn" @click="loadMoreDevice"> {{
          btninner }}</el-button>
      </div>
  

    </div>
    <el-dialog :visible.sync="showveido" width="60%" center :title="vedioname">
      <VideoPlayers id="videoPlayers" ref="hlsVideoPlayer" style="width: 100%; height: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import {
  listPageDevice
} from '@/api/system/device'
import VideoPlayers from './videosAllVideos.vue'
import deviceOfflinePng from "@/assets/images/device_offline.png"
export default {
  components: {
    VideoPlayers
  },
  props: {

  },
  data() {
    return {
      showveido: false,
      vedioname: null,

      loadings: false,
      scrollHeight: 0,

      DeviceImagelist: [],
      activeclass: null,

      disbtn: false,
      btninner: '加载更多',

      loading: false,
      loadingError: false,
      loadingSuccess: false,
      deviceListFinished: false,
      deviceListPageNum: 1,

      deviceListPageSize: 5,

      orgId: undefined

    }
  },
  created() {
  },

  methods: {
    init(orgId) {
      this.deviceListPageNum = 1
      this.loading = false
      this.loadingError = false
      this.loadingSuccess = false
      this.deviceListFinished = false
      this.orgId = orgId
      this.disbtn = false
      this.DeviceImagelist = []
      this.activeclass = null
      this.btninner = '加载更多'
      this.scrollHeight = 0
      this.loadings = false
      this.$nextTick(() => {
        this.LoadDeviceByOrgId()
      })
    },
    openvedio(item) {
      this.showveido = true
      this.vedioname = item.name
      const serviceId = item.serviceId || ''
      const vname = item.deviceName || '' // 视频名称
      this.$nextTick(() => {
        this.$refs.hlsVideoPlayer.requestPlay(serviceId, vname)
      })
    },

    deviceNodeClick(item, index) {
      const scrollEl = this.$refs.mianscroll
      this.scrollHeight = scrollEl.offsetHeight

      this.activeclass = index

      this.$emit('deviceClicked', item.serviceId, item.name)
    },
    loadMoreDevice() {
      this.loadings = true

      this.LoadDeviceByOrgId()
    },

    // 滚动到顶部
    divscolltop() {
      this.$nextTick(() => {

        const scrollEl = this.$refs.mianscroll
        scrollEl.scrollTo({ top: 0, behavior: 'smooth' })
      })
    },
    // 定位元素
    onedivtop() {
      const scrollEl = this.$refs.mianscroll
      scrollEl.scrollTo({ top: this.scrollHeight, behavior: 'smooth' })
    },


    LoadDeviceByOrgId() {
      this.loading = true
      this.loadingError = false
      this.deviceListFinished = false
      const param = {}
      param.orgId = this.orgId
      param.current = this.deviceListPageNum
      param.pageSize = this.deviceListPageSize
      if (this.deviceListPageNum == 1) {
        this.DeviceImagelist = []
      }

      listPageDevice(param).then((ret) => {
        this.loadings = false
        this.deviceListPageNum++ // 成功，加1

        this.deviceListFinished = ret.finish
        const deviceList = (ret.records || [])
        if (deviceList.length == 0 || ret.finish == true) {
          this.btninner = '没有更多'
          this.disbtn = true
        }
        deviceList.forEach(obj => {
          if (!obj.status) {
            obj.coverUrl = deviceOfflinePng
          } else {
            obj.coverUrl = '/assets/images/bgo.jpg'
          }

        })
        this.DeviceImagelist = this.DeviceImagelist.concat(deviceList)

      }).catch(() => {
      })
        .then(() => {
          this.$nextTick(() => {
            this.loading = false
          })
        })
    }

  }

}
</script>

<style lang="scss" scoped>
::v-deep .el-button--medium {
  height: 35px;
  margin: 108px 0 0 30px;
}

::v-deep .el-dialog--center .el-dialog__body {
  height: 450px;
  //   padding: 0;
}

.record-list {
  height: 40vw;
  overflow-y: inherit;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;

  .list {
    margin-top: 10px;
    width: 24%;
    height: 150px;
    margin-left: 1%;
    color: #ffffff;

    img {
      width: 100%;
      max-height: 150px;
      height: 100%;
    }

    .el-icon-upload {
      position: absolute;
      top: 4px;
      left: 4px;
      color: #7373dc;
    }

    .el-icon-star-on {
      position: absolute;
      right: 5px;
      bottom: 5px;
      color: rgb(70,160,252);
    }

    .el-icon-star-off {
      position: absolute;
      right: 5px;
      bottom: 5px;
      color: #ffffff;
    }

    span {
      position: absolute;
      left: 5px;
      bottom: 3px;
    }
  }
}

.infinite-list-wrapper {
  width: 100%;

  .icon-seting {
    ::v-deep .el-dropdown {
      color: #ffffff;
    }
  }
}

.icon-seting {
  display: flex;
  justify-content: space-around;
  color: white;
  font-size: 18px;
  width: 90%;
  margin-top: 15px;
}

::v-deep .el-tabs__header {
  .el-tabs__nav-wrap {
    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }
  }
}
</style>

