<template>
  <el-container style="min-width: 1080px;">
    <el-header :class="$style.header">
      <div :class="$style.headerContainer">
        <span :class="$style.name">江西移动慧眼平台</span>

        <el-dropdown :class="$style.avatarContainer" trigger="click">
          <div :class="$style.user">
            <img src="../assets/homepage/user.png">
            <div :class="$style.setting">{{ $store.getters.user.userName }}</div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="showSetting" @click.native="gotoSetting">
              <span>系统设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <div :class="$style.banner">
      <div :class="$style.welcome" />
      <div :class="$style.slogan" />
    </div>
    <el-main style="background-color: #f7f8fb;">
      <div :class="$style.container">
        <div :class="$style.left">
          <div v-for="(menu) in menuList" :key="menu.id" :class="menu.id === selectedItem.id ? $style.selected : ''" @click="selectSystem(menu)">
            <div :class="`${$style.icon} ${$style[menu.icon]}`" />
            {{ menu.name }}
          </div>
        </div>
        <div :class="$style.right">
          <div v-for="item in (selectedItem.children ? selectedItem.children : initList)" :key="item.id" :class="$style.card">
            <p :class="$style.title">{{ item.name }}</p>
            <div style="display: inline-block; margin-right: 0" :class="`${$style.logo} ${$style.icon} ${$style[item.icon]}`" />
            <p :class="$style.describe">{{ item.describe }}</p>
            <el-button v-loading.fullscreen.lock="loading" type="primary" round @click="setCookie(item)">立即进入</el-button>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getMenuList, setSession } from '@/api/homepage/menu'
import Cookies from 'js-cookie'
export default {
  name: 'Homepage',
  data() {
    return {
      loading: false,
      menuList: [],
      initList: [],
      selectedItem: {},
      showSetting: this.$store.getters.user.menuRouterList && this.$store.getters.user.menuRouterList.length,
      Cookies
    }
  },
  mounted() {
    console.log(this)
    getMenuList().then(res => {
      this.menuList = res
      const result = res.reduce((total, item) => {
        if (item.children) {
          return [...total, ...item.children]
        }
        return total
      }, [])
      this.initList = result
    })
  },
  methods: {
    setCookie(item) {
      if (item.adapterLogin) {
        this.loading = true
        setSession({ appCode: item.appCode }).then(() => {
          this.loading = false
          this.openNew(item)
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.openNew(item)
      }
    },
    openNew(item) {
      const url = `${item.urlWan}?sessionid=${Cookies.get('sessionid')}`
      let dateTime = new Date()
      dateTime = dateTime.setDate(dateTime.getDate() + 1)
      dateTime = new Date(dateTime).getTime()
      localStorage.setItem('antd-pro', dateTime)
      localStorage.setItem('antd-pro-authority', 'superAdmin')
      if (item.target === '_blank') {
        window.open(url)
      } else {
        window.location.href = url
      }
    },
    gotoSetting() {
      this.$router.push({ path: '/index' }).catch(() => {})
    },
    logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/login'
        })
      }).catch(() => {})
    },
    selectSystem(menu) {
      this.selectedItem = menu
    }
  }
}
</script>

<style module lang="scss">
  .header{
    text-align: center;
    .headerContainer{
      width: 1280px;
      display: inline-block;
      .name{
        font-size: 17px;
        font-weight: 700;
        float: left;
        line-height: 60px;
      }
      .avatarContainer{
        float: right;
        .user{
          display: flex;
          cursor: pointer;
          >img{
            width: 30px;
            height: 30px;
            margin: 15px;
          }
          .setting{
            line-height: 60px;
          }
        }
      }
    }
  }
  .banner{
    height: 460px;
    background-image: url("../assets/homepage/banner.png");
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .welcome{
      width: 409px;
      height: 48px;
      background-image: url("../assets/homepage/welcome.png");
      background-size: 100% 100%;
      margin-bottom: 30px;
    }
    .slogan{
      width: 234px;
      height: 24px;
      background-image: url("../assets/homepage/slogan.png");
      background-size: 100% 100%;
    }
  }
  .container{
    padding: 76px;
    width: 1920px;
    margin: auto;
    display: flex;
    background-color: #f7f8fb;
    .icon{
      width: 100px;
      height: 100px;
      background-size: 100% 100%;
      margin-right: 30px;
    }
    .icon-wisdom{
      background-image: url("../assets/homepage/icon-wisdom.png");
    }
    .icon-video{
      background-image: url("../assets/homepage/icon-video.png");
    }
    .icon-bigdata{
      background-image: url("../assets/homepage/icon-bigdata.png");
    }
    .icon-wisdom-eye{
      background-image: url("../assets/homepage/icon-wisdom-eye.png");
    }
    .icon-video-menu{
      background-image: url("../assets/homepage/icon-video-menu.png");
    }
    .icon-data-analyse{
      background-image: url("../assets/homepage/icon-data-analyse.png");
    }
    .icon-data-collect{
      background-image: url("../assets/homepage/icon-data-collect.png");
    }
    .icon-data-management{
      background-image: url("../assets/homepage/icon-data-management.png");
    }
    .icon-data-service{
      background-image: url("../assets/homepage/icon-data-service.png");
    }
    .left{
      flex: 0 0 250px;
      >div{
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 421px;
        height: 211px;
        background: #FFFFFF;
        margin-bottom: 4px;
        line-height: 120px;
        color:#545454;
        font-size: 30px;
        font-weight: 700;
        &.selected{
          background: linear-gradient(-11deg, #00D8FF, #489AFF);
          background-size: 100% 100%;
          .icon-wisdom{
            background-image: url("../assets/homepage/icon-wisdom-selected.png");
          }
          .icon-video{
            background-image: url("../assets/homepage/icon-video-selected.png");
          }
          .icon-bigdata{
            background-image: url("../assets/homepage/icon-bigdata-selected.png");
          }
        }
      }
    }
    .right{

      .card{
        display: inline-block;
        width: 416px;
        margin: 0 14px 28px 14px;
        background: #FFFFFF;
        box-shadow: 0 0 10px 0 rgba(0, 22, 41, 0.24);
        text-align: center;
        padding:20px;
        .title{
          color: #4EA0FF;
          font-size: 26px;
          font-weight: 700;
          margin: 0;
        }
        .logo{
          margin: 7px 0;
        }
        .describe{
          color: #8C9391;
          font-size: 16px;
          text-align: left;
          min-height: 66px;
        }
      }
    }
  }
</style>
