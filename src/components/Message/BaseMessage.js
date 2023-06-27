/** 统一消息提示框组件 */
import { Message } from 'element-ui'
const EvpMessage = function(type, message) {
    Message.closeAll();
    Message({
        message: message,
        type: type,
        center: true,
        customClass: 'evpMsgCls',
        duration: 5 * 1000
    });
}

export default {
    Info(message) {
        EvpMessage("info", message);
    },
    Error(message) {
        EvpMessage("error", message);
    },
    Success(message) {
        EvpMessage("success", message);
    },
    Warn(message) {
        EvpMessage("warning", message);
    }
};
