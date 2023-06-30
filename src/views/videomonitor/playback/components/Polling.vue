<template>
  <div class="pollss">
    <el-button class="adds" @click="addlosts">
      <i class="el-icon-plus" />添加
    </el-button>
    <el-tooltip :disabled="activeicon != -1" class="item" effect="dark" content="正在大屏轮播" placement="right">
      <div class="poll">
        <p>
          <i class="el-icon-folder" />
          <span>全部设备({{ deviceallarr.length }})</span>
        </p>
        <span class="rt">
          <span v-show="activeicon == -1" class="rt-left">
            <svg width="1em" height="1em"><path fill-rule="evenodd" fill="currentColor" d="M10.000,9.000 L2.000,9.000 C0.895,9.000 -0.000,8.105 -0.000,7.000 L-0.000,2.000 C-0.000,0.895 0.895,-0.000 2.000,-0.000 L10.000,-0.000 C11.104,-0.000 12.000,0.895 12.000,2.000 L12.000,7.000 C12.000,8.105 11.104,9.000 10.000,9.000 ZM11.000,1.000 L1.000,1.000 L1.000,8.000 L11.000,8.000 L11.000,1.000 ZM10.000,12.000 L2.000,12.000 L2.000,11.000 L10.000,11.000 L10.000,12.000 Z" /></svg>
          </span>
          <el-popover
            placement="bottom-end"
            width="90"
            trigger="click"
            style="padding: 0;"
          >
            <div style="height:15px ;" @click="allbigpolling">
              <span>
                <i class="el-icon-monitor" />
                设为大屏轮播
              </span>
            </div>
            <span slot="reference">...</span>
          </el-popover>
        <!-- <i class="el-icon-more-outline rt-right" /> -->
        </span>
      </div>
    </el-tooltip>
    <!-- //test -->
    <div v-for="(item,index) in devarr" :key="index" class="polls">
      <el-tooltip :disabled="activeicon != index" class="item" effect="dark" content="正在大屏轮播" placement="right">
        <p>
          <i class="el-icon-folder" />
          <span>{{ item.name }}({{ item.relNum }})</span>
        </p>
      </el-tooltip>
      <el-popover
        placement="bottom-end"
        width="90"
        trigger="click"
      >
        <div>
          <span @click="geteditinfo(item.id)"><i class="el-icon-edit" />编辑分组</span>
          <span style="color:red" @click="deletelist(item)"><i class="el-icon-delete" />删除分组</span>
          <span @click="bigpolling(item,index)">
            <i class="el-icon-monitor" />
            设为大屏轮播
          </span>
        </div>
        <span slot="reference" class="rt">
          <span v-show="activeicon == index" class="rt-left">
            <svg width="1em" height="1em"><path fill-rule="evenodd" fill="currentColor" d="M10.000,9.000 L2.000,9.000 C0.895,9.000 -0.000,8.105 -0.000,7.000 L-0.000,2.000 C-0.000,0.895 0.895,-0.000 2.000,-0.000 L10.000,-0.000 C11.104,-0.000 12.000,0.895 12.000,2.000 L12.000,7.000 C12.000,8.105 11.104,9.000 10.000,9.000 ZM11.000,1.000 L1.000,1.000 L1.000,8.000 L11.000,8.000 L11.000,1.000 ZM10.000,12.000 L2.000,12.000 L2.000,11.000 L10.000,11.000 L10.000,12.000 Z" /></svg>
          </span>
          <span>
            ...
          </span>
        </span>
      </el-popover>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :title="diatitle"
      :visible.sync="showdialog"
      width="70%"
      center
      top="2%"
    >
      <el-input v-model.trim="value" class="inputs" placeholder="请输入分组名称" />
      <div class="dialogdiv">
        <div style="width: 25%;">
          <pollleft />
        </div>
        <div style="width: 24%;">
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

                  <img v-if="item.status" style="width: 203px;height: 115px;" :src="item.coverUrl">
                  <img v-else style="width: 203px;height: 115px;" src="@/assets/images/device_offline.png">
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
        </div>
        <div style="width: 45%;">
          <pollright ref="pollright" />
        </div>
      </div>
      <el-button class="buttn" @click="centerDialogVisible = false">取消</el-button>
      <el-button @click="addoredit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPageDevice
} from '@/api/system/device'
import { listDeviceGroup, getDeviceGroupinfo, addDeviceGroup, deleteDeviceGroup, editDeviceGroup } from '@/api/system/devicegroup'
import { listDevice } from '@/api/system/device'
import pollleft from './pollleft.vue'
// import Pollmiddle from './pollmiddle.vue'
import Pollright from './pollright.vue'
export default {
  components: { pollleft, Pollright },
  props: {
    polling: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      deviceallarr: [], // 全部设备列表数组
      devarr: [], // 设备分组列表
      showdialog: false, // 显示弹窗
      value: '', // 输入框的值
      diatitle: '添加分组',

      choosechecked: '', // 全选框失效的操作
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
      idlist: [], // 编辑状态接收的id数组
      acticeedit: false, // 编辑状态
      editId: '', // 编辑的分组的ID
      activeicon: -1 // 动态展示图标
    }
  },
  watch: {
    checked(newval) {
      if (newval == true) {
        this.DeviceImagelist.forEach(item => {
          item.activeborder = true
        })
        this.choosearr = []
        this.choosearr.push(...this.DeviceImagelist)
        this.$bus.$emit('checkedall', this.DeviceImagelist)
      } else {
        if (this.choosechecked == 'chooselist') { // 表示点击的列表取消的全选
          this.choosechecked = ''
          return
        }
        this.DeviceImagelist.forEach(item => {
          item.activeborder = false // 全部取消全选状态
        })
        this.choosearr.splice(0)
        this.$bus.$emit('uncheckedall', this.DeviceImagelist) // 通知右侧组件清除数据
      }
    },
    polling(newval) {
      if (newval == 'polling') {
        this.$bus.$emit('getconcerninfo', this.deviceallarr)
      }
    }
  },
  created() {
    this.LoadDeviceByOrgId()
    this.getdevlist()
    this.getalldevice()
    this.showdialog = true
    setTimeout(() => { // 解决加载页面时dialog弹窗还创建的问题
      this.showdialog = false
    }, 10)
  },
  mounted() {
    this.$bus.$on('deletechoose', (item) => {
      this.choosechecked = 'chooselist'

      this.DeviceImagelist.forEach((item1, index) => {
        if (item1.id == item.id) {
          this.choosearr.splice(index, 1)

          this.$set(this.DeviceImagelist[index], 'activeborder', false)
        }
      })
      this.setCheckFlag()
    })
    this.$bus.$on('flushedlist', (id) => {
      this.choosechecked = 'chooselist'
      this.orgId = id
      this.deviceListPageNum = 1
      this.LoadDeviceByOrgId()
    })
  },
  methods: {
    setCheckFlag() {
      let checkedCount = 0

      this.DeviceImagelist.forEach((item, index) => {
        if (item.activeborder) {
          checkedCount++
        }
      })
      if (checkedCount > 0 && checkedCount == this.DeviceImagelist.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    addlosts() {
      this.diatitle = '添加分组'
      this.value = ''
      this.showdialog = true
      this.DeviceImagelist.forEach(item => {
        item.activeborder = false
        this.choosearr.splice(0)
      })
      this.setCheckFlag()
      this.$bus.$emit('uncheckedall')
    },
    // 删除分组
    async deletelist(obj) {
      await deleteDeviceGroup({ id: obj.id })
      this.getdevlist()
      this.$message({
        type: 'success',
        message: '删除分组成功'
      })
    },
    // 获取分组设备列表
    getdevlist() {
      listDeviceGroup({}).then(res => {
        this.devarr = res
      })
    },
    // 获取全部信息列表
    async getalldevice() {
      const res = await listDevice({})
      this.deviceallarr = res

      this.$bus.$emit('pollvedio', res)
    },
    // 编辑分组获取数据回显
    async geteditinfo(id) {
      this.diatitle = '编辑分组'
      this.showdialog = true
      this.acticeedit = true // 表示此时是编辑状态
      this.choosearr.splice(0) // 先清空数据
      this.$refs.pollright.itemarr.splice(0) // 清空右侧数据
      this.DeviceImagelist.forEach((i, index) => {
        this.$set(this.DeviceImagelist[index], 'activeborder', false)
      })

      this.editId = id
      const res = await getDeviceGroupinfo({ id })

      this.value = res.name
      res.deviceList.forEach((item, index2) => {
        this.DeviceImagelist.forEach((item1, index) => {
          if (item.id == item1.id) {
            this.$set(this.DeviceImagelist[index], 'activeborder', true)
            this.choosearr.push(item1)
            this.$bus.$emit('additem', item1)
          }
        })
      })

      this.setCheckFlag()
    },
    // 选择设备
    chooselist(item) {
      item.activeborder = !item.activeborder
      if (item.activeborder == true) { // 选中状态的操作
        this.choosearr.push(item)
        this.$bus.$emit('additem', item)
      } else { // 取消选中状态的操作
        this.choosechecked = 'chooselist'
        this.$bus.$emit('removeitem', item)
        this.choosearr.forEach((item1, index) => {
          if (item1.id == item.id) {
            this.choosearr.splice(index, 1)
          }
        })
      }
      this.setCheckFlag()
    },
    // 获取更多
    loadMoreDevice() {
      this.choosechecked == 'chooselist'
      this.LoadDeviceByOrgId()
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
        this.setCheckFlag()
      }

      listPageDevice(param).then((ret) => {
        this.deviceListPageNum++ // 成功，加1
        this.deviceListFinished = ret.finish
        const deviceList = (ret.records || [])
        if (deviceList.length == 0 || ret.finish == true) {
          this.btninner = '没有更多'
          this.disbtn = true
        } else {
          this.btninner = '加载更多'
          this.disbtn = false
        }
        deviceList.forEach(obj => {
          if (this.checked == true) {
            obj.activeborder = true
            this.choosearr.push(obj)
            this.$bus.$emit('additem', obj)
          } else {
            obj.activeborder = false
          }
        })
        this.DeviceImagelist = this.DeviceImagelist.concat(deviceList)
        // 与右侧数据做对比
        this.$refs.pollright.deviceifarr.forEach(itemid => {
          this.DeviceImagelist.forEach(item1 => {
            if (item1.id == itemid) {
              item1.activeborder = true
            }
          })
        })

        console.log(555, this.DeviceImagelist)
        this.setCheckFlag()
      }).catch(() => {
      })
        .then(() => {
          this.$nextTick(() => {
            this.loading = false
          })
        })
    },

    // 编辑分组
    async editarr() {
      const params = {}
      params.deviceList = this.$refs.pollright.deviceifarr
      params.name = this.value
      params.id = this.editId
      await editDeviceGroup(params).catch(() => {
        this.$message({
          type: 'error',
          message: '修改失败,请稍后重试'
        })
      })
      this.$message({
        type: 'success',
        message: '修改成功'
      })
      this.acticeedit = false
      this.showdialog = false
      this.getdevlist()
    },

    // 保存分组
    async addgroup() {
      const obj = {}
      obj.deviceList = this.$refs.pollright.deviceifarr
      obj.name = this.value
      if (obj.deviceList.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择分组设备'
        })
        return
      } else if (obj.name == '') {
        this.$message({
          type: 'warning',
          message: '请输入分组名称'
        })
        return
      }
      await addDeviceGroup(obj)
      this.getdevlist()
      this.$message({
        type: 'success',
        message: '添加分组成功'
      })
      this.showdialog = false
      this.value = ''
      this.choosearr.splice(0)
      this.middlearr.splice(0)
      this.DeviceImagelist.forEach(item => {
        item.activeborder = false
      })

      this.setCheckFlag()
      this.$bus.$emit('uncheckedall')
    },

    // 判断编辑还是保存
    addoredit() {
      if (this.acticeedit) {
        this.editarr()
      } else {
        this.addgroup()
      }
    },

    // 设为大屏轮播
    async bigpolling(item, index) {
      this.activeicon = index
      const res = await getDeviceGroupinfo({ id: item.id })

      // 改变右侧列表数据
      this.$bus.$emit('bigpollinfo', res.deviceList)
    },

    // 全部设备大屏轮播
    allbigpolling() {
      this.activeicon = -1
      this.$bus.$emit('bigpollinfo', this.deviceallarr)
    }

  }
}
</script>

