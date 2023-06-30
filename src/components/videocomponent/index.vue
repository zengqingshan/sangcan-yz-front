<template>
    <div class="wasmvidemain" style="object-fit: fill; height: 100%">
        <div class="topbar" style="object-fit: fill" v-if="isplback">
            <div class="topbar_detail">{{ obj.name }}</div>
            <div class="topbar_console">
                <div class="topbar_choose" @click="checkchose">
                    {{
            currentPlay
              ?currentPlay.length? "选集" + nowclick + "/" + currentPlay.length:'无历史记录'
              : "无历史记录"
          }}
                </div>
            </div>
        </div>
        <div :style="{ 'object-fit': 'fill' }" class="videoclass" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <div :id="Videotests" ref="Playtemplate"></div>
            <!-- <transition name="el-fade-in-linear"> -->
            <el-collapse-transition>
                <div class="PTZ_main" v-show="showPTZ && isptz">
                    <div v-for="item in operationButton" class="PTZ_btn" @click="clickFunction(item.imglist)">
                        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                            <img style="height: 16px" :src="imageList[item.imglist]" alt="" />
                        </el-tooltip>
                    </div>
                    <!-- <div class="PTZ">
            <div v-for="item in PTZoperation" :class="item.class">
              <img
                :src="imageList[item.imglist]"
                alt=""
                style="height10px;width:10px"
              />
            </div>
          </div> -->
                </div>
            </el-collapse-transition>
            <!-- </transition> -->
        </div>
        <div class="footer" v-if="isplback && hasstream">
            <el-slider @input="Realtimechange" @change="scrolbarchange" size="mini" style="width: 100%" :max="slidermax" :format-tooltip="formatTooltip" v-model="value1" :step="1">
            </el-slider>
        </div>
        <el-drawer :append-to-body="true" title="视频回放" :visible.sync="drawer" direction="rtl" size="12%">
            <div class="drawer_main">
                <el-scrollbar style="height: 100%">
                    <div :ref="'load' + item.device_id" v-for="(item, key) in currentPlay" class="backvideo_card">
                        <card :timeObj="{ item, key }" @play="play" @videoback='videoback' />
                    </div>
                </el-scrollbar>
            </div>
        </el-drawer>
    </div>
</template>
<script>
import dateFormat from "@/utils/date.js";
import { potoutbase, secondToDate } from "@/utils/randomNumber.js";
import card from "./component/card.vue";
import { mapGetters } from "vuex";

import fixWebm from "fix-webm-duration";
import { saveAs } from "file-saver";
import { potoutbase64 } from "@/utils/index.js";
import { setH265PlayerCover } from "./setH265PlayerCover";
import { recStart, recStop } from "./audio";

