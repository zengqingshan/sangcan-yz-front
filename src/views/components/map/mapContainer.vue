<template>
  <div>
    <div id="map"></div>
    <Heatmap :map="map"></Heatmap>
    <PlantLayer :map="map"></PlantLayer>
    <PathLayer :map="map"></PathLayer>
    <DrawLayer :map="map"></DrawLayer>
    <MarkerLayer :map="map"></MarkerLayer>
  </div>
</template>
<script>
import AMap from "amap";
import AMapLoader from "@amap/amap-jsapi-loader";
import Heatmap from "./heatmap";
import PlantLayer from "./plantLayer";
import PathLayer from "./pathLayer";
import DrawLayer from "./drawLayer";
import MarkerLayer from "./markerLayer";
export default {
  components: {
    Heatmap,
    PlantLayer,
    PathLayer,
    DrawLayer,
    MarkerLayer,
  },
  data() {
    return {
      heatmapData: [
        {
          longitude: 117.000923,
          latitude: 36.675807,
          count: 10,
        },
      ],
      map: {},
    };
  },
  mounted() {
    AMapLoader.load({
      key: "cadc2c02eac4442b66baf567078cbf43", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.MouseTool'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      AMapUI: {
        version: "1.1",
        plugins: ["overlay/SimpleMarker"],
      },
      Loca: {
        // 是否加载 Loca， 缺省不加载
        version: "1.3.2", // Loca 版本，缺省 1.3.2
      },
    })
      .then((AMap) => {
        this.map = new AMap.Map("map", {
          resizeEnable: true,
          center: [117.000923, 36.675807],
          zoom: 11,
        });
        this.$emit("map-event", this.map);
      })
      .catch((e) => {
        console.log(e);
      });
  },

  methods: {},
};
</script>
<style>
#map {
  width: 100%;
  height: calc(100vh - 84px);
}
.amap-logo,.amap-copyright{
    display:none !important;
}
</style>