<style lang="scss" scoped>
.inputs{
  width: 25%;
    margin-bottom: 1%;
    margin-top: 1%;
}

.buttn{
  margin-left: 45%;
    margin-top: 2%;
}
::v-deep .pollss .el-button--medium{
  background-color: #e8e8e8;
  color: black;
}
.dialogdiv{
  display: flex;
  justify-content: space-between;
  min-height: 940px;
}

::v-deep .el-dialog__body{
  .el-input{
    .el-input__inner{
      margin: 0;
    }
  }
  .el-button--medium{
    width: 7%;
  }
}
.el-popper{
  padding: 0;
}
 .el-popper{
  padding: 0 !important;
  div{
    display: flex;
    flex-direction: column;
    text-align: center;
    height: 100px;
    justify-content: space-around;
    span{
      cursor: pointer;
      height: 30px;
    line-height: 30px;

      &:hover{
        background-color: #c1c1c1;
        color: #3893e3;
      }
    }
  }
}
.poll{
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    padding: 12px;
    align-items: center;
    cursor: pointer;
    &:hover{
      background-color: #5d5d5d;
    }
    p{
      margin: 0;

      span{
        margin-left: 5px;
        font-size: 13px;
      }
    }
    .rt{
      display: flex;
      .rt-left{
        color: red;
        margin-right: 5px;
        margin-top: 7px;
        display: inline-block;
      }
      .rt-right{
        transform: rotateZ(0deg);
        color: white;
      }
    }
}
.polls{
  display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding: 12px;
    align-items: center;
    cursor: pointer;
    &:hover{
      background-color: #5d5d5d;
    }
    p{
      margin: 0;
      flex: 1;
      span{
        margin-left: 5px;
        font-size: 13px;
      }
    }
    .rt{
      display: flex;
      .rt-left{
        color: red;
        margin-right: 5px;
        margin-top: 7px;
        display: inline-block;
      }
      .rt-right{
        transform: rotateZ(0deg);
        color: white;
      }
    }
}
.adds{
  width: 100%;
  background-color: #373737;
  border: 1px solid #373737;
  color: white;
}

 ::v-deep .el-icon-plus{
    margin-right: 10px;
 }
 .pollmiddle{
    border: 1px solid #ccc;
    padding: 16px;
    min-height: 940px;
    max-height: 940px;
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
}

.list div img {
  // width: 100%;
  // height: 100%;
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
