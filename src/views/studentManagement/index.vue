<template>
  <div class="app-container sys-content" style="display: flex">
    <el-row>
      <!-- 左边 -->
      <el-col :span="4" style="padding: 20px 15px">
        <el-input
          prefix-icon="el-icon-search"
          style="margin-bottom: 12px"
          placeholder="搜索组织名称"
          v-model="filterText"
          clearable
        >
        </el-input>
        <el-tree
          style="max-width: 350px"
          :load="treeLoad"
          lazy
          node-key="id"
          class="filter-tree"
          :data="treeData"
          :props="treeProps"
          :highlight-current="true"
          ref="tree"
          @node-click="nodeClickEvent"
          :default-expanded-keys="defExpandDevs"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <img
              v-if="data.schoolFlag"
              src="../../assets/studentManagement/xuexiao.png"
              style="vertical-align: middle; margin-right: 5px"
            />

            <span style="font-size: 14px" :title="node.label">{{
              node.label
            }}</span>
            <el-popover
              placement="right"
              width="200"
              trigger="hover"
              style="margin-left: 20px"
            >
              <div class="prover">
                <el-button @click="editOrganization(data)">
                  <i class="el-icon-edit" />
                  修改组织名称</el-button
                >
                <el-button
                  @click="addOrganizations(data)"
                  v-if="!data.schoolFlag"
                >
                  <i class="el-icon-plus" />
                  添加下级组织</el-button
                >
                <el-button
                  v-if="data.schoolFlag"
                  @click="moveOrganizations(data)"
                >
                  <i class="el-icon-plus" />
                  移动到</el-button
                >
                <el-button @click="toDeleteOrganization(data)">
                  <i class="el-icon-delete-solid" />删除组织</el-button
                >
              </div>
              <!-- 1 -->
              <i slot="reference" class="el-icon-more" />
            </el-popover>
          </span>
        </el-tree>
      </el-col>
      <!-- 右边 -->
      <el-col :span="20" style="padding: 13px; border-left: 1px solid #ccc">
        <div class="fusion-resources-video-monitor-title-bar-container">
          <span class="title-bar-title">{{ currentSelectedOrgName }}</span>
        </div>
        <!-- 搜索 +新增 -->
        <el-row style="margin-top: 20px; display: flex">
          <el-form
            style="display: flex; flex: 1; text-align: center"
            :model="searchForm"
            label-width="80px"
            label-position=""
          >
            <el-form-item label="姓名">
              <el-input
                placeholder="请输入姓名"
                v-model="searchForm.studentName"
                :disabled="buttonIsDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓别">
              <el-select
                v-model="searchForm.sex"
                placeholder="请选择性别"
                :disabled="buttonIsDisabled"
              >
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input
                :disabled="buttonIsDisabled"
                placeholder="请输入联系人号码"
                v-model="searchForm.liaisonPhone"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="searchStudents"
                :disabled="buttonIsDisabled"
                >搜索</el-button
              >
              <el-button
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery"
                :disabled="buttonIsDisabled"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 按钮组 -->
        <div style="margin-bottom: 10px">
          <el-button
            plain
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="height: 30px"
            @click="addStudentsInfoDialog"
            :disabled="buttonIsDisabled"
            >新增</el-button
          >
          <el-button
            icon="el-icon-delete"
            size="mini"
            style="height: 30px"
            type="danger"
            plain
            @click="batchDeleteStudentInfo"
            :disabled="buttonIsDisabled"
            >删除</el-button
          >
          <el-button
            icon="el-icon-download"
            size="mini"
            style="height: 30px"
            type="success"
            plain
            :disabled="buttonIsDisabled"
            @click="importExcelDialog = true"
          >
            导入</el-button
          >
          <el-button
            icon="el-icon-upload2"
            size="mini"
            style="height: 30px"
            type="warning"
            plain
            :disabled="buttonIsDisabled"
            @click="exportStudentsInfo"
          >
            导出</el-button
          >
        </div>
        <!-- 表格 -->
        <div>
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            height="550"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
          >
            <div slot="empty">
              <el-empty description="暂无用户" />
            </div>
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="序号" width="80">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>

            <el-table-column
              prop="studentName"
              label="姓名"
              sortable="custom"
              style="line-height: 34px"
            >
            </el-table-column>
            <el-table-column prop="sex" label="性别">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.sex === "1" ? "女" : "男" }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="studentClass" label="所属组织" width="250">
            </el-table-column>

            <el-table-column
              prop="studentId"
              sortable
              label="学生证号码"
              width="200"
            >
            </el-table-column>
            <el-table-column prop="avatar" label="正面免冠照" width="150">
              <template slot-scope="scope">
                <span v-if="!scope.row.avatar">-</span>
                <img
                  v-if="scope.row.avatar"
                  @click="toUploadPictures(scope.row)"
                  style="width: 18px; height: 18px"
                  src="../../assets//studentManagement/zhaopian.png"
                />
              </template>
            </el-table-column>
            <el-table-column prop="liaisonName" label="联系人姓名" width="150">
            </el-table-column>
            <el-table-column prop="liaisonPhone" label="联系人号码" width="150">
            </el-table-column>
            <el-table-column label="操作" width="220" fixed="right">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.avatar"
                  type="text"
                  icon="el-icon-picture"
                  @click="toUploadPictures(scope.row)"
                  >上传图片</el-button
                >
                <el-button
                  type="text"
                  @click="editStudentInfo(scope.row)"
                  icon="el-icon-edit-outline"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="deleteStudentInfo(scope.row)"
                  icon="el-icon-delete"
                  style="color: red"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="searchForm.current"
            :limit.sync="searchForm.pageSize"
            @pagination="getList"
            :hide-on-single-page="false"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 新增和编辑弹窗 -->
    <el-dialog
      @open="openDialog"
      top="2%"
      style="margin-bottom: 2%"
      :title="dialogTitle"
      :visible.sync="studentInfoDialog"
      width="45%"
      append-to-body
      @close="closeStudentInfoDialog"
    >
      <div>
        <el-form
          style="width: 100%"
          :model="studentInfoDialogForm"
          :rules="studentInfoDialogFormRules"
          ref="studentInfoDialogFormRef"
        >
          <el-form-item label="姓名:" prop="studentName">
            <el-input
              placeholder="请输入学生姓名"
              v-model="studentInfoDialogForm.studentName"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" style="width: 100%">
            <el-select
              v-model="studentInfoDialogForm.sex"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属机构:">
            <el-cascader
              style="width: 100%"
              clearable
              v-model="studentInfoDialogForm.studentOrgId"
              @change="handleChange"
              :props="orgProps"
              :options="orgOptions"
              :disabled="true"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所在班级:">
            <el-input
              placeholder="请输入所在班级"
              v-model="studentInfoDialogForm.studentClass"
            ></el-input>
          </el-form-item>
          <el-form-item label="学生证号码:" prop="studentId">
            <el-input
              placeholder="请输入学生证号码"
              v-model="studentInfoDialogForm.studentId"
            ></el-input>
          </el-form-item>

          <el-form-item label="联系人姓名:" prop="liaisonName">
            <el-input
              placeholder="请输入联系人姓名"
              v-model="studentInfoDialogForm.liaisonName"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人手机:" prop="liaisonPhone">
            <el-input
              placeholder="请输入联系人手机号码"
              v-model="studentInfoDialogForm.liaisonPhone"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="正面免冠照片:"
            prop="avatar"
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            "
          >
            <div style="display: flex; align-items: flex-end">
              <el-image
                style="width: 160px; height: 200px; background-color: #f5f5f5"
                :src="dialogImgUrl"
                :preview-src-list="[dialogImgUrl]"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <img src="../../assets/studentManagement/JPG.png" />
                  <img src="../../assets/studentManagement/JPG备份.png" />
                </div>
              </el-image>
              <div style="margin-left: 10px">
                <div style="display: flex">
                  <el-upload
                    class="upload-demo"
                    :action="uploadurl()"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess1"
                    style="margin-right: 16px"
                  >
                    <el-button>上传</el-button>
                  </el-upload>
                  <el-button @click="dialogDeleteUpload" style="height: 36px"
                    >删除</el-button
                  >
                </div>
                <span style="font-size: 12px; color: #c0c4cc; font-size: 12px">
                  请上传正面免冠照，露出眼睛和眉毛；图片文件支持JPG丶PNG格式;图片文件大小200K-2M
                </span>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="closeStudentInfoDialog">取消</el-button>
            <el-button type="primary" @click="addStudentsInfo">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 修改组织/修改弹窗 -->
    <el-dialog
      :title="orgTitle"
      :visible.sync="modifyName"
      width="25%"
      append-to-body
    >
      <el-form label-width="80px">
        <el-form-item label="组织名称:">
          <el-input
            placeholder="请输入组织名称"
            v-model="newOrgName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="modifyName = false">取消</el-button>
          <el-button type="primary" @click="commitChangesName">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 上传照片的弹窗 -->
    <el-dialog
      title="正面免冠照"
      :visible.sync="photoDialog"
      width="25%"
      @open="openPhotoDialog"
      @close="closePhotosDialog"
      append-to-body
    >
      <div style="text-align: center; padding: 15px">
        <div>
          <span style="color: #c0c4cc"> {{ studentsClass }} </span>
          <span>{{ studentsName }}</span>
        </div>
        <el-image
          style="width: 160px; height: 200px; background-color: #f5f5f5"
          :src="this.imgUrl"
          :preview-src-list="[this.imgUrl]"
        >
          <div
            slot="error"
            class="image-slot"
            style="
              width: 100%;
              height: 100%;
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <img src="../../assets/studentManagement/JPG.png" />
            <img src="../../assets/studentManagement/JPG备份.png" />
          </div>
        </el-image>
        <div style="margin-top: 18px; display: flex; justify-content: center">
          <el-upload
            class="upload-demo"
            :action="uploadurl()"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            style="margin-right: 16px"
          >
            <el-button>上传</el-button>
          </el-upload>
          <el-button @click="deleteUpload">删除</el-button>
        </div>
        <div
          style="
            width: 228px;
            color: #c0c4cc;
            font-size: 12px;
            margin: 0 auto;
            text-align: left;
            margin-top: 18px;
          "
        >
          请上传正面免冠照，露出眼睛和眉毛；图片文件支持JPG丶PNG格式;图片文件大小200K-2M
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 30px">
        <el-button @click="cancelUpload">取消</el-button>
        <el-button type="primary" @click="commitPhotoChanges">确认</el-button>
      </div>
    </el-dialog>

    <!-- 移动组织的弹窗 -->
    <el-dialog
      title="移动组织"
      :visible.sync="moveOrganization"
      width="25%"
      append-to-body
      @close="moveOrgId = null"
    >
      <el-form label-width="80px">
        <el-form-item label="组织名称:">
          <el-cascader
            style="width: 100%"
            clearable
            v-model="moveOrgId"
            @change="handleChange1"
            :props="orgProps"
            :options="orgOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="
              moveOrganization = false;
              moveOrgId = null;
            "
            >取消</el-button
          >
          <el-button type="primary" @click="commitChangesOrg">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 导入的弹窗 -->
    <el-dialog
      class="excelDialog"
      title="批量导入学生信息"
      :visible.sync="importExcelDialog"
      width="40%"
      @close="closeExcelDialog"
      append-to-body
    >
      <a href="https://36.133.152.103:31012/template.xlsx" download>
        <el-button type="text" icon="el-icon-download">
          下载导入学生信息模板表格
        </el-button>
      </a>
      <el-upload
        :on-success="handleUploadSuccess"
        ref="upload"
        :file-list="fileList"
        :auto-upload="false"
        class="upload-demo1"
        drag
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :action="toImportStudentsInfo()"
        multiple
        style="width: 100%"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          下载模板并完善信息后,可将文件拖拽到此处进行上传,支持格式:XSLS,XLSX
        </div>
      </el-upload>
      <div style="text-align: right">
        <el-button @click="importExcelDialog = false">取消</el-button>
        <el-button @click="submitUpload">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import {
  studentList,
  addStudents,
  getTreeList,
  deleteStudents,
  updateStudents,
  updateOrg,
  addOrganization,
  batchDeletestudents,
  previewPhotos,
  UploadPhotos,
  deletePhotos,
  deleteOrganization,
  exportStudentInfo,
} from "@/api/studentManagement/index.js";

