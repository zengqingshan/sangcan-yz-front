<template>
  <div class="cont" style="height: 103%;">
    <div class="video-fens">
      <div class="cell-players">
        <div
          v-for="i in Number(layoutNum)"
          :key="i"
          :class="cellClass(i)"
          :data-key="i"
        >
          <div
            class="video-divf"
            @drop="drop($event, i)"
            @dragover="allowDrop($event)"
          >
            <!-- 点击遮罩蒙层，双击全屏，单击选中，层级7 -->
            <div class="tab-mb" @click="videoTap(i - 1)" />

            <!-- 绿色边框代表选中蒙层，层级8 -->
            <div
              v-show="i - 1 == chooseIndex && layoutNum != 1"
              class="tab-mb-active"
            />

            <div
              v-if="
                urlList[i - 1] &&
                  !urlList[i - 1]['name'] &&
                  !urlList[i - 1].isPlay
              "
              class="video-empty-tip"
            >
              <span
                class="anticon empty-player-tip-icon"
              ><svg viewBox="0 0 1024 1024" width="1em" height="1em">
                <path
                  d="M520.896 815.296c197.952 0 358.976-166.08 358.976-370.112S718.784 75.072 520.896 75.072 162.048 241.088 162.048 445.184s160.96 370.112 358.848 370.112z m0-676.224c162.688 0 294.976 137.344 294.976 306.112 0 168.832-132.288 306.112-294.976 306.112-162.624 0-294.848-137.344-294.848-306.112-0.064-168.768 132.224-306.112 294.848-306.112z"
                  fill="rgb(93, 93, 93)"
                />
                <path
                  d="M824.256 746.112a32.128 32.128 0 0 0-29.888 56.64c21.888 11.584 27.264 20.736 27.52 22.528-1.92 20.864-106.688 69.824-300.992 69.824-191.488 0-299.072-49.536-300.864-69.824 0.128-1.664 5.056-10.432 26.176-21.888a32 32 0 0 0-30.464-56.256c-49.344 26.688-59.712 57.216-59.712 78.144 0 91.968 189.12 133.824 364.864 133.824 175.808 0 364.992-41.856 364.992-133.824 0-21.248-10.688-52.224-61.632-79.168zM520.96 618.816a173.632 173.632 0 1 0 0.128-347.264 173.632 173.632 0 0 0-0.128 347.264z m-59.968-315.648a70.976 70.976 0 1 1 0 141.952 70.976 70.976 0 0 1 0-141.952z"
                  fill="rgb(93, 93, 93)"
                />
              </svg>
              </span>

              <span
                class="empty-player-tip-text"
              >拖拽或双击设备到这里观看</span>
            </div>
      
            <!-- m3u8的视频播放方式 -->
            <div
              v-show="urlList[i - 1] && urlList[i - 1].isPlay"
              class="video-div video-divs"
            >
              <!-- m3u8 -->

              <iframe
                :id="'videoPlayer' + i"
                :ref="'videoPlayer' + i"
                class="videoss video-js vjs-default-skin vjs-big-play-centered"
                :src="playerPath"
                frameborder="0"
                width="100%"
                height="100%"
                v-if="!urlList[i - 1].playAddress"
              />
              <videots  :ref="'videoPlayer' + i" :id="i" :playParam="urlList[i - 1].playAddress" v-else></videots>

              <!-- 视频名称图层，层级5 -->
              <div
                v-if="urlList[i - 1] && urlList[i - 1]['name']"
                class="video-name"
              >
                {{ urlList[i - 1].name || "" }}
              </div>

              <div
                v-if="urlList[i - 1]"
                class="video-close"
                @click="closePlayer(i - 1)"
              >
                <svg
                  v-if="!hides"
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="close-circle"
                  width="10px"
                  height="10px"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
                  />
                </svg>
              </div>

              <!-- 播放出错蒙层，层级4 -->
              <div
                v-if="urlList[i - 1] && urlList[i - 1].isError"
                class="flex flex_col flex_a_c flex_ju_c play-error"
              >
                <div class="font_16 c_white error-word">播放错误</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="displayCurrentDeviceInfo" class="bottom-bar">
      <div class="video-player-area-bottom-bar tool-bar">
        <div v-if="!hides" class="device-info">
          <div class="device-info-name">{{ currentDeviceName }}</div>
          <div class="device-info-content">
            型号: {{currentModel}} ID: {{ currentServiceId }}
          </div>
        </div>
        <div v-if="!hides && layoutNum == 1" class="icon-group">
          <div class="icon-item" @click="drawer = true">
            <span role="img" aria-label="file" class="anticon anticon-file">
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="file"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"
                />
              </svg>
            </span>
            备注
          </div>
          <div v-if="false" class="icon-item">
            <span
              role="img"
              aria-label="download"
              class="anticon anticon-download"
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="download"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                />
              </svg>
            </span>
            下载管理
          </div>
          <div style="margin-right: 20px; cursor: pointer">
            <span @click="showaddress">
              <i class="el-icon-location-outline" />
              位置
            </span>
          </div>
          <div class="icon-item" @click="showsettinginfo">
            <span
              role="img"
              aria-label="setting"
              class="anticon anticon-setting"
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="setting"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"
                />
              </svg>
            </span>
            设置
          </div>
        </div>
        <div v-if="hides && shows " class="pollbom">
          <span class="span">轮巡时长</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary" size="mini" @click="startpoll">{{
            btninner
          }}</el-button>
          <el-popover placement="top" width="200" trigger="click">
            <el-switch v-model="value1" active-text="只轮巡有画面设备" />
            <p slot="reference">更多操作<i class="el-icon-arrow-down" /></p>
          </el-popover>
        </div>
      </div>
    </div>
    <!-- 备注的弹窗 -->
    <el-drawer :visible.sync="drawer" :with-header="false" :modal="false">
      <div class="draw">
        <p class="draw-p">视频备注信息</p>
        <div class="draw-div">
          <span>暂无备注记录信息</span>
        </div>
      </div>
    </el-drawer>
    <!-- 位置+设置的弹窗 -->
    <settingDialog
      ref="settingDialogRef"
    />
  </div>
