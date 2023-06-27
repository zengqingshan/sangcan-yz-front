<template>
    <div></div>
</template>
<script>
export default {
    props: ["map", "heatmapData"],
    watch: {
        heatmapData: {
            deep: true,
            handler(newData) {
                this.heatmapOverlay?.setDataSet({
                    data: newData,
                    max: 10,
                });
            }
        },
    },
    mounted() {
        this.heatmapOverlay = new BMapLib.HeatmapOverlay({
            radius: 20,
            // gradient: {
            //     0.45: "rgb(0,0,255)",
            //     0.55: "rgb(0,255,255)",
            //     0.65: "rgb(0,255,0)",
            //     0.95: "yellow",
            //     1: "rgb(255,0,0)",
            // },
        });
        this.map.addOverlay(this.heatmapOverlay);
        this.heatmapOverlay?.setDataSet({
                    data: this.heatmapData,
                    max: 10,
                });
    },
    data() {
        return {
            heatmapOverlay: null,
        };
    },
};
</script>