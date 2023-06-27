<template>
  <div class="upMiddleDown_main">
    <div class="upMiddleDown_header" v-if="$slots.upMiddleDown_header">
      <div class="upMiddleDown_header_title">
        <slot name="upMiddleDown_header" />
      </div>
      <div class="upMiddleDown_btn">
        <!-- <i class="el-icon-bottom margin10" @click="edittable(4)"></i>
        <i class="el-icon-top margin10" @click="edittable(3)"></i> -->
        <el-tooltip class="item" effect="dark" content="批量删除轨迹预制点" placement="top">
     <i class="el-icon-remove margin10" @click="edittable(2)"></i>
    </el-tooltip>
           <el-tooltip class="item" effect="dark" content="新增轨迹预制点" placement="top">
        <i class="el-icon-circle-plus margin10" @click="edittable(1)"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="upMiddleDown_conter">
      <slot />
    </div>
    <div class="upMiddleDown_footer" v-if="hasfooter">
      <slot name="upMiddleDown_footer" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasfooter: {
      type: Boolean,
      default: true,
    },
    btnPositon: {
      type: String,
      default: "outside",
    },
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  methods: {
    edittable(e) {
      switch (e) {
        case 1:
            this.$emit('add')
          break;
        case 2:
            this.$emit('delete')
          break;
        case 3:
             this.$emit('up')
          break;
        case 4:
              this.$emit('down')
          break;

        default:
          break;
      }
    },
    search() {
      this.$emit("search");
    },
    reset() {
      this.$emit("reset");
    },
  },
};
</script>
<style lang="scss" scoped>
.upMiddleDown_main {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  .upMiddleDown_header {
    padding: 0px 0px 10px 0px;
    display: flex;
    border-bottom: 1px solid #e6ebf5;
    .upMiddleDown_header_title {
      flex: 1;
    }
    .upMiddleDown_btn {
      flex: 1;
      display: flex;
      flex-direction: row-reverse;
    }
  }
  .upMiddleDown_conter {
    flex: 1 1 0;
    position: relative;
    overflow: auto;
    // padding-top: 10px;
  }
  .upMiddleDown_footer {
    flex: 0 0 20px;
    display: flex;
    align-items: center;
    justify-content: right;
    padding-top: 5px;
    // border-top: 1px solid #e6ebf5;
  }
}
</style>
<style lang="scss" scoped>
</style>
<style lang="scss" scoped>
.margin10 {
  margin-right: 10px;
  cursor: pointer;
}
</style>