</template>

<script>
import settingDialog from '@/views/videomonitor/playback/components/settingDialog'
import {
  getPlayParameter
} from '@/api/system/device'
import { playrecordAdd, listPageDevicePlayRecord } from '@/api/system/device'

import videots from "@component/videocomponent";
/**
 * 分屏视频
 */

export default {
  components: {
    settingDialog,
    videots
  },
  data() {
    return {
      currentDeviceName: '',
      displayCurrentDeviceInfo: false,
      currentServiceId: '',
      currentModel:'',
      showedit: true, // 编辑设备
      chooseIndex: 0, // 选中值   从 0 开始

      urlList: [], // 视频的serviceId
      layoutNum: 1, // 小窗口数量
      playerPath: process.env.BASE_URL + 'VnPlayer.html',
      hides: false,
      options: [
        {
          value: 15,
          label: '15秒'
        },
        {
          value: 30,
          label: '30秒'
        },
        {
          value: 45,
          label: '45秒'
        },
        {
          value: 60,
          label: '1分'
        },
        {
          value: 300,
          label: '5分'
        },
        {
          value: 600,
          label: '10分'
        },
        {
          value: 1800,
          label: '30分'
        }
      ],
      value: '', // 定时切换的值
      value1: false, // 是否只轮巡有画面的设备
      btninner: '启动轮巡',
      drawer: false,
      activeName: 'first',
      servid: null,
      shows: false // 控制组件显示隐藏
    }
  },
  computed: {
    cellClass() {
      return function(index) {
        switch (Number(this.layoutNum)) {
          case 1:
            return ['cell-player-1']
          case 4:
            return ['cell-player-4']
          case 6:
            if (index == 1) return ['cell-player-6-1']
            if (index == 2) return ['cell-player-6-2']
            if (index == 3) return ['cell-player-6-3']
            return ['cell-player-6']
          case 8:
            if (index == 1) return ['cell-player-8-1']
            if (index == 2) return ['cell-player-8-2']
            if (index == 3) return ['cell-player-shu cell-player-8-3']
            if (index == 4) return ['cell-player-shu cell-player-8-4']
            return ['cell-player-8']
          case 9:
            return ['cell-player-9']
          case 16:
            return ['cell-player-16']
          case 25:
            return ['cell-player-25']
          default:
            break
        }
      }
    }
  },
  watch: {
    layoutNum: {
      handler(val, oldval) {
        if (val < oldval) {
          for (let i = val; i < 25; i++) {
            this.$set(this.urlList[i], 'isPlay', false)
            this.$set(this.urlList[i], 'isEdit', false)
            this.$set(this.urlList[i], 'isError', false)
            this.$set(this.urlList[i], 'serviceId', '')
            this.$set(this.urlList[i], 'name', '')
            this.$set(this.urlList[i], 'sdkParamJSON', '')
            this.$set(this.urlList[i], 'playAddress', '')
            this.$set(this.urlList[i], 'model', '')
          }
          if (this.chooseIndex >= val) {
            this.clearPlayerInfo()
          }
        }

        if (this.checkNeedShowTool(val) != this.checkNeedShowTool(oldval)) {
          for (let i = 0; i < oldval; i++) {
            this.displayTools(this.checkNeedShowTool(val), i)
          }
        }
        for (val; val < 25; val++) {
          this.closePlayer(val)
        }
      },
      // 深度观察监听
      immediate: true
    },
    value1(newval) {
      if (newval) {
        // 通知右侧组件筛选有画面监控
        this.$bus.$emit('switchlist')
      } else {
        // 通知右侧组件复原数据
        this.$bus.$emit('reback')
      }
    }
  },
  created() {
    this.initUrlList()
  },
  mounted() {
    this.$bus.$on('hideicon', (hide) => {
      this.hides = hide
      this.shows = hide
      this.$emit('activeclose', hide)
    })
    this.$bus.$on('changehide', (act) => {
      this.hides = act
      this.shows = false
    })
    this.$bus.$on('showedit', (act) => {
    })
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    // 展示位置弹框
    async showaddress() {
      this.$refs.settingDialogRef.showaddress(this.servid)
    },

    // 点击设置展示设置信息
    async showsettinginfo() {
      this.$refs.settingDialogRef.showDeviceInfo(this.servid)
    },
    // 启动轮巡
    startpoll() {
      if (this.value == '') {
        this.$message({
          type: 'warning',
          message: '请选择轮巡间隔时长'
        })
      } else if (this.btninner == '启动轮巡') {
        this.btninner = '停止轮巡'
        this.$emit('starpoill', this.value)
        this.$message({
          type: 'success',
          message: '已开始轮巡'
        })
        setTimeout(() => {
          const ele = document.querySelector('.cell-players')
          if (ele.requestFullscreen) {
            ele.requestFullscreen()
   
          } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen()
          } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen()
          } else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen()
          }
        }, 3000)
      } else if (this.btninner == '停止轮巡') {
        clearInterval(window.timer)
        this.btninner = '启动轮巡'
        this.$message({
          type: 'warning',
          message: '已停止轮巡'
        })
      }
    },
    // 允许放下拖拽
    allowDrop(ev) {
      ev.preventDefault()
    },
    // 放下事件
    drop(ev, i) {
      const data = ev.dataTransfer.getData('item')
      const item2 = JSON.parse(data)
      this.chooseIndex = i - 1
      this.requestPlay(
        item2.serviceId,
        item2.name
      )
    },
    initUrlList() {
      for (let i = 0; i < 25; i++) {
        const urlObj = {}
        urlObj.isPlay = false
        urlObj.isEdit = false
        urlObj.isError = false
        urlObj.serviceId = ''
        urlObj.name = ''
        urlObj.sdkParam = ''
        urlObj.model = ''
        this.urlList.push(urlObj)
      }
    },
    clearPlayerInfo() {
      this.currentDeviceName = ''
      this.currentServiceId = ''
      this.currentModel = ''
      this.displayCurrentDeviceInfo = false
    },

    setPlayerInfo(index) {
      
      const indexNew = index % this.layoutNum
      if (this.urlList[indexNew].isPlay) {
        
        this.currentDeviceName = this.urlList[indexNew].name
        this.currentServiceId = this.urlList[indexNew].serviceId
        this.currentModel = this.urlList[indexNew].model
        

        this.servid = this.urlList[indexNew].serviceId
   
        this.displayCurrentDeviceInfo = true
        
        
      } else {
        this.clearPlayerInfo()
      }
    },

    closePlayer(index) {

      try{
        const msgObj = {}
        var playerName = 'videoPlayer' + (index + 1)
        const _iframe = document.getElementById(playerName).contentWindow

        msgObj.type = 'stopPlay'
        if (index % this.layoutNum == this.chooseIndex % this.layoutNum) {
          this.clearPlayerInfo()
        }

        _iframe.postMessage(JSON.stringify(msgObj), '*')
            }catch(err){
              
            }

            try{
        const stopEvent = 'huiyanStop' + (index + 1)
          this.$bus.$emit(stopEvent, '')
      }catch(err){

      }

      if(index >= this.urlList.length){
        return;
      }

      this.$set(this.urlList[index], 'isPlay', false)
      this.$set(this.urlList[index], 'isEdit', false)
      this.$set(this.urlList[index], 'isError', false)
      this.$set(this.urlList[index], 'serviceId', '')
      this.$set(this.urlList[index], 'name', '')
      this.$set(this.urlList[index], 'sdkParamJSON', '')
      this.$set(this.urlList[index], 'playAddress', '')
      this.$set(this.urlList[index], 'model', '')



    },
    checkNeedShowTool(num) {
      if (num > 1) {
        return false
      } else {
        return true
      }
    },
    displayTools(flag, index) {
      const msgObj = {}
      var playerName = 'videoPlayer' + (index + 1)
      const _iframe = document.getElementById(playerName).contentWindow

      msgObj.type = 'hideTools'
      if (flag) {
        msgObj.flag = '1'
      } else {
        msgObj.flag = '0'
      }

      _iframe.postMessage(JSON.stringify(msgObj), '*')
    },
    requestPlay(serviceId, name) {
      if (this.urlList.length > 0) {
        let found = false
        this.urlList.forEach((element) => {
          if (element.serviceId == serviceId) {
            // 需要加上是否以前播放失败
            found = true
          }
        })
      }

      const curPlayIndex = this.chooseIndex % this.layoutNum

      this.chooseIndex = (curPlayIndex + 1) % this.layoutNum

      this.$nextTick(async () => {

        const playParam = await getPlayParameter(serviceId)

        let sdkParam = {token: playParam.token, appid: playParam.appid }

        this.closePlayer(curPlayIndex)
          this.$set(this.urlList[curPlayIndex], 'isPlay', true)
        this.$set(this.urlList[curPlayIndex], 'isEdit', true)
        this.$set(this.urlList[curPlayIndex], 'isError', false)
        this.$set(this.urlList[curPlayIndex], 'serviceId', serviceId)
        this.$set(this.urlList[curPlayIndex], 'name', name)
        this.$set(this.urlList[curPlayIndex], 'sdkParamJSON', JSON.stringify(sdkParam))
        this.$set(this.urlList[curPlayIndex], 'playAddress', playParam.playAddress)
        this.$set(this.urlList[curPlayIndex], 'model', playParam.model)
        
        this.$nextTick(() => {
          
          this.setPlayerInfo(curPlayIndex)
          this.play(curPlayIndex)
        })
      })


    },

    async play(index) {

      let playAddress = this.urlList[index].playAddress

      try{
        const msgObj = {}
            msgObj.deviceId = this.urlList[index].serviceId

        if(playAddress){
          try{
              let player1 = this.$refs[`videoPlayer${index + 1}`]
              let playEvent = 'huiyanPlay' + (index+1)

              
              this.$nextTick(() => {

                this.$bus.$emit(playEvent, playAddress)
              })
          }catch(err){
              console.log('err=', err)
          }
          return;
        }else{
          let sdkParamJSON = this.urlList[index].sdkParamJSON;
      
          if(!sdkParamJSON){
            return
          }
          let sdkParam = JSON.parse(sdkParamJSON)
          
          this.$nextTick(() => {
            
              var playerName = 'videoPlayer' + (index + 1)
          
           
              msgObj.type = 'startPlay'

            
              msgObj.token = sdkParam.token
              msgObj.appid = sdkParam.appid
            
              if (this.layoutNum > 1) {
                msgObj.showTools = '0'
              } else {
                msgObj.showTools = '1'
              }
              if (!msgObj.deviceId) {
                return
              }

              const param = { serviceId: msgObj.deviceId }
              playrecordAdd(param).then((ret) => {})
              const _iframe = document.getElementById(playerName).contentWindow

              _iframe.postMessage(JSON.stringify(msgObj), '*')

          })

        }

    }
    catch(err){
        console.log("play error=", err)
    }


    },
    pause(i) {},

    videoTap(index) {
      // 赋值点击选中框
      this.chooseIndex = index % this.layoutNum
      this.setPlayerInfo(this.chooseIndex)
    }
  }
}
</script>

