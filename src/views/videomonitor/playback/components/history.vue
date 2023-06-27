<template>
  <div class="controin">
    <div v-for="(item,index) in historylist" :key="item.id" :class="{'histry':true,'actclass':activeindex == index}" @click="playvideo(item,index)">
      <div class="top">
        <span class="top-left">
          <span class="left-svg">
            <svg width="1em" height="1em" viewBox="0 0 16 16"><g stroke="currentColor" stroke-width="1.2" fill="none" fill-rule="evenodd"><path d="M8 1.5999999999999996A5.4 5.4 0 1 0 8 12.4A5.4 5.4 0 1 0 8 1.5999999999999996Z" /><path d="M8 4.6A2.4 2.4 0 1 0 8 9.4A2.4 2.4 0 1 0 8 4.6Z" /><path d="M8 12.5153687L8 14.7662345" /><path stroke-linecap="round" stroke-linejoin="round" d="M4.75724981 14.7662345L11.3730759 14.7662345" /></g></svg>
          </span>
          <span class="left-text">{{ item.name }}</span>
        </span>
        <span class="top-right" style="font-size: 12px;">{{ item.createTime }}</span>
      </div>
      <div class="bom">
        {{ item.name }}
      </div>
    </div>
    <el-button v-if="!finish" type="primary" :loading="loding" :disabled="disable" @click="loadmoreinfo">{{ btninner }}</el-button>
    <span v-else style="color: #6d6a6a;font-size: 14px; margin-left: 34%;">没有更多了</span>
  </div>
</template>

<script>
import { listPageDevicePlayRecord
} from '@/api/system/device'
export default {
  props: {
    hisright: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      historylist: [], // 播放历史列表
      current: 1,
      loding: false,
      btninner: '加载更多',
      finish: false,
      disable: false,
      activeindex: -1
    }
  },
  watch: {
    hisright(newval) {
      if (newval == 'history') { // 传递数据到right组件
        this.$bus.$emit('getconcerninfo', this.historylist)
      }
    }
  },
  created() {
    this.gethistry()
  },
  methods: {
    // 加载更多
    loadmoreinfo() {
      ++this.current
      this.loading = true
      this.gethistry()
    },
    async gethistry() {
      const res = await listPageDevicePlayRecord({ current: this.current, pageSize: 5 })

      this.historylist.push(...res.records)
      if (this.historylist.length < res.total) { // 未加载完
        this.finish = false
        this.btninner = '加载更多'
      } else {
        this.finish = true
      }
      if (this.current > 1) { // 同步右侧组件加载后的数据
        this.$bus.$emit('historyarr', res.records)
      }
    },
    playvideo(item, index) {
      this.activeindex = index
      const deviceId = item.serviceId || ''
      const vname = item.name || '' // 视频名称
      this.$bus.$emit('playhistoryvedio', deviceId, vname)
    },
  
  }

}
</script>

<style lang="scss" scoped>
.actclass{
  background-color: #1a1a1a;
}
  .controin{
    max-height: 36vw;
    overflow: auto;
    .el-button{
      margin-left: 27%;
      color: #FFFFFF;
    background-color: #1890ff;
    border-color: #1890ff;
    }
    .histry{
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 58px;
      padding: 5px 3px;
      justify-content: space-around;
      position: relative;
      &:hover{
        background-color: #414141;
      }
      .top{
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        .top-left{
          .left-svg{
            color: #1875f3;
            position: absolute;
            top: 9px;
          }
          .left-text{
            display: inline-block;
            margin-left: 1vw;
            max-width: 78px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .bom{
        text-align: right;
        font-size: 12px;
        white-space: nowrap;
        color: #5d5d5d;
      }
    }
  }
</style>

