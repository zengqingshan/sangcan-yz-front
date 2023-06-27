<template>
	<div>
		<div class="auth-container">
			<el-tree :data="data" show-checkbox ref="tree" default-expand-all :default-checked-keys="getAbilityTree" node-key="treeId" :disabled="treeDisabled" :props="defaultProps">
			</el-tree>
	
		</div>
		<div>
					<el-row style="text-align: center;margin-top: 20px;">
				<el-button type="primary" @click="save">确认</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-row>
		</div>
	</div>
</template>

<script>
import { abilityTree } from "@/api/platform";
import { shareRel } from "@/api/abilitySharing/shareApp";
export default {
    name: "authEquipment",
    data() {
        return {
            data: [],
            checkedList: [],
            defaultProps: {
                children: "children",
                label: "value",
            },
        };
    },
    props: ["editRow", "getAbilityTree"],
    mounted() {
        abilityTree({}).then((data) => {
            this.dealData(data);
        });
    },
    methods: {
        dealData(data) {
            this.data = data.map((it) => {
                it.key = it.item.key;
                it.value = it.item.value;
                if (it.children?.length) {
                    this.dealData(it.children);
                }
                return it;
            });
        },

        // 筛选节点
        treeDisabled(value, data) {
            return data.disabled || (!data.isDevice && !data.children);
        },
        cancel() {
            this.$emit("cancel");
        },
        save() {
            shareRel({
                apiIdList: this.$refs.tree
                    .getCheckedNodes()
                    .map((item) => item.key),
                shareAppId: this.editRow.id,
            }).then(() => {
                this.msgSuccess("编辑成功");
            });
        },
    },
};
</script>

<style scoped lang="scss">
.auth-container {
    padding: 0 20px;
    max-height: calc(100vh - 300px);
    overflow: auto;
}
</style>
