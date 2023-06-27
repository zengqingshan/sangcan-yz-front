<template>
  <div id="amapcontainer" style="width: 100%; height: 880px"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
window._AMapSecurityConfig = {
  securityJsCode: '0ab20d7dcebd43f3c7e6fc05089007c5' // '「申请的安全密钥」',
}
export default {
  data() {
      return {
          map: null
      }
  },
  methods: {
      initAMap() {
          AMapLoader.load({
              key: "698fc6b0ee66ba47ef1c0fd36cf7cdba", // 申请好的Web端开发者Key，首次调用 load 时必填
              version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
              plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.ControlBar", 'AMap.Geocoder', 'AMap.Marker',
                  'AMap.CitySearch', 'AMap.Geolocation', 'AMap.AutoComplete', 'AMap.InfoWindow'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
          }).then((AMap) => {
              // 获取到作为地图容器的DOM元素，创建地图实例
              this.map = new AMap.Map("amapcontainer", { //设置地图容器id
                  resizeEnable: true,
                  zoom: this.zoom, // 地图显示的缩放级别
                  viewMode: "3D", // 使用3D视图
                  zoomEnable: true, // 地图是否可缩放，默认值为true
                  dragEnable: true, // 地图是否可通过鼠标拖拽平移，默认为true
                  doubleClickZoom: true, // 地图是否可通过双击鼠标放大地图，默认为true
                  zoom: 11, //初始化地图级别
                  center: [115.857963, 28.683016], // 初始化中心点坐标 
                  // mapStyle: "amap://styles/darkblue", // 设置颜色底层
              })
          }).catch(e => {
              console.log(e)
          })
      }
  },
  mounted() {
      //DOM初始化完成进行地图初始化
      this.initAMap()
  }
}
</script>

<style lang="less"></style>

