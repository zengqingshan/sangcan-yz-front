<template>
  <div class="pollmiddle">
    <span style="display: block;margin-bottom: 10px;">设备列表</span>
    <div>
      <el-checkbox v-model="checked">全选</el-checkbox>
      <div
        v-for="(item, index) in DeviceImagelist "
        :key="index"
        :class="{'list':true,'activeborer':item.activeborder}"
        @click="chooselist(item)"
      >
        <div :ref="'divs' + index">

          <img src="../assets/images/bgo.jpg">

          <span class="listspan">{{ item.name }}</span>
        </div>
        <span class="spansvg">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="check-square" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM695.5 365.7l-210.6 292a31.8 31.8 0 01-51.7 0L308.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H689c6.5 0 10.3 7.4 6.5 12.7z" /></svg>
        </span>
      </div>

      <div v-if=" loadingError " class="floor">
        <div class="floor text" style="color:red">加载失败</div>
      </div>
      <el-button class="middlebtn" type="primary" size="medium" :loading=" loadings " :disabled="disbtn" @click="loadMoreDevice"> {{
        btninner }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  listPageDevice,
  deviceStarDelete,
  deviceStarAdd
} from '@/api/system/device'
export default {
  data() {
    return {
      num: 0,
      loadingError: false,
      loadings: false, // 加载按钮的loading
      checked: false,
      DeviceImagelist: [], // 设备列表
      disbtn: false,
      btninner: '加载更多',
      deviceListPageNum: 1,
      deviceListPageSize: 5,
      orgId: undefined,
      deviceListFinished: false,
      choosearr: [], // 选择的列表数组
      middlearr: [], // 点击节点时的中转数组
      idlist: [] // 编辑状态接收的id数组
    }
  },
  watch: {
    choosearr: {
      deep: true,
      handler(newval) {
        if ((newval.length == this.DeviceImagelist.length) && this.DeviceImagelist.length != 0) {
          this.checked = true
        } else {
          this.checked = false
        }
      }
    },
    checked(newval) {
      // if (this.middlearr.length > 0) {
      //   return
      // }
      if (newval == true) {
        this.DeviceImagelist.forEach(item => {
          item.activeborder = true
        })
        this.choosearr = []
        this.choosearr.push(...this.DeviceImagelist)
        this.num = 0
        this.$bus.$emit('checkedall', this.DeviceImagelist)
      } else {
        if (this.num == 2) {
          this.num = 0
          return
        }
        if (this.num == 0) { // 表示是点击全选按钮引起的取消全选

          this.DeviceImagelist.forEach(item => {
            item.activeborder = false // 全部取消全选状态
          })
          this.choosearr.splice(0)
          this.$bus.$emit('uncheckedall', this.DeviceImagelist) // 通知右侧组件清除数据
        } else {
          this.num = 0
        }
      }
    },
    // 监听总数组，确保切换节点时选中数据保持一致
    DeviceImagelist: {
      deep: true,
      handler(newval) {
        this.num = 2
        this.checked = false
        this.middlearr = []
        newval.forEach(item => {
          this.choosearr.forEach(i => {
            if (item.id == i.id) {
              item.activeborder = true
              this.middlearr.push(item) // 当前选中的列表项
            }
          })
        })
        if (this.middlearr.length == newval.length) {
          // 如果当前选中的列表项数组长度与新列表数组长度相同，则是全选
          this.checked = true
        }
      }
    }
  },
  created() {
    this.LoadDeviceByOrgId()
  },
  mounted() {
    this.$bus.$on('deletechoose', (item) => {
      this.DeviceImagelist.forEach((item1, index) => {
        if (item1.id == item.id) {

          this.choosearr.splice(index, 1)
          this.DeviceImagelist[index].activeborder = false
        }
      })
    })
    this.$bus.$on('flushedlist', (id) => {
      this.orgId = id
      this.deviceListPageNum = 1
      this.LoadDeviceByOrgId()
    })
  },
  methods: {
    // 选择设备
    chooselist(item) {
      item.activeborder = !item.activeborder
      if (item.activeborder == true) { // 选中状态的操作
        this.choosearr.push(item)
        this.$bus.$emit('additem', item)
      } else { // 取消选中状态的操作
        this.num = 1
        this.$bus.$emit('removeitem', item)
        this.choosearr.forEach((item1, index) => {
          if (item1.id == item.id) {
            this.choosearr.splice(index, 1)
          }
        })
      }
    },
    // 获取更多
    loadMoreDevice() {
      this.LoadDeviceByOrgId()
    },
    starDevice(item, index) {
      const param = { deviceId: item.id }
      if (item.starFlag) {
        deviceStarDelete(param).then(() => {
          item.starFlag = false
          this.$set(this.DeviceImagelist[index], 'starFlag', false)
        })
      } else {
        deviceStarAdd(param).then(() => {
          item.starFlag = true
          this.$set(this.DeviceImagelist[index], 'starFlag', true)
        })
      }
    },
    // 获取设备列表
    LoadDeviceByOrgId() {
      const param = {}
      param.orgId = this.orgId
      param.current = this.deviceListPageNum
      param.pageSize = this.deviceListPageSize
	  param.getStarFlag = false
      if (this.deviceListPageNum == 1) {
        this.DeviceImagelist = []
      }

      listPageDevice(param).then((ret) => {
        this.deviceListPageNum++ // 成功，加1
        this.deviceListFinished = ret.finish
        const deviceList = (ret.records || [])
        if (deviceList.length == 0 || ret.finish == true) {
          this.btninner = '没有更多'
          this.disbtn = true
        }
        deviceList.forEach(obj => {
             if(!obj.coverUrl){
				obj.coverUrl = '../assets/images/bgo.jpg'
		   }
          obj.activeborder = false
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

<style scoped lang="scss">

 .pollmiddle{
    border: 1px solid #ccc;
    padding: 16px;
    // min-height: 940px;
    max-height: 993px;
    overflow: auto;
    ::-webkit-scrollbar-track {
  background-color: #ffffff;
  border-radius: 32px;
  // margin-top: 100px;
}
    .middlebtn{
        width: 50% !important;
        margin-left: 23%;
    }
  //   .el-tree-node__content{
  //     &:hover{
  //   background-color: #ffffff;
  // }
  //   }

}
.activeborer{
        border:4px solid  #409eff !important;
        .spansvg{
          display: inline-block !important;
        }
    }
.list {
  width: 14vw;
  position: relative;
  margin-bottom: 10px;
  .listspan{
    position: absolute;
    bottom: 3px;
    left: 6px;
    color: white;
    width: 90%;
    font-size: 12px;
  }
  .spansvg{
    position: absolute;
    top: 3px;
    left: 4px;
    font-size: 20px;
    display: none;
    color: white;
  }
}

.list div {
  overflow: hidden;
  border: 3px solid black;
//   &:focus{
//     border: 3px solid #409eff;
//   }
}

.list div img {
  width: 100%;
  height: 100%;
  cursor: pointer;

}
.vedio-bottom div .el-icon-upload {
  position: absolute;
  left: 2%;
  top: 2%;
  color: #7474ef;
  font-size: 18px;
}
</style>
