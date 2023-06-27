<template>
    <div>
        <Map :type="type" @device-click="deviceClick" :deviceList="deviceList" ref="map" :legendList="legendList"></Map>
        <!-- drawer:父组件控制子组件抽屉显示|隐藏 -->
        <!--<VedioModal v-if="Object.keys(deviceDetail).length" :drawer="drawer" @update:drawer="onDrawer" :deviceDetail="deviceDetail" />-->
    </div>
</template>
<script>
import Map from "@/components/Map/index";
import { getDeviceDataSet } from "@/api/device/device";
//import VedioModal from "@/components/videocomponent/VedioModal";

export default {
    components: {
        Map,
      //  VedioModal,
    },
    mounted() {
        //this.getDeviceDataSet();
    },
    data() {
        return {
            type: ["cluster", "tool"], // 显示地图类型
            deviceList: [], //图例设备列表
            drawer: false, //抽屉
            deviceDetail: {}, //设备详情
            legendList: [], //所有设备列表
        };
    },
    methods: {
        // 关闭抽屉
        onDrawer() {
            this.drawer = false;
            this.deviceDetail = {};
        },
        // 设备图标点击
        deviceClick(item) {
            this.deviceDetail = item;
            this.drawer = !this.drawer;
        },
        // 获取设备
        async getDeviceDataSet() {
            const res = await getDeviceDataSet({ isFilter: true });
            if (!res) return [];
            res.forEach((item) => {
                // 离线云台
                // if (!item.isControl && !item.status) {
                //     this.deviceList = [...this.deviceList, item];
                // }
                // 设备类型为1-4中的一种
                if (['1','2','3','4'].includes(item.devCategory)) {
                    this.deviceList = [...this.deviceList, item];
                }
            });
            this.legendList = res;
        },
    },
};
</script>