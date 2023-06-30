/* eslint-disable */

import Recorder from 'recorder-core';
import 'recorder-core/src/engine/pcm';
import request from "@/utils/request";
import {Message} from 'element-ui'

const testSampleRate = 8000;
const testBitRate = 16;

const SendFrameSize = 32000;

// 重置环境，每次开始录音时必须先调用此方法，清理环境
const RealTimeSendTryReset = function () {
    realTimeSendTryChunks = null;
};

let realTimeSendTryNumber;
let transferUploadNumberMax;
let realTimeSendTryChunk;
let realTimeSendTryChunks;

let isOver = false;

//= ====实时处理核心函数==========
const RealTimeSendTry = function (buffers, bufferSampleRate, isClose) {
    if (realTimeSendTryChunks == null) {
        realTimeSendTryNumber = 0;
        transferUploadNumberMax = 0;
        realTimeSendTryChunk = null;
        realTimeSendTryChunks = [];
    }

    // 配置有效性检查
    if (testBitRate == 16 && SendFrameSize % 2 == 1) {
        console.log('16位pcm SendFrameSize 必须为2的整数倍', 1);
        return;
    }

    var pcm = [];
    var
        pcmSampleRate = 0;
    if (buffers.length > 0) {
        // 借用SampleData函数进行数据的连续处理，采样率转换是顺带的，得到新的pcm数据
        var chunk = Recorder.SampleData(buffers, bufferSampleRate, testSampleRate, realTimeSendTryChunk);

        // 清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
        for (let i = realTimeSendTryChunk ? realTimeSendTryChunk.index : 0; i < chunk.index; i++) {
            buffers[i] = null;
        }

        realTimeSendTryChunk = chunk;// 此时的chunk.data就是原始的音频16位pcm数据（小端LE），直接保存即为16位pcm文件、加个wav头即为wav文件、丢给mp3编码器转一下码即为mp3文件

        pcm = chunk.data;
        pcmSampleRate = chunk.sampleRate;

        if (pcmSampleRate != testSampleRate)// 除非是onProcess给的bufferSampleRate低于testSampleRate
        {
            throw new Error(`不应该出现pcm采样率${pcmSampleRate}和需要的采样率${testSampleRate}不一致`);
        }
    }

    // 将pcm数据丢进缓冲，凑够一帧发送，缓冲内的数据可能有多帧，循环切分发送
    if (pcm.length > 0) {
        realTimeSendTryChunks.push({pcm, pcmSampleRate});
    }

    // 从缓冲中切出一帧数据
    const chunkSize = SendFrameSize / (testBitRate / 8);// 8位时需要的采样数和帧大小一致，16位时采样数为帧大小的一半
    var pcm = new Int16Array(chunkSize);
    var
        pcmSampleRate = 0;
    let pcmOK = false;
    let
        pcmLen = 0;
    for1:for (let i1 = 0; i1 < realTimeSendTryChunks.length; i1++) {
        var chunk = realTimeSendTryChunks[i1];
        pcmSampleRate = chunk.pcmSampleRate;

        for (let i2 = chunk.offset || 0; i2 < chunk.pcm.length; i2++) {
            pcm[pcmLen] = chunk.pcm[i2];
            pcmLen++;

            // 满一帧了，清除已消费掉的缓冲
            if (pcmLen == chunkSize) {
                pcmOK = true;
                chunk.offset = i2 + 1;
                for (let i3 = 0; i3 < i1; i3++) {
                    realTimeSendTryChunks.splice(0, 1);
                }

                break for1;
            }
        }
    }

    // 缓冲的数据不够一帧时，不发送 或者 是结束了
    if (!pcmOK) {
        if (isClose) {
            var number = ++realTimeSendTryNumber;
            TransferUpload(number, null, 0, null, isClose);
        }

        return;
    }

    // 16位pcm格式可以不经过mock转码，直接发送new Blob([pcm.buffer],{type:"audio/pcm"}) 但8位的就必须转码，通用起见，均转码处理，pcm转码速度极快
    var number = ++realTimeSendTryNumber;
    const encStartTime = Date.now();
    const recMock = Recorder({
        type: 'pcm',
        sampleRate: testSampleRate, // 需要转换成的采样率
        bitRate: testBitRate // 需要转换成的比特率
    });
    recMock.mock(pcm, pcmSampleRate);
    recMock.stop((blob, duration) => {
      console.log(123)
        blob.encTime = Date.now() - encStartTime;

        // 转码好就推入传输
        TransferUpload(number, blob, duration, recMock, false);

        // 循环调用，继续切分缓冲中的数据帧，直到不够一帧
        RealTimeSendTry([], 0, isClose);
    }, (msg) => {
        // 转码错误？没想到什么时候会产生错误！
        console.log(`不应该出现的错误:${msg}`, 1);
    });
};

