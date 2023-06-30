<template>
  <div class="contrion">
    <el-tree :data="concernlist" :props="treeProp" @node-click="handleNodeClick">
      <span slot-scope="{node, data}" class="custom-tree-node" @click="playvedios(data)">
        <span class="child">
          <span>
            <i :class="{ 'el-icon-folder': data.type == 'org' }" style="color: #5d5d5d;" />
            <span v-if="data.type == 'device'" style="color:#46a0fc;margin-right: 5px;">
              <svg width="1em" height="1em" viewBox="0 0 16 16">
                <g stroke="currentColor" stroke-width="1.2" fill="none" fill-rule="evenodd">
                  <path d="M8 1.5999999999999996A5.4 5.4 0 1 0 8 12.4A5.4 5.4 0 1 0 8 1.5999999999999996Z" />
                  <path d="M8 4.6A2.4 2.4 0 1 0 8 9.4A2.4 2.4 0 1 0 8 4.6Z" />
                  <path d="M8 12.5153687L8 14.7662345" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.75724981 14.7662345L11.3730759 14.7662345" />
                </g>
              </svg>
            </span>
            <span
              class="ellipsis"
              style="user-select:none;font-size: 13px;color: white;"
              :title="node.label"
            >{{ node.label || 'test'
            }}<span v-if="data.type == 'org'">({{ concernlist[0].total }})</span></span>
          </span>
          <el-popover placement="right" width="130" trigger="click">
            <el-button v-if="data.type == 'device'" @click="cancelDeviceStar(data)"><i
              class="el-icon-star-off"
            />取消关注</el-button>
            <i v-if="data.type == 'device'" slot="reference" class="el-icon-more" />
          </el-popover>
        </span>
        <span v-if="data.type == 'device'" class="bom">
          {{ data.fullpath }}
        </span>

      </span></el-tree>
    <div v-if="listfinish" class="nomore">没有更多了</div>
    <el-button v-else type="primary" @click="loadingmore">加载更多</el-button>

    <!-- 下级树结构 -->
    <div v-for="(item, index) in orgStarlist" :key="index" class="treelist">
      <treecomp :treeobj="item" @orgStarDeleteEvent="refreshOrgStarList" />
    </div>
    <div v-if="orgStarFinish" class="nomore">
      <span v-if="orgStarlist.length > 0">没有更多了</span>
      <span v-else>没有关注的机构</span>
    </div>
    <el-button v-else type="primary" @click="loadingmoreOrgStarList">加载更多</el-button>
  </div>
</template>

