<template>
  <div id="full-screen">
    <div :id="mapid || 'map'" :style="newStyle ? newStyle : mapStyle" />
    <PathLayer
      v-if="type.includes('path') && map && pathData && pathData.length"
      :map="map"
      :path-data="pathData"
    />
    <DrawPathLayer
      v-if="type.includes('drawPath') && map && deviceList && deviceList.length"
      ref="pathLayer"
      :map="map"
      :click-device-coor="clickDeviceCoor"
      @clear-current-device="clearCurrentDevice"
    />
    <DrawLayer
      v-if="type.includes('draw') && map && deviceList"
      :map="map"
      :device-list="deviceList"
      @select-device-id="getDeviceId"
    />
    <ClusterLayer
      v-if="type.includes('cluster') && map && deviceList"
      ref="markerLayer"
 
      :map="map"
      :device-list="deviceList"
      @device-click="deviceClick"
    />
    <ToolBar
      v-if="type.includes('tool') && map && deviceList"
      ref="toolBar"
      :map="map"
      :device-list="deviceList"
      :legend-list="legendList"
      @custom-style="customStyle"
    />
    <!-- &&legendList&&legendList.length -->
    <Boundary
      v-if="type.includes('boundary') && map && deviceList && deviceList.length"
      :map="map"
      v-bind="$attrs"
    />
    <Heatmap
      v-if="type.includes('heatmap') && map"
      :map="map"
      :heatmap-data="heatmapData"
    />
    <InfoWindow
      v-if="type.includes('info') && map"
      :map="map"
      :info-data="infoData"
    />
    <Geocoder
      v-if="type.includes('geocoder') && map"
      :map="map"
      @click-marker="clickMarker"
    />
  </div>
</template>
<script>
import Heatmap from './Heatmap'
import PathLayer from './PathLayer'
import DrawPathLayer from './DrawPathLayer'
import ClusterLayer from './ClusterLayer'
import DrawLayer from './DrawLayer'
import Boundary from './Boundary'
import ToolBar from './ToolBar'
import InfoWindow from './InfoWindow'
import config from './config.js'
import Geocoder from './Geocoder.vue'
import ball from '../../assets/images/ball.png'

