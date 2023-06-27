<template>
  <div class="auth-container">
    <el-select v-model="editShareApp.resourceGrantType" placeholder="授权类型" clearable size="small"
      @change="grantTypeChange">
      <el-option v-for="dict in  $store.getters.dict['share_app_resource_grant_type']" :key="dict.dictKey"
        :label="dict.dictValue" :value="dict.dictKey" />
    </el-select>
    <el-row>
      <el-col :span="8">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"
          style="margin-bottom:10px;margin-left:10px;width: 300px">
        </el-input>
        <div :class="cellClass()">
          <el-tree show-checkbox ref="tree" lazy :load="loadNode" :default-checked-keys="selectedDeviceAndTenantKeys"
            node-key="key" :filter-node-method="filterNode" :props="defaultProps" class="tenant_device_tree"
            @check-change="handleTreeClick">
          </el-tree>
        </div>


      </el-col>
      <el-col :span="16">
        <div class="table" v-show="editShareApp.resourceGrantType == 'byDevice'">
          <el-table stripe :data="grantedDeviceList">
            <div slot="empty">
              <el-empty description="暂无数据"></el-empty>
            </div>
            <el-table-column label="设备名" align="center" prop="name" />
            <el-table-column label="sip id" align="center" prop="serviceId" />
            <el-table-column label="创建时间" align="center" prop="createTime">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">

                <el-button size="small" type="text" icon="iconfont icon-delete" @click="handleDeleteSelectedDevice(scope.row)"><span
                    class="text">删除</span></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="table" v-show="editShareApp.resourceGrantType == 'byTenant'">
          <el-table stripe :data="grantedTenantList">
            <div slot="empty">
              <el-empty description="暂无数据"></el-empty>
            </div>
            <el-table-column label="企业名称" align="center" prop="name" />
            <el-table-column label="创建时间" align="center" prop="createTime">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="small" type="text" icon="iconfont icon-delete" @click="handleDeleteSelectedTenant(scope.row)"><span
                    class="text">删除</span></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-col>
    </el-row>

    <el-row style="text-align: center;margin-top: 20px;">
      <el-button type="primary" @click="save">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-row>

  </div>
</template>

<script>
import { tenantDeviceAuth, tenantDeviceAuthGetc, listTenant } from '@/api/system/tenant';
import { listTenanDevice } from '@/api/system/device'
import {
  shareAppResourceGrantInfoList,
  shareAppGrantResource
} from "@/api/abilitySharing/shareApp";

