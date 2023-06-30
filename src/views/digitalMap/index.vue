<template>
  <div class="diamap">
    <!-- @device-click="deviceClick" -->
    <Map
      ref="map"
      :new-style="newStyle"
      mapid="bigmap"
      :type="type"
      :device-list="deviceList"
      :legend-list="legendList"
    />
    <!-- 设备树 -->
    <div class="legend devictree">
      <div class="top">
        <el-input
          v-model.trim="devicename"
          placeholder="请输入设备名称"
          prefix-icon="el-icon-search"
          clearable
          @change="searchdevicelist"
        />
        <i
          :class="{
            'el-icon-d-arrow-right': hidetree,
            'el-icon-d-arrow-left': !hidetree,
          }"
          @click="hidetrees"
        />
      </div>
      <div v-show="hidetree" class="bom1">
        <el-tree
          v-show="showres"
          id="dev-tree"
          ref="devTree"
          node-key="key"
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
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span style="padding: 0 5px">
              <span
                v-if="data.type == 'org'"
              ><!--机构图标-->
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

              <!--设备图标-->
              <span
                v-if="data.type == 'device'"
                :class="[
                  {
                    'icon-video-camera-offline': !data.deviceStatus,
                    'icon-video-camera-online': data.deviceStatus,
                  },
                ]"
              ><svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="video-camera"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560zm176-167l-104-59.8V458.9L888 399v226zM208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
                />
              </svg>
              </span>

              <span
                class="ellipsis"
                style="user-select: none; margin-left: 4px"
                :title="node.label"
              >{{ node.label }}</span>
              <span
                v-if="data.type == 'device'"
                style="color: rgb(70, 160, 252); margin-left: 5px"
              />
            </span>
          </span>
        </el-tree>

        <div v-show="!showres" class="searchresult">
          <p>共{{ devtotal }}条记录</p>
          <div class="ct">
            <div v-for="(item,index) in searchlist" :key="index" class="devlist" @click="showdevice(item)">
              <div class="top1">
                <div class="top-top">{{ zimulist[index] }}</div>
                <div class="top-bom" />
              </div>
              <div class="bom">
                <span>{{ item.name }}</span>
                <p />
              </div>
            </div>
            <el-pagination small layout="prev, pager, next" :total="devtotal" :current-page.sync="current" />
          </div>
        </div>
      </div>
    </div>
    <infodialog
      v-if="showdia"
      ref="info"
      :valueleft="valueleft"
      :valueright="valueright"
      :valueaddress="valueaddress"
      :deviceobj="deviceobj"
    />
  </div>
</template>
<script>
import { listOrg } from '@/api/system/org'
import infodialog from '../../components/Map/infoDialog.vue'
import { orginfoAndSubOrgInfo } from '@/api/system/org'
import {
  listLocaLevelOrgDevice,
  listDevice,
  getInfoWithParams
} from '@/api/system/device'
import {
  listPageDevice, getInfo, editdevicename
} from '@/api/system/device'
import VideoPlayers from '@/views/videomonitor/playback/components/videosAllVideos.vue'
import Map from '@/components/Map/index'
import InfoDialog from '../../components/Map/infoDialog.vue'
// import VedioModal from "@/components/videocomponent/VedioModal";

