<template>
    <el-drawer :visible="drawer" :before-close="handleClose">
        <div class="drawer-content">
            <el-button type="info">实况</el-button>
            <div class="video">
                <videots :isptz="isptz" :obj="obj"></videots>
            </div>
            <div class="drawer-info">
                <div class="info-title"><i class="iconfont icon-shebei"></i> 设备信息</div>
                <div class="info-content">
                    <div class="info-item">
                        <div class="label">设备名称</div>
                        <div class="value" :title="deviceDetail.name">
                            {{ deviceDetail.name }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="label">设备状态</div>
                        <div class="value" :title="deviceDetail.status ? '在线' : '离线'">
                            {{ deviceDetail.status ? "在线" : "离线" }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="label">设备厂商</div>
                        <div class="value" :title="this.getDict('vendor', 'vendor')">
                            {{ this.getDict("vendor", "vendor") }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="label">设备类型</div>
                        <div class="value" :title="this.getDict('dev_type', 'devType')">
                            {{ this.getDict("dev_type", "devType") }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="label">省/地市/区县</div>
                        <div class="value" :title="divisionLabel">
                            {{ divisionLabel }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="label">设备编号</div>
                        <div class="value" :title="deviceDetail.serviceId">
                            {{ deviceDetail.serviceId }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-drawer>
</template>
<script>
import videots from "@component/videocomponent";
import { realTimeVideo, division } from "@api/getVideo/index.js";
import { potoutbase } from "@/utils/randomNumber.js";

export default {
    components: {
        videots,
    },
    props: ["drawer", "deviceDetail", "isptz"],
    data() {
        return {
            obj: {},
            divisionLabel: "",
        };
    },
    mounted() {
        this.getDivision();
        realTimeVideo({
            deviceId: this.deviceDetail.serviceId,
            platformServiceId: this.deviceDetail.platformServiceId,
            tag: potoutbase(),
        }).then((res) => {
            if (res.http_flv && res.playtoken) {
                this.obj = res;
            }
        });
    },
    beforeDestroy() {
        clearTimeout(this.timer);
    },
    methods: {
        // 行政区划
        getDivision() {
            // console.log(this.deviceDetail.division);
            division(this.deviceDetail.division).then((res) => {
                this.divisionLabel = res;
            });
        },
        getDict(mapKey, type) {
            return this.$store.getters.dict[mapKey].find(
                (item) => item.dictKey === this.deviceDetail[type]
            )?.dictValue;
        },
        handleClose() {
            this.$emit("update:drawer", false);
        },
    },
};
</script>
<style lang="scss" scoped>
.drawer-content {
    padding: 0 20px;
    .video {
        width: 100%;
        height: 200px;
    }
    .drawer-info {
        padding: 10px 0;
        .info-title {
            background: #f6f7fb;
            height: 36px;
            line-height: 36px;
            color: #303133;
            padding: 0 11px;
            font-weight: 600;
            font-family: "Microsoft YaHei UI";
            margin: 6px 0;
        }
        .info-content {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            .info-item {
                width: 100%;
                margin: 14px 10px;
                display: flex;
                align-items: center;
                .label {
                    width: 110px;
                    color: #606266;
                }
                .value {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                    color: #303133;
                }
            }
        }
    }
}
</style>
