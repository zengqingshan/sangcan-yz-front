<template>
  <div class="pollright">
    <span style="display: block;margin-bottom: 10px;">已选</span>
    <div>
      <div v-for="(item,index) in itemarr" :key="index" class="pollchild">
        <div class="left">
          <span class="leftspan">{{ ++index }}</span>
          <img :src="item.coverUrl" alt="">
          <div>
            <span style="white-space: nowrap;">{{ item.name }}</span>
            <span>{{ item.orgName }}</span>
          </div>
        </div>
        <div class="right">
          <span @click="itemtop(item,index)">置顶</span>
          <span @click="deleteitem(item,index)">删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemarr: [], // 接收的选择的数组
      deviceifarr: [] // 设备id数组
    }
  },
  watch: {
    itemarr: {
      deep: true,
      handler(newval) {
        // this.deviceifarr = []
        newval.forEach(item => {
          this.deviceifarr.push(item.id)
        })
      }
    }
  },
  mounted() {
    this.$bus.$on('additem', (item) => {
      this.itemarr.push(Object.assign({}, item))
      console.log('right', this.itemarr)
    })
    this.$bus.$on('removeitem', (item) => {
      this.itemarr.forEach((item1, index) => {
        if (item1.id == item.id) {
          this.itemarr.splice(index, 1)
        }
      })
    })
    this.$bus.$on('checkedall', (arr) => {
      this.itemarr.splice(0)
      this.itemarr.push(...arr)
    })
    this.$bus.$on('uncheckedall', () => {
      this.itemarr.splice(0)
    })
  },
  methods: {
    itemtop(item, index) {
      this.itemarr.splice(index - 1, 1)
      this.itemarr.unshift(item)
    },
    deleteitem(item, index) {
      this.itemarr.splice(index - 1, 1)
      this.$bus.$emit('deletechoose', item)
    }
  }

}
</script>

<style lang="scss" scoped>
  .pollright{
    border: 1px solid #ccc;
    padding: 16px;
    height: 100%;
    max-height: 930px;
    overflow: auto;
    .pollchild{
        display: flex;
        justify-content: space-between;
        height: 55px;
        border: 1px solid #dedede;
        margin-top: 10px;

        .left{
            width: 70%;
            display: flex;
            justify-content: space-around;
            .leftspan{
                width: 7%;
                text-align: center;
                line-height: 55px;
            }
            img{
                height: 100%;
                width: 40%;
            }
            div{
                margin-left: 5%;
                width: 40%;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                font-size: 13px;
            }
        }
        .right{
            width: 25%;
            display: flex;
            align-items: center;
            font-size: 13px;
            justify-content: space-evenly;
            cursor: pointer;
            color: #409eff;
        }
    }
  }
</style>