export default {
  components: {
    Map,
    VideoPlayers,
    infodialog
    // VedioModal,
  },
  data() {
    return {
      showdia: false,
      valueright: '',
      valueleft: '',
      valueaddress: '',
      devicename: '',
      zimulist: [
        'A',
        'B',
        'C',
        'D',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N'
      ],
      // 树结构
      treeProps: {
        label: (data, node) => {
          var label = data.name

          if (
            data.type == 'org' &&
            data.onelineNum != null &&
            data.deviceNum != null
          ) {
            label += ` [${data.onelineNum}/${data.deviceNum}]`
          }
          return label
        },
        isLeaf: (data, node) => {
          return this.treeLeaf(data)
        },
        disabled: (data, node) => {
          return this.treeLeaf(data)
        }
      },
      treeLoading: false,
      defExpandDevs: [],
      hidetree: true, // 树的隐藏和显示
      showres: true, // 展示结果
      deviceobj: {}, // 设备信息对象
      showmessage: false, // 信息窗口
      showvedioplay: false, // 预览弹窗
      showsetting: false, // 设置弹窗
      activeName: 'first',
      radio: '2', // 国际视频告警

      coor: [],
      type1: ['cluster', 'geocoder'], // 显示地图类型
      devicearr: null,
      newStyle: {
        width: '100%',
        height: '100%',
        margin: 0
      },
      type: ['cluster', 'tool'], // 显示地图类型
      deviceList: [], // 图例设备列表
      drawer: false, // 抽屉
      deviceDetail: {}, // 设备详情
      legendList: [], // 所有设备列表
      orgname: '', // 组织名称
      orgList: [],
      current: 1,
      pageSize: 10,
      searchlist: [], // 搜索的设备列表
      devtotal: 0 // 设备总数
    }
  },
  computed: {
    treeEmptyText() {
      return this.treeLoading ? '加载中...' : '暂无数据'
    },
    lodigstatus() {
      if (this.deviceobj.status) {
        return '在线'
      } else {
        return '离线'
      }
    }
  },
  watch: {
    devicename(newval) {
      if (newval == '') {
        this.showres = true
      }
    },
    current(newval) {
      this.searchdevicelist()
    }

  },
  mounted() {
    // 获取设备列表
    this.getDeviceDataSet()
    // 在地图上显示设备
    // this.$ref.map
  },
  created() {
  },
  methods: {
    showdevice(item) {
      this.$refs.map.bounce(item)
    },
    // 获取设备
    async getDeviceDataSet() {
      this.orgList = await listOrg({})

      const res = await listDevice({ isFilter: true })
      if (!res) return []
      const deviceListTemp = []
      res.forEach((item) => {
        // 离线云台
        // if (!item.isControl && !item.status) {
        //     this.deviceList = [...this.deviceList, item];
        // }
        // 设备类型为1-4中的一种
        this.orgList.forEach((orgItem) => {
          if (item.orgId == orgItem.id) {
            item.orgName = orgItem.name
          }
        })
      })
      this.deviceList = res
      this.legendList = res
    },
    clickMarkerCoor(e) {
      this.coor = e
      this.valueleft = e[0]
      this.valueright = e[1]
      this.valueaddress = e[2]
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
    },
    hidetrees() {
      this.hidetree = !this.hidetree
      this.showmessage = false
    },
    // 搜索框
    async searchdevicelist() {
      if (this.devicename) {
        const queryParams = {
          name: this.devicename,
	        getStarFlag: false,
          current: this.current,
          pageSize: this.pageSize
        }
        this.showres = false
        const res = await listPageDevice(queryParams)
        this.searchlist = res.records
        this.devtotal = res.total
        console.log(222, res)
      }
    },
    // 树方法
    treeLeaf(data) {
      if (data.type == 'device') {
        return true
      } else if (
        data.type == 'org' &&
        data.children != undefined &&
        data.children != null &&
        data.children.length == 0
      ) {
        if (data.deviceNum > 0) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    },
    treeLoad(node, resolve) {
      if (node.level === 0) {
        this.treeLoadOrg(node, resolve)
      } else {
        if ((node.data.type = 'org')) {
          if (node.data.children.length > 0) {
            this.treeLoadOrg(node, resolve)
          } else {
            if (node.data.deviceNum > 0) {
              this.treeLoadDevice(node, resolve)
            } else {
              resolve([])
            }
          }
        }
      }
    },
    treeLoadDevice(node, resolve) {
      let orgId
      if (node.data) {
        orgId = node.data.id
      }
      listLocaLevelOrgDevice({ orgId: orgId }).then((ret) => {
        const deviceList = ret
        deviceList.forEach((device) => {
          device.type = 'device'
          device.key = 'device_' + device.id
        })
        resolve(deviceList)
      })
    },
    // 请求树节点信息
    treeLoadOrg(node, resolve) {
      let orgId
      if (node.data) {
        orgId = node.data.id
      }
      orginfoAndSubOrgInfo({ orgId: orgId })
        .then((org) => {
          this.orgname = org.name
          let orgList = []
          org.type = 'org'
          org.key = 'org_' + org.id

          if (node.level == 0) {
            this.defExpandDevs.push(org.key)
            orgList.push(org)
          } else {
            orgList = org.children || []
            orgList.forEach((childOrg) => {
              childOrg.type = 'org'
              childOrg.key = 'org_' + childOrg.id
            })
          }

          resolve(orgList)
        })
        .catch(() => {})
        .then(() => {
          this.treeLoading = false
        })
    },
    treeNodeRightClick(event, data, node, c) {
      this.contextMenuNodeData = data
      this.contextMenuNode = node
      this.pnode = node.parent
      var new_event
      if (typeof MouseEvent === 'function') {
        new_event = new MouseEvent(event.type, event)
      } else {
        new_event = document.createEvent('MouseEvents')
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
        )
      }
      this.contextMenuTarget.dispatchEvent(new_event)
    },
    // 节点点击事件
    async storeNodeClick(data, node) {
      if (node.data.type == 'org') {
        return
      }

      const param = { id: node.data.id, getStarFlag: true }
      const deviceInfo = await getInfoWithParams(param)

      this.valueleft = deviceInfo.longitude
      this.valueright = deviceInfo.latitude
      this.valueaddress = deviceInfo.address

      this.orgList.forEach((item) => {
        if (item.id == deviceInfo.orgId) {
          deviceInfo.orgName = item.name
        }
      })
      this.deviceobj = deviceInfo

      this.showdia = true
      this.$refs.map.bounce(deviceInfo)
    }
  }
}
</script>
<style scoped lang="scss">
.diamap{
  height: calc(100vh - 120px);
  margin: 0;
}
.diamap > div:nth-child(3){
  display: none;
}
.searchresult {
  color: black;
  height: calc(99% - 30px);
  .ct {
    max-height: calc(99% - 50px);
    overflow: auto;
  }
  p {
    margin: 0px 0px 5px 10px;
    font-size: 13px;
  }
  .el-pagination {
    position: absolute;
    bottom: 1px;
    width: 100%;
    text-align: center;
  }
  .devlist {
    margin-top: 7px;
    min-height: 50px;
    width: 100%;
    display: flex;
    cursor: pointer;

    .top1 {
      width: 40px;
      height: 30px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      .top-top {
        width: 22px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        background: #f34635;
        color: #fff;
        border-radius: 50%;
      }
      .top-bom {
        position: absolute;
        top: 20px;
        left: 16px;
        width: 0px;
        height: 0px;
        border: 4px solid transparent;
        background: #f34635;
        transform: rotateZ(45deg);
      }
    }
    .bom {
      display: flex;
      flex-direction: column;
      span {
        font-weight: 600;
        color: #888;
      }
    }
    &:hover {
      background: #ededed;
      .searchresult .devlist .top{
        background-color: #ededed;
      }
    }
  }
}

.devictree {
  position: absolute;
  top: 31px;
  left: 30px;
  width: 300px;
  .top {
    display: flex;
    padding: 5px 10px;
    background-color: #fff;
    ::v-deep .el-input--medium {
      width: 91%;
      .el-input__inner {
        border-radius: 0;
        height: 30px;
        line-height: 30px;
        background-color: #eee;
      }
      .el-input__prefix {
        position: absolute;
        top: -3px;
      }
    }
    .el-icon-d-arrow-right {
      cursor: pointer;
      color: #888;
      transform: rotateZ(90deg);
    }
    .el-icon-d-arrow-left {
      cursor: pointer;
      color: #888;
      transform: rotateZ(90deg);
    }
  }
  .bom1 {
    width: 300px;
    height: 500px;
    background: #fff;
    .el-tree {
      font-size: 13px;
      ::v-deep .el-tree-node__content {
        &:hover {
          background-color: #5dabfc;
          color: #fff;
        }
      }
    }
  }

}

</style>
