<template>
  <div style="z-index: 999"></div>
</template>
<script>
import monitor from "@/assets/images/monitor.png";
export default {
  props: ["map", "deviceList"],
  mounted() {
    this.marker(this.map);
  },
  data() {
    return {
      markerList: [],
    };
  },
  methods: {
    marker(map) {
      let icon = new BMapGL.Icon(monitor, new BMapGL.Size(40, 40), {
        // 指定定位位置。
        // 图标中央下端的尖角位置。
        anchor: new BMapGL.Size(20, 40),
        imageOffset: new BMapGL.Size(0, 0), // 设置图片偏移
      });
      this.deviceList.forEach((item, index) => {
        let point = new BMapGL.Point(item.longitude, item.latitude);
        // 创建添加点标记
        let marker = new BMapGL.Marker(point, { icon: icon });
        this.markerList = [...this.markerList, marker];
        map.addOverlay(marker);
        // 创建图文信息窗口
        // marker添加点击事件
        marker.addEventListener("mouseover", () => {
          let label = new BMapGL.Label(item.deviceName, {
            offset: new BMapGL.Size(0, -80),
          });
          label.setStyle({
            color: "#000",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
            fontFamily: "微软雅黑",
          });
          marker.setLabel(label);
        });
        marker.addEventListener("mouseout", () => {
          map.removeOverlay(marker.getLabel());
        });
        marker.addEventListener("click", () => {
          this.$emit("device-click", item);
        });
      });
    },
    // 显示全部设备标签
    showAllDeviceLabel() {
      this.deviceList.forEach((item, index) => {
        let label = new BMapGL.Label(item.deviceName, {
          offset: new BMapGL.Size(0, -80),
        });
        label.status = "label";
        label.setStyle({
          color: "#000",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "16px",
          fontFamily: "微软雅黑",
        });
        this.markerList[index].setLabel(label);
        this.map.addOverlay(this.markerList[index]);
      });
    },
    // 清除全部设备标签
    clearAllDeviceLabel() {
      this.map.getOverlays().forEach((item) => {
        if (item.status === "label") {
          this.map.removeOverlay(item);
        }
      });
    },
  },
};
</script>