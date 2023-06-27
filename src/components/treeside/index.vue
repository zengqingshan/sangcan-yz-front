<template>
    <div class="treeside_main">
        <div class="video_Scenes borderbottom" v-if="treeObj.showheader">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="实时" name="first"></el-tab-pane>
                <el-tab-pane label="轮巡" name="second"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="video_type " v-if="treeObj.showtype&&activeName!='second'">
            <el-radio-group v-model="radio4" size="mini" @change="changetype">
                <el-radio-button id="fix" v-for="item in ['一屏', '四屏', '九屏']" :label="item"></el-radio-button>
            </el-radio-group>
        </div>
        <div class="video_render borderbottom" v-if="$slots.video_render&&activeName!='second'">
            <slot name="video_render"></slot>
        </div>
        <div class="video_time boxborder" v-if="treeObj.videoback&&activeName!='second'">
            <el-date-picker size="mini" v-model="duration" :picker-options="pickerOptions" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div class="video_splitscreen boxborder" v-if="treeObj.showdifftype&&activeName!='second'">
            <div v-for="(item, i) in treeObj.treeProperty.type" @click="checkedtype(i, item)">
                <splitscreen :checked="checked == i" :icon='item.icon' :tooltip='item.tooltip' />
            </div>
        </div>
        <div class="video_tree boxborder" ref="showmodel">
            <el-input v-if="treeObj.cansearch&&activeName!='second'" v-model="filterText" size="small" clearable placeholder="请输入关键字进行过滤" suffix-icon="el-icon-search" style="marginBottom:12px"></el-input>
            <el-tree v-if="activeName!='second'" :indent="8" :check-strictly="treeObj.tag =='plant'?false:true" :data="data" :show-checkbox="treeObj.treeProperty.showcheked" :filter-node-method="filterNode" default-expand-all node-key="treeId" ref="tree" highlight-current :props="defaultProps" :expand-on-click-node="false" :render-content="treeObj.treeProperty.type[checked].treenode" :check-on-click-node='true' :default-checked-keys='defaultcheck' @check-change="handleTreeClick" @node-click="nodeclick">
            </el-tree>
            <div v-else>
                <div :ref="'load' + item.device_id" v-for="(item, key) in currentPlaydata" class="backvideo_card" :style="{borderColor:checkedkey == key?'#1F8DFF':'#8c8c8c'}">
                    <card :timeObj="{ item, key }" @play="play" :class="{'checklist':checkedkey == key}" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import debounce from "./debounce.js";