export default {
  components: {
    Heatmap,
    PathLayer,
    DrawPathLayer,
    ClusterLayer,
    DrawLayer,
    Boundary,
    ToolBar,
    InfoWindow,
    Geocoder
  },
  // props:{

  // }
  props: [
    'type',
    'heatmapData',
    'deviceList',
    'pathData',
    'newStyle',
    'infoData',
    'clickDeviceCoor',
    'legendList',
    'mapid',
    'longitude',
    'latitude',
    'zoom'
  ],
  data() {
    return {
      map: null, // 初始化地图
      view: null, // 初始化mapgl容器对象，管理可视化图层
      mapStyle: null,

    }
  },
  watch: {
    legendList: {
      handler(newData, oldData) {},
      immediate: true
    },
    deviceList: {
      handler(newData, oldData) {},
      immediate: true
    },
    mapid(newval) {
      this.map = new BMap.Map(newval, { enableMapClick: false })
      const mapdiv = document.querySelector(`#${newval}`)
      mapdiv.style.height = '100vh'
      mapdiv.style.margin = '16px'
    }
  },
  mounted() {
    this.map = new BMap.Map(this.mapid, { enableMapClick: false })
    const mapdiv = document.querySelector(`#${this.mapid}`)
    mapdiv.style.height = this.newStyle.height || '100vh'
    mapdiv.style.margin = '16px'
    let initLongitude = this.longitude
    let initLatitude = this.latitude
    let initZoom = this.zoom
    if (!initLongitude) {
      initLongitude = config.center[0]
    }
    if (!initLatitude) {
      initLatitude = config.center[1]
    }
    if (!initZoom) {
      initZoom = config.zoom
    }

    // 创建地图实例
    const point = new BMap.Point(initLongitude, initLatitude)
    // 创建点坐标
    this.map.centerAndZoom(point, initZoom)

    // 初始化地图，设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom()
    this.map.setMapType(BMAP_HYBRID_MAP) // 此地图类型展示卫星和路网的混合视图
    // 添加缩放控件(旧)
    // this.map.addControl(
    //     new BMap.NavigationControl({
    //         // 靠左上角位置
    //         anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    //         // LARGE类型
    //         type: BMAP_NAVIGATION_CONTROL_ZOOM,
    //         offset: new BMap.Size(20, 5), //偏离值
    //     })
    // );
    // 添加缩放控件(新)
    // 定义一个控件类，即function
    function ZoomControl() {
      // 设置默认停靠位置和偏移量
      this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT
      this.defaultOffset = new BMap.Size(10, 10)
    }
    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control()

    // 自定义控件必须实现initialize方法，并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
    ZoomControl.prototype.initialize = () => {
      // 创建一个DIV
      const mydiv = document.createElement('div')
      // 创建一个放大用的img
      const img_plus = document.createElement('i')
      img_plus.className = 'el-icon-plus'
      this.customControlStyle(img_plus)
      img_plus.style.right = '67px'
      img_plus.style.borderTopLeftRadius = '5px'
      img_plus.style.borderBottomLeftRadius = '5px'
      img_plus.style.borderRight = '1px solid #ddd'
      // 设置img的src属性
      img_plus.setAttribute('src', ball)
      // 为img设置点击事件
      img_plus.onclick = () => {
        this.map.zoomTo(this.map.getZoom() + 1)
      }
      // 创建一个缩小用的img
      const img_minus = document.createElement('i')
      img_minus.className = 'el-icon-minus'

      this.customControlStyle(img_minus)
      img_minus.style.right = '28px'
      img_minus.style.borderTopRightRadius = '5px'
      img_minus.style.borderBottomRightRadius = '5px'
      img_minus.setAttribute('src', ball)
      img_minus.onclick = () => {
        this.map.zoomTo(this.map.getZoom() - 1)
      }
      // 添加放大的img图标到div中
      mydiv.appendChild(img_plus)
      // 添加缩小的img图标到div中
      mydiv.appendChild(img_minus)
      // 添加DOM元素到地图中
      this.map.getContainer().appendChild(mydiv)
      // 将DOM元素返回；
      return mydiv
    }

    // 创建控件实例
    const myZoomCtrl = new ZoomControl()
    // 添加到地图当中
    this.map.addControl(myZoomCtrl)
  },
  created() {
  },
  methods: {

    customControlStyle(img) {
      img.style.padding = '12px'
      img.style.position = 'absolute'
      img.style.bottom = '10px'
      img.style.background = '#fff'
      img.style.borderRight = '1px solid #ddd'
    },
    deviceClick(item) {
      this.$emit('device-click', item)
    },
    clearCurrentDevice() {
      this.$emit('clear-current-device')
    },
    // 全屏地图样式
    customStyle(e) {
      this.mapStyle = e
    },
    // 显示所有设备标签
    showAllDeviceLabel() {
      this.$refs.markerLayer.showAllDeviceLabel()
    },
    // 删除所有设备标签
    clearAllDeviceLabel() {
      this.$refs.markerLayer.clearAllDeviceLabel()
    },
    // 删除所有聚类覆盖物
    clearAllClusterDevice() {
      this.$refs.markerLayer.clearAllClusterDevice()
    },
    // 显示选择的聚类覆盖物类型
    filterClusterDevice(type) {
      this.$refs.markerLayer.filterClusterDevice(type)
    },
    // 动态视角
    flyTo(lng, lat, zoom) {
      this.map.centerAndZoom(new BMap.Point(lng, lat), zoom)
    },
    // 跳一跳
    bounce(item) {
      this.$refs.markerLayer.bounce(item)
    },
    // 框选设备id
    getDeviceId(e) {},
    // 正向打点
    clickMarker(e) {
      const geoc = new BMap.Geocoder()
      const point = new BMap.Point(e[0], e[1])
      // 对指定的坐标点进行反地址解析。如果解析成功，则回调函数的参数为GeocoderResult对象，否则回调函数的参数为null
      geoc.getLocation(point, (res) => {
        const param = []
        param.push(...e)

        var addComp = res.addressComponents
        const addr =
          addComp.province +
          addComp.city +
          addComp.district +
          addComp.street +
          addComp.streetNumber
        param.push(addr)
        this.$emit('click-marker-coor', param)
      })
    },
    // 禁止绘制
    disableDraw() {
      this.$refs.pathLayer.disableDraw()
    },
    // 绘制
    drawOpen() {
      this.$refs.pathLayer?.drawOpen()
    }
  }
}
</script>
<style lang="scss" scope>
#full-screen {
  width: 100%;
  height: 100%;
  position: relative;
  // #map {
  //     height: calc(100vh - 84px);
  //     margin: 16px;
  // }
  .BMap_cpyCtrl,
  .anchorBL {
    display: none;
  }
  .BMap_noprint .anchorBR {
    background: #fff !important;
  }
  // .BMap_bubble_content {
  //     div:nth-child(2) {
  //         > input[type="text"] {
  //             margin-bottom: 2px !important;
  //         }
  //         > input[type="button"] {
  //             width: 37px !important;
  //         }
  //     }
  // }
}
// .BMap_pop,
// .BMap_shadow {
//     display: none;
// }
</style>
