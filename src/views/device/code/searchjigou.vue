<template>
  <div>
    <el-empty :image-size="100" v-if="orgList.length == 0" description="未查询到组织机构" />
    <div v-else>

      <div v-for="(item, index) in orgList" :key="index">
        <el-button @click="handleOrgClick(item)">
          <span style="color: rgb(24, 144, 255);">
            <svg viewBox="64 64 896 896" focusable="false" data-icon="apartment" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M908 640H804V488c0-4.4-3.6-8-8-8H548v-96h108c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h108v96H228c-4.4 0-8 3.6-8 8v152H116c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16H292v-88h440v88H620c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16zm-564 76v168H176V716h168zm84-408V140h168v168H428zm420 576H680V716h168v168z"></path></svg></span>
  
    
            <span v-html="item.name">
            </span>

        </el-button>

 

      </span>
    </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Searchjigou',
  data() {
      return {
        orgList: [],
      }
  },
  methods:{
    handleOrgClick(item){
        this.$emit('searchedOrgClick', item.id, item.orgName);
    },
    heightLight(list, keyWords){
    list.forEach(e => {
      if(keyWords.length > 0 && e.name.length > 0){

        let replaceReg = new RegExp(keyWords, "ig");
        let replaceString = `<span style="color: #1890ff">${keyWords}</span>`;
        e.orgName = e.name
        e.name = e.name.replace(replaceReg, replaceString)
        
        
        }
    })
     
},
  }

}
</script>

<style></style>