import request from "@/utils/request.js";
import card from "./component/card.vue";
import {
    pollingStrategyList,
    pollingStrategyDetails,
} from "@api/videorading/pollingStrategy.js";
import { potoutbase } from "@/utils/randomNumber.js";
import { realTimeVideo } from "@api/getVideo/index.js";
import moment from "moment";
import {
    group,
    platform,
    city,
    groupnode,
    platformnode,
    citynode,
    mediaGatewayTree,
    equipmentPlatformList,
    cascadedEquipment,
} from "@api/equipmentPplatform/platform.js";
const format = "YYYY-MM-DD";
export default {
    props: {
        treeObj: Object,
        playmodel: [String, Number],
    },
    data() {
        return {
            debounces:debounce(() => {
                this.checknodelist=this.checknodelistclone
                    this.checknodelist.findIndex((e) => e.id == 1) > 0
                        ? this.$emit(
                              "checknodelistdata",
                              this.checknodelist.splice(
                                  this.checknodelist.findIndex(
                                      (e) => e.id == 1
                                  ),
                                  1
                              )
                          )
                        : this.$emit("checknodelistdata", this.checknodelist);
            },200),
            timer:'',
            defaultcheck: [],
            checkedkey: -1,
            Measurementdetails: [],
            currentPlaydata: [],
            duration: [],
            canvasquantity: [{}],
            checknodelist: [],
            checknodelistclone: [],
            filterText: "",
            activeName: "first",
            radio4: "一屏",
            checked: 0,
            data: [],
            datavalue: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
        };
    },
    watch: {
        duration: {
            handler: function (val) {
                this.$store.commit("SET_TIME", val);
            },
        },
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        // checknodelist(val) {
            // this.getAllDeviceNodes(this.data,val)
        // },
        activeName: function (val) {
            this.$emit("update:playmodel", val == "second" ? 2 : 1);
            request.removePeddingRequest();
            if (val == "second") {
                this.getlist();
                this.checkedkey = -1;
            }
        },
    },
    components: {
        card,
        splitscreen: {
            props: {
                checked: Boolean,
                icon: [String],
                tooltip: [String],
            },
            render(h) {
                let { checked, icon, tooltip } = this.$props;
                return tooltip ? (
                    <el-tooltip
                        class="item"
                        effect="light"
                        content={tooltip}
                        placement="bottom"
                    >
                        <div
                            class={
                                checked
                                    ? "splitscreencheck"
                                    : "splitscreenuncheck"
                            }
                            style="border-radius:2px"
                        >
                            <i
                                class="iconfont"
                                style={checked ? "color:#fff" : "color:#8c8c8c"}
                            >
                                {icon}
                            </i>
                        </div>
                    </el-tooltip>
                ) : (
                    <div
                        class={
                            checked ? "splitscreencheck" : "splitscreenuncheck"
                        }
                        style="border-radius:2px"
                    >
                        <i
                            class="iconfont"
                            style={checked ? "color:#fff" : "color:#8c8c8c"}
                        >
                            {icon}
                        </i>
                    </div>
                );
            },
        },
    },
    mounted() {
        this.duration = [
            moment().subtract(3, "days").format(format),
            moment().format(format),
        ];
        setTimeout(() => {
            this.treeObj?.defaultload
                ? this.checkedtype(
                      this.treeObj?.defaultload,
                      this.treeObj.treeProperty.type[this.treeObj?.defaultload]
                  )
                : this.checkedtype(0, this.treeObj.treeProperty.type[0]);
        }, 200);
    },
    computed: {
        checkflag: function () {
            return (
                this.$refs.tree.getCheckedKeys().length >
                this.canvasquantity.length
            );
        },
        videoplayflag: function () {
            return this.checknodelist.length == 4;
        },
    },

    methods: {
        async play(val) {
            request.removePeddingRequest();
            let config = {
                id: val.item.id,
            };
            this.checkedkey = val.key;
            let a = "";
            await pollingStrategyDetails(config).then((res) => {
                a = res;
                this.Measurementdetails = Array(a.screenAmount).fill({});
                res.relList.forEach((e) => {
                    if (
                        this.Measurementdetails[e.screenNum - 1]
                            ?.data instanceof Array
                    ) {
                        this.$nextTick((_) => {
                            this.Measurementdetails[e.screenNum - 1].data.push({
                                name: e.deviceName,
                                id: e.deviceId,
                                serviceId: e.serviceId,
                            });
                            this.Measurementdetails[e.screenNum - 1].Intervals =
                                e.pollInterval;
                        });
                    } else {
                        this.Measurementdetails[e.screenNum - 1] = {
                            Intervals: "",
                            data: [],
                        };
                        this.$nextTick((_) => {
                            this.Measurementdetails[e.screenNum - 1].data.push({
                                name: e.deviceName,
                                id: e.deviceId,
                                serviceId: e.serviceId,
                            });
                            this.Measurementdetails[e.screenNum - 1].Intervals =
                                e.pollInterval;
                        });
                    }
                });
            });
            this.Measurementdetails.forEach((e) => {
                if (!"Intervals" in e) {
                    (e.Intervals = 0), (e.data = []);
                }
            });
            this.$emit("Measurementdetails", {
                screenAmount: a.screenAmount,
                Measurementdetails: this.Measurementdetails,
            });
        },
        getlist() {
            let config = {
                current: 1,
                name: "",
                pageSize: 100,
            };
            let tableref = this.$refs.showmodel;
            pollingStrategyList({
                data: config,
                loadobj: {
                    target: tableref,
                    lock: false,
                    text: "",
                },
            }).then((res) => {
                let { records } = res;
                this.currentPlaydata = records;
                records.forEach((e, i) => {
                    if (e.status) {
                        let obj = {
                            item: {
                                id: e.id,
                            },
                            key: i,
                        };
                        this.play(obj);
                    }
                });
            });
        },
        updatetree() {
            this.checkedtype(
                this.checked,
                this.treeObj.treeProperty.type[this.checked]
            );
        },
        setinitcheck(e) {
            this.checknodelist = e;
        },
        nodeclick(data, node, tree) {
            let config = {
                data,
                node,
                tree,
            };
            this.$emit("nodeclickData", config);
            // if(this.treeObj.treeProperty.showcheked&&!data.disabled) {
            //      this.$refs.tree.setChecked(data.treeId,this.$refs.tree.getCheckedKeys().indexOf(data.treeId) != -1?false:true)
            // }
        },
        getAllDeviceNodes(checklist, nodeata = this.data) {
            let a = [];
            let listdata = [];
            let duringfun = (data) => {
                data.forEach((e) => {
                    if (e.parentId != "-1") {
                        a.push(e);
                    }
                    if (e.children) {
                        duringfun(e.children);
                        return;
                    }
                });
            };
            duringfun(nodeata);
            a.forEach((value) => {
                checklist.forEach((e) => {
                    if (value.serviceId == e.serviceId) {
                        listdata.push(value.treeId);
                    }
                });
            });
            this.$nextTick((_) => {
                this.defaultcheck = listdata;
                // this.$refs.tree.setCheckedNodes(listdata);
            });
        },
        handleTreeClick(data, check, bloeen) {
               if (check) {
                if (!this.treeObj.showtype) {
                    if (this.treeObj.videoback) {
                        if (!this.videoplayflag) {
                            this.checknodelist.push(Object.assign({}, data));
                            this.checknodelist.forEach(
                                (value, index, array) => {
                                    this.canvasquantity[index] = value;
                                }
                            );
                            this.$nextTick((_) => {
                                this.$emit("checkdata", this.canvasquantity);
                            });
                        } else {
                            this.$message({
                                message: "分屏已占满，无法选择更多设备",
                                type: "error",
                            });
                            this.$nextTick((_) => {
                                this.Uncheck(data);
                            });
                        }
                        return;
                    }
                    if (
                        this.checknodelistclone.findIndex(
                            (value) => value.serviceId == data.serviceId
                        ) == -1
                    ) {
                        this.checknodelistclone.push(data);
                    }
                    // 优化
                    this.debounces()
                    // this.checknodelist.findIndex((e) => e.id == 1) > 0
                    //     ? this.$emit(
                    //           "checknodelistdata",
                    //           this.checknodelist.splice(
                    //               this.checknodelist.findIndex(
                    //                   (e) => e.id == 1
                    //               ),
                    //               1
                    //           )
                    //       )
                    //     : this.$emit("checknodelistdata", this.checknodelist);
                    if (this.treeObj.canvideo) {
                        this.getrealvideo(data).then((res) => {
                            this.$nextTick((_) => {
                                this.$emit("checkdata", [res]);
                            });
                        });
                    }
                    return;
                }
                if (!this.checkflag) {
                    if (data.status) {
                        this.getrealvideo(data).then((res) => {
                            this.checknodelist.push(
                                Object.assign({}, data, res)
                            );
                            this.checknodelist.forEach(
                                (value, index, array) => {
                                    this.canvasquantity[index] = value;
                                }
                            );
                            this.$nextTick((_) => {
                                this.$emit("checkdata", this.canvasquantity);
                            });
                        });
                    }
                } else {
                    this.$message({
                        message: "达到展示上限",
                        type: "error",
                    });
                    this.$nextTick((_) => {
                        // this.$refs.tree.setChecked(data, false);
                        this.Uncheck(data);
                    });
                }
            } else {
                request.removePeddingRequest();
                if (
                    this.checknodelist.findIndex((e) => e.id == data.id) != -1
                ) {
                    this.checknodelist.splice(
                        this.checknodelist.findIndex((e) => e.id == data.id),
                        1
                    );
                     this.debounces()
                    // this.$emit("checknodelistdata", this.checknodelist);
                    this.treeObj.videoback
                        ? this.canvasquantity.length == 1
                            ? this.canvasquantity.splice(
                                  this.canvasquantity.findIndex(
                                      (e) => e.id == data.id
                                  ),
                                  1,
                                  {}
                              )
                            : this.canvasquantity.splice(
                                  this.canvasquantity.findIndex(
                                      (e) => e.id == data.id
                                  ),
                                  1
                              )
                        : this.canvasquantity.splice(
                              this.canvasquantity.findIndex(
                                  (e) => e.id == data.id
                              ),
                              1,
                              {}
                          );
                    this.$emit("checkdata", this.canvasquantity);
                }
            }

        },
        Uncheck(data, flag = false) {
            // this.$refs.tree.setChecked(data?.relId?data.relId:data, flag);
            this.$refs.tree.setChecked(data, flag);
        },
        getrealvideo({ serviceId, platformServiceId }) {
            let config = {
                deviceId: serviceId,
                platformServiceId,
                tag: potoutbase(),
            };
            return new Promise((resolve, reject) => {
                realTimeVideo(config).then((res) => {
                    resolve(res);
                });
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        duringdata(data, type) {
            let a = (data, parent = null) => {
                data.forEach((value, index, array) => {
                    value.checktype = type;
                    if (value.children) {
                        this.treeObj.tag == "device"
                            ? ""
                            : (value.disabled = true);
                        if (parent) {
                            a(value.children, value);
                            value.parent = true;
                        } else {
                            a(value.children, value);
                        }
                    } else {
                        if (!this.treeObj.showtype) {
                            if (!value.isDevice) {
                                this.treeObj.tag == "device"
                                    ? ""
                                    : (value.disabled = true);
                            }
                        } else {
                            if (!value.isDevice || !value.status) {
                                this.treeObj.tag == "playback"
                                    ? ""
                                    : (value.disabled = true);
                            }
                        }
                    }
                });
            };
            if (this.treeObj.tag == "plant") {
                
            } else {
                a(data);
            }
            return data;
        },
        checkedtype(i, item) {
            this.$emit("changetype");
            //  request.removePeddingRequest()
            this.filterText = "";
            this.checked = i;
            let checkparams = item?.params ?? {};
            let checktype;
            let checkapi;
            switch (item.api) {
                case "city":
                    checkapi = city;
                    checktype = "city";
                    break;
                case "group":
                    checktype = "group";
                    checkapi = group;
                    break;
                case "platform":
                    checktype = "platform";
                    checkapi = platform;
                    break;
                case "groupnode":
                    checktype = "groupnode";
                    checkapi = groupnode;
                    break;
                case "platformnode":
                    checktype = "platformnode";
                    checkapi = platformnode;
                    break;
                case "citynode":
                    checktype = "citynode";
                    checkapi = citynode;
                    break;
                case "mediaGatewayTree":
                    checktype = "mediaGatewayTree";
                    checkapi = mediaGatewayTree;
                    break;
                case "equipmentPlatformList":
                    checktype = "equipmentPlatformList";
                    checkapi = equipmentPlatformList;
                    break;
                case "cascadedEquipment":
                    checktype = "cascadedEquipment";
                    checkapi = cascadedEquipment;
                    break;
            }
            checkapi(checkparams)
                .then((res) => {
                    this.data = this.duringdata(res, checktype);
                    this.getAllDeviceNodes(this.checknodelist, this.data);
                })
                .catch((rej) => {
                    this.data = [];
                });
            if (this.treeObj.showtype) {
                this.checknodelist = [];
            }
            if (this.treeObj.videoback) {
                this.checknodelist = [];
                this.canvasquantity = [{}];
            }
        },
        handleClick() {},
        changetype(e) {
            let Obj = "";
            const vs = document.querySelector('#fix')
            switch (e) {
                case "一屏":
                    Obj = [{}];
                    vs.style.height = '800px'
                    break;
                case "四屏":
                    Obj = [{}, {}, {}, {}];
                    break;
                case "九屏":
                    Obj = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
                    break;
                default:
                    break;
            }
            this.canvasquantity = Obj;
            this.$emit("checktype", Obj);
            this.checknodelist = [];
            this.$refs.tree.setCheckedNodes([]);
        },
    },
    created() {
        // this.debounces()
    },
};
</script>
<style lang="scss" scoped>
.treeside_main {
    height: calc(100% - 22px);
    display: flex;
    flex-direction: column;
    margin: 10px;
    background: #fff;
    ::v-deep .treenodestyle {
        .iconfont {
            color: #8c8c8c;
        }
    }

    .video_type {
        flex: 0 0 40px;
        padding: 12px 0 0 0;
        margin-bottom: -1px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .video_render {
        flex: 0 0 40px;
        margin-bottom: -1px;
        display: flex;
        align-items: center;
    }
    .video_splitscreen {
        padding: 12px 0 0 12px;
        flex: 0 0 40px;
        margin-bottom: -1px;
        display: flex;
        align-items: center;
        // justify-content: center;
    }
    .video_time {
        flex: 0 0 40px;
        margin-bottom: -1px;
        display: flex;
        align-items: center;
        padding: 0 2px;
        // justify-content: center;
    }
    .video_Scenes {
        flex: 0 0 39px;
        margin-bottom: -1px;
        display: flex;
        align-items: center;
        // justify-content: center;
        padding: 0 10px;
        ::v-deep .el-tabs__header {
            margin: 0;
        }
    }
    .video_tree {
        overflow: auto;
        padding: 12px 10px;
        flex: 1;
        .backvideo_card {
            width: 100%;
            height: 32px;
            margin-bottom: 16px;
            padding: 8px 6px 6px 6px;
            border: 1px solid transparent;
            .checklist {
                color: #1f8dff;
                border-color: #1f8dff;
            }
        }
    }
}
.boxborder {
    border: 1px solid transparent;
}
.borderbottom {
    border-bottom: 1px solid #dfe4ed;
}
</style>
<style lang="scss" scoped>
.splitscreencheck {
    height: 30px;
    width: 30px;
    border: 1px solid #82adfe;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    cursor: pointer;
    background: #1f8dff;
}
.splitscreenuncheck {
    height: 30px;
    width: 30px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    cursor: pointer;
}
</style>
<style lang="scss" scoped>
</style>
