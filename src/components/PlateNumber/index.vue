<template>
  <div
    :class="getColor()[2]"
    :style="getColor()[0].indexOf('linear-gradient') !== -1
    ? { background: getColor()[0], color: getColor()[1] }
    : { backgroundColor: getColor()[0], color: getColor()[1] }"
  >
    <slot :data="item"></slot>
  </div>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object,
                default: {}
            }
        },
        methods:{
            getColor() {
                switch (this.item.plateColor) {
                    case '绿色': return ['#80FF95','#000000','newContainer'];
                    case '黄色': return ['#FFD966','#000000','newContainer'];
                    case '黑色': return ['#000000','#FFFFFF','container'];
                    case '白色': return ['#FFFFFF','#000000','newContainer'];
                    case '渐变绿': return ['linear-gradient(#ffffff,#80FF95)','#000000','container'];
                    case '黄绿色': return ['linear-gradient(to right, #FFD966 38%, #80FF95 0)','#000000','container'];
                    default: return ['#0060E6','#FFFFFF','container'];
                }
            }
        }
    }
</script>

<style scoped lang="scss">
  .container{
    display: inline-block;
    width: 140px;
    height: 42px !important;
    background: url('../../assets/images/plate-number.png');
    background-size: 100% 100%;
    line-height: 42px;
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    border-radius: 4px;
    text-align: center;
  }

  .newContainer{
  @extend .container;
    background-image: url('../../assets/images/plate-number-new.png');
  }
</style>
