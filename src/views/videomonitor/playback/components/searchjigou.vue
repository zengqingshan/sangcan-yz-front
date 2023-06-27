<template>
  <div>

    <el-empty v-show="orgList.length == 0" :image-size="100" />

    <div v-for="(item, index) in orgList" :key="index">
      <el-button @click="handleOrgClick(item)">
        <span style="color: rgb(24, 144, 255);margin-right: 5px;">
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="apartment"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M908 640H804V488c0-4.4-3.6-8-8-8H548v-96h108c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h108v96H228c-4.4 0-8 3.6-8 8v152H116c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16H292v-88h440v88H620c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16zm-564 76v168H176V716h168zm84-408V140h168v168H428zm420 576H680V716h168v168z"
            />
          </svg></span>

        <span v-html="item.name" />

      </el-button>

    </div>

  </div>
</template>

<script>

import {
  listOrg
} from '@/api/system/org'
export default {
  name: 'Searchjigou',
  data() {
    return {
      orgList: [],
      searchKey: '',
      current: 1,
      pageSize: 5
    }
  },
  methods: {
    handleOrgClick(item) {
      this.$emit('searchedOrgClick', item.id, item.orgName, item.onelineNum, item.deviceNum)
    },
    heightLight(list, keyWords) {
      list.forEach(e => {
        if (keyWords.length > 0 && e.name.length > 0) {
          const replaceReg = new RegExp(keyWords, 'ig')
          const replaceString = `<span style="color: #1890ff">${keyWords}</span>`
          e.orgName = e.name
          e.name = e.name.replace(replaceReg, replaceString)

          e.key = 'org_' + e.id
        }
      })
    },
    searchOrg() {
      const queryParams = {
        name: this.searchKey,
        current: this.current,
        pageSize: this.pageSize
      }
      this.loading = true
      if (this.current == 1) {
        this.orgList = []
      }
      listOrg(queryParams).then((res) => {
        this.heightLight(res, this.searchKey)

        this.orgList = this.orgList.concat(res)
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .el-tab-pane{
    .el-button--medium {
      width: 100%;
    border: 0;
    background-color: #2b2c2f;
    text-align: left;
    color: white;
    &:hover{
      background-color: #3f4045;
    }
    }
  }
</style>

