<template>
  <div></div>
</template>
<script>
import person from "@/assets/images/person.png";
export default {
  props: ["map"],
  watch: {
    map(curMap, old) {
      this.showPath(curMap);
    },
  },
  data() {
    return {
      pathData: [
        [117.000923, 36.675807],
        [117.100923, 36.575807],
        [117.200923, 36.975807],
        [117.300923, 37.675807],
      ],
    };
  },
  methods: {
    //轨迹巡航
    showPath(curMap) {
      AMapUI.load(["ui/misc/PathSimplifier", "lib/$"], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
        }
        // 创建组件实例
        let pathSimplifierIns = new PathSimplifier({
          map: curMap, //绑定的地图
          data: [
            {
              // 巡航路径
              path: this.pathData,
            },
          ],
          zIndex:1,
          getPath: (pathData, pathIndex) => {
            // 获取巡航路径中的路径坐标数组
            return pathData.path;
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            return null;
          },
          renderOptions: {
            renderAllPointsIfNumberBelow: 100, //绘制路线节点，如不需要可设置为-1
            pathLineStyle: {
              dirArrowStyle: true,
            },
            getPathStyle: function (pathItem, zoom) {
              let color = "#3366cc",
                lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));

              return {
                pathLineStyle: {
                  strokeStyle: color,
                  lineWidth: lineWidth,
                },
                pathLineSelectedStyle: {
                  lineWidth: lineWidth + 2,
                },
                pathNavigatorStyle: {
                  fillStyle: color,
                },
              };
            },
          },
        });
        // 创建巡航器
        let pathNavigator = pathSimplifierIns.createPathNavigator(0, {
          loop: true,
          speed: 10000,
          pathNavigatorStyle: {
            width: 33,
            height: 28,
            //使用图片
            content: PathSimplifier.Render.Canvas.getImageContent(
              person,
              onload,
              onerror
            ),
            strokeStyle: null,
            fillStyle: null,
            //经过路径的样式
            pathLinePassedStyle: {
              lineWidth: 6,
              strokeStyle: "black",
              dirArrowStyle: {
                stepSpace: 15,
                strokeStyle: "red",
              },
            },
          },
        });

        pathNavigator.start();
      });
    },
  },
};
</script>