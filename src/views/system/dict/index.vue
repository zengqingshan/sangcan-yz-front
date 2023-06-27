<template>
    <div class="app-container sys-content">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="字典类型" prop="type">
                <el-input v-model="queryParams.type" placeholder="请输入字典类型" clearable size="small" maxlength="32" style="width: 240px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="字典key" prop="dictValue">
                <el-input v-model="queryParams.dictKey" placeholder="请输入字典key" clearable size="small" maxlength="32" style="width: 240px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" plain icon="el-icon-plus" size="small" @click="handleAdd" v-hasPermi="['system:dict:add']">新增</el-button>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <!--    <el-row :gutter="10" class="mb8">-->
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          plain-->
        <!--          icon="el-icon-plus"-->
        <!--          size="small"-->
        <!--          @click="handleAdd"-->
        <!--          v-hasPermi="['system:dict:add']"-->
        <!--        >新增</el-button>-->
        <!--      </el-col>-->
        <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
        <!--    </el-row>-->
        <div class="table">
            <el-table stripe v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
                <div slot="empty">
                    <el-empty description="暂无数据"></el-empty>
                </div>
                <el-table-column type="selection" width="55" align="center" :selectable='selectEnable' />
                <el-table-column label="字典编号" align="center" prop="id" />
                <el-table-column label="字典类型" align="center" prop="type" :show-overflow-tooltip="true" />
                <el-table-column label="字典值" align="center" prop="dictValue" :show-overflow-tooltip="true" />
                <el-table-column label="字典key" align="center" prop="dictKey" />
                <el-table-column label="备注" align="center" prop="description" :show-overflow-tooltip="true" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-dictValue="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.editFlag" size="small" type="text" icon="iconfont icon-pen" @click="handleUpdate(scope.row)" v-hasPermi="['system:dict:edit']"><span class="text">编辑</span></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或编辑参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="字典类型" prop="type">
                    <el-input maxlength="32" :disabled="title === '编辑字典类型'" v-model="form.type" placeholder="请输入字典类型" />
                </el-form-item>
                <el-form-item label="字典值" prop="dictValue">
                    <el-input maxlength="32" v-model="form.dictValue" placeholder="请输入字典名称" />
                </el-form-item>
                <el-form-item label="字典key" prop="dictKey">
                    <el-input maxlength="32" :disabled="title === '编辑字典类型'" v-model="form.dictKey" placeholder="请输入字典名称" />
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input maxlength="200" v-model="form.description" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listType,
    getType,
    delType,
    addType,
    updateType,
    exportType,
    refreshCache,
} from "@/api/system/dict/type";

export default {
    dictValue: "Dict",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 导出遮罩层
            exportLoading: false,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 字典表格数据
            typeList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 状态数据字典
            statusOptions: [],
            // 日期范围
            dateRange: [],
            // 查询参数
            queryParams: {
                current: 1,
                pageSize: 10,
                type: undefined,
                dictKey: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                dictValue: [
                    {
                        required: true,
                        message: "字典值不能为空",
                        trigger: "blur",
                    },
                ],
                dictKey: [
                    {
                        required: true,
                        message: "字典key不能为空",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "字典类型不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
        // this.getDicts("sys_normal_disable").then(response => {
        //   this.statusOptions = response.data;
        // });
    },
    methods: {
        /** 查询字典类型列表 */
        getList() {
            this.loading = true;
            listType(this.addDateRange(this.queryParams, this.dateRange)).then(
                (response) => {
                    this.typeList = response.records;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                type: undefined,
                dictValue: undefined,
                dictKey: undefined,
                description: undefined,
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.current = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.queryParams.dictKey = undefined;
            this.queryParams.type = undefined;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加字典类型";
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 编辑按钮操作 */
        handleUpdate(row) {
            this.reset();
            getType({ dictId: row.id }).then((response) => {
                this.form = response;
                this.open = true;
                this.title = "编辑字典类型";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updateType(this.form).then((response) => {
                            this.msgSuccess("编辑成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addType(this.form).then((response) => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm("是否确认删除所选的数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return delType({ dictId: row.id });
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有类型数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.exportLoading = true;
                    return exportType(queryParams);
                })
                .then((response) => {
                    this.download(response.msg);
                    this.exportLoading = false;
                })
                .catch(() => {});
        },
        /** 刷新缓存按钮操作 */
        handleRefreshCache() {
            refreshCache().then(() => {
                this.msgSuccess("刷新成功");
            });
        },
        /** 表格勾选判断 */
        selectEnable(row) {
            return row.editFlag;
        },
    },
};
</script>
<style lang="scss" scoped>
.sys-content {
    display: flex;
    flex-direction: column;
    .table {
        flex: 1;
    }
    .text {
        font-size: 14px;
        margin-left: 4px;
    }
}
</style>
