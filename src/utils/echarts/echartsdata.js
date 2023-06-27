import * as echarts from "echarts";
const config = new Map();
const echartsColor = [
  "#1F87FF",
  "#16E991",
  "#7B83EB",
  "#FFC600",
  "#A963F2",
  "#FF0000",
  "#00FFFF",
  "#BD90F7",
  "#EE8F14",
  "#F9D6A8",
  "#CC83A8",
  "#21F7BB",
  "#2EF712",
];
const titlestyle = {
  fontWeight: "normal",
  fontSize: 12,
  color: "#262626",
};
const data = {
  line: ({ dataX, dataY, title }) => {
    let datax = [];
    let data1 = [];
    let data2 = [];
    dataX.forEach((e) => {
      datax.push(e.name);
      data1.push(e.person);
      data2.push(e.vehicle);
    });
    return {
      color: echartsColor,
      title: {
        text: title || "",
        textStyle: titlestyle,
        left: 10,
        top: 14,
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["人员告警", "车辆告警"],
        bottom: "1%",
        icon: "path://M10 10 H 60 V 20 H 10 L 10 10",
      },
      grid: {
        left: "20",
        right: "40",
        bottom: "18%",
        top: "20",
        containLabel: true,
      },

      xAxis: {
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        type: "category",
        boundaryGap: false,
        data: datax,
      },
      yAxis: {
        interval: 100,
        type: "value",
        splitLine: {
          show: true,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      series: [
        {
          name: "人员告警",
          type: "line",
          data: data1,
          smooth: true,
          lineStyle: {
            width: 4,
          },
        },
        {
          name: "车辆告警",
          type: "line",
          data: data2,
          smooth: true,
          lineStyle: {
            width: 4,
          },
        },
      ],
    };
  },
  Annular: ({ data, title }) => {
    return {
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c} ({d}%)",
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        left: "55%",
        top: "center",
        padding: "0 15 15 15",
        itemGap: 20,
        itemWidth: 12,
        itemHeight: 12,
        icon: "circle",
        textStyle: {
          fontFamily: "Arial",
        },
        formatter: function (name) {
          let total = data.find((e) => e.name == name).value;
          let percentage = (
            data.find((e) => e.name == name).percent * 100
          ).toFixed(1);
          return `${name} ${total.toLocaleString()} ${percentage}%`;
        },
      },
      toolbox: {
        show: true,
        orient: "horizontal",
        right: "20",
      },
      title:
        typeof title === "string"
          ? {
              text: title || "",
              textStyle: titlestyle,
              left: 14,
              top: 14,
            }
          : title,
      color: echartsColor,
      grid: { left: "0", right: "20", bottom: "0", containLabel: true },
      series: [
        {
          // name: "设备厂家分布",
          type: "pie",
          radius: ["65%", "95%"],
          center: ["18%", "50%"],
          emphasis: {
            label: {
              show: true,
              fontSize: "12",
              fontWeight: "bold",
              formatter: "{b} \n\n {c}",
            },
          },
          label: {
            show: false,
            position: "center",
            formatter: "{b|{b}：}{c}",
            rich: {
              a: {
                color: "#999",
                lineHeight: 22,
                align: "center",
              },
              hr: {
                borderColor: "#aaa",
                width: "100%",
                borderWidth: 0.5,
                height: 0,
              },
              b: {
                fontSize: 12,
                lineHeight: 33,
              },
              per: {
                color: "#eee",
                backgroundColor: "#334455",
                padding: [2, 4],
                borderRadius: 2,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 5,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    };
  },
  Lateraldirectionbar: ({ title, data }) => {
    const CoordinateName = {
      corname: [],
      data: [],
    };
    data.forEach((value, index, array) => {
      CoordinateName.corname.push(value.name);
      CoordinateName.data.push(value.value);
    });
    return {
      title: [
        {
          text: title || "",
          textStyle: titlestyle,
          top: 14,
          left: 5,
        },
        {
          text: "单位/ 次",
          textStyle: {
            fontSize: "10",
            color: "#8C8C8C",
          },
          top: 50,
          left: "88%",
        },
      ],
      grid: { left: "10", right: "50", bottom: "0", containLabel: true },
      xAxis: {
        boundaryGap: false,
        type: "value",
        show: false,
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        type: "category",
        data: CoordinateName.corname,
      },
      series: [
        {
          data: CoordinateName.data.map((e, i) => {
            return {
              value: e,
              itemStyle: {
                color: echartsColor[i],
              },
            };
          }),
          type: "bar",
          barWidth: "24px",
          itemStyle: {
            normal: {
              barBorderRadius: [0, 30, 30, 0],
            },
          },
          label: {
            normal: {
              show: true,
              fontSize: 10,
              fontWeight: "bold",
              color: "#595959",
              position: "right",
            },
          },
        },
      ],
    };
  },
  Landscapebar: ({ title, data }) => {
    const CoordinateName = {
      corname: [],
      data: [],
    };
    data.forEach((value, index, array) => {
      CoordinateName.corname.push(value.name);
      CoordinateName.data.push(value.value);
    });
    return {
      title: [
        {
          text: title || "",
          textStyle: titlestyle,
          top: 14,
          left: 5,
        },
        {
          text: "单位/ 次",
          textStyle: {
            fontSize: "10",
            color: "#8C8C8C",
          },
          top: 35,
          left: "88%",
        },
      ],
      grid: { left: "0", right: "10", bottom: "10", containLabel: true },
      xAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        type: "category",
        data: CoordinateName.corname,
      },
      yAxis: {
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        boundaryGap: false,
        type: "value",
      },
      series: [
        {
          data: CoordinateName.data.map((e, i) => {
            return {
              value: e,
              itemStyle: {
                color: echartsColor[i],
              },
            };
          }),
          type: "bar",
          barWidth: "24px",
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
            },
          },
          label: {
            normal: {
              show: true,
              fontSize: 10,
              fontWeight: "bold ",
              color: "#595959",
              position: "top",
            },
          },
        },
      ],
    };
  },
  category: (data, title) => {
    let name = [];
    let value = [];
    data.forEach((e) => {
      let a = new Map([
        ["person", "人员布控"],
        ["vehicle", "车辆布控"],
      ]);
      name.push(a.get(e.name));
      value.push(e.value);
    });
    return {
      tooltip: {},
      xAxis: {
        type: "category",
        data: name,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: value,
          type: "bar",
          barWidth: "30",
          colorBy: echartsColor,
        },
      ],
      grid: {
        left: "0",
        right: "20",
        bottom: "0",
        top: "20",
        containLabel: true,
      },
    };
  },
  Lineargradient: ({ dataX, dataY, title }) => {
    let datax = [],
      data1 = [],
      data2 = [];
    dataX.interfaceStaVos.forEach((e) => {
     
      datax.push(e.name.split(" ")[1].substring(0, 5));
      data1.push(e.interfaceIn);
      data2.push(e.interfaceOut);
    });
    return {
      color: echartsColor,
      title: {
        show: false,
        text: title || "",
        textStyle: titlestyle,
        left: 10,
        top: 14,
      },
      tooltip: {
        show: true,
        trigger: "axis",
        formatter: (params) => {
          let dataStr = `<div><p style="font-weight:bold;margin:0 8px 15px;">${params[0].name}</p></div>`;
          params.forEach((item) => {
            dataStr += `<div>
          <div style="margin: 0 8px;">
            <span style="display:inline-block;margin-right:5px;width:10px;height:10px;border-radius:10px;background-color:${title};"></span>
            <span>${item.seriesName}</span>
            <span style="float:right;color:#000000;margin-left:20px;">${item.data}</span>
          </div>
        </div>`;
          });
          return dataStr;
        },
      },

      legend: {
        show: false,
        data: ["租户数量", "接口数量"],
      },
      grid: {
        left: "10",
        right: "10",
        bottom: "1%",
        top: "10px",
        containLabel: true,
      },

      xAxis: {
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            // color: "#728AE0",
          },
        },
        axisLabel: {
          interval: 11,
          showMaxLabel: true,
        },
        type: "category",
        boundaryGap: false,
        data: datax,
      },
      yAxis: {
        splitNumber: 6,
        type: "value",
        splitLine: {
          show: true,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            // color: "#728AE0",
          },
        },
      },
      series: [
        {
          showSymbol: false,
          name: "内部接口",
          type: "line",
          data: data1,
          smooth: true,
          center: ["50%", "50%"],
          lineStyle: {
            width: 1,
            color: "#0396FF",
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#0396FF",
                },
                {
                  offset: 1,
                  color: "#ABDCFF",
                },
              ]),
            },
          },
        },
        {
          showSymbol: false,
          name: "外部接口",
          type: "line",
          data: data2,
          smooth: true,
          center: ["50%", "50%"],
          lineStyle: {
            width: 1,
            color: "#32CCBC",
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#32CCBC",
                },
                {
                  offset: 1,
                  color: "#90F7EC",
                },
              ]),
            },
          },
        },
      ],
    };
  },
  dashboard:({data}) => {
    return {
      series: [
        {
          type: "gauge",
          splitNumber: 4,
          pointer: {
            show: true,
            width: 2,
            itemStyle: {
              color: "#BFBFBF",
            },
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.25, "#30BF78"],
                [0.5, "#A0D911"],
                [0.75, "#FAAD14"],
                [1, "#F4664A"],
              ],
            },
          },
          axisTick: {
            show: false,
          },

          axisLabel: {
            show: false,
            distance: 25,
            color: "#999",
            fontSize: 20,
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 10,
            itemStyle: {
              borderWidth: 2,
              borderColor: "#BFBFBF",
            },
          },
          title: {
            show: false,
          },
          splitLine: {
            show: true,
            distance: -10,
            lineStyle: {
              color: "#DCDCDC",
            },
          },
          detail: {
            valueAnimation: true,
            formatter: ` ${data.value}%\n${data.name}`,
            color: "auto",
            fontSize: 12,
            offsetCenter: [0, "100%"],
          },
          data: [
            {
              value: data.value,
            },
          ],
        },
      ],
    };
  }
};
Object.keys(data).forEach((el) => {
  config.set(el, data[el]);
});
export default config;
