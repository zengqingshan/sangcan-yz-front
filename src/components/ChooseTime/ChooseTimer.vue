<template>
    <div class="choose-time-bar">
        <el-radio-group class="radio" v-model="chooseData.num" @change="onChange" size="small">
            <el-radio-button :label="24">24小时</el-radio-button>
            <el-radio-button :label="7">7天</el-radio-button>
            <el-radio-button :label="30">30天</el-radio-button>
            <el-radio-button :label="null">自定义</el-radio-button>
        </el-radio-group>
        <div class="time" v-if="showDatePicker">
            <div class="label">时间</div>
            <el-date-picker @change="onDatePicker" size="small" v-model="chooseData.time" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div class="deviceList">
            <div class="label">范围选择</div>
            <tree-select @check="onArea" multiple clearable collapseTags v-model="chooseData.deviceList" size="small" :data="treeData">
            </tree-select>
        </div>
    </div>
</template>
<script>
import TreeSelect from "@/components/TreeSelect/index";

export default {
    components: { TreeSelect },
    data() {
        return {
            showDatePicker: false, //自定义时间
            treeData: this.$store.getters.deviceList,
            chooseData: {
                num: 24,
                isDay: false,
                time: null,
                deviceList: [],
                startDate: null,
                endDate: null,
            },
        };
    },
    methods: {
        onChange(e) {
            if (e === null) {
                this.showDatePicker = true;
            } else {
                this.showDatePicker = false;
                this.chooseData.time = null;
            }
            this.chooseData.num = e;
            this.chooseData.isDay = true;
            if (this.chooseData.num === 24) {
                this.chooseData.isDay = false;
            }
            if (this.chooseData.num === null) {
                this.chooseData.isDay = true;
                return;
            }
            this.search();
        },
        onDatePicker(e) {
            if (this.chooseData.num === null) {
                this.chooseData.time = e;
            } else {
                this.chooseData.time = null;
            }
            this.search();
        },
        onArea(e) {
            this.chooseData.deviceList = e;
            this.search();
        },
        async search() {
            if (this.chooseData.time) {
                this.chooseData.startDate = this.chooseData.time[0];
                this.chooseData.endDate = this.chooseData.time[1];
            } else {
                this.chooseData.startDate = null;
                this.chooseData.endDate = null;
            }
            this.$emit("choose-time", this.chooseData);
        },
    },
};
</script>
<style lang="scss" scoped>
.choose-time-bar {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e6e8;
    padding-bottom: 16px;
    .radio {
        padding: 0 8px;
    }
    .deviceList,
    .time {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #565656;
        padding: 0 8px;
        .label {
            padding: 0 8px;
        }
    }
}
</style>