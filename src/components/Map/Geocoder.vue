<template>
    <div class="search-wrap">
        <el-input clearable placeholder="请输入内容" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>

        <!-- 检索结果 -->
        <div v-show="showResultFlag" class="search-result">
            <div v-for="(item, index) in searchResult" class="item" :key="index" @click="handleSelect(item)">
                <div class="title">{{ item.title }}</div>
                <div class="address">{{ item.address }}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["map"],
    mounted() {
        this.map.addEventListener("click", this.getMarker);
    },
    watch: {
        keyword() {
            if (!this.keyword) {
                this.map.getOverlays().forEach(item=>{
                    // 删除地图中type!=current的覆盖物
                    if(item.type!=='current'){
                        this.map.removeOverlay(item)
                    }
                })
                this.showResultFlag = false;
            }
        },
    },
    data() {
        return {
            marker: null,
            label: null,
            keyword: "",
            searchResult: [], // 检索结果列表
            showResultFlag: false,
        };
    },
    methods: {
        Intercept(str) {
            let reg = /([0-9]\.[0-9]{6})[0-9]*/
            return JSON.stringify(str).replace(reg, "$1")*1
        },
        handleSearch() {
            this.showResultFlag = true;
            // console.log("111111111", defaultInfo);
            let local = new BMap.LocalSearch(this.map, {
                renderOptions: {
                    map: this.map,
                    selectFirstResult: false,
                },
                // 检索完成后的回调函数
                onSearchComplete: (res) => {
                    if (res && res.Cr) {
                        // 模糊搜索到的位置
                        this.searchResult = [...res.Cr];
                    }
                },
            });
            // 根据检索词发起检索
            local.search(this.keyword);
        },
        handleSelect(item) {
            // console.log("item", item);
            let title = item.title;
            let { lng, lat } = item.marker.point;
            // console.log("lng,lat", lng, lat);
            let point = new BMap.Point(lng, lat);
            // 用户地址解析
            let geoc = new BMap.Geocoder();
            // 对指定的坐标点进行反地址解析。如果解析成功，则回调函数的参数为GeocoderResult对象，否则回调函数的参数为null
            geoc.getLocation(point, (res) => {
                // console.log('res111', res)
                let addString =
                    res.addressComponents.province +
                    res.addressComponents.city +
                    res.addressComponents.district +
                    title;
                // console.log("addString", addString);
                this.showResultFlag = false;
                this.keyword = addString;
                this.map.clearOverlays(); //清除地图上所有覆盖物
                this.getMarker(item.marker);
            });
        },
        getMarker(e) {
            // 收起下拉菜单
            this.showResultFlag = false
            // marker有值清除所有marker
            this.map.clearOverlays();
            let point = new BMap.Point(e.point.lng, e.point.lat);
            // 创建点标记
            this.marker = new BMap.Marker(point, { enableDragging: true });
            this.marker.type='current'
            // 监听marker dragging事件
            this.marker.addEventListener("dragging", (item) => {
                this.map.getOverlays().forEach((e) => {
                    // 删除地图label覆盖物
                    if (e.toString() === "[object Label]") {
                        this.map.removeOverlay(e);
                    }
                });
                // 根据拖拽位置重新生成label
                this.getLabel(this.Intercept(item.point.lng), this.Intercept(item.point.lat));
                this.$emit("click-marker", [this.Intercept(item.point.lng), this.Intercept(item.point.lat)]);

            });
            this.map.addOverlay(this.marker, {}); // 将标注添加到地图中
            this.getLabel(this.Intercept(e.point.lng), this.Intercept(e.point.lat));
            this.$emit('click-marker',[this.Intercept(e.point.lng), this.Intercept(e.point.lat)])
        },
        getLabel(lng, lat) {
            this.label = new BMap.Label(`${lng}, ${lat}`, {
                // 创建文本标注
                position: new BMap.Point(lng, lat), // 设置标注的地理位置
                offset: new BMap.Size(0, -60),
            });
            this.label.setStyle({
                color: "#000",
                fontSize: "10px",
                fontWeight: "bold",
                border: "none",
                borderRadius: "5px",
                fontFamily: "微软雅黑",
                padding: "10px",
            });
            this.label.type='current'
            this.map.addOverlay(this.label); // 将标注添加到地图中
        },
    },
};
</script>
<style lang="scss" scoped>
.search-wrap {
    position: absolute;
    top: 60px;
    left: 20px;
    width: 320px;
    .search-result {
        background-color: #fff;
        height: 200px;
        overflow: auto;
        .item {
            border-bottom: 1px solid #ebeef2;
            padding: 5px 10px;
            &:last-child {
                border-bottom: none;
            }
            .title {
                font-weight: 600;
                color: #313233;
            }
            .address {
                font-weight: 400;
                color: #9ca5b3;
            }
        }
    }
}
</style>