<style lang="scss">
.selectinput {
  position: absolute;
  z-index: 11;
  right: 26px;
  top: 122px;
}

.search-wrap {
  position: absolute;
  top: 0 !important;
  left: 16px !important;

  .el-input-group {
    .el-input__inner {
      border-radius: 0;
    }
  }

  .el-input-group__append {
    border-radius: 0;
  }
}

.dia {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;

  .dia-left {
    display: flex;
    flex-direction: column;

    .el-input__inner {
      width: 300px;
    }
  }

  .dia-right {
    display: flex;
    flex-direction: column;

    .el-input__inner {
      width: 300px;
    }
  }
}

.el-dialog--center .el-dialog__body {
  padding-top: 0;
}

.setting {
  .setting-pan {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    padding-left: 25px;
    padding-right: 16px;
  }
}

.draw {
  display: flex;
  flex-direction: column;
  height: 100%;

  .draw-p {
    text-align: center;
    color: #000;
    margin-top: 8px;
  }

  .draw-div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    span {
      color: #000;
    }
  }
}

.cont {
  .el-drawer {
    width: 20% !important;
    height: 68%;
    margin-top: 9%;
    margin-right: 18%;
    opacity: 0.7;
  }
}

.el-select-dropdown__list {
  max-height: 250px;
  overflow: auto;
}

