<template>
  <div class="draw-panel">
    <el-radio-group v-model="radio" @change="selectDrawType">
      <el-radio-button v-for="(value, key) in drawType" :key="key" :label="key">
        {{ value }}</el-radio-button>
    </el-radio-group>
    <el-button type="primary" icon="el-icon-delete" @click="onDelete">删除</el-button>
  </div>
</template>
<script>
export default {
  props: ['map', 'deviceList'],
  data() {
    return {
      drawType: {
        BMAP_DRAWING_CIRCLE: '画圆',
        // BMAP_DRAWING_RECTANGLE: "画矩形",
        BMAP_DRAWING_POLYGON: '画多边形'
      },
      radio: '', // radio 选择类型
      drawingManager: null, // AMap 编辑矢量图形
      curEnableEditing: null, // 当前选中的绘制覆盖物
      curMarker: null, // 当前选中的绘制覆盖物上的marker
      chooseDevice: {}, // 选择摄像头对象{id:coor}
      styleOptions: {
        strokeColor: '#5E87DB', // 边线颜色
        fillColor: '#5E87DB', // 填充颜色。当参数为空时，圆形没有填充颜色
        strokeWeight: 2, // 边线宽度，以像素为单位
        strokeOpacity: 1, // 边线透明度，取值范围0-1
        fillOpacity: 0.2 // 填充透明度，取值范围0-1
      }
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw() {
      // 实例化鼠标绘制工具
      this.drawingManager = new BMapLib.DrawingManager(this.map, {
        // isOpen: true,        // 是否开启绘制模式
        // enableDrawingTool: true, //是否显示工具栏
        enableCalculate: false, // 绘制是否进行测距测面
        enableSorption: true, // 是否开启边界吸附功能
        sorptiondistance: 20, // 边界吸附距离
        circleOptions: this.styleOptions, // 圆的样式
        // rectangleOptions: this.styleOptions, // 矩形的样式
        polygonOptions: this.styleOptions // 多边形的样式
      })
      // 监听绘制完成的事件
      this.drawingManager.addEventListener('overlaycomplete', (e) => {
        e.overlay.enableEditing() // 绘制完成后打开编辑模式
        this.drawingManager.close() // 绘制完成，关闭绘制的状态
        // 随机定义每次绘制覆盖物的id
        e.overlay.id = Math.round(Math.random() * 100000 + 100000)
        // 框选图形内的设备
        this.isPointInPolygon(e.overlay)
        this.curEnableEditing = e.overlay // 绘制完成后开启编辑模式的覆盖物
        this.filterId() // 过滤重复设备id

        this.addandMoveMarker(e)
      })
      // 监听地图点击事件，判断选中覆盖物类型
      this.map.addEventListener('click', (e) => {
        // 选中覆盖物是圆|面，只打开当前选中覆盖物的编辑模式
        if (
          e.overlay &&
          (e.overlay.toString() === '[object Circle]' ||
            e.overlay.toString() === '[object Polygon]')
        ) {
          this.closeEdit()

          e.overlay.enableEditing() // 开启选中覆盖物的编辑模式
          this.curEnableEditing = e.overlay // 选中并开启编辑模式的覆盖物
          this.addandMoveMarker(e)
        }
      })
    },
    // 选择绘制覆盖物类型
    selectDrawType(e) {
      this.closeEdit()

      let drawingType
      // if (e === "BMAP_DRAWING_RECTANGLE") {
      //   drawingType = BMAP_DRAWING_RECTANGLE;
      // }
      if (e === 'BMAP_DRAWING_CIRCLE') {
        drawingType = BMAP_DRAWING_CIRCLE
      }
      if (e === 'BMAP_DRAWING_POLYGON') {
        drawingType = BMAP_DRAWING_POLYGON
      }
      // 进行绘制
      if (
        this.drawingManager._isOpen &&
        this.drawingManager.getDrawingMode() === drawingType
      ) {
        this.drawingManager.close()
      } else {
        this.drawingManager.setDrawingMode(drawingType)
        this.drawingManager.open()
        this.radio = ''
      }
    },

    // 框选设备和绘制覆盖物的关系，return 当前框选的设备id
    isPointInPolygon(polygon) {
      this.chooseDevice[polygon.id] = []
      this.deviceList.forEach((item) => {
        // 设备在面内
        if (
          BMapLib.GeoUtils.isPointInPolygon(
            new BMap.Point(item.longitude, item.latitude),
            polygon
          )
        ) {
          this.chooseDevice[polygon.id].push(item)
        }
      })
    },
    // 过滤重复框选的设备id
    filterId() {
      // 过滤数组重复的设备
      this.$emit(
        'select-device-id',
        Array.from(
          new Set(
            Object.values(this.chooseDevice).reduce(
              (pre, next) => [...pre, ...next],
              []
            )
          )
        )
      )
    },
    // 删除绘制图形
    onDelete() {
      // 当前未选中覆盖物，不执行删除方法
      if (!this.curEnableEditing) return
      // 地图中删除选中的覆盖物和marker
      this.map.removeOverlay(this.curEnableEditing)
      this.map.removeOverlay(this.curMarker)
      delete this.chooseDevice[this.curEnableEditing.id] // 删除当前选中的覆盖物，通过id删除
      this.filterId() // 过滤重复框选的设备id
      this.curEnableEditing = null // 删除当前选中覆盖物
      this.curMarker = null // 删除当前选中覆盖物
    },
    // 移动
    moveMarker(e, type) {
      this.curMarker.addEventListener('dragging', (marker) => {
        this.map.getOverlays().forEach((item) => {
          // 删除一个生成的覆盖物，不删除覆盖物上的marker
          if (
            item.id === this.curEnableEditing.id &&
            item.toString() !== '[object Marker]'
          ) {
            this.map.removeOverlay(item)
          }
        })
        let overlay
        // 圆形
        if (type === '[object Circle]') {
          overlay = new BMap.Circle(
            new BMap.Point(marker.point.lng, marker.point.lat),
            this.curEnableEditing.getRadius(),
            this.styleOptions
          )
        } else {
          // 多边形
          const newCircleData = []
          const newLng = marker.target.point.lng - marker.target.beforeLng // 移动的lng距离
          const newLat = marker.target.point.lat - marker.target.beforeLat // 移动的lat距离
          e.overlay.getPath().forEach((item) => {
            const obj = {}
            obj.lng = item.lng + newLng
            obj.lat = item.lat + newLat
            newCircleData.push(obj)
          })
          // 重新添加覆盖物
          const pointArr = []
          newCircleData.forEach((item, index) => {
            pointArr.push(new BMap.Point(item.lng, item.lat))
          })
          overlay = new BMap.Polygon(pointArr, this.styleOptions)
        }
        overlay.id = this.curEnableEditing.id
        this.map.addOverlay(overlay)
        this.isPointInPolygon(overlay) // 框选图形内的设备
        this.filterId() // 过滤重复设备id
      })
    },
    // 关闭所有覆盖物编辑模式
    closeEdit() {
      this.map.getOverlays().forEach((item) => {
        if (
          item.toString() === '[object Circle]' ||
          item.toString() === '[object Polygon]'
        ) {
          item.disableEditing()
        }
        if (item.toString() === '[object Marker]' && item.id) {
          this.map.removeOverlay(item)
        }
      })
    },
    // 监听覆盖物编辑
    update(e) {
      e.overlay.addEventListener('lineupdate', (e) => {
        this.isPointInPolygon(e.target) // 框选图形内的设备
        this.filterId() // 过滤重复设备id
      })
    },
    // 增加覆盖物上的marker
    addMaker(e, type) {
      let center
      // 圆形
      if (type === '[object Circle]') {
        center = e.overlay.getCenter()
      } else {
        // 多边形
        const path = e.overlay.getPath()
        center = {
          lat: 0,
          lng: 0
        }
        path.forEach((item) => {
          center.lat += item['lat']
          center.lng += item['lng']
        })
        center.lng = center.lng / path.length
        center.lat = center.lat / path.length
      }
      this.curMarker = new BMap.Marker(new BMap.Point(center.lng, center.lat))
      // 原始marker经纬度
      this.curMarker.beforeLng = center.lng
      this.curMarker.beforeLat = center.lat
      this.curMarker.id = e.overlay.id
      this.curMarker.enableDragging()
      this.map.addOverlay(this.curMarker)
    },
    // 增加marker并移动
    addandMoveMarker(e) {
      const type = e.overlay.toString()
      this.addMaker(e, type)
      this.update(e)
      this.moveMarker(e, type)
    }
  }
}
</script>
<style lang="scss" scoped>
.draw-panel {
  position: absolute;
  top: 0;
  background: #fff;
  z-index: 9;
}
</style>
