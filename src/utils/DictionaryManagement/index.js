// import { Inquiry, InquiryPersonnelLabel, SceneList } from "@api/Dictionary";
import { get, set } from "./DataIsolation.js";
import { allDictionary, getZoneTree } from "@api/dict/index.js";
/**
 * @translation Inquiry:民族
 * @translation InquiryPersonnelLabel:人员标签
 * @translation SceneList:布控场景列表
 */
class InitializationDictionary {
  constructor(initdata) {
    this.initdata = initdata;
    this.RemoteData = {
      // Inquiry,
      // InquiryPersonnelLabel,
      // SceneList
    };
  }
  //  获取字典表
  /**
   * @params *StorageType 字典名称
   * @params *DictionaryName  字典下属性
   * @params *fun 参数回调
   * @params nocache 是否使用缓存
   *      */
  GetDictionaryValues(StorageType, DictionaryName, fun, nocache = true) {
    let initdata = this.initdata[DictionaryName];
    if (initdata) {
      set(StorageType, DictionaryName, initdata);
      fun && fun(initdata);
      if (!nocache) console.error('初始化数据只能使用缓存');
    } else {
      let getlocadata = get(StorageType, DictionaryName, "");
      if (getlocadata && nocache) {
        fun && fun(getlocadata);
      } else {
        this.RemoteData[DictionaryName]().then(res => {
          set(StorageType, DictionaryName, res);
          fun && fun(res);
        });
      }
    }
  }
}
// 全局字典设置
function Globaldictionary(StorageType, DictionaryName, res) {
  set(StorageType, DictionaryName, res);
}

let outobj = Object.create({});
Object.defineProperty(outobj.__proto__, "dictData", {
  get: function (params) {
    allDictionary().then((res) => {
      for (const [key, value] of Object.entries(res)) {
        Globaldictionary("dict", key, value);
      }
    });
    //division
    getZoneTree().then(res => {
      Globaldictionary("dict", "division", res);
    })
  },
});
outobj.install = function (Vue, initdata) {
  let basdata = new InitializationDictionary(initdata);
  Vue.prototype.$getdict = basdata;
  //同步获取全局字典
  Vue.prototype.$dt = (DictionaryName) => {
    return get('dict', DictionaryName, "");
  };
}
export default outobj;
