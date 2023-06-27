<template>
  <div class="videoStorageStrategy_main">

    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="form" :model="sizeForm" :rules="rules" label-width="150px" size="mini">
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备SIP-ID" prop="serviceId">
                <el-input :disabled="true" v-model="sizeForm.serviceId" placeholder="请输入设备SIP-ID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备名称" prop="name">
                <el-input show-word-limit :maxlength="64" v-model="sizeForm.name" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属平台" prop="platformName">
                <el-input :disabled="true" v-model="sizeForm.platformName" placeholder="请输入存储策略名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
              <el-col :span="8">
                <el-form-item label="省市区" prop="division">
                  <el-cascader
                    style="width:100%"
                    :disabled="true"
                    clearable
                    size="mini"
                    v-model="divisionvalue"
                    :props="props"
                    :options="$dt('division')"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="行业编码" prop="industryCode">
                  <el-select
                    style="width: 100%"
                    clearable
                    size="mini"
                    v-model="sizeForm.industryCode"
                    placeholder="请选择行业编码"
                  >
                    <el-option
                      :label="item.dictValue"
                      :value="item.dictKey"
                      v-for="item in $dt('industry_code')"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="场景类型" prop="sceneType">
                  <el-select
                    multiple
                    style="width: 100%"
                    clearable
                    size="mini"
                    v-model="sizeForm.sceneType"
                    placeholder="请选择场景类型"
                  >
                    <el-option
                      :label="item.dictValue"
                      :value="item.dictKey"
                      v-for="item in $dt('scene_type')"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>-->
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备厂家" prop="vendor">
                <el-select style="width: 100%" clearable size="mini" v-model="sizeForm.vendor" placeholder="请选择设备厂家">
                  <el-option :label="item.dictValue" :value="item.dictKey" v-for="item in $dt('vendor')"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型" prop="devCategory">

                <el-select style="width: 100%" clearable size="mini" v-model="sizeForm.devCategory" placeholder="请选择设备类型">
                  <el-option :label="item.dictValue" :value="item.dictKey"
                    v-for="item in $dt('dev_category')"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备型号" prop="model">
                <el-input show-word-limit :maxlength="32" v-model="sizeForm.model" placeholder="请输入设备型号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="设备地址" prop="address">
                <el-input show-word-limit :maxlength="100" v-model="sizeForm.address" placeholder="请输入设备地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经纬度" prop="Latitudeandlongitude">
                <el-input v-model="sizeForm.Latitudeandlongitude" @change="lalongChange" placeholder="请输入经纬度">
                  <el-button slot="append" @click="addlongitude" icon="el-icon-search"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备账号" prop="devUsername">
                <el-input show-word-limit :maxlength="32" v-model="sizeForm.devUsername" placeholder="请输入设备账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备密码" prop="devPassword">
                <el-input show-word-limit :maxlength="32" v-model="sizeForm.devPassword" placeholder="请输入设备密码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接入方式" prop="connetType">
                <el-select style="width: 100%" clearable size="mini" v-model="sizeForm.connetType" placeholder="请选择设备类型">
                  <el-option :label="item.dictValue" :value="item.dictKey" v-for="item in $dt('connet_type')"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="支持红外" prop="isInfrared">
                <el-radio-group v-model="sizeForm.isInfrared">
                  <el-radio-button :label="true">是</el-radio-button>
                  <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="支持夜视" prop="isNightVersion">
                <el-radio-group v-model="sizeForm.isNightVersion">
                  <el-radio-button :label="true">是</el-radio-button>
                  <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="支持云台" prop="isControl">
                <el-radio-group v-model="sizeForm.isControl">
                  <el-radio-button :label="true">是</el-radio-button>
                  <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否共享" prop="isShare">
                <el-radio-group v-model="sizeForm.isShare">
                  <el-radio-button :label="true">是</el-radio-button>
                  <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-col :offset="22">
        <el-button size="mini" type="primary" @click="onSubmit">立即创建</el-button>
        <el-button size="mini" @click="back">返回</el-button>
      </el-col>
    </el-row>

    <el-dialog title="提示" style="margin-top:0px" :visible.sync="dialogVisible" width="70%" append-to-body>
      <Map @click-marker-coor="clickMarkerCoor" :newStyle="newStyle" :type="type"></Map>
      <span slot="footer" class="dialog-footer">
        <div class="tip">
          请点击拖动定位图标，进行经纬度的选择：<span v-if="coor.length">{{ coor[0] }}，{{ coor[1] }}</span>
        </div>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Map from "@/components/Map/index";
import { editdevicename } from "@/api/system/device.js";

