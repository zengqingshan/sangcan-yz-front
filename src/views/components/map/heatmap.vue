<template>
  <div></div>
</template>
<script>
export default {
  props: ["map"],
  data() {
    return {
      heatmapData: [
        {
          longitude: 117.000923,
          latitude: 36.675807,
          count: 10,
        },
      ],
    };
  },
  watch: {
    map(curMap, old) {
      let heatmap;
      curMap.plugin(["AMap.Heatmap"], () => {
        //初始化heatmap对象
        heatmap = new AMap.Heatmap(curMap, {
          radius: 25, //给定半径
          opacity: [0, 0.8],
        });
        heatmap.setDataSet({
          data: this.heatmapData,
          max: 1,
        });
      });
    },
  },
};
</script>