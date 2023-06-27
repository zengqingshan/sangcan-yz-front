<template>
  <div class="legend-wrap" v-if="boundaryType">
    <div class="legend-item" v-for="(value, key) in weightColor" :key="key">
      <div :style="{ background: value }" class="icon"></div>
      <div>{{ key }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["map", "boundaryType"],
  mounted() {
    if (this.boundaryType) {
      this.city = [
        { name: "南昌市", weight: -1, lonLat: [115.858093, 28.697996] },
        { name: "九江市", weight: 99, lonLat: [115.960896, 29.664389] },
        { name: "上饶市", weight: 999, lonLat: [117.951846, 28.462877] },
        { name: "抚州市", weight: 100, lonLat: [116.359756, 27.952152] },
        { name: "宜春市", weight: 100, lonLat: [114.415731, 27.82408] },
        { name: "吉安市", weight: 100001, lonLat: [114.997963, 27.126129] },
        { name: "赣州市", weight: 99, lonLat: [114.93636, 25.8337] },
        { name: "景德镇市", weight: 10, lonLat: [117.184291, 29.274276] },
        { name: "萍乡市", weight: 99, lonLat: [113.858776, 27.633952] },
        { name: "新余市", weight: 99, lonLat: [114.921848, 27.821106] },
        { name: "鹰潭市", weight: 1000000, lonLat: [117.073683, 28.273128] },
      ];
    }
    this.boundary(this.map);
  },
  data() {
    return {
      city: [
        { name: "南昌市" },
        { name: "九江市" },
        { name: "上饶市" },
        { name: "抚州市" },
        { name: "宜春市" },
        { name: "吉安市" },
        { name: "赣州市" },
        { name: "景德镇市" },
        { name: "萍乡市" },
        { name: "新余市" },
        { name: "鹰潭市" },
      ],
      weightColor: {
        0: "#79E1F6",
        100: "#48CAE4",
        10000: "#48CAE4",
        100000: "#0077B6",
        1000000: "#023E8A",
      },
    };
  },
  methods: {
    boundary(map) {
      let boundary = new BMap.Boundary();
      this.city.forEach((item, index) => {
        boundary.get(item.name, (rs) => {
          rs.boundaries.forEach((bounder) => {
            let hole = new BMap.Polygon(bounder, {
              fillColor: this.boundaryType ? this.getColor(item) : "#79E1F6",
              fillOpacity: 0.2,
              strokeColor: "#fff",
            });
            map.addOverlay(hole);
            //板块图
            if (this.boundaryType) {
              let point = new BMap.Point(item.lonLat[0], item.lonLat[1]);
              let marker = new BMap.Marker(point);
              map.addOverlay(marker,{
              }); // 将标注添加到地图中
              let label = new BMap.Label(item.weight, {
                // 创建文本标注
                position: point, // 设置标注的地理位置
                offset: new BMap.Size(0,-70)
              });

              // 鼠标移入高亮
              marker.addEventListener("mouseover", () => {
                hole.setFillOpacity(0.4);
                label.setStyle({
                  color: "#000",
                  fontSize: "20px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "5px",
                  fontFamily: "微软雅黑",
                  padding: "10px",
                });
                map.addOverlay(label); // 将标注添加到地图中
              });

              marker.addEventListener("mouseout", () => {
                hole.setFillOpacity(0.2);
                map.removeOverlay(label);
              });
            }
          });
        });
      });
    },
    getColor(item) {
      switch (
        Object.keys(this.weightColor).findIndex((el) => el > item.weight) - 1
      ) {
        // 权重<0
        case -1:
          return Object.entries(this.weightColor)[0][1];
        // 权重>最大值
        case -2:
          return Object.entries(this.weightColor).pop()[1];
        // 权重范围[a,b)
        default:
          return Object.entries(this.weightColor)[
            Object.keys(this.weightColor).findIndex((el) => el > item.weight) -
              1
          ][1];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.legend-wrap {
  position: absolute;
  bottom: 50px;
  right: 0;
  background: #fff;
  padding: 0 10px;
  border-radius: 5px;
  z-index: 9;
  .legend-item {
    display: flex;
    align-items: center;
    margin: 10px 0;
    .icon {
      margin-right: 10px;
      border-radius: 10px;
      width: 15px;
      height: 15px;
    }
  }
}
</style>