<template>
  <div>
    <InfoDialog id="infoDialog"></infoDialog>
  </div>
</template>
<script>
import InfoDialog from './infoDialog'
import Vue from 'vue'
export default {
  components:{
    InfoDialog,
  },
  props: ["infoData", "map"],
  mounted() {
    // console.log(this.infoData);
    this.showInfoWindow();
  },
  data() {
    return {};
  },
  watch: {
    infoData: {
      handler (val) {
        this.showInfoWindow()
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
      

    showInfoWindow() {
      
      if(!this.infoData.deviceInfo){
         return 
      }
 
      let point = new BMap.Point(this.infoData.deviceInfo.longitude, this.infoData.deviceInfo.latitude);
      let marker = new BMap.Marker(point); // 创建标注
      this.map.addOverlay(marker); // 将标注添加到地图中
      this.map.centerAndZoom(point, 15);

      let infoDialog = Vue.extend({
        render: (h) => h(InfoDialog, { props:{deviceobj: this.infoData.deviceInfo}})
      })

      let baseComponent = new infoDialog().$mount();

      
      let infoWindow = new BMap.InfoWindow(baseComponent.$el, {
        offset: new BMap.Size(0, -20),
        width: 250,
      }); // 创建信息窗口对象
   
      this.map.openInfoWindow(infoWindow, point); //开启信息窗口
      
      marker.addEventListener("click", function () {

        this.map.openInfoWindow(infoWindow, point); //开启信息窗口
      });
    },
  },
};
</script>