<template>
  <div style="z-index: 999" />
</template>
<script>
import Vue from 'vue'
import InfoDialog from './infoDialog'
import { listOrg } from '@/api/system/org'
import { getDeviceDataSet } from '@/api/device/device'
import pos_lixian_qiuji from '@/assets/images/map-icon-device.png'
import pos_lixian_banqiu from '@/assets/images/pos_lixian_banqiu.svg'
import pos_lixian_guding from '@/assets/images/pos_lixian_guding.svg'
import pos_lixian_yaokong from '@/assets/images/pos_lixian_yaokong.svg'
import pos_qiuji from '@/assets/images/pos_qiuji.svg'
import pos_banqiu from '@/assets/images/pos_banqiu.svg'
import pos_guding from '@/assets/images/pos_guding.svg'
import pos_yaokong from '@/assets/images/pos_yaokong.svg'
import monitor from '@/assets/images/monitor.svg'
import lixian_monitor from '@/assets/images/lixian_monitor.svg'
export default {
  components: {
    InfoDialog
  },
  props: ['map', 'deviceList'],
  data() {
    return {
      markerList: [],
      markerClusterer: null // 聚类
    }
  },
  watch: {
    deviceList: {
      handler(newData, oldData) {
        this.showDeviceList = newData // 地图上显示的设备
        this.cluster(newData)
        this.markerClusterer.setStyles(
          this.markerClusterer
            .getStyles()
            .map((item) => ({ ...item, textColor: '#fff' }))
        )
      },
      immediate: true,
      deep: true
    }
  },
  created() {
  },
  methods: {
    // 所有设备位于可视范围内
    getBounds(data) {
      if (data.length) {
        const resData = data.map(
          (item) =>
            new BMap.Point(
              Number(item.longitude),
              Number(item.latitude)
            )
        )
        const { zoom, center } = this.map.getViewport(resData)
        this.map.centerAndZoom(center, zoom)
      }
    },
    addDeviceMarker(deviceItem) {
      let exist = false
      for (let i = 0; i < this.markerList.length; i++) {
        if (deviceItem.id == this.markerList[i].id) {
          exist = true
          break
        }
      }
      if (exist) {
        return
      }
      const point = new BMap.Point(
        Number(deviceItem.longitude),
        Number(deviceItem.latitude)
      )
      // 创建添加点标记
      const marker = new BMap.Marker(point, {
        icon: new BMap.Icon(
          this.deviceType(deviceItem),
          new BMap.Size(45, 45), // 图标可视区域的大小
          {
            // 指定定位位置。
            imageOffset: new BMap.Size(-3, -3), // 设置图片偏移
            imageSize: new BMap.Size(30, 40) // 图片大小
          }
        )
      })
      marker.id = deviceItem.id
      this.markerList = [...this.markerList, marker]
      // 创建图文信息窗口
      marker.addEventListener('mouseover', () => {
        const label = new BMap.Label(deviceItem.name, {
          offset: new BMap.Size(0, -40)
        })
        label.setStyle({
          color: '#000',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '16px',
          fontFamily: '微软雅黑'
        })
        marker.setLabel(label)
      })
      marker.addEventListener('mouseout', () => {
        this.map.removeOverlay(marker.getLabel())
      })
      const item = {}
      // console.log('deviceItem', deviceItem)

      // deviceItem.orgName = '123'
      // marker添加点击事件
      marker.addEventListener('click', () => {
        const infoDialog = Vue.extend({

          render: (h) => h(InfoDialog, { props: { deviceobj: deviceItem, longitude: deviceItem.longitude, latitude: deviceItem.latitude, address: deviceItem.address }})
        })

        const baseComponent = new infoDialog().$mount()

        const infoWindow = new BMap.InfoWindow(baseComponent.$el, {
          offset: new BMap.Size(0, -20),
          width: 250,
          height: 320
        }) // 创建信息窗口对象
        this.map.removeOverlay(marker.getLabel())
        this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
        // this.$emit('device-click', item)
      })
    },
    cluster(data) {
      data.map((item) => {
        this.addDeviceMarker(item)
      })
      // 显示所有聚类覆盖物
      this.showAllClusterDevice(this.markerList)
      this.getBounds(data)
    },
    // 显示设备图标
    deviceType(item) {
      return pos_lixian_qiuji
      // switch (item.devCategory) {
      //   case '1':
      //     return item.status ? pos_qiuji : pos_lixian_qiuji
      //   case '2':
      //     return item.status ? pos_banqiu : pos_lixian_banqiu
      //   case '3':
      //     return item.status ? pos_guding : pos_lixian_guding
      //   case '4':
      //     return item.status ? pos_yaokong : pos_lixian_yaokong
      //   default:
      //     return item.status ? monitor : lixian_monitor
      // }
    },
    // 地图上显示的设备标签
    showAllDeviceLabel() {
      this.showDeviceList.forEach((item, index) => {
        const label = new BMap.Label(item.name, {
          offset: new BMap.Size(0, -40),
          position: new BMap.Point(item.longitude, item.latitude)
        })
        label.stauts = 'label'
        label.setStyle({
          color: '#000',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '16px',
          fontFamily: '微软雅黑'
        })
        this.map.addOverlay(label)
      })
    },
    // 清除全部设备标签
    clearAllDeviceLabel() {
      this.map.getOverlays().forEach((item) => {
        if (item.toString() === '[object Label]') {
          this.map.removeOverlay(item)
          // item.hide()
        }
      })
    },
    // 删除所有聚类覆盖物
    clearAllClusterDevice() {
      this.markerClusterer.clearMarkers()
    },
    // 显示选择的聚类覆盖物类型
    showAllClusterDevice(data) {
      // 最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
      this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
        markers: data
      })
    },
    // 过滤设备类型
    async filterClusterDevice(type) {
      const res = await getDeviceDataSet({ ...type, isFilter: true })
      if (!res) return []
      this.markerList = []
      this.showDeviceList = res
      this.cluster(res)
    },
    // 跳一跳
    bounce(data) {
      this.addDeviceMarker(data)
      const jump = this.markerList.find(
        (item) => item.id === data.id
      )

      const infoDialog = Vue.extend({
        render: (h) => h(InfoDialog, { props: {
          deviceobj: data,
          longitude: data.longitude,
          latitude: data.latitude,
          address: data.address,
          orgname: data.orgname }})
      })

      const baseComponent = new infoDialog().$mount()

      const infoWindow = new BMap.InfoWindow(baseComponent.$el, {
        offset: new BMap.Size(0, -20),
        width: 250
      }) // 创建信息窗口对象
      this.map.centerAndZoom(jump.point, 15)
      this.map.openInfoWindow(infoWindow, jump.point) // 开启信息窗口

      jump.setAnimation(BMAP_ANIMATION_BOUNCE)
      setTimeout(() => {
        jump.setAnimation()
      }, 2000)
    }
  }
}
</script>
