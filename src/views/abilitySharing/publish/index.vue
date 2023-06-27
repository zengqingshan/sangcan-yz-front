<template>
    <div class="content-wrap">
        <div class="content">
            <div class="top-bar">
                <el-select size="small" v-model="value" placeholder="请选择分类" class="select-classify" clearable @change="onSelect">
                    <el-option v-for="item in options" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
                </el-select>
                <el-input size="small" clearable class="search-api-name" placeholder="API名称" suffix-icon="el-icon-search" v-model="input" @change="onChange"></el-input>
                <el-button size="mini" class="btn-add" icon="el-icon-plus" type="primary" @click="add">新建</el-button>
            </div>
            <table-data :config="tableList" ref="tableRef" @current-page="currentPage">
                <template v-slot:operate="slotData">
                    <span class="opreate-icon" v-hasPermi="['abilitySharing:publish:edit']">
                        <i class="iconfont icon-pen" @click="onEdit(slotData.data.row.id)" title="编辑"><span class="text">编辑</span></i>
                    </span>
                    <span class="opreate-icon" v-hasPermi="['abilitySharing:publish:isPublish']">
                        <i :class="slotData.data.row.status ? 'iconfont icon-Fra4me1' : 'iconfont icon-Fra3me' " :title="slotData.data.row.status ? '未发布' : '已发布'" @click="onPublish(slotData.data.row)"><span class="text">{{slotData.data.row.status ? '撤销发布' : '发布'}}</span></i>
                    </span>
                    <span class="opreate-icon" v-hasPermi="['abilitySharing:publish:delete']">
                        <i class="el-icon-delete" title="删除" @click="onDelete(slotData.data.row.id)"><span class="text">删除</span></i>
                    </span>
                </template>
                <template v-slot:status="slotData">
                    <div class="status">
                        <div class="icon" :style="{
                background: slotData.data.row.status ? '#409EFF' : '#909399',
              }"></div>
                        <div>{{ slotData.data.row.status ? "已发布" : "未发布" }}</div>
                    </div>
                </template>
            </table-data>
        </div>
    </div>
</template>
<script>
import TableData from "./components/tableData";
import config from "./config";
import {
    shareGroup,
    shareDelete,
    sharePublish,
    shareUnpublish,
} from "@/api/abilitySharing/index";

export default {
    components: {
      TableData
    },
    created() {
        this.getShareGroup({});
    },
    data() {
        return {
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            config: config,
            tableList: config.personManagementTable({
                getType: this.getType,
            }),
            form: {
                name: null,
                target: null,
                type: null,
                time: null,
                status: null,
                person: null,
                deviceInfoList: null,
            }, // 筛选表单
            options: [], // 所属分类列表
            value: "",
            input: "",
            apiName: null,
            groupId: null,
        };
    },
    methods: {
        // 所属分类映射
        getType(row, prop) {
            return this.options.find((item) => item.id === row[prop])
                ?.groupName;
        },
        // 发布
        onPublish(item) {
            this.$confirm(`是否${item.status ? "取消" : ""}发布？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    if (item.status) {
                        // 取消发布
                        await shareUnpublish(item.id);
                        this.msgSuccess("取消发布成功");
                    } else {
                        // 发布
                        await sharePublish(item.id);
                        this.msgSuccess("发布成功");
                    }
                    this.filterList();
                })
                .catch(() => {
                    this.msgSuccess("已取消");
                });
        },
        // 删除
        onDelete(id) {
            this.$confirm("是否删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    await shareDelete(id);
                    this.msgSuccess("修改成功");
                    this.filterList();
                })
                .catch(() => {
                    this.msgSuccess("已取消");
                });
        },
        // 编辑
        onEdit(id) {
            this.$router.push({
                name: "ApiEdit",
                query: {
                    id,
                },
            });
        },
        // 新建
        add() {
            this.$router.push({
                name: "ApiAdd",
            });
        },
        // 分类接口
        async getShareGroup(data) {
            const res = await shareGroup(data);
            if (!res) return [];
            this.options = res;
        },
        // api名称搜索
        onChange(e) {
            this.apiName = e;
            this.filterList();
        },
        // 分类
        onSelect(e) {
            this.groupId = e;
            this.filterList();
        },
        // 分页
        currentPage(e) {
            this.$refs.tableRef.getTableList({
                ...this.pagination,
                current: e,
                ...this.searchData,
            });
        },
        // 列表接口
        filterList() {
            this.searchData = {
                apiName: this.apiName,
                groupId: this.groupId,
            };
            this.$refs.tableRef.getTableList({
                ...this.pagination,
                apiName: this.apiName,
                groupId: this.groupId,
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.content-wrap {
    height: calc(100vh - 50px);
    background: #f2f3f5;
    padding: 16px;
    .content {
        background: #fff;
        height: 100%;
        padding: 16px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        .top-bar {
            padding-bottom: 16px;
            .select-classify {
                width: 240px;
                margin-right: 24px;
            }
            .search-api-name {
                width: 240px;
            }

            .btn-add {
                float: right;
            }
        }
        .opreate-icon {
            color: #1f8dff;
            margin-right: 10px;
            cursor: pointer;
            .text {
                font-size: 14px;
                margin-left: 4px;
            }
        }
        .status {
            display: flex;
            align-items: center;
            .icon {
                width: 10px;
                height: 10px;
                margin-right: 10px;
                border-radius: 10px;
            }
        }
    }
}
</style>