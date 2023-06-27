<template>
    <div class="app-container sys-content">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="参数键名" prop="code">
                <el-input v-model="queryParams.code" placeholder="请输入参数键名" clearable size="small" maxlength="50" style="width: 240px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="table">
            <el-table stripe v-loading="loading" :data="configList">
                <div slot="empty">
                    <el-empty description="暂无数据"></el-empty>
                </div>
                <el-table-column label="参数键名" align="center" prop="code" :show-overflow-tooltip="true" />
                <el-table-column label="参数键值" align="center" prop="value" />
                <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" icon="iconfont icon-pen" @click="handleUpdate(scope.row)" v-hasPermi="['system:config:edit']"><span class="text">编辑</span></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或编辑参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="参数键名" prop="code">
                    <el-input disabled v-model="form.code" placeholder="请输入参数键名" />
                </el-form-item>
                <el-form-item label="参数键值" prop="value">
                    <el-input v-model="form.value" placeholder="请输入参数键值" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listConfig, getConfigKey, updateConfig } from "@/api/system/config";

export default {
    name: "Config",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 参数表格数据
            configList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 日期范围
            dateRange: [],
            // 查询参数
            queryParams: {
                current: 1,
                pageSize: 10,
                remark: undefined,
                code: undefined,
                configType: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                code: [
                    {
                        required: true,
                        message: "参数键名不能为空",
                        trigger: "blur",
                    },
                ],
                value: [
                    {
                        required: true,
                        message: "参数键值不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询参数列表 */
        getList() {
            this.loading = true;
            listConfig(
                this.addDateRange(this.queryParams, this.dateRange)
            ).then((response) => {
                this.configList = response.records;
                this.total = response.total;
                this.loading = false;
            });
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
                remark: undefined,
                code: undefined,
                value: undefined,
                configType: "Y",
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
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 编辑按钮操作 */
        handleUpdate(row) {
            this.reset();
            getConfigKey({ sysParamId: row.id }).then((response) => {
                this.form = response;
                this.open = true;
                this.title = "编辑参数";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    updateConfig(this.form).then(() => {
                        this.msgSuccess("编辑成功");
                        this.open = false;
                        this.getList();
                    });
                }
            });
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
