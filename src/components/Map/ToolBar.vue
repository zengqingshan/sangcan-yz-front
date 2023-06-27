<template>
  <div class="tool-layer">
    <div class="tool-bar">
      <!--图层-->
      <div class="select-map" @click="layerOpen" @mouseover="layerIconVisible = true" @mouseleave="layerIconVisible = false">
        <img v-if="!layerVisible &&!layerIconVisible" title="图层" :src="toolBarIcon.map_ctrlLayer">
        <img v-else title="图层" :src="toolBarIcon.map_ctrlLayerActive">
      </div>
      <!--标注-->
      <div class="select-map" @click="openMark" @mouseover="markIconVisible = true" @mouseleave="markIconVisible = false">
        <img v-if="!markIconVisible&&!mapObj.showLabelArray" title="标注" :src="toolBarIcon.map_ctrlMark">
        <img v-else title="标注" :src="toolBarIcon.map_ctrlMarkActive">
      </div>
      <!--测距-->
      <div id="lineTool" class="select-map" @click="lineToolCtrl" @mouseover="distanceIconVisible = true" @mouseleave="distanceIconVisible = false">
        <img v-if="!distanceIconVisible" title="测距" :src="toolBarIcon.map_ctrlDistance">
        <img v-else title="测距" :src="toolBarIcon.map_ctrlDistanceActive">
      </div>
      <!--复位-->
      <div class="select-map" @click="mapRest" @mouseover="resetIconVisible = true" @mouseleave="resetIconVisible = false">
        <img v-if="!resetIconVisible" title="复位" :src="toolBarIcon.map_ctrlReset">
        <img v-else title="复位" :src="toolBarIcon.map_ctrlResetActive">
      </div>
      <!--全屏-->
      <div class="select-map" @click="toggleFullScreen" @mouseover="fullIconVisible = true" @mouseleave="fullIconVisible = false">
        <img v-if="!fullIconVisible" title="全屏" :src="toolBarIcon.map_ctrlFull">
        <img v-else title="全屏" :src="toolBarIcon.map_ctrlFullActive">
      </div>
      <!--图层弹窗-->
      <div v-if="layerVisible" class="layer-modal">
        <img class="layer-items" :src="layerImageList[0]" @click="layerChange(0)">
        <img class="layer-items" :src="layerImageList[1]" @click="layerChange(1)">
      </div>
    </div>

  </div>
</template>
<script>
import {
  listDevice

} from '@/api/system/device'
import vector from '@/assets/images/vector.png'
import satellitepoi from '@/assets/images/satellitepoi.png'
import blue from '@/assets/images/blue.png'
import map_ctrlLayer from '@/assets/images/map_ctrlLayer.svg'
import map_ctrlLayerActive from '@/assets/images/map_ctrlLayerActive.svg'
import map_ctrlMark from '@/assets/images/map_ctrlMark.svg'
import map_ctrlMarkActive from '@/assets/images/map_ctrlMarkActive.svg'
import map_ctrlDistance from '@/assets/images/map_ctrlDistance.svg'
import map_ctrlDistanceActive from '@/assets/images/map_ctrlDistanceActive.svg'
import map_ctrlReset from '@/assets/images/map_ctrlReset.svg'
import map_ctrlResetActive from '@/assets/images/map_ctrlResetActive.svg'
import map_ctrlFull from '@/assets/images/map_ctrlFull.svg'
import map_ctrlFullActive from '@/assets/images/map_ctrlFullActive.svg'
import map_qiuji from '@/assets/images/map_qiuji.svg'
import map_banqiu from '@/assets/images/map_banqiu.svg'
import map_qiangji from '@/assets/images/map_qiangji.svg'
import map_yaokong from '@/assets/images/map_yaokong.svg'
import map_yuntai from '@/assets/images/map_yuntai.svg'
import map_lixian from '@/assets/images/map_lixian.svg'
import map_banqiu_lixian from '@/assets/images/map_banqiu_lixian.svg'
import map_qiangji_lixian from '@/assets/images/map_qiangji_lixian.svg'
import map_yaokong_lixian from '@/assets/images/map_yaokong_lixian.svg'

