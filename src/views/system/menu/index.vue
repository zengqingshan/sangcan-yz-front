<template>
    <div class="app-container">
        <el-col :span="24" :xs="24" style="padding: 0 10px">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
                <el-form-item label="菜单名称" prop="name">
                    <el-input maxlength="32" v-model="queryParams.name" placeholder="请输入菜单名称" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
                        <el-option v-for="dict in statusOptions" :key="dict.key" :label="dict.value" :value="dict.key" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="primary" plain icon="el-icon-plus" size="small" @click="handleAdd" v-hasPermi="['system:menu:add']">新增</el-button>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <!--      <el-row :gutter="10" class="mb8">-->
            <!--        <el-col :span="1.5">-->
            <!--          <el-button-->
            <!--            type="primary"-->
            <!--            plain-->
            <!--            icon="el-icon-plus"-->
            <!--            size="small"-->
            <!--            @click="handleAdd"-->
            <!--            v-hasPermi="['system:menu:add']"-->
            <!--          >新增</el-button>-->
            <!--        </el-col>-->
            <!--        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
            <!--      </el-row>-->

            <el-table v-loading="loading" :data="menuList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <div slot="empty">
                    <el-empty description="暂无数据"></el-empty>
                </div>
                <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
                <el-table-column prop="icon" label="图标" align="center" width="100">
                    <template slot-scope="scope">
                        <svg-icon :icon-class="scope.row.icon" />
                    </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
                <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80"></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" icon="iconfont icon-pen" @click="handleUpdate(scope.row)" v-hasPermi="['system:menu:edit']"><span class="text">编辑</span></el-button>
                        <el-button size="small" type="text" icon="el-icon-plus" class="iconfont" @click="handleAdd(scope.row)" v-hasPermi="['system:menu:add']"><span class="text">新增</span></el-button>
                        <el-button size="small" type="text" icon="iconfont icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:menu:remove']"><span class="text">删除</span></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>

        <!-- 添加或编辑菜单对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级菜单">
                            <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true" placeholder="选择上级菜单" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="菜单类型" prop="menuType">
                            <el-radio-group v-model="form.menuType">
                                <el-radio label="M">目录</el-radio>
                                <el-radio label="C">菜单</el-radio>
                                <el-radio label="F">按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
                            <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
                                <IconSelect ref="iconSelect" @selected="selected" />
                                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" clearable>
                                    <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                                </el-input>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="name">
                            <el-input maxlength="32" v-model="form.name" placeholder="请输入菜单名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="orderNum">
                            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.menuType != 'F'" label="是否外链">
                            <el-radio-group v-model="form.frameFlag">
                                <el-radio v-for="dict in targetOptions" :key="dict.key" :label="dict.key">{{dict.value}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.menuType != 'F'" label="路由地址" prop="path">
                            <el-input v-model="form.path" placeholder="请输入路由地址" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item label="组件路径" prop="component">
                            <el-input v-model="form.component" placeholder="请输入组件路径" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.menuType != 'M'" label="权限标识">
                            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.menuType != 'F'" label="显示状态">
                            <el-radio-group v-model="form.visible">
                                <el-radio v-for="dict in visibleOptions" :key="dict.key" :label="dict.key">{{dict.value}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in statusOptions" :key="dict.key" :label="dict.key">{{dict.value}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.menuType == 'C'" label="是否缓存">
                            <el-radio-group v-model="form.cacheFlag">
                                <el-radio v-for="dict in cacheOptions" :key="dict.key" :label="dict.key">{{dict.value}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.menuType == 'C'" label="菜单类型">
                            <el-radio-group v-model="form.appType">
                                <el-radio :key="0" :label="0">PC端</el-radio>
                                <el-radio :key="1" :label="1">小程序端</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listMenu,
    getMenu,
    delMenu,
    addMenu,
    updateMenu,
} from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
    name: "Menu",
    components: { Treeselect, IconSelect },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 应用名
            appName: undefined,
            // 显示搜索条件
            showSearch: true,
            // 应用列表数据
            applicationList: [],
            // 选中的应用
            appCode: "DEFAULT",
            // 菜单表格树数据
            menuList: [],
            // 菜单树选项
            menuOptions: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 是否外链数据字典
            targetOptions: [],
            // 显示状态数据字典
            visibleOptions: [],
            // 菜单状态数据字典
            statusOptions: [],
            // 菜单状态数据字典
            cacheOptions: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            // 查询参数
            queryParams: {
                tenantId: this.$store.getters.user.tenantId,
                name: undefined,
                visible: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                name: [
                    {
                        required: true,
                        message: "菜单名称不能为空",
                        trigger: "blur",
                    },
                ],
                orderNum: [
                    {
                        required: true,
                        message: "菜单顺序不能为空",
                        trigger: "blur",
                    },
                ],
                path: [
                    {
                        required: true,
                        message: "路由地址不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    watch: {
        // 根据名称筛选部门树
        appName(val) {
            this.$refs.tree.filter(val);
        },
    },
    created() {
        this.getList();
        this.getDicts("menu_target").then((response) => {
            this.targetOptions = response;
        });
        this.getDicts("menu_show").then((response) => {
            this.visibleOptions = response;
        });
        this.getDicts("menu_status").then((response) => {
            this.statusOptions = response;
        });
        this.getDicts("menu_cache").then((response) => {
            this.cacheOptions = response;
        });
    },
    methods: {
        // 选择图标
        selected(name) {
            this.form.icon = name;
        },
  
        /** 查询菜单列表 */
        getList() {
            this.loading = true;
            listMenu({ ...this.queryParams, appCode: this.appCode }).then(
                (response) => {
                    this.menuList = this.handleTree(response);
                    this.loading = false;
                }
            );
        },
        /** 转换菜单数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.name,
                children: node.children,
            };
        },
        /** 查询菜单下拉树结构 */
        getTreeselect() {
            listMenu({ ...this.queryParams, appCode: this.appCode }).then(
                (response) => {
                    this.menuOptions = [];
                    const menu = { id: 0, name: "主类目", children: [] };
                    menu.children = this.handleTree(response);
                    this.menuOptions.push(menu);
                }
            );
        },
        // 显示状态字典翻译
        visibleFormat(row, column) {
            if (row.menuType == "F") {
                return "";
            }
            return this.selectDictLabel(this.visibleOptions, row.visible);
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 菜单状态字典翻译
        statusFormat(row, column) {
            if (row.menuType == "F") {
                return "";
            }
            return this.selectDictLabel(this.statusOptions, row.status);
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                parentId: 0,
                name: undefined,
                icon: undefined,
                menuType: "M",
                orderNum: undefined,
                frameFlag: "1",
                cacheFlag: "1",
                visible: "0",
                status: "0",
                appType: 0,
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 点击树节点 */
        handleNodeClick(item) {
            this.appCode = item.appCode;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.reset();
            this.getTreeselect();
            if (row != null && row.id) {
                this.form.parentId = row.id;
            } else {
                this.form.parentId = 0;
            }
            this.form.appCode = this.appCode;
            this.open = true;
            this.title = "添加菜单";
        },
        /** 编辑按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            getMenu(row.id).then((response) => {
                this.form = response;
                this.open = true;
                this.title = "编辑菜单";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updateMenu(this.form).then((response) => {
                            this.msgSuccess("编辑成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addMenu(this.form).then((response) => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm("是否确认删除所选的数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return delMenu({ menuId: row.id });
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
    },
};
</script>
<style lang="scss" scoped>
.iconfont {
    font-size: 16px;
}
.text {
    font-size: 14px;
    margin-left: 4px;
}
</style>
