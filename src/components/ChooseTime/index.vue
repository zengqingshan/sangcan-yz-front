<template>
    <div class="choose-time-bar">
        <el-radio-group class="radio" v-model="chooseData.timeType" @change="onChange" size="small">
            <el-radio-button label="one_day">24小时</el-radio-button>
            <el-radio-button label="seven_day">7天</el-radio-button>
            <el-radio-button label="thirty_day">30天</el-radio-button>
            <!-- <el-radio-button label="ninety_day">90天</el-radio-button> -->
            <el-radio-button label="customize">自定义</el-radio-button>
        </el-radio-group>
        <div class="time" v-if="showDatePicker">
            <div class="label">时间</div>
            <el-date-picker @change="onDatePicker" size="small" v-model="chooseData.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div class="deviceIds">
            <div class="label">范围选择</div>
            <tree-select @check="onArea" multiple clearable collapseTags v-model="chooseData.deviceIds" size="small" :data="treeData">
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
                timeType: "one_day",
                timeUnits: "hour",
                // isUserDefined: false,
                time: null,
                deviceIds: [],
                customizeStartTime: null,
                customizeEndTime: null,
            },
        };
    },
    methods: {
        onChange(e) {
            if (e === "customize") {
                this.showDatePicker = true;
            } else {
                this.showDatePicker = false;
                this.chooseData.time = null;
            }
            this.chooseData.timeType = e;
            this.chooseData.timeUnits = "day";
            // this.chooseData.isUserDefined = false;
            if (this.chooseData.timeType === "one_day") {
                this.chooseData.timeUnits = "hour";
            }
            if (this.chooseData.timeType === "customize") {
                // this.chooseData.isUserDefined = true;
                return;
            }
            this.search();
        },
        onDatePicker(e) {
            if (this.chooseData.timeType === "customize") {
                this.chooseData.time = e;
            } else {
                this.chooseData.time = null;
            }
            this.search();
        },
        onArea(e) {
            this.chooseData.deviceIds = e;
            this.search();
        },
        async search() {
            if (this.chooseData.time) {
                this.chooseData.customizeStartTime = this.chooseData.time[0];
                this.chooseData.customizeEndTime = this.chooseData.time[1];
            } else {
                this.chooseData.customizeStartTime = null;
                this.chooseData.customizeEndTime = null;
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
    .deviceIds,
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