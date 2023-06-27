<template>
  <div class="draw-panel">
    <el-radio
      v-model="radio"
      v-for="(value, key) in drawType"
      :key="key"
      :label="key"
      @change="draw"
      >{{ value }}</el-radio
    >

    <el-button type="primary" icon="el-icon-delete" @click="onDelete"
      >删除</el-button
    >
  </div>
</template>
<script>
export default {
  props: ["map"],
  data() {
    return {
      drawType: {
        circle: "画圆",
        rectangle: "画矩形",
      },
      radio: "", // radio 选择类型
      mouseTool: null, // AMap 编辑矢量图形
      overlays:[]
    };
  },
  watch: {
    map(map) {
      map.plugin(["AMap.MouseTool"], () => {
        this.mouseTool = new AMap.MouseTool(map);
        //监听draw事件可获取画好的覆盖物
        this.overlays = [];
        this.mouseTool.on("draw", (e) => {
          this.overlays.push(e.obj);
        });
        map.on('click',(e)=>{
        })
      });
    },
  },
  methods: {
    draw() {
      this.mouseTool[this.radio]({
        fillColor: "#00b0ff",
        strokeColor: "#80d8ff",
      });
    },
    onDelete() {
    },
  },
};
</script>
<style lang="scss" scoped>
.draw-panel {
  position: absolute;
  top: 0;
  background: #fff;
}
</style>