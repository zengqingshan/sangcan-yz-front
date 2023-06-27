export default {
  state: {
    periodtime: [],
    backvalue: {},
    chosearr: []
  },
  mutations: {
    SET_TIME: (state, time) => {
      state.periodtime = time
    },
    SET_BACKVALUE: (state, value) => {
      value.current = 1
      state.backvalue = value
    },
    SET_CHOS: (state, value) => {
      state.chosearr.push(...value)
    }
  }
}