export default {
  name: "StudentInfo",
  components: {},
  watch: {
    filterText(val) {
      this.keyword = val;
      this.getTreeData();
    },
  },
  data() {
    var validaPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入联系人号码"));
      } else if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号格式"));
      } else {
        callback();
      }
    };
    return {
      fileList: [], //上传文件的列表
      importExcelDialog: false, //导入表格的弹窗
      keyword: "", //过滤
      timer: null,
      moveOrgId: null, //移动组织级联选择器的值
      moveOrganization: false, //移动组织的弹窗
      photoDialog: false, //照片弹窗
      fileList: [], //图片
      defExpandDevs: [], //默认展开
      loading: false, //遮罩层
      orgTitle: null, //修改组织标题
      newParentId: null,
      newOrgId: null,
      newOrgName: null,
      modifyName: false, //修改名称弹窗
      orgProps: {
        label: "label",
        value: "id",
        checkStrictly: true,
      },
      treeProps: {
        label: (data, node) => {
          var label = data.label;

          return label;
        },
        isLeaf: (data, node) => {
          return this.treeLeaf(data);
        },
      },
      orgOptions: [],
      currentSelectedOrgName: null, //右侧标题
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      sexOptions: [
        {
          value: "0",
          label: "男",
        },
        {
          value: "1",
          label: "女",
        },
      ],
      studentInfoDialogFormRules: {
        studentId: [
          { required: true, message: "请输入学生证号码", trigger: "blur" },
        ],
        studentName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" },
        ],
        liaisonPhone: [{ validator: validaPhone, trigger: "change" }],
        liaisonName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
      },

      studentInfoDialogForm: {
        avatar: null,
        id: null,
        studentClass: null,
        studentOrgId: null,
        sex: null,
        studentId: null,
        studentName: null,
        liaisonPhone: null,
        liaisonName: null,
      },
      dialogImgUrl: null, //编辑弹窗里面的图片
      dialogTitle: null,
      studentInfoDialog: false, //学生信息弹窗
      headers: { "Content-Type": "multipart/form-data;charset=UTF-8" },
      dialogVisible: false, //导入弹窗
      searchForm: {
        sortField: null, //排序名称
        sortOrder: null, //排序类型
        studentOrgId: null,
        studentName: null,
        sex: null,
        liaisonName: null,
        liaisonPhone: null,
        studentId: null,
        pageSize: 10, //条数
        current: 1, //页码
      },
      total: 0, // 总条数
      tableData: [],
      treeData: [],
      isEdit: null,
      higherId: null,
      isAdd: null,
      multipleSelection: [], //多选
      buttonIsDisabled: true, //按钮禁用
      newStudentOrgId: null, //学生组织id
      imgUrl: null, //学生照片
      studentsId: null, //学生ID
      fileKey: null, //上传图片的key值
      studentsClass: null, //弹窗标题的班级
      studentsName: null, //弹窗标题的名字
      photoDialogData: null, //照片弹窗的数据
    };
  },
  created() {
    this.currentSelectedOrgName = sessionStorage.getItem("tenantName");
  },
  methods: {
    //懒加载树
    treeLoad(node, resolve) {
      let orgId;
      if (node.data) {
        orgId = node.data.id;
      }
      getTreeList({ id: orgId })
        .then((ret) => {
          if (node.level == 0) {
            this.defExpandDevs.push(ret[0].id);
          }
          let orgList = [];
          if (node.level == 0) {
            orgList = ret;
          } else {
            orgList = ret[0].children || [];
          }
          resolve(orgList);
        })
        .catch(() => {});
    },
    treeLeaf(data) {
      if (
        data.children === 0 ||
        data.children === undefined ||
        data.children === null
      ) {
        return true;
      } else {
        return false;
      }
    },
    //过滤树
    getTreeData() {
      const param = {
        id: "",
        orgName: this.keyword,
      };
      // 清除上一次计时器
      if (this.timer) clearTimeout(this.timer);
      // 重新设置计时器
      this.timer = setTimeout(async () => {
        // 在这里执行防抖函数的处理逻辑，利用箭头函数绑定了正确的 this 对象
        const res = await getTreeList(param);
        this.treeData = res;
      }, 500);
    },

    //修改组织名称
    editOrganization(data) {
      this.isAdd = false;
      this.orgTitle = "修改组织名称";
      this.modifyName = true;
      this.newOrgName = data.label;
      this.newOrgId = data.id;
      this.newParentId = data.parentId;
    },
    async commitChangesName() {
      if (!this.isAdd) {
        const res = await updateOrg({
          id: this.newOrgId,
          orgName: this.newOrgName,
          parentId: this.newParentId,
        });
        this.$message({
          message: "修改名称成功",
          type: "success",
        });
        this.getAgencyTreelist();
        this.modifyName = false;
        this.currentSelectedOrgName = this.newOrgName;
      } else {
        const res = await addOrganization({
          parentId: this.higherId,
          orgName: this.newOrgName,
        });
        this.$message({
          message: "新增组织成功",
          type: "success",
        });
        this.getAgencyTreelist();
        this.modifyName = false;
      }
    },
    //添加下级组织
    addOrganizations(data) {
      this.isAdd = true;
      this.orgTitle = "添加下级组织";
      this.higherId = data.id;
      this.modifyName = true;
      this.newOrgName = null;
    },
    //删除组织
    toDeleteOrganization(data) {
      this.$confirm(`确认删除${data.label}的信息吗?`, "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          await deleteOrganization(data.id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });

          if (!data.children) {
            this.currentSelectedOrgName = sessionStorage.getItem("tenantName");
          }

          this.getAgencyTreelist();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //移动组织
    moveOrganizations(data) {
      this.cascadeSelector();
      this.moveOrganization = true;
      this.newOrgId = data.id;
    },
    handleChange1(e) {
      this.moveOrgId = e[e.length - 1];
    },
    async commitChangesOrg() {
      const res = await updateOrg({
        id: this.newOrgId,
        parentId: this.moveOrgId,
      });

      this.$message({
        message: "移动组织成功",
        type: "success",
      });
      this.moveOrganization = false;
      this.getAgencyTreelist();
    },

    //级联选择器
    handleChange(e) {
      this.studentInfoDialogForm.studentOrgId = e[e.length - 1];
    },
    //节点点击事件
    nodeClickEvent(node, data) {
      if (data.isLeaf === true) {
        this.buttonIsDisabled = !data.data.schoolFlag;
        this.currentSelectedOrgName = data.data.label;
        this.searchForm.studentOrgId = data.data.id;
        this.studentInfoDialogForm.studentOrgId = data.data.id;
        this.newStudentOrgId = data.data.id;
        this.getList();
      }
    },
    //获取树数据
    async getAgencyTreelist() {
      const res = await getTreeList({ id: "", orgName: "" });
      this.treeData = res;
    },

    //级联选择器
    async cascadeSelector() {
      const res = await getTreeList({ id: "" || "", orgName: "" });
      this.orgOptions = res;
    },
    //点击编辑
    editStudentInfo(row) {
      this.cascadeSelector();
      this.studentInfoDialogForm.id = row.id;
      this.studentInfoDialogForm.studentClass = row.studentClass;
      this.studentInfoDialogForm.studentOrgId = row.studentOrgId;
      this.studentInfoDialogForm.sex = row.sex;
      this.studentInfoDialogForm.studentId = row.studentId;
      this.studentInfoDialogForm.studentName = row.studentName;
      this.studentInfoDialogForm.liaisonPhone = row.liaisonPhone;
      this.studentInfoDialogForm.liaisonName = row.liaisonName;
      this.studentInfoDialogForm.avatar = row.avatar;
      this.isEdit = true;
      this.dialogTitle = "编辑学生信息";
      this.studentInfoDialog = true;
    },
    //新增学生
    addStudentsInfoDialog() {
      this.cascadeSelector();
      this.isEdit = false;
      this.dialogTitle = "新增学生信息";
      this.studentInfoDialog = true;
    },

    //新增/编辑学生信息
    addStudentsInfo() {
      this.$refs.studentInfoDialogFormRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit === true) {
            await updateStudents(this.studentInfoDialogForm);
            this.$message({
              message: "编辑学生信息成功",
              type: "success",
            });
          } else {
            await addStudents(this.studentInfoDialogForm);
            this.$message({
              message: "新增学生信息成功",
              type: "success",
            });
          }

          this.studentInfoDialog = false;
          this.getList();
        } else {
          return false;
        }
      });
    },
    //打开弹窗的回调
    openDialog() {
      if (this.studentInfoDialogForm.avatar) {
        this.$nextTick(async () => {
          const res = await previewPhotos(this.studentInfoDialogForm.avatar);
          this.dialogImgUrl = res;
        });
      }
    },
    //关闭学生新增和编辑的回调
    closeStudentInfoDialog() {
      this.studentInfoDialogForm = {
        avatar: null,
        studentClass: null,
        studentOrgId: this.studentInfoDialogForm.studentOrgId,
        sex: null,
        studentId: null,
        studentName: null,
        liaisonPhone: null,
        liaisonName: null,
      };

      this.dialogImgUrl = null;
      this.$refs.studentInfoDialogFormRef.resetFields();
      this.studentInfoDialog = false;
    },
    //获取列表数据
    getList() {
      this.loading = true;
      studentList(this.searchForm).then((response) => {
        this.total = response.total;
        this.tableData = response.records;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    searchStudents() {
      this.searchForm.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.searchForm = {
        studentOrgId: this.newStudentOrgId,
        name: null,
        liaisonPhone: null,
        liaisonName: null,
        pageSize: 10,
        current: 1,
      };
      this.getList();
    },
    //删除学生
    deleteStudentInfo(row) {
      this.$confirm(
        `确认删除${row.studentClass + row.studentName}信息`,
        "删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      )
        .then(async () => {
          await deleteStudents(row.id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //排序
    sortChange(column) {
      let prop = null;
      if (column.prop === "studentName") {
        prop = "student_name";
      } else if (column.prop === "studentId") {
        prop = "student_id";
      } else {
        prop = null;
      }
      this.searchForm.sortField = prop;
      this.searchForm.sortOrder = column.order;
      this.getList();
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    batchDeleteStudentInfo() {
      let arr = [];
      this.multipleSelection.forEach((item) => {
        return arr.push(item.id);
      });
      this.$confirm(
        `确认删除${
          this.multipleSelection[0].studentClass +
          this.multipleSelection[0].studentName
        }...等${this.multipleSelection.length}人信息?`,
        "删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      )
        .then(async () => {
          await batchDeletestudents({ studentIds: arr });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //上传图片地址
    uploadurl() {
      return (
        process.env.VUE_APP_BASE_API +
        "/jxict-project-sso/student/avatar/upload?fileKey="
      );
    },
    //上传照片弹窗
    async openPhotoDialog() {
      this.studentsId = this.photoDialogData.id;
      this.studentsName = this.photoDialogData.studentName;
      this.studentsClass = this.photoDialogData.studentClass;
      if (this.photoDialogData.avatar) {
        const img = await previewPhotos(this.photoDialogData.avatar);
        this.imgUrl = img;
        this.fileKey = this.photoDialogData.avatar;
      }
    },
    toUploadPictures(row) {
      this.photoDialog = true;
      let obj = Object.assign({}, row);

      this.photoDialogData = obj;
    },
    //限制图片类型
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return (isJPG && isLt2M) || (isPNG && isLt2M);
    },
    //上传成功的回调
    async handleAvatarSuccess(res) {
      let key = res.data;
      const img = await previewPhotos(key);
      this.imgUrl = img;
      this.fileKey = key;
    },

    async handleAvatarSuccess1(res) {
      let key = res.data;
      previewPhotos(key).then((res) => {
        const img = res;
        this.dialogImgUrl = img;
        this.studentInfoDialogForm.avatar = key;
        if (this.isEdit === true) {
          updateStudents(this.studentInfoDialogForm).then((res) => {
            this.getList();
          });
        }
      });
    },

    //提交修改
    async commitPhotoChanges() {
      const res = await updateStudents({
        avatar: this.fileKey,
        id: this.studentsId,
      });
      this.fileKey = null;
      this.photoDialog = false;
      this.getList();
    },
    //删除照片
    async deleteUpload() {
      if (this.fileKey) {
        deletePhotos(this.fileKey).then(() => {
          this.photoDialogData.avatar = "";
          this.imgUrl = null;
          this.fileKey = null;
          updateStudents(this.photoDialogData).then((res) => {
            this.getList();
          });
        });
      }
    },
    //取消上传
    cancelUpload() {
      this.photoDialog = false;
    },
    closePhotosDialog() {
      if (!this.photoDialogData.avatar) {
        deletePhotos(this.fileKey).then(() => {
          this.imgUrl = null;
          this.fileKey = null;
        });
      } else {
        this.imgUrl = null;
        this.fileKey = null;
      }
    },
    //弹窗里面的删除
    dialogDeleteUpload() {
      deletePhotos(this.studentInfoDialogForm.avatar).then(() => {
        this.studentInfoDialogForm.avatar = "";
        if (!!this.isAdd) {
          updateStudents(this.studentInfoDialogForm).then((res) => {
            this.dialogImgUrl = null;
            this.getList();
          });
        } else {
          this.dialogImgUrl = null;
        }
      });
    },
    //导出学生信息
    async exportStudentsInfo() {
      const res = await exportStudentInfo(this.searchForm.studentOrgId);
      FileSaver.saveAs(res, "学生信息表.xlsx");
    },
    //导入学生信息的地址
    toImportStudentsInfo() {
      return (
        process.env.VUE_APP_BASE_API +
        "/jxict-project-sso/student/importExcel?studentOrgId=" +
        this.searchForm.studentOrgId
      );
    },
    //关闭弹窗
    closeExcelDialog() {
      this.$refs.upload.clearFiles();
    },
    //点击确认上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    //上传成功的回调
    handleUploadSuccess(response, file, fileList) {
      this.importExcelDialog = false;
      // 处理上传成功的逻辑
      this.$message({
        type: "success",
        message: "上传成功!",
      });
      this.getList();
      // 清空文件列表
      this.$refs.upload.clearFiles();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-table-column--selection .cell {
  padding-left: 14px !important;
}

::v-deep .el-tree {
  min-height: 600px;
  background: none !important;
  box-sizing: content-box;
  overflow: auto;
  margin-right: 10px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep .el-tree-node {
  /*设置横向滚动条*/
  min-width: 100% !important;
  display: block !important;
  float: left;
}
::v-deep .upload-demo1 {
  width: 100%;
}
::v-deep .upload-demo1 .el-upload--text {
  height: 200px;
  width: 100%;
}
::v-deep .upload-demo1 .el-upload-dragger {
  width: 100%;
  background-color: #dddfe6;
  margin-top: 10px;
  margin-bottom: 40px;
}
::v-deep .el-dialog__body {
  padding: 19px 32px 24px;
}

::v-deep .el-dialog__header {
  height: 54px;
  padding: 17px 32px;
  font-weight: 500;
  line-height: 20px;
}

.prover {
  display: flex;
  flex-direction: column;
  /* width: 10vw; */
  align-items: center;

  .el-button--medium {
    border: 0;
    width: 100%;
    display: flex;
    margin-left: 0;

    i {
      margin-right: 5px;
    }
  }
}
.el-icon-more {
  font-size: 13px;
  transform: rotateZ(90deg);
  // display: block;
  opacity: 0;
}
::v-deep .el-tree-node__content:hover .el-icon-more {
  opacity: 1;
}

::v-deep .is-sortable {
  line-height: 34px;
}

.left-right {
  font-size: 13px;
  color: #409eff;
  cursor: pointer;
  font-weight: normal;
}
.sys-content {
  display: flex;
  flex-direction: column;
}
.fusion-resources-video-monitor-title-bar-container {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;

  height: 36px;
  justify-content: space-between;
  padding-left: var(--frvm-space-level-5);
  padding-right: var(--frvm-space-level-3);
  width: 100%;
}
.fusion-resources-video-monitor-title-bar-container .title-bar-title {
  font-size: 16px;
  font-weight: 600;
  color: #2b2f3a;
}
// .fusion-resources-video-monitor-title-bar-container .title-bar-title:before {
//   // border-left: 3px solid #46a0fc;
//   content: "";
//   display: inline-block;
//   height: 10px;
//   margin-right: 0.52vw;
//   width: 0;
// }
// /* WebKit（Chrome、Safari）浏览器 */
// ::-webkit-scrollbar {
//   width: 3px; /* 设置滚动条宽度 */
// }

// ::-webkit-scrollbar-thumb {
//   background-color: #c1c1c1; /* 设置滚动条颜色 */
// }

// /* Firefox（Gecko）浏览器 */
// ::-moz-scrollbar {
//   width: 3px; /* 设置滚动条宽度 */
// }

// ::-moz-scrollbar-thumb {
//   background-color: #c1c1c1; /* 设置滚动条颜色 */
// }
</style>
