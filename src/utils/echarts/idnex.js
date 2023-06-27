import * as echarts from 'echarts'
import config from './echartsdata'

class inirecharts {
  ObserverConfig = { attributes: true, childList: false, subtree: false };
  constructor({ dom, theme = {}, option = {}, datatype, data }) {
    this.charsExample = null
    this.dom = dom
    this.theme = theme
    this.option = option
    this.datatype = datatype
    this.data = data
    this.init()
  }
  config(datatype, data) {
    if (config.has(datatype)) {
      return config.get(datatype)(data)
    } else {
      console.error('没有相关数据类型')
    }
  }
  init() {
    this.charsExample = echarts.init(this.dom, this.theme, this.option)
    this.setOption({
      datatype: this.datatype,
      data: this.data
    })
    this.resize()
  }
  setOption({ datatype, data }) {
    this.charsExample.setOption(this.config(datatype, data))
  }
  resize() {
    window.addEventListener('resize', () => {
         this.charsExample.resize();
    })

  }
}
export default inirecharts
