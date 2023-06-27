<template>
  <div class="card_main">
    <div class="card_content">
      <div class="time_dur" :title="timeObj.item.name">{{timeObj.item.name}}</div>
      <div class="time_btn">
          <i class="el-icon-video-play btn" @click="play"></i>
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
          this.$emit('play',this.timeObj)
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
    flex: 1;
    display: flex;
    .time_dur {
      flex: 1;
      overflow:hidden; 
text-overflow:ellipsis;
white-space:nowrap; 
    }
    .time_btn {
      flex: 0 0 20px;
      display: flex;
      justify-content: space-around;
    }
  }
}
.btn{
    cursor: pointer;
}
</style>
