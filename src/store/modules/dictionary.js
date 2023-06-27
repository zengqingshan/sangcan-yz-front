import { getDictionary, getDevice } from '@/api/system/dict/data';
import { getConfigList } from "@api/system/config";
import { getZoneTree } from "@api/dict";

const dict = {
  state: {
    dict: {},
    deviceList: [],
    kvList: [],
  },

  mutations: {
    SET_DICT: (state, dict) => {
      state.dict = dict
    },
    SET_DEVICE: (state, device) => {
      state.deviceList = device
    },
    SET_KVLIST: (state, kvList) => {
      state.kvList = kvList
    },
  },

  actions: {
    // 获取字典
    GetDictionary({ commit }) {
      return new Promise((resolve, reject) => {
        getDictionary().then(res => {
          if (res && res.min_pixel) {
            res.min_pixel.sort(sortFn)
            commit('SET_DICT', res)
            resolve()
          }
          reject()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取字典
    GetDevice({ commit }) {
      return new Promise((resolve, reject) => {
		  
		  
		  commit('SET_DEVICE', []);
          resolve()
		  /*
        getDevice().then(res => {
          commit('SET_DEVICE', res)
          resolve()
        }).catch(error => {
          reject(error)
        })*/
      })
    },
    // 获取字典
    GetKvList({ commit }) {
      return new Promise((resolve, reject) => {
        getConfigList().then(response => {
          let result = {}
          response.forEach(item => {
            result = {
              ...result,
              [item.key]: item.value
            }
          })
          commit('SET_KVLIST', result)
          resolve()
        })
      })
    },
  }
}
function sortFn(a, b) {
  return Number(a.dictKey) - Number(b.dictKey)
}
export default dict
