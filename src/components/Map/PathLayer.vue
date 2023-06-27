<template>
    <div></div>
</template>
<script>
import person from "@/assets/images/person.png";
import posIcon from "@/assets/images/posIcon.png";
export default {
    props: ["map", "pathData"],
    mounted() {
        if (this.pathData.length) {
            this.map.centerAndZoom(
                new BMap.Point(this.pathData[0][0], this.pathData[0][1]),
                10
            );
            this.lushu();
        }
    },
    methods: {
        lushu() {
            // this.pathData = [
            //     [108.945315, 34.350606],
            //     [109, 34.350606],
            // ];
            // 轨迹线
            let icon = new BMap.Icon(posIcon, new BMap.Size(40, 40), {
                // 指定定位位置。
                // 图标中央下端的尖角位置。
                anchor: new BMap.Size(20, 40),
                imageOffset: new BMap.Size(0, 0), // 设置图片偏移
            });
            let obj = {};
            const data = this.pathData.map((item, index) => {
                // 经纬度相同的点去重做标记，数组长度为1.不循环加载路数动画
                obj[item] = item;
                obj = { ...obj };
                // 节点处添加marker
                let marker = new BMap.Marker(new BMap.Point(item[0], item[1]), {
                    icon: icon,
                });
                // marker上数字
                let label = new BMap.Label(index + 1, {
                    offset: new BMap.Size(16, 7),
                });
                label.setStyle({
                    background: "none",
                    border: "none",
                });
                marker.setLabel(label);
                this.map.addOverlay(marker);
                return new BMap.Point(item[0], item[1]);
            });
            // 折线上的箭头
            let sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                scale: 0.6, //图标缩放大小
                strokeColor: "#fff", //设置矢量图标的线填充颜色
                strokeWeight: "2", //设置线宽
            });
            let icons = new BMap.IconSequence(sy, "10", "30");

            //创建折线
            let lineLayer = new BMap.Polyline(data, {
                strokeColor: "rgba(55, 71, 226, 0.9)",
                strokeWeight: 10,
                strokeOpacity: 0.7,
                icons: [icons],
            });

            this.map.addOverlay(lineLayer); //绘制折线
            // 路书
            let lushu = new BMapLib.LuShu(this.map, data, {
                autoView: true, //是否开启自动视野调整，若是开启那么路书在运动过程当中会根据视野自动调整
                icon: new BMap.Icon(person, new BMap.Size(52, 36), {
                    anchor: new BMap.Size(27, 13),
                }),
                enableRotation: true, //是否设置marker随着道路的走向进行旋转
                speed: 10000,
                landmarkPois: [],
            });
            // 经纬度相同的点数组长度为1.加载一次路书动画
            if (Object.values(obj).length <= 1) {
                lushu.start();
                return;
            } else {
                lushu.start(() => {
                    lushu = null;
                    this.map.clearOverlays();
                    this.lushu();
                });
            }
        },
    },
};
</script>
