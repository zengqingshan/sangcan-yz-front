<template>
  <div>
    <el-dialog title="套餐详情" :visible.sync="packageDialog" width="500px">
      <div style="padding: 24px">
        <div style="margin-bottom: 10px">套餐名称:{{ name }}</div>
        <div style="margin-bottom: 10px">生效时间:{{ effectOfTime }}</div>
        <div style="margin-bottom: 10px">到期时间:{{ dueToTime }}</div>
      </div>
      <div>
        <div
          style="display: flex; justify-content: flex-end; padding: 10px 16px"
        >
          <el-button @click="packageDialog = false">取消</el-button>
          <el-button type="primary" @click="dissociated">解除关联</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "PackageDialog",
  data() {
    return {
      name: "7天云存储",
      effectOfTime: "2022-06-06 00:00:00",
      dueToTime: "2022-06-08 00:00:00",
      packageDialog: false,
    };
  },
  methods: {
    dissociated() {},
  },
};
</script>
<style lang="scss" scoped></style>
