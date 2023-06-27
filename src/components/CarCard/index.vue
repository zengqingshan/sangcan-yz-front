<template>
    <div :class="`card-container ${$listeners.click ? 'click' : ''}`" :style="{flex: `0 0 ${cardWidth}px`}" @click="cardClick">
        <el-checkbox v-if="!hiddenBox" @click.stop.native="()=>{}" @change.stop.native="check" :label="''" style="position: absolute;right: 10px;top: 10px"></el-checkbox>
        <div class="img-wrap">
            <img class="img" :src="showFile?record[showFile]:record.sourceFile" alt="">
        </div>
        <div class="label-container">
            <div v-for="(item, index) in labelList" :key="index">
                <renderCom v-if="item.render" :item="item" :record="record" :render="item.render"></renderCom>
                <div v-else class="label-content">
                    <span class="label-name">{{item.labelName}}</span>
                    <renderCom v-if="item.renderValue" :item="item" :record="record" :render="item.renderValue"></renderCom>
                    <span v-else-if="item.dictKey" class="label-name">{{renderDict(item.dictKey, record[item.labelKey])}}</span>
                    <span v-else class="label-value" :style="`max-width:${cardWidth-100}px`">{{record[item.labelKey]}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: ["labelList", "record", "hiddenBox", "showFile", "cardWidth"],
    computed: {
        ...mapGetters({
            dict: "dict",
        }),
    },
    components: {
        renderCom: {
            functional: true,
            render(h, context) {
                return context.props.render(h, { ...context.props });
            },
        },
    },
    methods: {
        renderDict(key, value) {
            return this.dict[key].find((item) => item.dictKey === value)
                ?.dictValue;
        },
        check(e) {
            this.$emit("change", e.target.checked, this.record);
        },
        cardClick() {
            this.$emit("click", this.record);
        },
    },
};
</script>

<style scoped lang="scss">
.card-container {
    // width: 260px;
    position: relative;
    border: 1px solid #e5e6e8;
    border-radius: 4px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    margin-right: 15px;
    margin-bottom: 20px;
    &.click {
        cursor: pointer;
    }
    &:hover {
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
    }
    .img-wrap {
        display: flex;
        height: 160px;
        background: #f6f7fa;
        border-bottom: 1px solid #e5e6e8;
        .img {
            object-fit: contain;
            width: 100%;
        }
    }
    .label-container {
        padding: 20px;
        font-size: 14px;
        .label-content {
            display: flex;
            justify-content: space-between;
            line-height: 26px;
            .label-name {
                color: #8c8c8c;
            }
            .label-value {
                color: #595959;
                max-width: 160px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
