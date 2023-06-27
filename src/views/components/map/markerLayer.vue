<template>
  <div style="content"></div>
</template>
<script>
import posIcon from "@/assets/images/posIcon.png";
export default {
  props: ["map"],
  data() {
    return {
      markerList: [
        [117.000923, 36.675807],
        [117.100923, 36.575807],
        [117.200923, 36.975807],
        [117.300923, 37.675807],
      ],
    };
  },
  watch: {
    map(curMap) {
      this.showMarker(curMap);
    },
  },
  methods: {
    showMarker(map) {
      let infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(16, -45),
      });
      this.markerList.forEach((item, index) => {
        let markersItem = new AMap.Marker({
          position: item,
          map: map,
          offset: new AMap.Pixel(-20, -40),
          icon: posIcon,
        });
        // 设置点标记文本标签内容
        markersItem.setLabel({
          offset: new AMap.Pixel(14, 5), //设置文本标注偏移量
          content: index + 1, //设置文本标注内容
        });
        markersItem.content = `<div class="input-card">
        <label style="color:grey">故宫博物院</label>
        </div>`;
        // marker点击事件
        markersItem.on("click", (e) => {
          infoWindow.setContent(e.target.content);
          // 打卡信息窗
          infoWindow.open(map, e.target.getPosition());
        });
      });
      map.setFitView();
    },
  },
};
</script>
<style lang="scss" scoped>
.amap-marker-label {
  border: none;
  background: none;
}
</style>