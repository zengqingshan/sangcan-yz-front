<template>
  <div></div>
</template>
<script>
import plantJson from "@/assets/json/jiangxiPlant.json";

export default {
  props: ["map"],
  watch: {
    map(curMap, old) {
      let geojson = new AMap.GeoJSON({
        geoJSON: plantJson,
        getPolygon: function (geojson, lnglats) {
          // 计算面积
          let area = AMap.GeometryUtil.ringArea(lnglats[0]);
          return new AMap.Polygon({
            path: lnglats,
            fillOpacity: 0.3, // 面积越大透明度越高
            strokeColor: "white",
            fillColor: "red",
          });
        },
      });
      curMap.add(geojson);
    },
  },
  data() {
    return {
      plantJson: [],
    };
  },
};
</script>