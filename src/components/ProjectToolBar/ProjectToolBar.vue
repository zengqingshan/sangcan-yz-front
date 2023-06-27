<template>
    <div class="tool-bar">
        <el-form inline :model="form" ref="form" class="form">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item prop="search">
                        <el-input clearable placeholder="请输入关键词检索" v-model="form.search" class="search">
                            <div slot="suffix" class="suffix">
                                <el-upload ref="upload" :show-file-list="false" :action="`/cmict-project-retrieval/theme/upload?type=${type}`" list-type="picture-list" :on-success="handleSuccess" :before-upload="beforeUpload">
                                    <i class="el-icon-camera icon"></i>
                                </el-upload>
                            </div>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">确定</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <i class="pack-up" :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="onShow">{{isShow?'收起':'展开'}}</i>
                </el-col>
            </el-row>
            <div v-if="isShow">
                <el-form-item label="上传图片" v-if="visible">
                    <div class="image-wrap">
                        <el-image class="image" :src="form.imageUrl" :preview-src-list="[form.imageUrl]">
                        </el-image>
                        <i class="el-icon-error icon" @click="onRemove"></i>
                    </div>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item prop="qualityScore" label="质量得分">
                            <el-input placeholder="请输入质量得分" type="number" oninput="if(!/^[0-9]+$/.test(value)) value=value.replace(/\D/g,'');if(value>100)value=100;if(value<0)value=null" min="1" max="100" v-model.number="form.qualityScore" show-input class="quality-score">
                                <template slot="append">分</template>
                            </el-input>
                            <span class="above">以上</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="visible">
                        <el-form-item label="相似度">
                            <el-input class="similar" placeholder="请输入相似度" type="number" oninput="if(!/^[0-9]+$/.test(value)) value=value.replace(/\D/g,'');if(value>100)value=100;if(value<0)value=null" min="1" max="100" v-model.number="form.similar">
                                <template slot="append">%</template>
                            </el-input>
                            <span class="above">以上</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item prop="time" label="时间范围">
                    <el-date-picker :picker-options="pickerOptions" value-format="yyyy-MM-dd" v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="time">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="gallerySource" label="图库来源" class="device-ids">
                    <tree-select ref="tree" :width="216" @clear="onClear" @check="e=>selectNum=e.length" multiple clearable collapseTags v-model="form.gallerySource" :data="$store.getters.deviceList">
                    </tree-select>
                    <span class="text">已选择设备<span class="number">{{selectNum}}</span>个</span>
                </el-form-item>
                <div class="more">
                    <div class="more-option">更多选项</div>
                    <div class="more-select">
                        <el-form-item v-for="(item,index) in config" :key="index" :prop="item.prop" class="more-common">
                            <el-select v-if="item.type==='select'" @clear="onClearSelect(item.prop)" clearable collapse-tags :multiple="item.isMultiple" v-model="form[item.prop]" :placeholder="item.placeholder">
                                <el-option v-for="label in $store.getters.dict[item.dict]" :key="label.dictKey" :label="label.dictValue" :value="label.dictKey">
                                </el-option>
                            </el-select>
                            <div class="more-item" v-if="item.type==='slider'">
                                <div class="label">{{item.label}}</div>
                                <el-slider class="slider" v-model="form[item.prop]" range></el-slider>
                                <div class="text">{{form[item.prop][0]}}-{{form[item.prop][1]}}</div>
                            </div>
                        </el-form-item>
                    </div>
                </div>
            </div>
        </el-form>
    </div>
