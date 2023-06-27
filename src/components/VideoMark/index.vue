<template>
  <el-dialog
    title="提示"
    :visible="visible"
    :show-close="false"
    width="70%">
    <div style="height: 70vh;position: relative;">
      <videots :obj='videoInfo'></videots>
      <div class="markBox" ref="markBox0"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="create0">新增标注</el-button>
      <el-button type="primary" @click="deleteAll0">删除标注</el-button>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="$emit('change',false)">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Markjs from '@component/Mark';
import videots from "@component/videocomponent";
import {potoutbase} from "@/utils/randomNumber";
import {getMarks, realTimeVideo} from "@api/getVideo";

export default {
  name: "index",
  model: {
    prop: "visible",
    event: "change"
  },
  components:{
    videots
  },
  props:{
    deviceInfo:{
      type: Object,
      default: {}
    },
    policyId:{
      type: [String,Number],
      default: ''
    },
    markLength:{
      type: Number,
      default: 3
    },
    visible:{
      type: Boolean,
      default: false
    },
  },
  data(){
    return{
      // 推荐用法
      mark0: null,
      item: {},
      videoVisible: false,
      videoInfo:{}
    }
  },
  mounted() {
    realTimeVideo({
      deviceId: this.deviceInfo.serviceId,
      platformServiceId: this.deviceInfo.platformServiceId,
      tag: potoutbase()
    }).then((res) => {
      this.videoInfo = res;
    });
    this.$nextTick(()=>{
      this.initMark();
      this.getMark();
    })
  },
  methods:{
    initMark() {
      // 推荐用法
      this.mark0 = new Markjs({
        el: this.$refs.markBox0,
        hoverActive: false,
        dbClickActive: true,
        noCrossing: true,
        enableAddPoint: true,
        area: true,
        showPen: false,
        singleClickComplete: false,
        pointType: 'circle',
        pointWidth: 2,
        pointStyle: {
          lineWidth: 2,
          strokeColor: '#0088FF',
          fillColor: '#fff'
        },
        lineType: 'borderLine',
        strokeStyle: {
          lineWidth: 5,
          strokeColor: 'rgba(255, 255, 255, 0.7)',
          frontLineWidth: 3,
          frontStrokeColor: '#2196F3'
        },
        fillColor: 'rgba(0,136,255,0.30)',
        dbClickRemovePoint: true,
        minPointLength: this.markLength,
        maxPointLength: this.markLength === 2 ? 2 : 0
      })
      this.mark0.on('NOT-ENOUGH-END-POINTS', (state) =>{
        this.$message.warning(`至少需要绘制${this.markLength}个端点`)
      })
      if(this.markLength === 2){
        this.mark0.on('NOT-MORE-END-POINTS', (state) =>{
          this.$message.warning(`至多绘制${this.markLength}个端点`)
        })
      }
      this.mark0.on('LINE-CROSS', (item) => {
        this.$message.warning('线段不允许交叉')
      })
      this.mark0.on('NOT-ENOUGH-POINTS-REMOVE', (item) => {
        this.$message.warning(`至少需要${this.markLength}个端点`)
      })
    },
    getMark() {
      if(this.policyId){
        getMarks({
          policyId: this.policyId,
          deviceId: this.deviceInfo.id
        }).then((res) => {
          let result = []
          if(this.markLength === 2){
            result = res.cordon_line_list.map(item=>{
              return item.map(point=>{
                return {x:parseFloat(point[0]),y:parseFloat(point[1])}
              })
            })
          }
          if(this.markLength === 3){
            result = res.roi_area_list.map(item=>{
              return item.map(point=>{
                return {x:parseFloat(point[0]),y:parseFloat(point[1])}
              })
            })
          }
          result.forEach(item=>{
            this.mark0.createMarkItem({
              pointArr: item
            });
          })
        });
      }
    },
    save(){
      const markList = this.mark0.getMarkData();
      const res = markList.map(item=>{
        return item.pointArr.map(point=>{
          return[parseFloat(point.x.toFixed(6)),parseFloat(point.y.toFixed(6))]
        })
      })
      this.$emit('save', res, this.deviceInfo.id)
      this.$emit('change',false)
    },
    deleteAll0() {
      this.mark0.deleteAllMarkItem()
    },
    create0() {
      this.mark0.createMarkItem()
    },
    exit0() {
      this.mark0.exitCreate()
    },
  }
}
</script>

<style scoped>
.markBox{
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 11;
}
</style>
