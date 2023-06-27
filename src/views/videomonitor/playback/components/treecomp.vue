<template>
  <div class="treecomputed">
    <el-tree
      ref="devTree"
      node-key="key"
      :props="treeProps"
      :load="treeLoad"
      lazy
      :default-expanded-keys="defExpandDevs"
      @node-click="storeNodeClick"
    >
      <span slot-scope="{node, data}" class="custom-tree-node">
        <span style="display: flex;justify-content: space-between;">
          <span>
            <span v-if="data.type == 'device'" style="color:#46a0fc">
              <svg width="1em" height="1em" viewBox="0 0 16 16"><g stroke="currentColor" stroke-width="1.2" fill="none" fill-rule="evenodd"><path d="M8 1.5999999999999996A5.4 5.4 0 1 0 8 12.4A5.4 5.4 0 1 0 8 1.5999999999999996Z" /><path d="M8 4.6A2.4 2.4 0 1 0 8 9.4A2.4 2.4 0 1 0 8 4.6Z" /><path d="M8 12.5153687L8 14.7662345" /><path stroke-linecap="round" stroke-linejoin="round" d="M4.75724981 14.7662345L11.3730759 14.7662345" /></g></svg>
            </span>
            <i
              :class="['fa', {
                'fa-folder': data.type == 'org'
              }]"
            />
            <span class="ellipsis" style="user-select:none;margin-left:4px;" :title="node.label">{{ node.label }}</span>
          </span>

          
          <el-popover
            placement="right"
            width="130"
            trigger="click"
          >
            <el-button v-if="node.level == 1" @click="cancelOrgStar(data)"><i class="el-icon-star-off" />取消关注</el-button>
            <i v-if="node.level == 1" slot="reference" class="el-icon-more" />
          </el-popover>
          <!-- </el-popover> -->
        </span>
      </span>
    </el-tree>

  </div>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import { orginfoAndSubOrgInfo ,
  orgStarDelete} from '@/api/system/org'
import {
  listLocaLevelOrgDevice
} from '@/api/system/device'
export default {
  props: {
    treeobj: {
      type: Object,
      default: []
    }
  },
  data() {
    return {
      concernalllist: null, // 下方总列表
      treeProps: {
        label: 'name',
        isLeaf: (data, node) => {
          if (node.level == 1) {
            return false
          }
          return this.treeLeaf(data)
        },
        disabled: (data, node) => {
          return this.treeLeaf(data)
        }
      }, // 下级树
      defExpandDevs: [], //
      devicelist: [], // 下层树的数组
      currentOrgId: undefined
    }
  },
  computed: {
   
  },
  created() {
  },
  methods: {
    cancelOrgStar(data){
      let param = {orgId:data.id}
      orgStarDelete(param).then(() => {
        this.$emit('orgStarDeleteEvent');
        
      })
    },
    // 节点点击事件
    handleNodeClick(data) {

    },
    treeLeaf(data) {
      if (data.type == 'device') {
        return true
      } else if (data.type == 'org' && data.children != undefined && data.children != null && data.children.length == 0) { 
		if(data.deviceNum > 0){
			return false
		}else{
			return true 
		}
	  } else {
        return false
      }
    },
	treeLoadDevice(node, resolve){
		let orgId = undefined;
		if(node.data){
			orgId = node.data.id
		}
		listLocaLevelOrgDevice({orgId:orgId}).then((ret)=>{
	
			let deviceList = ret 
			deviceList.forEach((device)=>{
				device.type = 'device'
				device.key = 'device_'+ device.id
			})
			resolve(deviceList)
		})
	},
	treeLoadOrg(node, resolve) {
      const nodeLevel = node.level
 
 		let orgId = undefined;
		if(node.data){
			orgId = node.data.id
		}
		
      orginfoAndSubOrgInfo({orgId:orgId}).then((org) => {
        let orgList = []
         
 
			orgList = (org.children || [])
			orgList.forEach((childOrg)=>{
				childOrg.type = 'org'
				childOrg.key = 'org_'+ childOrg.id
			})
			if(orgList.length == 0 && node.data.deviceNum > 0 ){
				this.treeLoadDevice(node, resolve);
			}else{
				
				resolve(orgList)
			}
		
      }).catch(() => { })
     
    },
    // tree
    treeLoad(node, resolve) {
      if (node.level === 0) {
	 
        const rootNode = {}
        rootNode.type = 'org'

        rootNode.name = this.treeobj.name
        rootNode.children = []
        rootNode.id = this.treeobj.id
		rootNode.key = 'org_'+ rootNode.id
		rootNode.deviceNum = this.treeobj.deviceNum
		
        return resolve([rootNode])
      } else {
		  if(node.data.type = 'org'){
				this.treeLoadOrg(node, resolve);
			}
			
			
			
      }
    },
    storeNodeClick(data, node, c) {
    
      if (data.type == 'org') {
        if (!this.treeLeaf(data)) {
          if (this.currentOrgId == data.id) {

            return
          }
        }

        this.currentOrgId = data.id
        this.$emit('orgNodeClicked', data.id, data.onelineNum, data.deviceNum)
      } else if (data.type == 'device') {
        this.$emit('deviceNodeClicked', data.serviceId, data.deviceName)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.treecomputed{
    ::v-deep .el-tree-node {
    border: 0;
    color: white;
    font-size: 13px;
    outline: none;

}
}

::v-deep .el-icon-more{
    color: white;
}
::v-deep .fa-folder{
    color: #5d5d5d;
}

</style>