.pollbom {
  display: flex;
  margin-left: 52%;
  width: 50%;
  justify-content: flex-end;
  align-items: center;

  .span {
    color: #888;
    margin-right: 2%;
  }

  .el-select {
    width: 20%;
    margin-right: 2%;
    border-radius: 3px;
    overflow: hidden;

    .el-input {
      .el-input__inner {
        height: 30px;
        background-color: #5d5d5d;
        border-color: #5d5d5d;
        color: #aca5a5;
      }

      .el-input__suffix {
        position: absolute;
        top: 3px;
      }
    }
  }

  .el-button {
    margin-right: 2%;

    &:hover {
      background: #1890ff;
      border-color: #1890ff;
    }
  }

  p {
    margin: 0;
    cursor: pointer;
    color: #888;
  }
}

.video-fens {
  width: 100%;
  height: 100%;
  background-color: #000;

  .video-divf {
    &:hover {
      border: 2px solid #1890ff;
    }
  }

  .video-div,
  .video-divf {
    width: 100%;
    height: 100%;
    position: relative;
    background-size: cover;

    .video-js .vjs-control-bar {
      width: calc(100% - 6px);
      z-index: 10;
      left: 3px;
      bottom: 3px;
    }

    .tab-mb {
      position: absolute;
      width: 100%;
      height: calc(100% - 40px);
      background-color: rgba($color: #000000, $alpha: 0);
      top: 0;
      left: 0;
      z-index: -1;
    }

    .video-empty-tip {
      color: rgb(93, 93, 93);
      font-weight: bold;
      position: absolute;
      padding: 0.2rem 0.25rem;
      top: 50%;
      left: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 4;
      transform: translate(-50%, -50%);

      .empty-player-tip-icon {
        font-size: 30px;
      }

      .empty-player-tip-text {
        font-size: 12px;
        text-align: center;
      }
    }

    .video-divs {
      .close-img {
        width: 0.28rem;
        height: 0.28rem;
        position: absolute;
        right: 0.08rem;
        bottom: 0.13rem;
        cursor: pointer;
      }

      // 播放出错蒙层
      .play-error {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: #000;
        z-index: 4;

        .img_noplay {
          width: 0.76rem;
          height: 0.64rem;
          margin-bottom: 0.46rem;
        }
      }

      // 视频名称图层
      .video-name {
        font-size: 0.2rem;
        color: #fff;
        font-weight: bold;
        position: absolute;
        padding: 0.2rem 0.25rem;
        top: 0;
        right: 0;
        z-index: 5;
      }

      // 视频名称图层
      .video-close {
        font-size: 0.2rem;
        color: #fff;
        font-weight: bold;
        position: absolute;
        padding: 0.2rem 0.25rem;
        top: 0;
        left: 0;
        z-index: 10;
      }
    }
  }

  .video-js {
    width: 100%;
    height: 100%;
  }

  .cell-players {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // border: 1px solid #fff;
    position: relative;

    .tab-mb-active {
      position: absolute;
      width: 100.3%;
      height: 100.4%;
      background-color: rgba($color: #000000, $alpha: 0);

      top: -0.2%;
      left: -0.1%;
      // border: 2px solid #1890ff;
      z-index: 8;
    }
  }

  .cell-player {
    border: 1px solid #fff;
  }

  .cell-player-4 {
    width: 50%;
    height: 50% !important;
    box-sizing: border-box;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;
  }

  .cell-player-1 {
    width: 100%;
    box-sizing: border-box;
    // border: 1px solid #fff;
  }

  .cell-player-6-1 {
    width: 66.66%;
    height: 66.66% !important;
    box-sizing: border-box;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;
  }

  .cell-player-6-2 {
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;

    .error-word {
      font-size: 0.17rem;
    }
  }

  .cell-player-6-3 {
    position: absolute;
    right: 0;
    top: 33.33%;
    width: 33.33%;
    height: 33.33%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;

    .error-word {
      font-size: 0.17rem;
    }
  }

  .cell-player-6-none {
    display: none;
  }

  .cell-player-6-2-cell {
    width: 100%;
    height: 50% !important;
    box-sizing: border-box;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;
  }

  .cell-player-6 {
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;
    border-left: 2px solid #2d2d2e;

    .error-word {
      font-size: 0.17rem;
    }
  }

  .cell-player-8-1 {
    width: 75%;
    height: 75% !important;
    box-sizing: border-box;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;
  }

  .cell-player-shu {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    right: 0;
    position: absolute;

    .img_noplay {
      width: 0.63rem !important;
      height: auto !important;
    }

    .error-word {
      font-size: 0.13rem;
    }
  }

  .cell-player-8-2 {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;

    .img_noplay {
      width: 0.63rem !important;
      height: auto !important;
    }

    .error-word {
      font-size: 0.13rem;
    }
  }

  .cell-player-8-3 {
    top: 25%;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;
  }

  .cell-player-8-4 {
    top: 50%;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;
  }

  .cell-player-8-none {
    display: none;
  }

  .cell-player-8-2-cell {
    width: 100%;
    height: 33.3% !important;
    box-sizing: border-box;
    border-bottom: 2px solid #2d2d2e;
    border-left: 2px solid #2d2d2e;
  }

  .cell-player-8 {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
    border-left: 1px solid #2d2d2e;

    .img_noplay {
      width: 0.63rem !important;
      height: auto !important;
    }

    .error-word {
      font-size: 0.13rem;
    }
  }

  .cell-player-9 {
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;

    border: 2px solid #2d2d2e;
  }

  .cell-player-16 {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
    border: 2px solid #2d2d2e;
  }

  .cell-player-25 {
    width: 20%;
    height: 20% !important;
    box-sizing: border-box;
    border: 2px solid #2d2d2e;
  }

  .cell {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.video-player-area-bottom-bar {
  padding-top: 12px;

  .polling-settings-container {
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #888;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 14px;
    gap: 20px;
    justify-content: flex-end;
    width: 100%;

    .polling-settings-interval .polling-settings-interval-text {
      margin-right: 12px;
    }

    .video-player-area-bottom-bar
      .polling-settings-container
      .polling-settings-interval
      .ant-select {
      width: 80px;
    }
  }
}

.video-player-area-bottom-bar
  .polling-settings-container
  .video-player-area-bottom-bar
  .polling-settings-container
  .polling-settings-interval
  .ant-select
  .ant-select-selector {
  background-color: #5d5d5d;
  border-color: #5d5d5d;
}

.video-player-area-bottom-bar
  .polling-settings-container
  .polling-settings-interval
  .ant-select
  .ant-select-arrow,
.video-player-area-bottom-bar
  .polling-settings-container
  .polling-settings-interval
  .ant-select
  .ant-select-selector
  .ant-select-selection-item {
  color: #cbcbcb;
}

.video-player-area-bottom-bar
  .polling-settings-container
  .polling-settings-start-btn {
  background-color: #1875f3;
  border-color: #1875f3;
  color: #cbcbcb;
}

.video-player-area-bottom-bar
  .polling-settings-container
  .polling-settings-start-btn
  > span {
  font-size: 14px;
}

.video-player-area-bottom-bar
  .polling-settings-container
  .polling-settings-visible-device {
  color: #888;
  width: 80px;
}

.video-player-area-bottom-bar .icon-group {
  -ms-flex-item-align: start;
  align-self: flex-start;
}

.video-player-area-bottom-bar .device-info .device-info-name {
  color: #fff;
  font-size: 16px;
}

.video-player-area-bottom-bar .device-info .device-info-content {
  color: hsla(0, 0%, 100%, 0.7);
  font-size: 12px;
  margin-top: 4px;
}

.video-player-area-bottom-bar {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.video-player-area-bottom-bar .flat-bottom-tool-bar .icon-group .icon-item {
  font-size: 16px;
  margin: 0;
}

.video-player-area-bottom-bar .icon-group {
  -webkit-box-align: center;
  -ms-flex-align: center;
  -ms-flex-pack: distribute;
  align-items: center;
  color: hsla(0, 0%, 100%, 0.7);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 14px;
  justify-content: space-around;
}

.video-player-area-bottom-bar .icon-group .icon-item {
  cursor: pointer;
  margin-right: 20px;
}
</style>
