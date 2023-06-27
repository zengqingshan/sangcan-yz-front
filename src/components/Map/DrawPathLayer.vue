<template>
    <div></div>
</template>
<script>
import posIcon from "@/assets/images/posIcon.png";
export default {
    props: ["map", "clickDeviceCoor"],
    data() {
        return {
            timer: null,
            pathData: [], // 路径点
        };
    },
    mounted() {
        this.map.addEventListener("click", this.getPath);
    },
    beforeDestroy() {
        // 取消点击绘制
        this.map.removeEventListener("click", this.getPath);
        this.pathData = [];
        this.removePath();
    },
    methods: {
        // 禁止绘制
        disableDraw() {
            this.map.removeEventListener("click", this.getPath);
        },
        // 绘制
        drawOpen() {
            this.map.addEventListener("click", this.getPath);
        },
        // 删除路径
        removePath() {
            this.map.getOverlays().forEach((item) => {
                if (item.status === "icon" || item.status === "line") {
                    this.map.removeOverlay(item);
                }
            });
        },
        // 绘制路径
        getPath(e) {
            // console.log(this.map.getOverlays());
            this.$emit("clear-current-device");
            this.getLine(e.point.lng, e.point.lat);
        },
        // 绘制路线
        getLine(lng, lat) {
            this.pathData = [
                ...this.pathData,
                this.clickDeviceCoor.length ? this.clickDeviceCoor : [lng, lat],
            ];

            // 绘制点icon
            let icon = new BMap.Icon(posIcon, new BMap.Size(40, 40), {
                // 指定定位位置。
                // 图标中央下端的尖角位置。
                anchor: new BMap.Size(20, 40),
                imageOffset: new BMap.Size(0, 0), // 设置图片偏移
            });
            const data = this.pathData.map((item, index) => {
                return new BMap.Point(item[0], item[1]);
            });

            let point = new BMap.Point(
                this.pathData.at(-1)[0],
                this.pathData.at(-1)[1]
            );
            // 节点处添加marker
            let marker = new BMap.Marker(point, {
                icon: icon,
            });
            // marker上数字
            let label = new BMap.Label(this.pathData.length);
            label.setStyle({
                background: "none",
                border: "none",
                width: "40px",
                height: "31px",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
            });
            marker.status = "icon";
            marker.setLabel(label);
            this.map.addOverlay(marker);

            // 点>1，开始绘制线
            if (data.length > 1) {
                // 折线上的箭头
                let sy = new BMap.Symbol(
                    BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW,
                    {
                        scale: 0.6, //图标缩放大小
                        strokeColor: "#fff", //设置矢量图标的线填充颜色
                        strokeWeight: "2", //设置线宽
                    }
                );
                let icons = new BMap.IconSequence(sy, "10", "30");
                //创建折线
                // // 每次增加的路线是路径列表的倒数两个，保证不重复绘制前面的路径
                let point = [data[data.length - 2], data[data.length - 1]];

                let lineLayer = new BMap.Polyline(point, {
                    strokeColor: "rgba(55, 71, 226, 0.9)",
                    strokeWeight: 10,
                    strokeOpacity: 0.7,
                    // icons: [icons],
                });
                lineLayer.status = "line";
                this.map.addOverlay(lineLayer); //绘制折线
            }
        },
    },
};
</script>