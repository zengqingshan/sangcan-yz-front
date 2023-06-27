<template>
  <div class="contron">
    <el-empty v-if="deviceList.length == 0" :image-size="100" />

    <div v-for="(item, index) in deviceList" :key="index" class="shebeidiv">
      <div class="shedivchild" @click="handleDeviceClick(item)">

        <div class="top">
          <div class="left">
            <i class="el-icon-video-camera" style="margin-right: 5px;" />
            <span class="na">
              <span v-html="item.name" />

            </span>
          </div>
          <el-popover
            placement="bottom"
            width="150"
            trigger="click"
          >
            <span class="spans" @click="editdeviceinfo(item.id)"><i class="el-icon-edit" />修改设备名称</span>
            <i slot="reference" class="el-icon-more" />
          </el-popover></div>
        <div class="bom">
          {{ item.orgName }}
        </div>
      </div>

    </div>
    <el-button v-if="hidemore" class="lodmore" :loading="loding" @click="loadmore">加载更多</el-button>
    <span v-else class="spanstwo">没有更多了</span>
    <!-- 修改设备名称 -->
    <el-dialog
      title="修改摄像机名称"
      :visible.sync="showeditvedioinfo"
      width="35%"
      center
    >
      <div class="dialog">
        <p style="margin-top:30px;">
          <span style="font-size: 13px;margin-left: 14px;">摄像机现有名称：</span>
          <span>{{ nowname }}</span>
        </p>
        <p class="p-form">
          <el-form ref="numberValidateForm" :model="numberValidateForm" label-width="110px" class="demo-ruleForm">
            <el-form-item
              label="摄像机新的名称"
              prop="name"
              :rules="[
                { required: true, message: '名称不能为空'}
              ]"
            >
              <el-input v-model.number="numberValidateForm.name" autocomplete="off" />
            </el-form-item>
          </el-form></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showeditvedioinfo = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('numberValidateForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPageDevice, getInfo, editdevicename
} from '@/api/system/device'
export default {
  name: 'SearchShebei',
  data() {
    return {
      deviceList: [],
      searchKey: '',
      current: 1,
      pageSize: 10,
      showeditvedioinfo: false,
      numberValidateForm: {
        name: ''
      },
      nowname: '', // 设备现有名称
      devid: null, // 设备id
      loding: false,
      hidemore: true
    }
  },

  methods: {
    // 加载更多
    loadmore() {
      this.current++
      this.searchDevice()
    },
    // 保存修改
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          await editdevicename({ id: this.devid, name: this.numberValidateForm.name })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.numberValidateForm.name = ''
          this.showeditvedioinfo = false
          // 重新拉取设备列表
          this.current = 1
          this.searchDevice()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改设备名称的数据回显
    async editdeviceinfo(id) {
      this.devid = id
      const res = await getInfo(id)
      this.nowname = res.name
      this.showeditvedioinfo = true
    },
    handleDeviceClick(item) {
      this.$emit('searchedDeviceClick', item.serviceId, item.deviceName)
    },
    heightLight(devList, keyWords) {
      devList.forEach(e => {
        if (keyWords.length > 0 && e.name.length > 0) {
          const replaceReg = new RegExp(keyWords, 'ig')
          const replaceString = `<span style="color: #1890ff">${keyWords}</span>`
          e.deviceName = e.name
          e.name = e.name.replace(replaceReg, replaceString)
          e.key = 'device_' + e.serviceId
        }
      })
    },
    searchDevice() {
      this.loding = true
      const queryParams = {
        name: this.searchKey,
		getStarFlag:false,
        current: this.current,
        pageSize: this.pageSize
      }
      if (this.current == 1) {
        this.deviceList = []
      }
      this.loading = true
      listPageDevice(queryParams).then((res) => {
        this.loding = false
        const ret = (res.records || [])
        this.heightLight(ret, this.searchKey)

        this.deviceList = this.deviceList.concat(ret)
        if (this.deviceList.length == res.total) { // 表示已经全部加载完了
          this.hidemore = false
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
 .p-form{
  margin-top: 30px;
  .el-form{
    .el-form-item{
      ::v-deep .el-form-item__content{
        margin-left: 110px !important;
      }
    }
  }
  }

.spans{
  display: inline-block;
    width: 100%;
    text-align: center;
    cursor: pointer;
    &:hover{
      color: #5050ca;
    // background-color: #d8d7d6;
    }
}
.contron {
  color: white;
    max-height: 31vw;
    overflow: auto;
    .lodmore{
      border: 0;
      background-color: #1890ff;
      color: #ffffff;
      margin-left: 25%;
    }
  .spanstwo{
    display: block;
    width: 100%;
    text-align: center;
    font-size: 13px;
    color: #7a7a7a;
  }
.shebeidiv{
  margin-bottom: 10px;
  cursor: pointer;
  &:hover{
    background-color: #424547;
  }
  .shedivchild{
    // background-color: #424547;
    padding: 7px 4px;
    padding-right: 0;
  }
}
  .top {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding-right: 5px;

    .left {
      i {
        color: #5050fd;
        font-size: 15px;
      }

      span {
        // margin-left: 5px;
      }
    }

    .el-icon-more {
      color: #ffffff;
      font-size: 13px;
      transform: rotateZ(90deg);
    }

  }

  .bom {
    font-size: 12px;
    color: #8f8f8f;
  }
}
</style>
