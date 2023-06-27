<template>
    <div class="swiper">
        <div class="img-wrap">
            <div class="arrow-left" @click="changeImg(-1)">
                <i class="el-icon-arrow-left" />
            </div>
            <div class="arrow-right" @click="changeImg(1)">
                <i class="el-icon-arrow-right" />
            </div>
            <img class="img" :src="curRecord.sourceFile" alt="">
        </div>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" :class="item.id===curRecord.id?'is-select':''" v-for="(item,index) in list" :key="index">
                    <img @click="onClickImg(item,index)" class="swiper-img" :src="item.file" alt="">
                </div>
            </div>
            <div class="swiper-button-prev"></div>
            <!--左箭头。如果放置在swiper外面，需要自定义样式。-->
            <div class="swiper-button-next" @click="onPagination(1)"></div>
            <!--右箭头。如果放置在swiper外面，需要自定义样式。-->
        </div>
    </div>
</template>
<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
export default {
    props: ["showIndex", "list"],
    watch: {
        showIndex: {
            handler(newData, old) {
                this.curRecord = this.list[newData];
            },
            immediate: true,
        },
    },
    mounted() {
        //创建swiper实例来实现轮播
        this.swiper = new Swiper(".swiper-container", {
            // loop: true,
            spaceBetween: 13,
            slidesPerView: 10,
            slidesPerGroup: 10,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
                disabledClass: "button-disabled",
            },
            observer: true,
        });
    },
    data() {
        return {
            curRecord: {}, //抓拍记录对象
        };
    },
    methods: {
        // 大图前进后退按钮
        changeImg(count) {
            this.$emit("step", count);
        },
        // 点击swiper上的小图
        onClickImg(e, index) {
            this.curRecord = this.list[index];
            this.$emit("cur-record-event", {
                data: e,
                index,
            });
        },
        // swiper前进后退按钮
        onPagination(page) {
            this.$emit("pagination");
        },
    },
};
</script>
<style lang="scss" scoped>
.swiper {
    height: calc(100% - 56px);
    .img-wrap {
        height: calc(100% - 132px);
        margin: 18px 0;
        width: 100%;
        position: relative;
        .arrow {
            position: absolute;
            background: #fff;
            width: 32px;
            height: 68px;
            top: calc(100% / 2 - 34px);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .arrow-left {
            @extend .arrow;
            left: 1px;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
        .arrow-right {
            @extend .arrow;
            right: 1px;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }
        .img {
            height: 100%;
            width: 100%;
            background: #f6f7f9;
            border: 1px solid #dbdee6;
            object-fit: contain;
        }
    }
    .swiper-container {
        border: 1px solid #dbdee6;
        max-width: 1256px;
        height: 113px;
        .swiper-slide {
            background: #f6f7f9;
            width: 110px;
            .swiper-img {
                width: 100%;
                height: 100%;
                cursor: pointer;
                object-fit: contain;
            }
            &:hover {
                border: 2px solid #2b59fc;
                box-sizing: border-box;
            }
        }
        .button-disabled {
            opacity: 1;
        }
        .is-select {
            border: 2px solid #2b59fc;
            box-sizing: border-box;
        }
        @mixin swiper-btn($url) {
            background: #eceef2;
            height: 100%;
            top: 0;
            margin-top: 0;
            background-image: url($url);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
        .swiper-button-prev {
            left: 0;
            @include swiper-btn("../../assets/images/arrowLeft.svg");
            &:hover {
                @include swiper-btn("../../assets/images/arrowLeftHover.svg");
            }
        }
        .swiper-button-next {
            right: 0;
            @include swiper-btn("../../assets/images/arrowRight.svg");
            &:hover {
                @include swiper-btn("../../assets/images/arrowRightHover.svg");
            }
        }
    }
}
</style>