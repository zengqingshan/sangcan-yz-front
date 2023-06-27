<template>
    <div class="table-content">
        <div class="table">
            <el-table ref="multipleTable" stripe :row-key="getRowKeys" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column v-if="config.checkbox" type="selection" width="55" label="序号" :reserve-selection="true" />
                <el-table-column v-if="config.columnIndex" type="index" width="55" label="序号" />
                <template v-for="item in config.columns">
                    <el-table-column v-if="item.type === 'function'" :key="item.prop" :label="item.label" :prop="item.prop" :sortable="item.sortable">
                        <template slot-scope="scope">
                            <span>{{ item.callback &&item.callback(scope.row, item.prop, item.dictName)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="item.type === 'image'" :key="item.prop" :label="item.label" :prop="item.prop" :width="item.alignWidth">
                        <template slot-scope="scope">
                            <slot :name="item.operateSlot" :data="scope" :width="item.alignWidth"></slot>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="item.type === 'customIcon'" :key="item.prop" :label="item.label" :prop="item.prop" :sortable="item.sortable">
                        <template slot-scope="scope">
                            <slot :name="item.operateSlot" :data="scope"></slot>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="item.type === 'operate'" :key="item.prop" :label="item.label" :prop="item.prop" :width="item.width">
                        <template slot-scope="scope">
                            <slot :name="item.operateSlot" :data="scope"></slot>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="item.type === 'icon'" :key="item.prop" :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">
                            <span class="icon" @click="item.callback &&item.callback(scope.$index, scope.row, item.prop)"><i :class="item.class"></i></span>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="item.type === 'tag'" :key="item.prop" :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">
                            <el-popover class="tags" placement="top-start" title="标签" width="200" trigger="hover">
                                <span v-for="(tagItem,tagIdx) in item.option" :key="tagIdx">
                                    <el-tag style="margin: 2px" v-if="scope.row[item.prop].map(String).includes(tagItem.dictKey)">{{tagItem.dictValue}}</el-tag>
                                </span>
                                <span slot="reference">
                                    <span v-for="(tagItem,tagIdx) in item.option" :key="tagIdx">
                                        <el-tag style="margin: 5px" v-if="scope.row[item.prop].map(String).includes(tagItem.dictKey)">{{tagItem.dictValue}}</el-tag>
                                    </span>
                                </span>
                            </el-popover>
                            <!-- 标签>1，省略号 -->
                            <el-tag style="margin: 5px" v-if="scope.row[item.prop].length>1">...</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column v-else :key="item.prop" :label="item.label" :prop="item.prop" :sortable="item.sortable">
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <!--分页组件-->
        <el-pagination class="pagination" background @current-change="currentPage" :current-page="pagination.current" :page-size="pagination.pageSize" layout="total, prev, pager, next" :total="pagination.total">
        </el-pagination>
    </div>
</template>
<script>
import { deleteRow, getList } from "@/api/abilitySharing/index";
export default {
    props: ["config", "selectRowData", "showList"],
    data() {
        return {
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
        };
    },
    mounted() {
        // 只回显table信息
        if (this.showList) return;
        this.getTableList(this.pagination);
    },
    methods: {
        // table列表
        async getTableList(data, otherData) {
            const res = await getList({
                url: this.config.listUrl,
                data: { ...data, ...otherData },
            });
            if (!res) return this.msgSuccess(res.msg);
            this.tableData = res.records;
            this.pagination.current = res.current;
            this.pagination.pageSize = res.pageSize;
            this.pagination.total = res.total;
            // 有勾选属性&&有已选人员信息，回显选中的数据
            if (this.selectRowData?.length && this.config.checkbox) {
                res.records.forEach((row) => {
                    // 已选人员信息id=row.id，回显✔
                    if (this.selectRowData.includes(row.id)) {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    }
                });
            }
        },
        // 勾选行数据
        handleSelectionChange(val) {
            this.$emit("select-row-event", val);
        },
        // 分页
        currentPage(e) {
            // this.getTableList({ ...this.pagination, current: e });
            this.$emit("current-page", e);
        },
        // 行数据的 Key
        getRowKeys(row) {
            return row.id;
        },
        // 删除
        async handleDelete(id) {
            const res = await deleteRow(id);
            if (!res) return {};
            this.msgSuccess("任务已删除");
            this.getTableList({ ...this.pagination, current: 1 });
        },
    },
};
</script>
<style lang="scss" scoped>
.table-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    .table {
        flex: 1;
        .icon {
            cursor: pointer;
        }
        .tags {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .pagination {
        text-align: center;
        padding: 10px;
    }
}
</style>