export default {
  name: 'authEquipment',
  data() {
    return {
      filterText: '',
      data: [],
      selectedDeviceAndTenantKeys: [],
      checkedList: [],
      grantedDeviceList: [],
      grantedTenantList: [],
      tenantAndDeviceList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data1, node) => {
          return data1.type == 'device'
        }
      }
    };
  },
  props: ['editShareApp'],
  mounted() {

  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },


  },
  computed: {
    cellClass() {
      return function () {
        if (this.editShareApp.resourceGrantType == 'byTenant') {

          return ['grant-by-tenant'];
        } else if (this.editShareApp.resourceGrantType == 'byDevice') {

          return ['grant-by-device'];
        }
      }
    }
  },
  methods: {
    handleDeleteSelectedDevice(row){
        let key = 'device_' + row.id
        this.$refs.tree.setChecked(key, false)
    },
    handleDeleteSelectedTenant(row){
      let key = 'tenant_' + row.id
        this.$refs.tree.setChecked(key, false)
    },
    handleTreeClick(data, check, boolean) {
      if (this.editShareApp.resourceGrantType == 'byTenant' && data.type == 'tenant') {
        if (check) {
          let insertData = Object.assign({}, data)
          this.grantedTenantList.push(insertData)
        } else {
          this.grantedTenantList = this.grantedTenantList.filter(item => item.id != data.id);//删除
        }
      } else if (this.editShareApp.resourceGrantType == 'byDevice' && data.type == 'device') {
        if (check) {
          let insertData = Object.assign({}, data)
          this.grantedDeviceList.push(insertData)
        } else {
          this.grantedDeviceList = this.grantedDeviceList.filter(item => item.id != data.id);//删除
        }
      }
    },

    refreshCheckKeys() {

      if (this.editShareApp.resourceGrantType == 'byTenant') {
        this.selectedDeviceAndTenantKeys = this.grantedTenantList.map(item => {
          return 'tenant_' + item.id
        })
      } else if (this.editShareApp.resourceGrantType == 'byDevice') {
        this.selectedDeviceAndTenantKeys = this.grantedDeviceList.map(item => {
          return 'device_' + item.id
        })
      }
    },

    async loadNode(node, resolve) {

      if (node.level === 0) {
   
        let tenantList = await listTenant({});


        let grantInfo = await shareAppResourceGrantInfoList({ shareAppId: this.editShareApp.id });


        this.grantedTenantList = grantInfo.tenantList

        this.grantedDeviceList = grantInfo.deviceList
        tenantList.forEach((item) => {
          item.type = 'tenant';
          item.key = "tenant_" + item.id

        })

        this.tenantAndDeviceList = tenantList;

        this.refreshCheckKeys();
        return resolve(this.tenantAndDeviceList);
      } else {
        let deviceList = await listTenanDevice({ tenantId: node.data.id })
        deviceList.forEach((item) => {
          item.type = 'device'
          item.key = "device_" + item.id
        })
        return resolve(deviceList);
      }
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    grantTypeChange() {
      this.refreshCheckKeys();

    },
    cancel() {
      this.$emit('cancel')
    },
    save() {
      let tenantIdList = [];
      let deviceIdList = [];
      if (this.editShareApp.resourceGrantType == 'byTenant') {
        tenantIdList = this.grantedTenantList.map(item => item.id);
      } else if (this.editShareApp.resourceGrantType == 'byDevice') {
        deviceIdList = this.grantedDeviceList.map(item => item.id);
      }
      shareAppGrantResource({
        tenantIdList: tenantIdList,
        deviceIdList: deviceIdList,
        resourceGrantType: this.editShareApp.resourceGrantType,
        shareAppId: this.editShareApp.id
      }).then(() => {
        this.msgSuccess("编辑成功");
      })
    }
  }
}
</script>

<style scoped lang="scss">
.auth-container {
  width: 100%;
  height: 600px;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }


  .grant-by-device {

    //一级节点不显示复选框 其他子节点，收起状态不显示复选框，展开状态显示复选框，叶子节点显示复选框
    ::v-deep .tenant_device_tree>.el-tree-node {

      //叶子节点显示复选框，其他节点不显示复选框
      .is-leaf~.el-checkbox .el-checkbox__inner {
        display: flex;
      }

    }

    ::v-deep .tenant_device_tree>.el-tree-node__children {

      //节点展开显示复选框
      .expanded~.el-checkbox .el-checkbox__inner {
        display: flex;
      }

      .el-checkbox__input>.el-checkbox__inner {
        display: none;
      }
    }
  }

  .grant-by-tenant {

    //一级节点不显示复选框 其他子节点，收起状态不显示复选框，展开状态显示复选框，叶子节点显示复选框
    ::v-deep .tenant_device_tree>.el-tree-node {

      //叶子节点显示复选框，其他节点不显示复选框
      .is-leaf~.el-checkbox .el-checkbox__inner {
        display: none;
      }

      .el-checkbox__input>.el-checkbox__inner {
        display: flex;
      }
    }

    ::v-deep .tenant_device_tree>.el-tree-node__children {

      //节点展开显示复选框
      .expanded~.el-checkbox .el-checkbox__inner {
        display: flex;
      }

      .el-checkbox__input>.el-checkbox__inner {
        display: flex;
      }
    }
  }


}
</style>