// let Circulation = this.Circulationbody();
let Circulation = (_) => {
    let count = 0;
    return (_) => {
        return {
            addcount: () => {
                count += 1;
            },
            getcount: () => {
                return count;
            },
            resetcount: () => {
                count = 0;
            },
        };
    };
};
let Circulations = Circulation();
export default {
    props: {
        isptz: {
            type: Boolean,
            default: false,
        },
        isplback: {
            type: Boolean,
            default: false,
        },
        Encoding: {
            type: String,
            default: "264",
        },
        obj: Object,
        playParam:String,
        id:Number,
        playback: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            intervalspacename: "",
            realtime: 0,
            nowTime: 0,
            slidermax: "",
            holdvideconfig: {},
            hasstream: false,
            value1: 0,
            nowclick: "1",
            currentPlay: "",
            durationtime: [],
            drawer: false,
            PTZoperation: [
                {
                    name: "top",
                    class: "PTZ_top",
                    imglist: "1",
                },
                {
                    name: "left",
                    class: "PTZ_left",
                    imglist: "3",
                },
                {
                    name: "right",
                    class: "PTZ_right",
                    imglist: "5",
                },
                {
                    name: "bottom",
                    class: "PTZ_bottom",
                    imglist: "7",
                },
            ],
            operationButton: [
                {
                    name: "喊话",
                    imglist: "17",
                },
                {
                    name: "拍照",
                    imglist: "15",
                },
                {
                    name: "录像",
                    imglist: "16",
                },
                {
                    name: "云台",
                    imglist: "14",
                },
                // {
                //   name: "录像",
                //   imglist: "13",
                // },
                // {
                //   name: "录像",
                //   imglist: "12",
                // },
                // {
                //   name: "录像",
                //   imglist: "11",
                // },
                // {
                //   name: "录像",
                //   imglist: "10",
                // },
                // {
                //   name: "录像",
                //   imglist: "9",
                // },
            ],
            startTime: "",
            videogather: [],
            code: 1,
            stream: "",
            rafId: "",
            recorder: "",
            Videotests: "",
            showPTZ: false,
            player: "",
            defaultOpts: {
                cbUserPtr: this,
                decodeType: "auto",
                // decodeType: "soft",
                HideKbs: true,
                openAudio: 0,
                BigPlay: false,
                Height: true,
                alt:''
            },
            imageList: [
                require("../../assets/video/left-top.png"),
                require("../../assets/video/up.png"),
                require("../../assets/video/right-top.png"),
                require("../../assets/video/left.png"),
                require("../../assets/video/huiyan.png"),
                require("../../assets/video/right.png"),
                require("../../assets/video/left-bottom.png"),
                require("../../assets/video/down.png"),
                require("../../assets/video/right-bottom.png"),
                require("../../assets/video/magnifier_minus.png"),
                require("../../assets/video/magnifier_plus.png"),
                require("../../assets/video/aperture-small.png"),
                require("../../assets/video/aperture-large.png"),
                require("../../assets/video/focus-small.png"),
                require("../../assets/video/focus-large.png"),
                require("../../assets/video/旧式相机,相机,截图,截屏,拍照.png"),
                require("../../assets/video/录屏.png"),
                require("../../assets/video/voice.png"),
                require("../../assets/video/voiceDisable.png"),
            ],
        };
    },

    components: {
        card,
    },

    computed: {
        ...mapGetters(["periodtime"]),
    },
    mounted() {
		
        this.Videotests = "videoId" + "_" + potoutbase64();
        this.$nextTick((_) => {
            this.testwasmvideo().then((res) => {
                // setTimeout(() => {
                //   this.Cyclicexecution();
                // }, 10000);
            });
        });
        this.$nextTick((_) => {
			
            if (this.isplback && "serviceId" in this.obj) {
                this.getvideobacklist(this.obj);
            }
            if (this.playback && "serviceId" in this.obj) {
                this.play(this.obj);
            }
    
        });
        let playEvent = 'huiyanPlay' + this.id
        let stopEvent = 'huiyanStop' + this.id
        
        this.$bus.$on(playEvent, (playParam) => {
            
            this.playNew(playParam)
        })
        this.$bus.$on(stopEvent, () => {
            this.destroyvideo()
        })
    },
    methods: {
        propaganda() {
            const { operationButton } = this;
            console.log(operationButton);
            if (operationButton[0].imglist === "17") {
                operationButton.splice(0, 1, {
                    imglist: "18",
                    name: "取消喊话",
                });
                recStart(this.obj.deviceId);
            } else {
                operationButton.splice(0, 1, {
                    imglist: "17",
                    name: "喊话",
                });
                recStop(this.obj.deviceId);
                // setTimeout(()=>{
                // },2000)
            }
        },
        goPTZstate() {
            this.$router.push({
                name: "PTZstate",
                query: this.obj,
            });
        },
        intervertime(init = 0) {
            clearInterval(this.intervalspacename);
            this.intervalspacename = setInterval(() => {
                this.value1 += 1;
            }, 1000);
        },
        formatTooltip() {
            return dateFormat(
                "HH:MM:SS",
                new Date(
                    this.holdvideconfig.item.start_time + this.realtime * 1000
                )
            );
        },
        Realtimechange(e) {
            this.realtime = e;
        },
        scrolbarchange(e) {
            console.log(this.nowTime, e);
            this.nowTime = e;
            let config = {
                deviceId: this.holdvideconfig.deviceId,
                oper: "play",
                range: e,
                scale: "1.0",
                tag: this.holdvideconfig.tag,
            };
            playbackOper(config).then((res) => {});
        },
        playNew(val) {
          
                
                this.destroyvideo();
                this.testwasmvideoNew('',val).then((res) => {
                    let videoplay = val;
                    this.player.play(
                        `${videoplay}`,
                        1,
                        0
                    );
                    this.hasstream = videoplay ? true : false;
                    this.value1 = 0;
                    this.intervertime();
                });
    
        },
        play(e) {
            this.nowclick = e.key + 1;
            let config = {
                deviceId: e.item.device_id,
                endTime: e.end,
                startTime: e.start,
                tag: potoutbase(),
            };
            getVideoBackstrem({
                query: config,
                loadobj: {
                    target: this.$refs["load" + e.item.device_id]
                        ? this.$refs["load" + e.item.device_id][e.key]
                        : null,
                    lock: false,
                    text: "",
                },
            }).then((res) => {
                this.holdvideconfig = Object.assign({}, config, e);
                let { data: val } = res;
                this.destroyvideo();
                this.testwasmvideo().then((res) => {
                    let videoplay = val.http_flv_wan;
                    // this.player.play(`${videoplay}?token=${"extract"}`, 1, 0);
                    this.player.play(
                        `${videoplay}?token=${val.playtoken}`,
                        1,
                        0
                    );
                    this.hasstream = videoplay ? true : false;
                    this.value1 = 0;
                    this.intervertime();
                });
            });
        },
        videoback(e) {
            console.log(e);
            let config = {
                devCode: e.item.device_id,
                endTime: e.end,
                startTime: e.start,
                tag: potoutbase(),
            };
            pushvideoplayback({
                query: config,
                loadobj: {
                    target: this.$refs["load" + e.item.device_id][e.key],
                    lock: false,
                    text: "",
                },
            }).then((res) => {
                this.$message({
                    message: res ? "视频已推送到下载列表" : "视频下载失败",
                    type: res ? "success" : "warning",
                });
            });
        },
        checkchose() {
            if (this.currentPlay && this.currentPlay.length) {
                this.drawer = true;
            }
        },
        destroyvideo() {
            if (this.player) {
                this.player.destroy();
                this.hasstream = false;
            }
        },
        Cyclicexecution() {
            let { currentH5Status } = this.player;
            if (!currentH5Status) {
                if (Circulations().getcount() > 2) {
                    Circulations().resetcount();
                    this.player.destroy();
                    this.player = new WasmPlayer(
                        null,
                        this.Videotests,
                        this.callback,
                        this.defaultOpts
                    );
                    return;
                }
                setTimeout(() => {
                    Circulations().addcount();
                    this.Cyclicexecution();
                }, 5000);
            }
        },
        clickFunction(e) {
            console.log(e);
            switch (e) {
                case "17":
                case "18":
                    this.propaganda();
                    break;
                case "15":
                    this.screenshot();
                    break;
                case "16":
                    this.getVideo();
                    break;
                case "14":
                    if (this.obj.isControl) {
                        this.goPTZstate();
                    } else {
                        this.$message({
                            message: "设备不支持云台控制",
                            type: "warning",
                        });
                    }
                    break;
                default:
                    break;
            }
        },
        //录像
        getVideo() {
            let stream = null;
            if (this.Encoding == "264") {
                let canvas = document.createElement("canvas");
                let loop = () => {
                    let width = window.innerWidth;
                    let height = (window.innerWidth / 16) * 9;
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    let video = this.player.h5Video;
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(video, 0, 0, width, height);
                    this.rafId = window.requestAnimationFrame(loop);
                };
                window.requestAnimationFrame(loop);
                stream = canvas.captureStream(60);
            } else {
                stream = this.player.canvas.captureStream(48);
            }
            let recorderObj = {
                startvideo: (stream) => {
                    this.startTime = Date.now();
                    this.code = 2;
                    this.stream = new MediaRecorder(stream, {
                        mimeType: "video/webm;codecs=vp9",
                    });
                    this.stream.start(0);
                    this.stream.addEventListener("dataavailable", (event) => {
                        this.videogather.push(event.data);
                    });
                },
                stopvideo: () => {
                    this.code = 1;
                    this.stream.stop();
                    let fullBlob = new Blob(this.videogather, {
                        type: "video/mp4",
                    });
                    let duration = Date.now() - this.startTime;
                    fixWebm(fullBlob, duration, (fixedBlob) => {
                        saveAs(fixedBlob, "recordScreen.mp4");
                        this.videogather = [];
                    });
                    window.cancelAnimationFrame(this.rafId);
                },
            };
            if (this.code === 1) {
                recorderObj.startvideo(stream);
            } else if (this.code === 2) {
                recorderObj.stopvideo();
            }
        },
        // 拍照
        screenshot() {
            if (this.Encoding == "264") {
                let video = this.player.h5Video;
                let canvas = document.createElement("canvas");
                let w = window.innerWidth;
                let h = (window.innerWidth / 16) * 9;
                canvas.width = w;
                canvas.height = h;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, w, h);
                let previewImg = canvas.toDataURL("image/png");
                let pictureName =
                    this.Videotests + new Date().getTime() + ".jpg";
                saveAs(previewImg, pictureName);
            } else {
                setH265PlayerCover(
                    this.player,
                    this.Videotests + new Date().getTime()
                );
            }
        },
        getvideobacklist(obj) {
            let id = obj.serviceId;
            let config = {
                deviceId: id,
                platformServiceId: obj.platformServiceId,
                startDate: this.periodtime[0],
                stopDate: this.periodtime[1],
            };
            getVideoBacklist(config).then((res) => {
                if (res) {
                    this.currentPlay = res;
                } else {
                    this.$message({
                        message: `${obj.name}无历史记录`,
                        type: "warning",
                    });
                    this.currentPlay = "";
                }
            });
        },
        mouseenter() {
            this.showPTZ = true;
        },
        mouseleave() {
            this.showPTZ = false;
        },
        testwasmvideoNew(val, url) {
            let decodeType = "soft";
            if(val?.tracks?.filter(item=>item.codec_id_name.indexOf('264') !== -1).length){
              decodeType = "auto";
            }
            return new Promise((resolve) => {
                this.player = new WasmPlayer(
                    url,
                    this.Videotests,
                    this.callback,
                    Object.assign(this.defaultOpts, {decodeType}),
                );
                resolve(this.player);
            });
        },

        testwasmvideo(val) {
            let decodeType = "soft";
            if(val?.tracks?.filter(item=>item.codec_id_name.indexOf('264') !== -1).length){
              decodeType = "auto";
            }
            return new Promise((resolve) => {
                this.player = new WasmPlayer(
                    null,
                    this.Videotests,
                    this.callback,
                    Object.assign(this.defaultOpts, {decodeType}),
                );
                resolve(this.player);
            });
        },
        callback(e) {},
    },
    destroyed() {
        this.destroyvideo();
    },
    watch: {
        value1: function (e) {
            e >= this.slidermax ? clearInterval(this.intervalspacename) : "";
        },
        holdvideconfig: function (val) {
            this.slidermax = (val.item.end_time - val.item.start_time) / 1000;
        },
        obj: {
            deep: true,
            handler(val) {
                console.log(val, "val");
                if ("http_flv_wan" in val) {
                    this.destroyvideo();
                    this.testwasmvideo(val).then((res) => {
                        let videoplay = val.http_flv_wan;
                        if (!videoplay.includes("token")) {
                            videoplay = `${videoplay}?token=${val.playtoken}`;
                        }
                        console.log(videoplay, "videoplay");
                        this.player.play(videoplay, 1, 0);
                    });
                } else if (this.isplback && "serviceId" in this.obj) {
                    this.getvideobacklist(this.obj);
                } else if (this.playback && "serviceId" in this.obj) {
                    this.play({
                        item: {
                            device_id: this.obj.serviceId,
                        },
                        end: `${this.periodtime[1]} 23:59:59`,
                        key: 0,
                        start: `${this.periodtime[0]} 00:00:00`,
                    });
                } else {
                    this.destroyvideo();
                    this.testwasmvideo(val);
                    this.currentPlay = "";
                }
            },
        },
    },
};
</script>
<style lang="scss" scoped>
.wasmvidemain {
    display: flex;
    flex-direction: column;
    .topbar {
        display: flex;
        flex: 0 0 32px;
        background: #2a2e3d;
        color: #d8ddef;
        display: flex;
        align-items: center;
        padding: 0 10px;
        .topbar_detail {
            flex: 1;
        }
        .topbar_console {
            flex: 1;
            display: flex;
            flex-direction: row-reverse;
            .topbar_choose {
                border: 1px solid #ccc;
                padding: 2px 2px;
                font-size: 14px;
                color: #d8ddef;
                cursor: pointer;
                border-radius: 2px;
            }
        }
    }
    .footer {
        flex: 0 0 30px;
        background: #2a2e3d;
        color: #d8ddef;
        display: flex;
        align-items: center;
        padding: 0 10px;
    }
    .videoclass {
        flex: 1 1 0;
        position: relative;
        .PTZ_main {
            position: absolute;
            background-color: rgba($color: #fff, $alpha: 0.7);
            border-radius: 5px;
            width: 120px;
            // background: linear-gradient(45deg,transparent 5%,#1F8DFF 5%);
            top: 0px;
            right: 0px;
            height: 30px;
            display: grid;
            grid-template-columns: (repeat(4, 1fr));
            grid-column-gap: 10px;
            padding: 2px;
            .PTZ_btn {
                cursor: pointer;
                height: 100%;
                width: 100%;
                // background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .PTZ {
                position: absolute;
                align-items: center;
                left: 50%;
                transform: translateX(-50%);
                bottom: 2px;
                height: 50px;
                width: 50px;
                background: url(../../assets/svg/yt-direction-circle.svg);
                background-size: 100% 100%;
                .PTZ_top {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .PTZ_left {
                    position: absolute;
                    top: 50%;
                    left: 4px;
                    transform: translateY(-50%);
                }
                .PTZ_right {
                    position: absolute;
                    top: 50%;
                    right: 4px;
                    transform: translateY(-50%);
                }
                .PTZ_bottom {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
}
</style>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
    margin-bottom: 20px;
}
::v-deep .el-slider__button {
    border-radius: 0;
    width: 5px;
    height: 15px;
    transform: translateY(-2px);
    border: 1px solid #fff;
}
::v-deep .el-slider__runway {
    height: 1px;
}
::v-deep .el-slider__bar {
    height: 2px;
}
.drawer_main {
    border-top: 1px solid #ccc;
    height: 100%;
    padding: 10px;
    .backvideo_card {
        width: 100%;
        height: 52px;
        margin-bottom: 16px;
        padding: 4px 6px 4px 6px;
        border: 1px solid #3a465e;
    }
}
</style>
<style lang="scss" scoped>
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>