export default {
  data () {
    return {
      coor: [],
      newStyle: {
        height: "500px",
      },
      dialogVisible: false,
      type: ["cluster", "geocoder"], // 显示地图类型
      drawer: false, //抽屉
      props: {
        label: "name",
        value: "id",
        checkStrictly: true,
      },
      divisionvalue: [],

      activeName: "first",
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        serviceId: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
        ],
        platformId: [
          { required: true, message: "请输入所属平台", trigger: "blur" },
        ],
        division: [
          { required: true, message: "请输入省市区", trigger: "change" },
        ],
        industryCode: [
          { required: true, message: "请选择行业编码", trigger: "change" },
        ],
        sceneType: [
          { required: true, message: "请选择场景类型", trigger: "change" },
        ],
        vendor: [
          { required: true, message: "请选择设备厂家", trigger: "change" },
        ],
        devType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        Latitudeandlongitude: [
          { required: true, message: "请选择设备经纬度", trigger: "change" },
        ],
        devCategory: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
      },
      Latitudeandlongitude: "",
      sizeForm: {
        name: "",
        serviceId: "",
        vendor: "",
        platformId: "",
        platformName: "",
        industryCode: "",
        division: "",
        sceneType: [],
        devType: "",
        model: "",
        address: "",
        longitude: "",
        isInfrared: "",
        isNightVersion: "",
        isControl: "",
        isShare: "",
        devCategory: "",
        devUsername: "",
        devPassword: "",
        connetType: "",
        latitude: "",
        Latitudeandlongitude: "",
      },
    };
  },

  components: {
    Map,
  },

  computed: {},

  methods: {
    init (form) {
      this.$set(this.sizeForm, 'id', form.id)
      this.$set(this.sizeForm, "name", form.name)
      this.$set(this.sizeForm, "serviceId", form.serviceId)
      this.$set(this.sizeForm, "vendor", form.vendor)
      this.$set(this.sizeForm, "platformId", form.platformId)
      this.$set(this.sizeForm, "platformName", form.platformName)
      this.$set(this.sizeForm, "industryCode", form.industryCode)
      this.$set(this.sizeForm, "division", form.division)
      this.$set(this.sizeForm, "sceneType", form.sceneType)
      this.$set(this.sizeForm, "devType", form.devType)
      this.$set(this.sizeForm, "model", form.model)
      this.$set(this.sizeForm, "address", form.address)
      this.$set(this.sizeForm, "longitude", form.longitude)
      this.$set(this.sizeForm, "isInfrared", form.isInfrared)
      this.$set(this.sizeForm, "isNightVersion", form.isNightVersion)
      this.$set(this.sizeForm, "isControl", form.isControl)
      this.$set(this.sizeForm, "isShare", form.isShare)
      this.$set(this.sizeForm, "devCategory", form.devCategory)
      this.$set(this.sizeForm, "devUsername", form.devUsername)
      this.$set(this.sizeForm, "devPassword", form.devPassword)
      this.$set(this.sizeForm, "connetType", form.connetType)
      this.$set(this.sizeForm, "latitude", form.latitude)
      this.$set(this.sizeForm, "Latitudeandlongitude", form.Latitudeandlongitude)
    },
    lalongChange (e) {
      const laglong = e.split(',');
      if (laglong.length !== 2) {
        this.$message({
          type: 'error',
          message: '请输入正确的经纬度'
        })
        return;
      }
      this.clickMarkerCoor(laglong);
    },
    clickMarkerCoor (e) {
      this.coor = e
      this.sizeForm.longitude = e[0];
      this.sizeForm.latitude = e[1];
    },
    addlongitude () {
      this.dialogVisible = true;
      // this.$message({
      //   message: "选择经纬度",
      // });
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          editdevicename(this.sizeForm).then((res) => {
            this.$router.go(-1);
          });
        }
      });
    },
    back () {
    },
  },
  watch: {
    /*"sizeForm.longitude": function (val) {
      if (val) {
        this.sizeForm.Latitudeandlongitude = [
          this.sizeForm.longitude,
          this.sizeForm.latitude,
        ];
      }
    },*/
  },
  created () {
    // delete this.$route.query.servicePassword;
    // Object.assign(this.sizeForm, this.$route.query);
    this.divisionvalue = [2, 4, 6].reduce((previousValue, currentValue) => {
      return previousValue.indexOf(this.sizeForm.division.slice(0, currentValue).padEnd(6, 0) * 1) ? previousValue.concat(
        this.sizeForm.division.slice(0, currentValue).padEnd(6, 0) * 1
      ) : previousValue
    }, []);
  },
};
</script>
<style lang="scss" scoped>
.videoStorageStrategy_main {
  .tip {
    float: left;
  }
}
</style>
<style lang="scss" soped>
.titleicon {
  display: flex;

  .titleicon_main {
    display: flex;
    align-items: center;
    width: 50px;
    justify-content: center;
  }

  .titleicon_list {
    padding-left: 20px;

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }
    }
  }
}
</style>
