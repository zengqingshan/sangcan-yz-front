<template>
    <div class="project-type">
        <span class="label-name">{{label}}</span>
        <div class="icon" :style="{background:getIcon(item).sty,border:`1px solid ${getIcon(item).border}`}">
            <i class="iconfont" :class="getIcon(item).cls" :style="{color:getIcon(item).color}"></i>
            <div v-if="type==='vehicle'" class="number" :style="{color:getIcon(item).color}">
                {{item.number?item.number:'未识别'}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["item", "label","type"],
    data() {
        return {};
    },
    methods: {
        getIcon(item) {
            switch (this.type) {
                case "face":
                    return { cls: "icon-face", sty: "#2B59FC", color: "#fff" };
                case "person":
                    return { cls: "icon-body", sty: "#2B59FC", color: "#fff" };
                case "nonVehicle":
                    return { cls: "icon-bick", sty: "#2B59FC", color: "#fff" };
                case "vehicle":
                    return {
                        cls: "icon-vehicle",
                        sty: this.getColor(item.plateColor)[0],
                        color: this.getColor(item.plateColor)[1],
                        border: this.getColor(item.plateColor)[2],
                    };

                default:
                    return 3;
            }
        },
        // 车牌颜色
        getColor(plateColor) {
            switch (plateColor) {
                // 绿色
                case "1":
                    return ["#63CD7B", "#000000", "#63CD7B", "newContainer"];
                    // 黄色
                case "2":
                    return ["#FFBA01", "#000000", "#FFBA01", "newContainer"];
                    // 黑色
                case "3":
                    return ["#000000", "#FFFFFF", "#000000", "container"];
                    // 白色
                case "4":
                    return ["#FFFFFF", "#000000", "#000000", "newContainer"];
                    // 渐变绿
                case "5":
                    return [
                        "linear-gradient(#ffffff,#63CD7B)",
                        "#000000",
                        "linear-gradient(#ffffff,#63CD7B)",
                        "container",
                    ];
                    // 黄绿色
                case "6":
                    return [
                        "linear-gradient(to right, #FFBA01 31%, #63CD7B 0)",
                        "#000000",
                        "linear-gradient(to right, #FFBA01 31%, #63CD7B 0)",
                        "container",
                    ];
                    // 灰色
                case "":
                    return ["#F2F3F5", "#909399", "#F2F3F5", "newContainer"];
                    // 蓝色
                default:
                    return ["#0060E6", "#FFFFFF", "#0060E6", "container"];
            }
        },
    },
};
</script>
<style scoped lang="scss">
.project-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label-name {
        color: #8c8c8c;
    }
    .icon {
        padding: 5px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        .iconfont {
            font-size: 25px;
        }
        .number {
            padding-left: 16px;
            font-weight: 400;
            font-size: 14px;
        }
    }
}
</style>