</template>
<script>
import TreeSelect from "@/components/TreeSelect/index";
export default {
    props: ["config", "type"],
    components: { TreeSelect },
    data() {
        return {
            isShow: false,
            selectNum: 0,
            visible: false, // 上传图片
            form: {
                imageUrl: null,
                search: null,
                time: null,
                similar: null,
                qualityScore: null,
                gallerySource: null,
                ageRange: [1, 100],
                vector: null,
            },
            pickerOptions: {
                disabledDate(time) {
                    // 禁止选择未来日期（可以选择今天）
                    return time.getTime() > Date.now();
                },
            },
        };
    },
    methods: {
        // 清除选择框
        onClearSelect(val) {
            this.form[val] = null;
        },
        // 手动清除树选框
        onClear(e) {
            if (e.length) {
                this.form.deviceList = e;
                this.form.gallerySource = this.form.gallerySource.filter(
                    (item) => {
                        if (this.form.deviceList.includes(item.id)) {
                            return item;
                        }
                    }
                );
            } else {
                this.form.deviceList = null;
                this.form.gallerySource = null;
            }
        },
        // 上传图片按钮
        onUpload() {
            this.visible = true;
        },
        // 确定
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.form.time) {
                        this.form.startTime = `${this.form.time[0]} 00:00:00`;
                        this.form.endTime = `${this.form.time[1]} 23:59:59`;
                    } else {
                        this.form.startTime = null;
                        this.form.endTime = null;
                    }
                    if (this.form.gallerySource) {
                        this.form.deviceList = this.form.gallerySource.map(
                            (item) => item.id
                        );
                    }
                    this.form.maxAge = this.form.ageRange[1];
                    this.form.minAge = this.form.ageRange[0];
                    this.form.score = this.form.qualityScore / 100;
                    this.form.similarity = this.form.similar / 100;
                    // 关键词检索&图片同时有值，清空图片和图片的所有条件
                    if (this.form.search && this.form.imageUrl) {
                        let search = this.form.search;
                        this.visible = false;
                        this.clearCondition();
                        this.form.search = search;
                    }

                    // this.$emit("form-event", {
                    //     form: this.form,
                    //     type: "submit",
                    // });
                    this.$emit("form-event", this.form);
                }
            });
        },
        // // 专题库列表
        // async getThemeList(list, type) {
        //     if (type === "load") {
        //         this.pagination.current++;
        //     }
        //     const data = { ...list, ...this.pagination };
        //     const res = await themeFace(data);
        //     if (!res) return {};
        //     this.pagination.current = res.current;
        //     res.records.forEach((item) => (item.imgPath = item.sourceFile));
        //     this.list = [...this.list, ...res.records];
        //     this.$emit("theme-list", { list: this.list, params: data });
        // },
        // 重置
        resetForm() {
            this.clearCondition();
            // this.$emit("form-event", { form: {}, type: "reset" });
            this.$emit("form-event", {});
        },
        // 只清除表单条件
        clearCondition() {
            this.$refs.form.resetFields();
            if (this.$refs.tree) {
                this.$refs.tree.clearSelectedNodes(); //清空树选
            }
            this.form = {
                imageUrl: null,
                search: null,
                time: null,
                similar: null,
                qualityScore: null,
                gallerySource: null,
                ageRange: [1, 100],
                vector: null,
            };
            this.onRemove();
        },
        // 显示|隐藏
        onShow() {
            this.isShow = !this.isShow;
        },
        // 删除图片按钮
        onRemove() {
            this.$refs.upload.clearFiles();
            this.form.imageUrl = null;
            this.form.vector = null;
            this.visible = false;
        },
        // 上传成功
        handleSuccess(res, file) {
            // console.log(res, file);
            this.visible = true;
            this.form.imageUrl = URL.createObjectURL(file.raw);
            this.form.vector = res.data;
        },
        // 上传前
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            let reg = /(png|jpe?g)$/;
            if (!reg.test(file.type)) {
                this.$message.error("上传头像图片只能是 JPEG、JPG、PNG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return reg.test(file.type) && isLt2M;
        },
    },
};
</script>
<style lang="scss" scoped>
.tool-bar {
    padding: 16px 16px 0 16px;
    background: #fff;
    position: absolute;
    width: 100%;
    z-index: 2;
    box-shadow: 0 5px 5px #ddd;

    .form {
        display: grid;
        .search {
            width: 320px;
            .suffix {
                display: inline-flex;
                .icon {
                    cursor: pointer;
                }
            }
        }
        .pack-up {
            cursor: pointer;
            color: #2b59fc;
            font-weight: 400;
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 14px;
            z-index: 2;
        }
        .image-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 254px;
            height: 120px;
            border: 1px solid #dcdfe6;
            padding: 10px;
            .image {
                width: 100px;
                height: 100px;
            }
            .icon {
                cursor: pointer;
                color: #c0c4cc;
            }
        }
        .similar,
        .quality-score {
            width: 240px;
        }
        .above {
            padding: 0 8px;
            color: #606266;
        }
        .time {
            width: 240px;
        }
        .device-ids {
            display: flex;
            .text {
                padding-left: 8px;
                .number {
                    color: #2b59fc;
                }
            }
        }

        .more {
            display: flex;
            // flex-wrap: wrap;
            .more-option {
                width: 60px;
                color: #606266;
                line-height: 40px;
                padding: 0 12px 0 0;
                font-size: 12px;
                font-weight: 700;
            }
            .more-select {
                flex: 1;
                .more-item {
                    display: flex;
                    align-items: center;
                    width: 350px;
                    .label {
                        flex-basis: 70px;
                        padding: 0 10px;
                    }
                    .slider {
                        flex: 1;
                    }
                    .text {
                        color: #1890ff;
                        padding-left: 8px;
                    }
                }
            }
        }
    }
}
</style>
<style scoped>
::v-deep .device-ids .el-form-item__content {
    display: flex;
    flex: 1;
}
::v-deep .more-common .el-form-item__content {
    width: 170px;
}
::v-deep .image-wrap .el-image__preview {
    object-fit: contain;
    background: #eee;
}
</style>
