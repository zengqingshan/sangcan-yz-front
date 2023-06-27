<template>
  <div class="TimeMonitoring_main">
    <div class="tree_side">
      <treeside
        ref="treeside"
        :treeObj="treeObj"
        @checktype="checktype"
        @checknodelistdata="checknodelistdata"
      />
    </div>
    <div class="TimeMonitoring_main_content">
      <upMiddleDown btnPositon="inner" :hasfooter="hasfooter">
        <div slot="upMiddleDown_header" v-if="showheader">
          <el-form-item
            label="活动名称"
            v-for="item in 2"
            style="marginright: 10px"
          >
            <el-input
              size="mini"
              v-model="form.name"
              placeholder="请输入查询条件"
            ></el-input>
          </el-form-item>
        </div>
        <zltable
          :tablecolumn="
            'tablecolumn' in treeObjout ? treeObjout.tablecolumn : tablecolumn
          "
          :zldata="zldata"
        />
        <div slot="upMiddleDown_footer">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          >
          </el-pagination>
        </div>
      </upMiddleDown>
    </div>
  </div>
</template>

<script>
import upMiddleDown from "@component/zllayout/upMiddleDown.vue";
import zltable from "@component/zltable";
import videots from "@component/videocomponent";
import VideoMark from "@component/VideoMark";
import treeside from "@/components/treeside";
import {getTreeConfig} from "@/utils/deal-tree";

export default {
  props: {
    treeObjout: [Object],
    showheader: {
      type: Boolean,
      default: true,
    },
    hasfooter: {
      type: Boolean,
      default: true,
    },
    choselistdata: [Object, Array],
  },
  data() {
    return {
      // 推荐用法
      mark0: null,
      editing0: true,
      curEditMarkItem0: null,
      isCreateMarking0: false,
      item: {},
      videoVisible: false,
      form: {},
      currentPage4: "",
      zldata: [],
      tablecolumn: [
        {
          label: "设备名称",
          prop: "name",
        },
        {
          label: "设备编码",
          prop: "serviceId",
        },
        {
          label: "设备厂家",
          prop: "vendor",
           render: (h, params) => {
            return h(
              "div",
              params.params.vendor?this.$dt("vendor").find(
                (e) => e.dictKey == params.params.vendor
              ).dictValue:''
            );
          },
        },
               {
          label: "设备分类",
          prop: "devCategory",
          render: (h, params) => {
            return h(
              "div",
              params.params.devCategory?this.$dt("dev_category").find(
                (e) => e.dictKey == params.params.devCategory
              ).dictValue:''
            );
          },
        },
                {
          label: "省市区",
          prop: "division",
          render: (h, params) => {
            return h(
              "div",
              (() => {
                let datacont = "";
                let step = 0;
                let contdivsion = [2, 4, 6].reduce(
                  (previousValue, currentValue) => {
                    return previousValue.concat(
                      params.params.division
                        .slice(0, currentValue)
                        .padEnd(6, 0) * 1
                    );
                  },
                  []
                );
                let duringFun = (e) => {
                  e.forEach((el) => {
                    if (el.id == contdivsion[step]) {
                      datacont += el.name;
                      step++;
                      if (step < 3&&'children' in el&&el.children) {
                        duringFun(el.children);
                      }
                    }
                  });
                };
                duringFun(this.$dt("division"));
                return datacont;
              })()
            );
          },
        },
        // {
        //   label: "操作",
        //   width: 80,
        //   render: (h, parmas) => {
        //     return (
        //       "div",
        //       [
        //         h("i", {
        //           style: {
        //             cursor: "pointer",
        //           },
        //           class: {
        //             "el-icon-delete": true,
        //           },
        //           on: {
        //             click: (_) => {
        //               this.item = parmas.params
        //               this.videoVisible = true;
        //             },
        //           },
        //         }),
        //       ]
        //     );
        //   },
        // },
      ],
      treeObj: {
        cansearch: true,
        showdifftype: true,
        showheader: false,
        showtype: false,
        treeProperty: {
          showcheked: false,
          type: [
            {
              name: "",
              icon: "",
              interface: "",
              api: "group",
              params:{
                tag:'play'
              },
              treenode: getTreeConfig.call(this, 'group')
            },
            {
              name: "",
              icon: "",
              interface: "",
              api: "platform",
              treenode: getTreeConfig.call(this, 'platform', {showEdit: true}),
            },
            {
              name: "",
              icon: "",
              interface: "",
              api: "city",
              treenode: getTreeConfig.call(this, 'city'),
            },
          ],
        },
        Whetherscreen: false,
      },
      Viewport: [{}],
    };
  },

  components: {
    treeside,
    videots,
    zltable,
    upMiddleDown
  },

  computed: {},
  watch: {
    zldata: function (val) {
      this.$emit("update:choselistdata", val);
    },
  },
  methods: {
    checktype(e) {
      this.Viewport = e;
    },
    handleCurrentChange() {},
    handleSizeChange() {},
    checknodelistdata(params) {
      this.zldata = params;
    },
  },
  created() {
    if (this.treeObjout) {
      this.treeObj = this.treeObjout;
    }
    // getTreeGroup({
    //   showDevice: true,
    //   online: true,
    //   hiddenNoChild: true,
    // });
  },
  mounted() {
    setTimeout(() => {
       this.$set(this, "zldata", this.choselistdata);
      this.$refs.treeside.setinitcheck(this.choselistdata);
       this.$refs.treeside.getAllDeviceNodes(this.choselistdata)
      // this.choselistdata.forEach((e) => {
      //   this.$refs.treeside.Uncheck(e, true);
      // });
    }, 800);
  },
};
</script>
<style lang="scss" scoped>
.TimeMonitoring_main {
  height: calc(100vh - 50px);
  display: flex;
  .tree_side {
    flex: 0 0 227px;
    overflow: hidden;
  }
  .TimeMonitoring_main_content {
    flex: 1;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
  }

  ::v-deep .platftreenodestyle {
    width: 100%;
    display: flex;
    font-size: 12px;
    align-items: center;
    >i{
      margin-right: 6px;
      color: #8C8C8C;
    }
    .name{
      flex: 0 0 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon-click{
      flex: 1;
      text-align: right;
    }
    .icon-hide{
      display: none;
      margin-right: 5px;
    }
    &:hover{
      .icon-hide{
        display: inline;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep .treenodestyle {
  display: flex;
  font-size: 12px;
  align-items: center;
  :first-child {
    margin-right: 5px;
  }
}
</style>
