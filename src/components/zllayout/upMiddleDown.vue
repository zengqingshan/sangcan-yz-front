<template>
    <div class="upMiddleDown_main">
        <div class="upMiddleDown_header" v-if="$slots.upMiddleDown_header">
            <div class="upMiddleDown_header_inner">
                <div class="upMiddleDown_header_inner_from" >
                    <el-form label-position="left" :inline="true" @submit.native.prevent>
                        <slot name="upMiddleDown_header" />
                    </el-form>
                </div>
                <div class="upMiddleDown_header_inner_btn" v-if="btnPositon == 'inner'">
                    <div style="transform: translateX(-10px)">
                        <slot name="upMiddleDown_btn" />
                    </div>
                    <el-button size="small" @click="search">查询</el-button>
                    <el-button  size="small" @click="reset">重置</el-button>
                </div>
            </div>
            <div class="upMiddleDown_header_btn" v-if="btnPositon != 'inner'">
                <div style="marginRight: 10px">
                    <slot name="upMiddleDown_btn" />
                </div>
                <el-button size="small" @click="search">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </div>
        </div>
        <div class="upMiddleDown_conter">
            <slot />
        </div>
        <div class="upMiddleDown_footer" v-if="hasfooter">
            <slot name="upMiddleDown_footer" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        hasfooter: {
            type: Boolean,
            default: true,
        },
        btnPositon: {
            type: String,
            default: "outside",
        },
    },
    data() {
        return {};
    },

    components: {},

    computed: {},

    methods: {
        search() {
            this.$emit("search");
        },
        reset() {
            this.$emit("reset");
        },
    },
};
</script>
<style lang="scss" scoped>
.upMiddleDown_main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    ::v-deep .el-form-item {
        margin: 0;
    }
    .upMiddleDown_header {
        margin-bottom: 16px;
        padding: 0px 0px 10px 0px;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #e6ebf5;
        .upMiddleDown_header_btn {
            flex: 0 0 50px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .upMiddleDown_header_inner {
            flex: 0 0 40px;
            // background: #f8f8f9;
            height: 100%;
            display: flex;
            align-items: center;
            display: flex;
            justify-content: space-between;
            .upMiddleDown_header_inner_from {
                flex: 2;
            }
            .upMiddleDown_header_inner_btn {
                flex: 1;
                display: flex;
                justify-content: flex-end;
            }
        }
    }
    .upMiddleDown_conter {
        flex: 1 1 0;
        position: relative;
        overflow: auto;
        // padding-top: 10px;
    }
    .upMiddleDown_footer {
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        // border-top: 1px solid #e6ebf5;
    }
}
</style>
<style lang="scss" scoped>
</style>
