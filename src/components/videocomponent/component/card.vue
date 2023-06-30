<template>
  <div class="card_main">
    <div class="banner">{{timeObj.item.record_date}}</div>
    <div class="card_content">
      <div class="time_dur">{{dateFormat('HH:MM:SS',new Date(timeObj.item.start_time))}}/{{dateFormat('HH:MM:SS',new Date(timeObj.item.end_time))}}</div>
      <div class="time_btn">
         <el-tooltip class="item" effect="dark" content="播放录像" placement="top">
     <i class="el-icon-video-play btn" @click="play"></i>
    </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下载录像" placement="top">
          <i class="el-icon-upload btn" @click="videoback"></i>
          </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import dateFormat  from '@/utils/date.js'
export default {
  props: {
    timeObj: [Object],
  },
  data() {
    return {
        dateFormat
    };
  },

  components: {},

  methods: {
      play() {
          let config = {
              start:dateFormat('YYYY-mm-dd HH:MM:SS',new Date(this.timeObj.item.start_time)),
              end:dateFormat('YYYY-mm-dd HH:MM:SS',new Date(this.timeObj.item.end_time))
          }
          this.$emit('play',Object.assign({},this.timeObj,config))
      },
      videoback() {
          let config = {
              start:dateFormat('YYYY-mm-dd HH:MM:SS',new Date(this.timeObj.item.start_time)),
              end:dateFormat('YYYY-mm-dd HH:MM:SS',new Date(this.timeObj.item.end_time))
          }
          this.$emit('videoback',Object.assign({},this.timeObj,config))
      }
  },
};
</script>
<style lang="scss" scoped>
.card_main {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  .banner {
    flex: 1;
  }
  .card_content {
      margin-top: 10px;
    flex: 1;
    display: flex;
    .time_dur {
      flex: 1;
    }
    .time_btn {
      flex: 0 0 50px;
      display: flex;
      justify-content: space-around;
    }
  }
}
.btn{
    cursor: pointer;
}
</style>
