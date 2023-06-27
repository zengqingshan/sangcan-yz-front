<template>
    <div class="content-wrap">
        <div class="content">
            <div class="title">
                <div>Api详情</div>
                <i v-if="!isEdit" class="el-icon-edit-outline common-icon" @click="onEdit">编辑</i>
                <i v-else class="el-icon-folder common-icon" @click="onSave">保存</i>
            </div>
            <div class="api-detail" v-if="Object.keys(detailList).length">
                <div class="api-detail-item" v-for="(item, index) in apiEditConfig" :key="index">
                    <div class="item-title">
                        <i :class="`common-icon iconfont ${item.icon}`"></i>
                        <span class="text">{{ item.title }}</span>
                    </div>
                    <div class="item-content" v-for="(it, idx) in item.content" :key="idx">
                        <div class="label">{{ it.label }}：</div>
                        <el-input :type="it.textarea?'textarea':'text'" @focus="onFocue" @change="(e)=>onChange(e,it.value)" ref="editInput" v-if="isEdit&&it.isModify" v-model="detailList[it.value]" clearable size="mini" class="modify-input" />
                        <div v-else class="no-modify">
                            <div class="value">{{ detailList[it.value] }}</div>
                        </div>
                        <!-- <el-input ref="editInput" @blur="onBlur" v-if="modifyValue === it.value" v-model="modifyLabel" clearable size="mini" class="modify-input" />
                        <div v-else class="no-modify">
                            <div class="value">{{ detailList[it.value] }}</div>
                            <i class="el-icon-edit-outline" v-if="it.isModify" @click="onModify(it.value, detailList[it.value])">修改</i>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="footer">
                <el-button @click="back">返回</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { shareInfo } from "@/api/abilitySharing/index";
import config from "./config";
import { shareGroup, shareUpdate } from "@/api/abilitySharing/index";
import { isChinese, isNum } from "@/utils/validate.js";

export default {
    created() {
        // 接口信息信息
        this.getShareInfo(this.$route.query.id);
        this.apiEditConfig = config.apiEditConfig;
    },
    data() {
        return {
            detailList: [], // 信息详情
            // modifyValue: "", // 选择修改的字段
            // modifyLabel: "", // 原始信息
            options: [], //所属分类列表
            isEdit: false, // 开启修改
            oldValue: "", // 鼠标聚焦输入框信息
            oldDetailList: [], // 原始信息详情
        };
    },
    methods: {
        onChange(value, key) {
            // 校验汉字
            const validList = [
                "insideProtocol",
                "insideAddress",
                "insidePath",
                "timeout",
            ];
            if (validList.includes(key) && isChinese(value)) {
                this.detailList[key] = this.oldValue;
                return this.msgInfo("禁止输入汉字");
            }
            // 校验path
            const validPath = ["insidePath"];
            if (validPath.includes(key) && value[0] !== "/") {
                this.detailList[key] = this.oldValue;
                return this.msgInfo("格式错误，例：/getUserInfo/[userId]");
            }
            // 校验数字
            const validNumber = ["timeout"];
            if (validNumber.includes(key) && !isNum(value)) {
                this.detailList[key] = this.oldValue;
                return this.msgInfo("请输入数字");
            }
        },
        onFocue(e) {
            this.oldValue = e.target.value;
        },
        // 保存
        async onSave() {
            this.isEdit = false;
            // 新、旧详情数据相等 ，不调接口
            if (
                Object.entries(this.detailList).every(
                    (item) => item[1] === this.oldDetailList[item[0]]
                )
            )
                return;
            // 更新
            const res = await shareUpdate(this.detailList);
            if (!res) return [];
            this.msgSuccess("修改成功");
            this.getShareInfo(this.$route.query.id);
        },
        // 编辑
        onEdit() {
            this.isEdit = true;
        },
        //  返回
        back() {
            this.$router.go(-1);
        },
        // 列表详情接口--接口信息
        async getShareInfo(id) {
            // 所属分类列表
            const list = await shareGroup({});
            if (!list) return [];
            this.options = list;

            const res = await shareInfo(id);
            if (!res) return [];
            res.groupName = this.options.find(
                (item) => item.id === res.groupId
            ).groupName;
            this.detailList = res;
            this.oldDetailList = { ...res };
        },
        // 修改
        // onModify(value, label) {
        //     this.modifyValue = value;
        //     this.modifyLabel = label;
        //     this.$nextTick(() => {
        //         this.$refs.editInput[0].focus();
        //     });
        // },
        // 失焦
        // async onBlur() {
        //     // 修改值有变化调更新接口
        //     if (this.detailList[this.modifyValue] !== this.modifyLabel) {
        //         // 修改接口
        //         const data = {
        //             ...this.detailList,
        //             [this.modifyValue]: this.modifyLabel,
        //         };
        //         if (
        //             isChinese(data.insideProtocol) ||
        //             isChinese(data.insideAddress) ||
        //             isChinese(data.insidePath) ||
        //             isChinese(data.timeout)
        //         ) {
        //             this.modifyValue = "";
        //             return this.msgInfo("禁止输入汉字");
        //         }
        //         // 更新
        //         const res = await shareUpdate(data);
        //         if (!res) return [];
        //         this.msgSuccess("修改成功");
        //         this.getShareInfo(this.$route.query.id);
        //     }
        //     // 修改值无变化，隐藏修改input
        //     this.modifyValue = "";
        // },
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
        padding: 24px;
        overflow: auto;
        .title {
            color: #262626;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding-bottom: 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .common-icon {
                color: #1f8dff;
                cursor: pointer;
            }
        }
        .api-detail {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            .api-detail-item {
                width: 50%;
                > .item-title:nth-child(2n-1) {
                    margin: 8px 24px 8px 0;
                }
                .item-title {
                    background: #f6f7fb;
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    color: #303133;
                    .common-icon {
                        margin-right: 10px;
                    }
                    .text {
                        font-weight: bold;
                    }
                }
                .item-content {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    font-size: 14px;
                    .label {
                        color: #606266;
                        width: 190px;
                    }
                    .modify-input {
                        margin: 0 63px;
                    }
                    .no-modify {
                        display: flex;
                        align-items: center;
                        .value {
                            color: #303133;
                            padding: 0 8px 0 63px;
                        }
                        .el-icon-edit-outline {
                            color: #1f8dff;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .footer {
            width: 100%;
            text-align: center;
            position: absolute;
            bottom: 56px;
        }
    }
}
</style>
