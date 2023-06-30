// 兼容
/**
 * 注意：浏览器默认采样率为48000，国标采样率为8000，因此需要压缩音频文件到1/6
 *      input()、encodePCM() 录入任意时长的音频，最后调用encodePCM方法转成PCM格式
 *      inputCompress(),encodeCompressPCM两个方法：每触发一次inputCompress方法，压缩一次，
 *      最后将所有压缩文件合并生成一个PCM文件
 *      两种方式只能存在一种，根据要求修改代码
 *
 */
let lastTime = 0;
const AudioRecorder = function(stream, config) {
    config = config || {};
    config.sampleBits = config.sampleBits || 16; // 采样数位 8, 16
    config.sampleRate = config.sampleRate || 8000; // 采样率

    // let context = new (window.AudioContext || window.webkitAudioContext)();
    // let audioInput = context.createMediaStreamSource(stream);
    // let recorder = context.createJavaScriptNode(4096, 1, 1);
    let context = new AudioContext();
    let audioInput = context.createMediaStreamSource(stream);
    let recorder = context.createScriptProcessor(4096, 1, 1);// 缓冲区大小、指定输入node的声道的数量，默认值是2、指定输出node的声道的数量，默认2
    let audioData = {
        stream: stream,
        size: 0, // 录音文件长度
        buffer: [], // 录音缓存
        compressBuffer: [], // 录音缓存，压缩后
        compressBufferSize: 0,
        inputSampleRate: context.sampleRate, // 输入采样率
        inputSampleBits: 16, // 输入采样数位 8, 16
        outputSampleRate: config.sampleRate, // 输出采样率
        oututSampleBits: config.sampleBits, // 输出采样数位 8, 16
        input: function (data) {
            this.buffer.push(new Float32Array(data));
            this.size += data.length;
            // this.inputCompress();
            if (lastTime) {
                console.log("耗时：" + (new Date().getTime() - lastTime));
            }
            lastTime = new Date().getTime();
            console.log("语音数据Size：" + this.size + "byte");
        },
        inputCompress: function (data) {
            this.compressBuffer.push(this.compress());
            this.compressBufferSize += this.compress().length;
            this.clearInput();
        },
        clearInput: function () {
            this.buffer = [];
            this.size = 0;
        },
        compress: function () { // 合并处理
            let data = new Float32Array(this.size);
            let offset = 0;
            for (let i = 0; i < this.buffer.length; i++) {
                data.set(this.buffer[i], offset);
                offset += this.buffer[i].length;
            }
            let compression = parseInt(this.inputSampleRate / this.outputSampleRate);
            let length = data.length / compression;
            let result = new Float32Array(length);
            let index = 0;
            let j = 0;
            while (index < length) {
                result[index] = data[j];
                j += compression;
                index++;
            }
            return result;
        },
        // 分次压缩后合并
        encodeCompressPCM() {
            let sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
            let bytesArray = this.compressBuffer;
            let bytes = new Float32Array(this.compressBufferSize);
            // 合并分片
            let index = 0;
            for (let b = 0; b < bytesArray.length; b++) {
                for (let c = 0; c < bytesArray[b].length; c++) {
                    bytes[index] = bytesArray[b][c];
                    index++;
                }
            }
            let dataLength = this.compressBufferSize * (sampleBits / 8);
            let buffer = new ArrayBuffer(dataLength);
            let data = new DataView(buffer);
            let a = 0;
            if (sampleBits === 8) {
                for (let o = 0; o < bytes.length; o++, a++) {
                    let s = Math.max(-1, Math.min(1, bytes[o]));
                    let u = s < 0 ? 32768 * s : 32767 * s;
                    u = parseInt(255 / (65535 / (u + 32768)));
                    data.setInt8(a, u, !0);
                }
            } else {
                for (let o = 0; o < bytes.length; o++, a += 2) {
                    let s = Math.max(-1, Math.min(1, bytes[o]));
                    data.setInt16(a, s < 0 ? 32768 * s : 32767 * s, !0)
                }
            }
            return data;
        },
        // 压缩一次
        encodePCM: function() {
            let sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
            let bytes = this.compress();
            let dataLength = bytes.length * (sampleBits / 8);
            let buffer = new ArrayBuffer(dataLength);
            let data = new DataView(buffer);
            let a = 0;
            if (sampleBits === 8) {
                for (let o = 0; o < bytes.length; o++, a++) {
                    let s = Math.max(-1, Math.min(1, bytes[o]));
                    let u = s < 0 ? 32768 * s : 32767 * s;
                    u = parseInt(255 / (65535 / (u + 32768)));
                    data.setInt8(a, u, !0);
                }
            } else {
                for (let o = 0; o < bytes.length; o++, a += 2) {
                    let s = Math.max(-1, Math.min(1, bytes[o]));
                    data.setInt16(a, s < 0 ? 32768 * s : 32767 * s, !0)
                }
            }
            return data;
        },
        encodeWAV: function () {
            let sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
            let sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
            let bytes = this.compress();
            let dataLength = bytes.length * (sampleBits / 8);
            let buffer = new ArrayBuffer(44 + dataLength);
            let data = new DataView(buffer);

            let channelCount = 1;// 单声道
            let offset = 0;

            let writeString = function (str) {
                for (let i = 0; i < str.length; i++) {
                    data.setUint8(offset + i, str.charCodeAt(i));
                }
            }

            // 资源交换文件标识符
            writeString('RIFF'); offset += 4;
            // 下个地址开始到文件尾总字节数,即文件大小-8
            data.setUint32(offset, 36 + dataLength, true); offset += 4;
            // WAV文件标志
            writeString('WAVE'); offset += 4;
            // 波形格式标志
            writeString('fmt '); offset += 4;
            // 过滤字节,一般为 0x10 = 16
            data.setUint32(offset, 16, true); offset += 4;
            // 格式类别 (PCM形式采样数据)
            data.setUint16(offset, 1, true); offset += 2;
            // 通道数
            data.setUint16(offset, channelCount, true); offset += 2;
            // 采样率,每秒样本数,表示每个通道的播放速度
            data.setUint32(offset, sampleRate, true); offset += 4;
            // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
            data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
            // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
            data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
            // 每样本数据位数
            data.setUint16(offset, sampleBits, true); offset += 2;
            // 数据标识符
            writeString('data'); offset += 4;
            // 采样数据总数,即数据总大小-44
            data.setUint32(offset, dataLength, true); offset += 4;
            // 写入采样数据
            if (sampleBits === 8) {
                for (let i = 0; i < bytes.length; i++, offset++) {
                    let s = Math.max(-1, Math.min(1, bytes[i]));
                    let val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    val = parseInt(255 / (65535 / (val + 32768)));
                    data.setInt8(offset, val, true);
                }
            } else {
                for (let i = 0; i < bytes.length; i++, offset += 2) {
                    let s = Math.max(-1, Math.min(1, bytes[i]));
                    data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            }
            return data;
        },
        playSound: function () {
            context.decodeAudioData(this.encodeWAV().buffer, function(buffer) {
                let source = context.createBufferSource();
                source.buffer = buffer; // 设置数据
                source.connect(context.destination); // connect到扬声器
                source.start();
            }, function() {
                console.log('error');
            });
        }
    };

    // 开始录音
    this.start = function () {
        audioInput.connect(recorder);
        recorder.connect(context.destination);
    }

    // 停止
    this.stop = function () {
        audioData.stream.getTracks()[0].stop();
        audioInput.disconnect();
        recorder.disconnect();
    }

    // 清空语音数据
    this.clearAudio = function () {
        audioData.clearInput();
    }

    // 获取音频文件
    this.getBlob_WAV = function () {
        this.stop();
        let data = audioData.encodeWAV();
        return new Blob([data], { type: 'audio/wav' });
    }

    // 获取音频文件
    this.getBlob_PCM = function () {
        this.stop();
        let data = audioData.encodePCM();
        return new Blob([data], { type: 'audio/pcm' });
    }
    // 获取音频文件
    this.getBlob_CompressPCM = function () {
        this.stop();
        let data = audioData.encodeCompressPCM();
        return new Blob([data], { type: 'audio/pcm' });
    }

    // 回放(WAV格式-使用audio标签)
    this.playWav = function (audio) {
        audio.src = window.URL.createObjectURL(this.getBlob_WAV());
    }

    // 播放语音（使用context）
    this.playSound = function () {
        audioData.playSound();
    }

    this.combineDateView = function(resultConstructor, ...arrays) {

    }

    // 音频采集
    recorder.onaudioprocess = function (e) {
        audioData.input(e.inputBuffer.getChannelData(0));
        // record(e.inputBuffer.getChannelData(0));
        // 回调函数
        if (config.onAudioProcess) {
            console.log("--执行回调函数--");
            config.onAudioProcess(audioData);
        }
    }
}
// 获取
AudioRecorder.get = function (callback, config) {
    if (callback) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
            (navigator.mediaDevices && (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia));
        window.console.log("navigator.getUserMedia：" + navigator.getUserMedia);
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { audio: true }, // 只启用音频
                function (stream) {
                    var rec = new AudioRecorder(stream, config);
                    callback(rec);
                },
                function (error) {
                    switch (error.code || error.name) {
                    case 'PERMISSION_DENIED':
                    case 'PermissionDeniedError':
                        alert('用户拒绝提供信息。');
                        break;
                    case 'NOT_SUPPORTED_ERROR':
                    case 'NotSupportedError':
                        alert('浏览器不支持硬件设备。');
                        break;
                    case 'MANDATORY_UNSATISFIED_ERROR':
                    case 'MandatoryUnsatisfiedError':
                        alert('无法发现指定的硬件设备。');
                        break;
                    default:
                        alert('无法打开麦克风。异常信息:' + (error.code || error.name));
                        break;
                    }
                });
        } else {
            alert('当前浏览器不支持录音功能。');
        }
    }
}
export default AudioRecorder;
