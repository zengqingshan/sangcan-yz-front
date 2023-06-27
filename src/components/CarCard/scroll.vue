<template>
    <div v-infinite-scroll="load" :infinite-scroll-disabled="finish" id="scroll-container" v-if="list && list.length" ref="scroll" class="scroll-container infinite-list" :style="{overflowY:'auto',...styles}">
        <car-card :showFile="showFile" :cardWidth="cardWidth" :hiddenBox="hiddenBox" v-for="(record,index) in list" :key="record.id + Math.random()" :labelList="labelList" :record="record" @click="e=>click(e,index)" @change="selectChange" />
        <template v-if="emptyBlock">
            <div :style="{flex: `0 0 ${cardWidth}px`}" v-for="(i,k) in emptyBlock" :key="k"></div>
        </template>
    </div>
    <el-empty class="empty" v-else description="暂无数据"></el-empty>
</template>

<script>
import CarCard from "./index";
export default {
    name: "index",
    components: { CarCard },
    data() {
        return {
            emptyBlock: 0,
            // stateQueryParams: {},
            selectedCard: [],
            id: 0,
        };
    },
    watch: {
        list: {
            deep: true,
            handler(newVal, old) {
                this.$nextTick(() => {
                    if (this.$refs.scroll) {
                        const len = parseInt(
                            this.$refs.scroll.clientWidth /
                                (this.cardWidth + 15)
                        );
                        if (!(newVal.length % len)) {
                            this.emptyBlock = 0;
                            return;
                        }
                        if (newVal) {
                            this.emptyBlock = len - (newVal.length % len);
                        } else {
                            this.emptyBlock = len;
                        }
                    }
                    const container = this.$refs.scroll;
                    if (
                        container &&
                        container.scrollHeight > container.clientHeight
                    ) {
                        return;
                    }
                    this.load();
                });
            },
            immediate: true,
        },
        queryParams(val) {
            this.stateQueryParams = {
                ...val,
            };
        },
    },
    computed: {
        stateQueryParams: {
            get() {
                return { ...this.queryParams };
            },
            set() {},
        },
    },
    props: {
        finish: {
            type: Boolean,
            default: false,
        },
        showFile: {
            type: String,
            default: "",
        },
        styles: {
            type: Object,
            default: function () {
                return { height: "360px" };
            },
        },
        labelList: {
            // 图片下面标签名
            type: Array,
            default: [],
        },
        list: {
            // 卡片列表
            type: Array,
            default: [],
        },
        queryParams: {
            type: Object,
            default: function () {
                return {};
            },
        },
        hiddenBox: {
            type: Boolean,
            default: false,
        },
        cardWidth: {
            type: Number,
            default: 260,
        },
    },
    methods: {
        selectChange(checked, item) {
            if (checked) {
                this.selectedCard.push(item);
            } else {
                this.selectedCard.splice(
                    this.selectedCard.findIndex((it) => it.id === item.id),
                    1
                );
            }
        },
        getSelectedCard() {
            return this.selectedCard;
        },
        click(e, index) {
            if (!this.hiddenBox) {
                return;
            }
            e.index = index;
            this.$emit("crash", e);
        },
        load() {
            if (this.finish && this.stateQueryParams.current !== 1) {
                console.log("finish");
                return;
            }
            this.$emit("load", this.stateQueryParams);
            this.stateQueryParams.current++;
        },
    },
};
</script>

<style scoped lang="scss">
.scroll-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: start;
    padding: 0px;
    > div {
        //flex: 0 0 260px;
        margin-right: 15px;
    }
}
.empty {
    flex: 1;
}
</style>
