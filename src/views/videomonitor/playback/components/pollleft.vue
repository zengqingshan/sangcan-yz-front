<template>
  <div class="pollleft">
    <span style="display: block;margin-bottom: 10px;">所有节点</span>
    <div>
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />

      <div class="pptv">
        <el-tree
          id="dev-tree"
          ref="devTree"
          class="treesds"
          node-key="id"
          :props="treeProps"
          :load="treeLoad"
          lazy
          :filter-node-method="filterNode"
          :highlight-current="false"
          :expand-on-click-node="false"
          :empty-text="treeEmptyText"
          :default-expanded-keys="defExpandDevs"
          @node-click="storeNodeClick"
        >
          <span slot-scope="{node, data}" class="custom-tree-node">
            <span>
              <i
                :class="['fa','fa-folder']"
              />
              <span class="ellipsis" style="user-select:none;margin-left:4px;" :title="node.label">{{ node.label
              }}</span>

            <!-- </el-popover> -->
            </span>
          </span>
        </el-tree>
      </div>
    </div>

  </div>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import {

  orginfoAndSubOrgInfo
} from '@/api/system/org'
export default {
  data() {
    return {
      filterText: '', // 过滤输入框的值
      treeLoading: false,
      defExpandDevs: [],
      defExpandGroups: [],
      pnode: null,
      contextMenuTarget: null,
      contextMenuVisible: false,
      contextMenuNodeData: null,
      conntextMenuNode: null,
      treeProps: {
        label: (data, node) => {
          var label = data.name

          if (data.onelineNum != null && data.deviceNum != null) {
            label += ` [${data.onelineNum}/${data.deviceNum}]`
          }
          return label
        },
        isLeaf: (data, node) => {
          return this.treeLeaf(data)
        },
        disabled: (data, node) => {
          return this.treeLeaf(data)
        }
      },

      level: 0
    }
  },
  computed: {
    treeEmptyText() {
      return this.treeLoading ? '加载中...' : '暂无数据'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.devTree.filter(val)
    }
  },
  created() {

  },
  methods: {
    // 过滤节点方法
    filterNode(value, data) {
      if (!value) return true
      // console.log(data)
      return data.orgName.indexOf(value) !== -1
    },

    treeLoad(node, resolve) {
      const nodeLevel = node.level

	  let orgId
      if (node.data) {
        orgId = node.data.id
      }
      orginfoAndSubOrgInfo({ orgId: orgId }).then((ret) => {
        let orgList = []

        if (node.level == 0) {
		  this.defExpandDevs.push(ret.id)
          orgList.push(ret)
        } else {
          orgList = (ret.children || [])
        }

        resolve(orgList)
      }).catch(() => { })
        .then(() => {
          this.treeLoading = false
        })
    },

    treeNodeRefresh(node) {
      if (!node || !node.level) {
        this.treeRefresh()
        return
      }
      this.contextMenuVisible = false
      node.loaded = false
      node.expand()
    },

    storeNodeClick(data, node, c) {
      this.$bus.$emit('flushedlist', data.id)
    },

    treeLeaf(data) {
      if (data.children != undefined && data.children != null && data.children.length == 0) { return true } else {
        return false
      }
    }

  }
}
</script>

<style scoped lang="scss">

.pollleft{
    border: 1px solid #ccc;
    padding: 10px;
    // width: 26%;
    height: 100%;
    .el-tree--highlight-current{
      .el-tree-node.is-current > .el-tree-node__content{
        &:hover{
          background-color: #cde3f8;
        }

      }
    }

}
//  .dialogdiv .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
//   background-color: #cde3f8;
// }
</style>
<style lang="less">
.pptv {
  .el-tree-node__content:hover{
  background-color: #fff !important
}
.el-tree-node:focus>.el-tree-node__content{
  background-color: #fff !important
}
.custom-tree-node:hover {
  background-color: rgb(104, 137, 173);
}

}

</style>
