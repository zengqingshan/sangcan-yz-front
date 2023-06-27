
<template>
    <div class="main_table" :style="{position:hasposition?'absolute':'',height:zldata.length?'':'100%'}">

        <el-table style="height:100%" ref="table" :stripe='true' :height="height" :data="zldata" v-bind="$attrs" :cell-style="cellstyle" :header-cell-style='headerstyle' v-on="$listeners">
            <div slot="empty" style="height:100%">
                <el-empty description="暂无数据"></el-empty>
            </div>
            <el-table-column v-if="canchoice" type="selection" align="center" style="paddingleft: 10px"></el-table-column>
            <el-table-column v-if="hasindex" type="index" width="45">
            </el-table-column>
            <el-table-column v-for="(item, index) in tablecolumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed" :show-overflow-tooltip="
          item.showovertooltip == false?false:true
        ">
                <template slot-scope="scope">
                    <rendercolumn v-if="item.render" :params="scope.row" :renderfn="item" :rowindex="scope.$index" :total="zldata.length" />
                    <span v-else @click="goDetail(scope.row)">
                        {{ scope.row[item.prop] }}
                    </span>
                </template>
            </el-table-column>
            <template v-if="menueLists" slot="multipleHeader">
                <Operationset :menueList="menueLists" />
            </template>
        </el-table>


    </div>
</template>

<script>
export default {
    props: {
        cellstyle: {
            type: Object,
            default: () => {},
        },
        headerstyle: {
            type: Object,
            default: () => {},
        },
        hasposition: {
            type: Boolean,
            default: true,
        },
        hasindex: {
            type: Boolean,
            default: false,
        },
        emptyImage: {
            type: String,
            default: require("../../assets/svg/table_empty.svg"),
        },
        emptyText: {
            type: String,
            default: "暂无数据",
        },
        zldata: Array,
        tablecolumn: Array,
        menueLists: Array,
        canchoice: {
            type: Boolean,
            default: false,
        },
        height: {
            type: [String, Number],
            default: "100%",
        },
    },
    components: {
        rendercolumn: {
            functional: true,
            props: {
                renderfn: Object,
                params: Object,
                rowindex: [Number, String],
                total: [String, Number],
            },
            render(h, context) {
                let outparams = {
                    params: context.props.params,
                    index: context.props.rowindex,
                    total: context.props.total,
                };
                return context.props.renderfn.render(h, outparams);
            },
        },
        Operationset: {
            functional: true,
            props: {
                menueList: Array,
            },
            render(h, context) {
                return h(
                    "div",
                    context.props.menueList.map((e) => e.creatrender(h))
                );
            },
        },
    },
    data() {
        return {
            // cellstyle: {
            // height: "24px",
            // padding: "6px 0",
            // fontSize:'12px'
            // },
            // headerstyle:{
            //   height: "24px",
            // padding: "4px 0",
            // fontSize:'12px'
            // }
        };
    },
    methods: {
        goDetail(val) {
            this.$emit("toDetail", val);
        },
        gettableref() {
            return this.$refs.table;
        },
    },
};
</script>
<style lang="scss" scoped>
.main_table {
    &
        ::v-deep
        .el-table.el-table--small
        .el-table__body-wrapper
        .el-table__body
        tbody
        tr
        td.el-table-column--selection
        .cell {
        padding: 0;
    }
    // position: absolute;
    width: 100%;
    height: 100%;
    .empty_Image {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.text {
    margin-left: 4px;
}
</style>
