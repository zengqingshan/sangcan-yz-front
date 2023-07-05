<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      },
    };
  },
};
</script>
<style lang="scss">
#app {
  background-color: #363637;
  box-sizing: border-box;
}
body {
  background-color: #363637;
}
.el-menu {
  background-color: #00a99c !important;
}
.navbar .topmenu-container {
  display: -webkit-box;
  -webkit-box-align: center;
}
.el-menu .is-active {
  color: white;
}
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  color: #6d91d8;
}
</style>