export default {
  components: {

  },
  props: ['map', 'deviceList', 'legendList'],
  data() {
    return {

      isShowTip: true, // 提示
      checked: false, // 不再提示
      searchBtn: false, // 名称检索按钮可用
      deviceType: null, // 名称检索，选择设备类型
      searchData: {},
      searchResultVisible: false,
      searchContentVisible: false, // 显示搜索图例
      searchKey: '', // 搜索内容
      typeList: ['1', '2', '3', '4'], // 图例设备类型1球机|2半球|3固定枪机|4遥控枪机
      // isControl: true, //云台radio选中
      // status: true, //离线radio选中
      offline: true,
      online: true,
      cloud: true,
      noCloud: true,
      checks: {
        categoryList: ['1', '2', '3', '4']
        // status: false, //离线
        // isControl: false, //云台
      }, // 选中图例
      layerIconVisible: false, // 图层
      markIconVisible: false, // 标注
      distanceIconVisible: false, // 测距
      resetIconVisible: false, // 复位
      fullIconVisible: false, // 全屏
      layerVisible: false, // 图层弹窗
      layerImageList: [vector, satellitepoi, blue],
      legendIcon: {
        1: { open: map_qiuji, close: map_lixian },
        2: { open: map_banqiu, close: map_banqiu_lixian },
        3: { open: map_qiangji, close: map_qiangji_lixian },
        4: { open: map_yaokong, close: map_yaokong_lixian },
        map_lixian: map_lixian,
        map_yuntai: map_yuntai
      },
      toolBarIcon: {
        map_ctrlLayer: map_ctrlLayer,
        map_ctrlLayerActive: map_ctrlLayerActive,
        map_ctrlMark: map_ctrlMark,
        map_ctrlMarkActive: map_ctrlMarkActive,
        map_ctrlDistance: map_ctrlDistance,
        map_ctrlDistanceActive: map_ctrlDistanceActive,
        map_ctrlReset: map_ctrlReset,
        map_ctrlResetActive: map_ctrlResetActive,
        map_ctrlFull: map_ctrlFull,
        map_ctrlFullActive: map_ctrlFullActive
      }, // 工具条icon
      windowContent: {
        width: 0,
        height: 0,
        chartHeight: 0
      },
      mapStyle: {},
      distance: null,
      mapObj: {
        showLabelArray: false
      },
      distanceList: []

    }
  },

  watch: {
    searchKey() {
      if (this.searchKey === '') {
        this.searchContentVisible = true // 清空输入，显示图例
        this.searchResultVisible = false // 隐藏搜索结果
        this.searchBtn = false // 全文搜索按钮可用
        this.$parent.clearAllClusterDevice() // 删除所有聚类覆盖物
        this.$parent.filterClusterDevice({
          name: this.searchKey,
          ...this.checks
        }) // 名称搜索
        this.mapObj.showLabelArray = false // 标注按钮重置
        this.$parent.clearAllDeviceLabel() // 清除标注
      }
    },
    checked() {
      localStorage.setItem('tip', this.checked)
    },
    deviceList: {
      handler(newData, oldData) {},
      immediate: true
    },
    input2(newval) {
      if (newval == '') {
        this.showres = true
      }
    }
  },
  created() {
    // this.testtt()
  },
  mounted() {
    
    this.distance = new BMapLib.DistanceTool(this.map, {
      lineColor: '#1890ff',
      opacity: 1
    })
    if (JSON.parse(localStorage.getItem('tip'))) {
      this.isShowTip = false // 隐藏
    } else {
      this.isShowTip = true // 显示
    }
  },
  methods: {
    // 关闭抽屉
    onDrawer() {
      this.drawer = false
      this.deviceDetail = {}
    },
    // 设备图标点击
    deviceClick(item) {
      this.deviceDetail = item
      this.drawer = !this.drawer
    },
    // 获取设备
    // async getDeviceDataSet() {
    //   const res = await listDevice({ isFilter: true })
    //   if (!res) return []
    //   res.forEach((item) => {
    // 离线云台
    // if (!item.isControl && !item.status) {
    //     this.deviceList = [...this.deviceList, item];
    // }
    // 设备类型为1-4中的一种
    //     if (['1', '2', '3', '4'].includes(item.devCategory)) {
    //       this.deviceList = [...this.deviceList, item]
    //     }
    //   })
    //   this.legendList = res
    // },
    // 创建地图坐标图层

    cuslayers(lon, lat) {
      function createDOM(feature) {
        const img = document.createElement('img')
        img.style.height = '240px'
        img.style.width = '80px'
        img.src = 'https://bj.bcebos.com/v1/mapopen-pub-jsapigl/assets/images/fire.gif'
        img.draggable = false
        return img
      }
      // 自定义图层
      const cusLayer = new BMap.CustomHtmlLayer(createDOM, {
        offsetX: 0,
        offsetY: 0,
        minZoom: 5,
        maxZoom: 17,
        enablePick: true
      })
      const data = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [lon, lat]
            },
            'properties': { 'prop0': 'value0' }
          }
        ]
      }
      // 设置图层数据
      cusLayer.setData(data)

      // 将自定义html图层添加到地图上
      this.map.addCustomHtmlLayer(cusLayer)
    },

    // 图层方法，打开图层切换抽屉
    layerOpen(e) {
      if (this.layerVisible) {
        this.layerVisible = false
        this.layerBit = false // 隐藏右侧控件
        this.stopBubble(e)
      } else {
        this.layerVisible = true
        this.layerBit = true // 隐藏右侧控件
        this.stopBubble(e)
      }
    },
    stopBubble(e) {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      } else {
        window.event.cancelBubble = true
      }
    },
    // 复位按钮，点击重置map数据
    mapRest() {
      this.$parent.flyTo(115.858093, 28.697996, 10)
      // this.resetMap();
    },
    // 控制文字标注的显示和隐藏
    openMark() {
      this.mapObj.showLabelArray = !this.mapObj.showLabelArray
      if (this.mapObj.showLabelArray) {
        this.$parent.showAllDeviceLabel()
      } else {
        this.$parent.clearAllDeviceLabel()
      }
    },
    // 测距方法
    lineToolCtrl() {
      this.distance.open()
    },
    // 图层切换具体方法
    layerChange(e) {
      this.layerVisible = false
      if (e === 0) {
        this.map.setMapType(BMAP_NORMAL_MAP) // 设置地图类型为地球模式
      } else {
        this.map.setMapType(BMAP_HYBRID_MAP) // 设置地图类型为地球模式
      }
    },
    // 打开设备信息弹窗
    showDialog(id, devCode, title, status) {
      this.dialogVisible = true
      setTimeout(() => {
        this.$refs.dialogDetail.init(id, devCode, title, status)
      }, 100)
    },
    // 全屏方法
    toggleFullScreen(e) {
      if (!this.isFullscreen) {
        this.FullScreen(document.getElementById('full-screen'))
        this.mapStyle = {
          height: '100vh',
          width: '100vw',
          margin: '0'
        }
      } else {
        this.exitFullscreen()
        this.mapStyle = {
          height: 'calc(100vh - 84px)',
          margin: '16px'
        }
      }
      this.$emit('custom-style', this.mapStyle)
      this.isFullscreen = !this.isFullscreen
    },
    // 进入全屏方法
    FullScreen(el) {
      if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
      } else if (el.requestFullscreen) {
        el.requestFullscreen()
      }
      const that = this
      setTimeout(function() {
        that.windowContent.height = screen.height
      }, 500)
    },
    // 退出全屏方法
    exitFullscreen() {
      if (document.exitFullScreen) {
        document.exitFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
    // 监听屏幕变化事件
    addFullScreenListener() {
      const _that = this
      // 监听全屏 退出全屏事件，适配浏览器
      document.addEventListener('fullscreenchange', () => {
        if (document.fullscreen === false) {
          this.isFullscreen = false
          _that.initWidthAndHeight()
        } else {
          this.windowContent.height = screen.height
          this.isFullscreen = true
        }
      })
      document.addEventListener('mozfullscreenchange', () => {
        if (document.mozFullScreen === false) {
          this.isFullscreen = false
          _that.initWidthAndHeight()
        } else {
          this.windowContent.height = screen.height
          this.isFullscreen = true
        }
      })
      document.addEventListener('webkitfullscreenchange', () => {
        if (document.webkitIsFullScreen === false) {
          this.isFullscreen = false
          _that.initWidthAndHeight()
        } else {
          this.windowContent.height = screen.height
          this.isFullscreen = true
        }
      })
      document.addEventListener('msfullscreenchange', () => {
        if (document.msFullscreenElement === false) {
          this.isFullscreen = false
          _that.initWidthAndHeight()
        } else {
          this.windowContent.height = screen.height
          this.isFullscreen = true
        }
      })
    },
    // 初始化高度和宽度
    initWidthAndHeight() {
      this.windowContent.height = $(window).height() - 110
      this.windowContent.chartHeight =
                Number(this.windowContent.height - 6) / 3
      this.windowContent.width = $(window).width()
    },
    // 图例多选框选择回调
    typeChange(e) {
      // str->int
      this.checks.categoryList = e
      this.$parent.clearAllClusterDevice() // 删除所有聚类覆盖物
      this.$parent.filterClusterDevice({
        name: this.searchKey,
        ...this.checks
      }) // 添加指定覆盖物
      this.mapObj.showLabelArray = false // 标注按钮重置
      this.$parent.clearAllDeviceLabel() // 清除标注
    },
    checksChange(e, type) {
      this.checks = {}
      // const config = {
      //     status: [this.offline, this.online],
      //     isControl: [this.noCloud, this.cloud],
      // };
      const config = {
        status: {
          attr: this.getAttribute(
            [this.offline, this.online],
            'status'
          )
        },
        isControl: {
          attr: this.getAttribute(
            [this.noCloud, this.cloud],
            'isControl'
          )
        }
      }
      // console.log({...config.status.attr,...config.isControl.attr});
      this.checks = { ...config.status.attr, ...config.isControl.attr }
      this.$parent.clearAllClusterDevice() // 删除所有聚类覆盖物
      this.$parent.filterClusterDevice({
        name: this.searchKey,
        ...this.checks
      }) // 添加指定覆盖物
      this.mapObj.showLabelArray = false // 标注按钮重置
      this.$parent.clearAllDeviceLabel() // 清除标注
    },
    getAttribute(config, type) {
      // 同真，不传过滤属性字段，显示全部
      if (config[0] && config[1]) {
        return { categoryList: this.typeList }
      } else if (config[0]) {
        // 离线|云台
        return { categoryList: this.typeList, [type]: false }
      } else if (config[1]) {
        // 在线|非云台
        return { categoryList: this.typeList, [type]: true }
      } else {
        // 同假，设备属性全部不满足，不显示设备，deviceList: [-1]
        return { categoryList: this.typeList, deviceList: [-1] }
      }
    },
    // 当input（搜索）获得焦点时触发，展示搜索框底部的tab页
    focusInput() {
      if (this.searchKey) {
        this.searchContentVisible = false
      } else {
        this.searchContentVisible = true
      }
    },
    // 点击查询，地图搜索
    searchMap(type) {
      this.searchContentVisible = false
      // 输入-->搜索
      if (typeof type === 'object' && this.searchKey) {
        this.searchResultVisible = true
        // 搜索结果
        this.deviceType = 'searchResult'
        this.searchData[this.deviceType] = this.legendList.filter(
          (item) => item.name.indexOf(this.searchKey) > -1
        )
        // console.log(this.searchData[this.deviceType]);
        this.$parent.clearAllClusterDevice() // 删除所有聚类覆盖物
        this.$parent.filterClusterDevice({
          name: this.searchKey,
          ...this.checks
        }) // 名称搜索
      }
      // 选择图例
      if (typeof type === 'string') {
        this.$store.getters.dict['dev_category'].forEach((item) => {
          if (type === item.dictKey) {
            this.searchKey = item.dictValue
          }
        })
        this.deviceType = type
        this.searchResultVisible = true
        this.searchBtn = true // 全文搜索按钮不可用
      }
    },
    // 搜索框点击显示列表时，定义searchKey，刷新map
    changeLiData(item) {
      this.searchKey = item.name
      this.searchResultVisible = false
      this.$parent.clearAllClusterDevice() // 删除所有聚类覆盖物
      this.$parent.filterClusterDevice({
        name: this.searchKey,
        ...this.checks
      }) // 名称搜索
      this.$parent.flyTo(item.longitude, item.latitude, 10)
    },
    // 设备数量
    getDeviceType(type) {
      const res = this.legendList.filter(
        (item) => item.devCategory === type
      )
      this.searchData[type] = res
      return res.length
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";

.tool-layer {
    .tool-bar {
        position: absolute;
        top: 36px;
        right: 36px;
        z-index: 9;
        .select-map {
            width: 40px;
            height: 40px;
            padding: 12px;
            margin-bottom: 5px;
            border-radius: 2px;
            background: #fff;
            cursor: pointer;
            > img {
                width: 100%;
                height: 100%;
            }
        }
        .layer-modal {
            position: absolute;
            right: 80px;
            top: 15px;
            bottom: 0;
            height: 116px;
            width: 300px;
            z-index: 2000;
            cursor: pointer;
            background: #fff;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            > img {
                width: 100%;
                height: 100%;
            }
            .layer-items {
                width: 120px;
                height: 84px;
                float: left;
                border-radius: 5px;
            }
            .layer-items:hover {
                border: 1px solid blue;
            }
        }
    }

    /*-----------------------底部图例样式--------------------------------*/
    .legend {
        z-index: 9;
        background: #fff;
        width: 300px;
        position: absolute;
        top: 5px;
        left: 20px;
        .legend-title {
            height: 32px;
            padding: 6px 15px;
            font-weight: 400;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
            .tip {
                z-index: 9;
                background: #fff;
                width: 300px;
                position: absolute;
                bottom: 250px;
                left: calc((300px / 2) - 22px);
                border-radius: 5px;
                padding: 10px;
                .close {
                    width: 100%;
                    text-align: right;
                    cursor: pointer;
                }
                .tip-text {
                    padding: 10px 0;
                }
                .arrow {
                    width: 0;
                    height: 0;
                    border-top: 10px solid #fff;
                    border-right: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-left: 10px solid transparent;
                    position: absolute;
                    left: calc((100% / 2) - 10px);
                    bottom: -20px;
                }
            }

            .el-icon-question {
                cursor: pointer;
                float: right;
            }
        }
        .legend-content {
            padding: 10px 24px;
            .check-group {
                display: flex;
                flex-wrap: wrap;
                .checkbox {
                    flex: 1;
                    margin: 8px 1px;
                    .check-icon {
                        display: flex;
                        align-items: center;
                        > img {
                            width: 24px;
                            height: 24px;
                        }
                        .title {
                            color: #595959;
                        }
                    }
                }
            }
            .attribute {
                border-top: 1px solid #ddd;
                flex-direction: column;
                margin-top: 15px;
                padding-top: 15px;
                .attr-wrap {
                    font-size: 14px;
                    color: #909399;
                    display: flex;
                    align-items: center;
                    .label {
                        margin-right: 30px;
                    }
                }
            }
        }
    }
    /*------------------------底部图例样式结束---------------------------------*/
    .search-wrap {
        position: absolute;
        top: 20px;
        left: 36px;
        width: 350px;
        .search {
            display: flex;
            ::v-deep .el-input__inner {
                border-top-left-radius: 2px !important;
                border-bottom-left-radius: 2px !important;
                height: 40px;
            }
            > button {
                border-radius: 0 !important;
                border-top-right-radius: 2px !important;
                border-bottom-right-radius: 2px !important;
                height: 40px;
            }
        }
        .search-content {
            font-size: 10px;
            color: #8c8c8c;
            background: #fff;
            border-radius: 4px;
            display: flex;
            justify-content: space-around;
            .legend-item {
                padding: 10px 0;
                cursor: pointer;
                text-align: center;
                width: calc(100% / 4);
                > img {
                    width: 35px;
                }
                &:hover {
                    background: #ebebeb;
                }
            }
        }
    }
    .search-result {
        background: #fff;
        border-radius: 4px;
        box-shadow: 1px 2px 10px #d2d2d2;
        color: #595959;
        height: 180px;
        overflow: auto;
        @include scrollBar;
        .search-result-list {
            padding: 5px 15px;
            display: flex;
            align-items: center;
            cursor: pointer;

            > img {
                width: 30px;
                height: 30px;
            }
            .label {
                padding-left: 10px;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        :hover {
            background: #ebebeb;
        }
    }
}
</style>
<style scoped>
/*--------------------复选框样式----------------------------*/
/deep/.legend-content .el-checkbox__input {
    border: 1px solid #1890ff;
    border-radius: 15px;
    width: 18px;
    height: 18px;
}
/deep/ .legend-content .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border: 2px solid #fff;
    width: 14px;
    height: 14px;
    top: 1px;
    left: 1px;
}

/deep/
    .legend-content
    .el-checkbox__input.is-checked
    .el-checkbox__inner::after {
    -webkit-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    background-size: 25px;
    background: url("../../assets/images/map_qiuji.svg") left center no-repeat;
}

.legend-content .el-checkbox {
    margin-right: 2px;
    display: flex;
    align-items: center;
}

/deep/ .legend-content .el-checkbox__inner {
    border-radius: 20px;
    border: 0;
    top: 1px;
    left: 1px;
}

.legend-content .ecp-checkbox-left {
    margin-left: 18px;
    margin-top: 13px;
    line-height: 24px;
    float: left;
}

.legend-content .ecp-checkbox-right {
    margin-top: 13px;
    line-height: 24px;
    float: left;
}
/deep/.input .el-input__inner {
    border-radius: 0;
    box-shadow: 0 1px 2px #ddd;
}
</style>