//= ====数据传输函数==========
const TransferUpload = function (number, blobOrNull, duration, blobRec, isClose) {
    transferUploadNumberMax = Math.max(transferUploadNumberMax, number);
    if (blobOrNull) {
        const blob = blobOrNull;
        const {encTime} = blob;

        //* ********发送方式一：Base64文本发送***************
        const reader = new FileReader();
        reader.onloadend = function () {
            const base64 = (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result) || [])[1];
            const form = new FormData();
            form.append("audioData", base64);
            form.append("deviceId", deviceID);
            request({
                url: `/cmict-project-hikvision/hikvision/audio/device/startAudio`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: form
            })
            if(isOver){
              recStop()
            }
        };
        reader.readAsDataURL(blob);
    }

    if (isClose) {
        console.log(`No.${number < 100 ? (`000${number}`).substr(-3) : number}:已停止传输`);
    }
};

//= ====pcm文件合并核心函数==========
Recorder.PCMMerge = function (fileBytesList, bitRate, sampleRate, True, False) {
    // 计算所有文件总长度
    let size = 0;
    for (let i = 0; i < fileBytesList.length; i++) {
        size += fileBytesList[i].byteLength;
    }

    // 全部直接拼接到一起
    const fileBytes = new Uint8Array(size);
    let pos = 0;
    for (let i = 0; i < fileBytesList.length; i++) {
        const bytes = fileBytesList[i];
        fileBytes.set(bytes, pos);
        pos += bytes.byteLength;
    }

    // 计算合并后的总时长
    const duration = Math.round(size * 8 / bitRate / sampleRate * 1000);

    True(fileBytes, duration, {bitRate, sampleRate});
};

// 调用录音
let rec;
let deviceID = ''

export function recStart(id) {
    isOver = false;
    deviceID = id;
    if (rec) {
        rec.close();
    }

    rec = Recorder({
        type: 'unknown',
        onProcess(buffers, powerLevel, bufferDuration, bufferSampleRate) {
            // Runtime.Process.apply(null, arguments);

            // 推入实时处理，因为是unknown格式，buffers和rec.buffers是完全相同的，只需清理buffers就能释放内存。
            RealTimeSendTry(buffers, bufferSampleRate, false);
        }
    });

    rec.open(() => { // 打开麦克风授权获得相关资源
        rec.start();// 开始录音
        // Message({ showClose: true, message: '录音调用成功，请讲话！', type: "success" })
        RealTimeSendTryReset();// 重置环境，开始录音时必须调用一次
    }, (msg, isUserNotAllow) => {
        Message({ showClose: true, message: `${isUserNotAllow ? '用户未允许录音，' : ''}无法录音:${msg}`, type: "error" })
    });
}

export function recStop() {
    if(isOver){
      rec.close();// 直接close掉即可，这个例子不需要获得最终的音频文件
      RealTimeSendTry([], 0, true);// 最后一次发送
    }
    isOver = true;
}