<script>
var num = 0
import {
  listPageStarOrg
} from '@/api/system/org'
import {
  listPageStarDevice,
  deviceStarDelete
} from '@/api/system/device'
import treecomp from './treecomp.vue'
export default {
  components: { treecomp },
  props: {
    rightinfo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      current: 1,
      currentall: 1,
      concernlist: [{ type: 'org', name: '全部关注设备', total: 0, children: [] }], // 关注列表
      concernalllist: null, // 下方总列表
      treeProp: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node) => {
          return data.type == 'device'
        }
      }, // 上级树
      listfinish: false, // 关注列表是否全部加载完
      treeProps: {
        label: 'label',
        isLeaf: (data, node) => {
          return this.treeLeaf(data)
        },
        disabled: (data, node) => {
          return this.treeLeaf(data)
        }
      }, // 下级树
      defExpandDevs: [], //
      orgStarlist: [], // 下层树的数组
      concernpage: false // 是否展示其他图标
    }
  },
  computed: {
    treeEmptyText() {
      return this.treeLoading ? '加载中...' : '暂无数据'
    }
  },
  watch: {
    rightinfo(newval) {
      if (newval == 'concern') { // 传递数据到right组件
        this.$bus.$emit('getconcerninfo', this.concernlist[0].children, this.concernpage)
      }
    }
  },
  mounted() {
    // 重新拉取关注列表
    this.$bus.$on('againgetinfo', () => {
      this.current = 1
      this.getconcernlist(true)
    })
    // 重新拉取关注节点列表
    this.$bus.$on('againconcerninfo', () => {
      this.currentall = 1
      this.getOrgStarlist(true)
    })
  },
  created() {
    this.getconcernlist(true)
    this.getOrgStarlist(true)
  },
  methods: {

    // 点击播放监控
    playvedios(data) {

      this.$bus.$emit('playvedio', data.serviceId, data.name)
    },

    cancelDeviceStar(data) {
      const param = { deviceId: data.deviceId }
      deviceStarDelete(param).then(() => {
        this.$set(this.concernlist[0], 'total', 0)

        this.$set(this.concernlist[0], 'children', [])
        this.current = 1
        this.getconcernlist(true)
      })
    },

    getAllParentNodeName(orgList) {
      let path = ''
      for (let i = 0; i < orgList.length; i++) {
        path = path + orgList[i].name
        if (i < orgList.length - 1) {
          path += '>'
        }
      }
      return path
    },

    // 获取关注列表
    getconcernlist(firstLoad) {
      listPageStarDevice({ current: this.current, pageSize: 10 }).then((res) => {

        const recList = (res.records || []).map(item => {
          item.type = 'device'

          item.fullpath = this.getAllParentNodeName((item.parentOrgList || []))

          return item
        })
        if (firstLoad) {
          this.$set(this.concernlist[0], 'total', res.total)

          this.$set(this.concernlist[0], 'children', recList)
        } else {
          this.$set(this.concernlist[0], 'total', res.total)
          if (this.current > 1) { // 首页已经加载的时候追加了
            const childrentList = this.concernlist[0].children.concat(recList)
            this.$set(this.concernlist[0], 'children', childrentList)
            this.$bus.$emit('getconcerninfo', this.concernlist[0].children, this.concernpage)
          }
        }
        // 传递事件给右侧组件更新数据

        this.listfinish = res.finish

        this.current++
      })
    },
   
    // 获取更多列表
    loadingmore() {
      this.getconcernlist(false)
    },
    refreshOrgStarList() {
      this.getOrgStarlist(true)
    },
    loadingmoreOrgStarList() {
      this.getOrgStarlist(false)
    },
    // 获取总列表
    getOrgStarlist(firstLoad) {
      if (firstLoad) {
        this.orgStarlist = []
        this.orgStarFinish = false
        this.currentall = 1
      }
      listPageStarOrg({ current: this.currentall, pageSize: 10 }).then((res) => {
        this.orgStarFinish = res.finish
        this.orgStarlist.push(...res.records)
        this.currentall++
      })
    },
    // 节点点击事件
    handleNodeClick(data) {

    }

  }

}
</script>
import 'font-awesome/css/font-awesome.css'
<style lang="scss" scoped>

.el-popover {
  padding: 5px;

 ::v-deep .el-button--medium {
    text-align: center;
    border: 0;
    padding: 10px 28px;
    font-size: 16px;
  }
}
::v-deep .el-tree-node .el-tree-node__content .custom-tree-node:hover{
  background-color: #454444;
}
.contrion {
  // padding-bottom: 30px;
  // border-bottom: solid 0.5px #aaa6a6;
  height: 37vw;
  overflow: auto;

}

.nomore {
  // display: block;
  font-size: 13px;
  text-align: center;
  padding-bottom: 50px;
  border-bottom: solid 0.5px #aaa6a6;
}

::v-deep .el-icon-more {
  color: white;
}

::v-deep .el-tree-node__content {
  height: 45px;
padding-left: 0 !important;
  &:hover {
    background-color: #2d2d2e;
  }
}

.child {
  display: flex;
  justify-content: space-between;
}

::v-deep .el-tree-node {
  margin-top: 3px;
  padding-bottom: 10px;
  border-bottom: 0.5px solid #535151;

  .el-tree-node__content {
    .custom-tree-node {
      width: 80%;
      display: flex;
      flex-direction: column;
      padding: 4px 8px;
    }
  }
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.bom {
  margin-bottom: 5px;
  margin-top: 5px;
  color: #888;
  font-size: 12px;
  padding-left: 19px;
}

::v-deep .el-tree {
  background: #2d2d2f;
}

::v-deep .el-tree>.is-focusable {
  border-bottom: 0;
}

::v-deep .el-tree>.is-focusable>.el-tree-node__content {
  height: 36px;
}

::v-deep .el-tabs__content {
  overflow: auto;
  position: relative;
  height: 37vw;
}

::v-deep .fa-folder {
  color: #5d5d5d;
}</style>

