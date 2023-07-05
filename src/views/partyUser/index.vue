<template>
  <div class="app-container" style="padding: 0; display: block;">
    <div v-show="!isView && !isAddOrEdit">
      <div style="display: flex; justify-content: center;">
        <div style="margin: 20px 20px 0px; width: 100%;">
          <div class="partyNewInfoTopHeaderStyle">0, 169, 154
            <div class="custom-top-card">
              <div class="custom-card">
                <div class="custom-card-title">党员数<div><i class="el-icon-caret-right"></i></div>
                </div>
                <div class="custom-card-content">
                  <div>
                    <div class="el-image custom-card-icon"><img
                        src="data:image/png;base64,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"
                        class="el-image__inner">
                    </div>
                  </div>
                  <div class="custom-card-number">
                    {{info.partyUserAmount}}
                  </div>
                  <div class="custom-card-unit">人</div>
                </div>
              </div>
              <div class="custom-card">
                <div class="custom-card-title">正式党员数<div><i class="el-icon-caret-right"></i></div>
                </div>
                <div class="custom-card-content">
                  <div>
                    <div class="el-image custom-card-icon"><img
                        src="data:image/png;base64,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"
                        class="el-image__inner">
                    </div>
                  </div>
                  <div class="custom-card-number">
                    {{info.officialAmount}}
                  </div>
                  <div class="custom-card-unit">人</div>
                </div>
              </div>
              <div class="custom-card">
                <div class="custom-card-title">预备党员数<div><i class="el-icon-caret-right"></i></div>
                </div>
                <div class="custom-card-content">
                  <div>
                    <div class="el-image custom-card-icon"><img
                        src="data:image/png;base64,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"
                        class="el-image__inner">
                    </div>
                  </div>
                  <div class="custom-card-number">
                    {{info.prepareAmount}}
                  </div>
                  <div class="custom-card-unit">人</div>
                </div>
              </div>
              <div class="custom-card">
                <div class="custom-card-title">党支部数<div><i class="el-icon-caret-right"></i></div>
                </div>
                <div class="custom-card-content">
                  <div>
                    <div class="el-image custom-card-icon"><img
                        src="data:image/png;base64,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"
                        class="el-image__inner">
                    </div>
                  </div>
                  <div class="custom-card-number">
                    {{info.partyBranchAmount}}
                  </div>
                  <div class="custom-card-unit">个</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-card class="box-card">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="100px">
          <!--      <el-form-item label="用户ID" prop="userId">-->
          <!--        <el-input-->
          <!--          v-model="queryParams.userId"-->
          <!--          placeholder="请输入用户ID"-->
          <!--          clearable-->
          <!--          @keyup.enter.native="handleQuery"-->
          <!--        />-->
          <!--      </el-form-item>-->
          <!--      <el-form-item label="党支部ID" prop="partyBranchId">-->
          <!--        <el-input-->
          <!--          v-model="queryParams.partyBranchId"-->
          <!--          placeholder="请输入党支部ID"-->
          <!--          clearable-->
          <!--          @keyup.enter.native="handleQuery"-->
          <!--        />-->
          <!--      </el-form-item>-->
          
          <!-- <el-form-item label="姓名" prop="username" label-width="50px">
            <el-input v-model="queryParams.username" placeholder="请输入姓名" style="width: 140px" clearable />
          </el-form-item> -->

          <el-form-item label="所属支部" prop="partyBranchId" label-width="80px">
            <el-select v-model="queryParams.partyBranchId" placeholder="请选择所属支部" clearable>
              <el-option v-for="item in partyBranchList" :key="item.partyBranchId" :label="item.partyBranchName"
                :value="item.partyBranchId" />
            </el-select>
          </el-form-item>
          
          <!-- <el-form-item label="性别" prop="sex" label-width="50px">
            <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable style="width: 140px">
              <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item> -->

          <el-form-item label="职务" prop="post" label-width="50px">
            <el-select v-model="queryParams.post" placeholder="请选择职务" clearable style="width: 140px">
              <!-- <el-option v-for="dict in dict.type.party_post" :key="dict.value" :label="dict.label"
                :value="dict.value" /> -->
            </el-select>
          </el-form-item>
          
          <el-form-item label="党员类型" align="center" prop="partyType" label-width="80px">
            <el-select v-model="queryParams.partyType" placeholder="请选择职务" clearable style="width: 140px">
              <!-- <el-option v-for="dict in dict.type.party_user_type" :key="dict.value" :label="dict.label"
                :value="dict.value" /> -->
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="积分" prop="points">
          <el-input v-model="queryParams.points" placeholder="请输入积分" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->

          <!-- <el-form-item label="入党时间" prop="joinPartyTime" label-width="80px">
            <el-date-picker clearable v-model="queryParams.joinPartyTime" type="date" value-format="yyyy-MM-dd"
              placeholder="请选择入党时间">
            </el-date-picker>
          </el-form-item> -->

          <!-- <el-form-item label="转正时间" prop="officialTime">
          <el-date-picker clearable v-model="queryParams.officialTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择转正时间">
          </el-date-picker>
        </el-form-item> -->
          <!-- <el-form-item label="是否优秀" prop="isExcellent">
          <el-select v-model="queryParams.isExcellent" placeholder="请输入是否优秀" clearable style="width: 240px">
            <el-option v-for="dict in dict.type.sys_number_yes_no" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item> -->
          <!-- <el-form-item label="参加工作时间" prop="takeJobTime">
          <el-date-picker clearable v-model="queryParams.takeJobTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择参加工作时间">
          </el-date-picker>
        </el-form-item> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['community:partyUser:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['community:partyUser:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['community:partyUser:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
              v-hasPermi="['community:partyUser:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="partyUserList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="姓名" align="center" prop="userName" />
          <el-table-column label="所属支部" align="center" prop="partyBranchName" />
          <el-table-column label="性别" align="center" prop="sex" />
          <el-table-column label="职务" align="center" prop="post">
            <template slot-scope="scope">
              <!-- <dict-tag :options="dict.type.party_post" :value="scope.row.post" /> -->
            </template>
          </el-table-column>
          <el-table-column label="党员类型" align="center" prop="partyType">
            <template slot-scope="scope">
              <!-- <dict-tag :options="dict.type.party_user_type" :value="scope.row.partyType" /> -->
            </template>
          </el-table-column>
          <!-- <el-table-column label="积分" align="center" prop="points" /> -->
          <el-table-column label="入党时间" align="center" prop="joinPartyTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.joinPartyTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="转正时间" align="center" prop="officialTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.officialTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column> -->
          <!-- <el-table-column label="党员类型" align="center" prop="partyType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.party_user_type" :value="scope.row.partyType" />
          </template>
        </el-table-column>
        <el-table-column label="是否优秀" align="center" prop="isExcellent">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_number_yes_no" :value="scope.row.isExcellent" />
          </template>
        </el-table-column>
        <el-table-column label="优秀事迹" align="center" prop="excellentContent" />
        <el-table-column label="参加工作时间" align="center" prop="takeJobTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.takeJobTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column> -->
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['community:partyUser:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                v-hasPermi="['community:partyUser:remove']">删除</el-button>
              <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)"
                v-hasPermi="['community:partyUser:remove']">预览</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />

      </el-card>
    </div>
    <div v-show="isView">
      <el-card class="box-card">
        <div>
          <el-button type="primary" plain @click="goBack">返回</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="100px">
          <div data-v-1075c1c7="" class="custom-header" style="margin-top: 10px;"><div class="custom-icon"><div class="el-image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAAdBJREFUOE+FVMtVAkEQrJ69iBfJQM3ADDQD3CcelINkgCEYAmawHNSD+hYiECPQEDQDuIgXZqye2WW/yLwHzDI93VXV1SvYtdKnIx8SX339Fyqth2naxXrVA9wtRE58jMOc3wn615O2O9VE6cMJLEYMPAekC+dmEEzhZMFMQybV5NxLAuMmiAefedKQyCP4eQvV3bevbEzSoKM0rR3ynB859CijTow4XpQTJUVFojC4L1cMBeuIMSFVTUzg5eUrOtKiNloR+CK9sQ8R4X84CohlDNMh4pg0wyoQ2d8RjJ1tUDw/nUFUF9z4SMfqjtpcXs0LdKYHs0fkG2qeOwOUt6OArBh1mJQVVT9d+b7cTYclIupKa1SpvT6oiMr5NHQn00oTlbsJvPM8wcUgqVKrCMUH1WqtOrE7goOM2pK/CRGM28yZaaTdkI9W03mUXHn1ulmNHFepNWip6YRCZqNRb73Ss3KXi98ckTotPxqu682q4m6hVzLkKuWFKaJ9Wj/zR4FS+1+IGyaBtpDzqrNVg5dHOjvzjF6yZrLxTN4M9ZaxmiDoprMY7Q8LH+WB9Vna6uzmLLa/RgJCHZVs4rPqOvX962ndLfq8PVEZpe53vNj+ABD37RP26h9lAAAAAElFTkSuQmCC" class="el-image__inner"><!----></div></div> <div class="custom-title">基本信息</div> <div class="custom-header-btns"></div></div>
          <el-row style="width: 80%;margin-top: 22px;">
            <el-col :span="8">
              <el-form-item label="姓名：" prop="userName">
                <el-input v-model="form.userName" disabled>                  
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别：" prop="sex">
                <el-input v-model="form.sex" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期：" prop="birthday">
                <el-input v-model="form.birthday" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="width: 80%;">
            <el-col :span="8">
              <el-form-item label="身份证号：" prop="idCard">
                <el-input v-model="form.idCard" disabled />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话：" prop="phone">
                <el-input v-model="form.phone" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文化程度：" prop="eduDegree">
                <!-- <dict-tag v-if="form.eduDegree" :options="dict.type.edu_degree" :value="form.eduDegree" class="disabled" style="width: 100%;"/> -->
                <!-- <div v-else class="disabled"></div> -->
                <!-- <el-select v-model="form.eduDegree" disabled style="width: 100%">
                  <el-option v-for="dict in dict.type.edu_degree" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-row>
          <div data-v-1075c1c7="" class="custom-header"><div class="custom-icon"><div class="el-image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAAaBJREFUOE+tlN1RwlAQhc8NTzxpB2IFYgWmBJjwAjwIFagdQAVCBeYl4UEyQAXGDqACKQELMOu590r+GXHGnWGGbPZ+e/bnRuGfTJ3FeV24UNKBgsBRc3T7+/K580DHU8vQJ+weUBN4/WkedhoUBSOIEgZTiRzgDcfmYAoTP/XRXQ9Kg9OcOzhNF93uwXiigKWpK0CmhE20qwr6DWJBIx59MVBHXeueFUFVCCOLJaQao1CXzdeYozd4zED5LNVRPsEbzAruKIz5fAeRLXrD27KiGYt9YMCOmbZ2QkeTMfvh5xRZkDZvoOp61EGjGZvGVkrNwaJwS8TNaVC5rDqY48RI5OMndEdF7UzRatGq21gTXIYJYpbtWpBdAQtaBW0keOO/dX7JCuLqJir4REO1s/Fr0JfSWS54eM9GT9inTbqAJhkVJ6KTtbL+y4YT6+hnq8hcyuQZivS86RKs/MvKu4xmpmlBy/Bg1AgzKBCm1/+E6XIUV+M4ethJ/oCCNQ+7aAjv03BrroDwsmqfLVfbO39r3jk/Ww2Jj7v1t8/ISZnANwshpxPiV6zVAAAAAElFTkSuQmCC" class="el-image__inner"><!----></div></div> <div class="custom-title">支部信息</div> <div class="custom-header-btns"></div></div>
          <el-row style="width: 80%;margin-top: 22px;">
            <el-col :span="12">
              <el-form-item label="所属支部：" prop="partyBranchId">
                <el-select v-model="form.partyBranchId" placeholder="请选择所属支部" disabled style="width: 100%">
                  <el-option v-for="item in partyBranchList" :key="item.partyBranchId" :label="item.partyBranchName"
                    :value="item.partyBranchId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职务：" prop="post">
                <el-select v-model="form.post" placeholder="请选择职务" disabled style="width: 100%">
                  <!-- <el-option v-for="dict in dict.type.party_post" :key="dict.value" :label="dict.label"
                    :value="dict.value" /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div data-v-1075c1c7="" class="custom-header"><div class="custom-icon"><div class="el-image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAApNJREFUOE+tlE9IFGEYxp9vdlM361QQFVSHkC7VUeoQkZmBpNLuajurgkjdoiSNokNGpwxZyKBDGJjun2Z31EUjwrbon8eIvLXQoUMUHat1rd3v65n94zo6SIcWhpl593t/3/s87/eOwH/6CUdOcnQzpKcBUjsGIQ9AQoPCe7hUCrX5Z2jq/rU6by1oKnYCUg5BqhoIpAnw8K4ALQvIOgixyPcBnNbnVsLsIHPCx4TrgDLhFvfQ8vE7JutMgt/A3zmMyP1tqNrUz/9PAvlB+LrMMqwCirMSIYcBEYIv8KCwYDJ2EDKXhHLp8Afmlyswo71Qqg9KXGA8ZcWLIMuT3MbXLH0a3uDgcoIFUmqasCD8XRWQtSARvc3KmiDd9WhvXyyCEo/auPgWqsURtOrf/gkUHd2BKk8KLlxGmz5TBJnRESi5B77gKVs31quokBeZZRsW4NOvlkDhl9Sbp4FJeLvuFLtU8shJmlICicglOtMMjc/e4NGStMgrpuYh8iY7cbcibWwLPYgz4St31W3VJsJ9jLdwU4L0EsgIj0DTKC1gl2ZlzkS2YknNMOkzYR2rYI8Z/1CRFo+1QuWHUJ2h2WcrZpezzPBuVhyzwYyxndA2pKC0fvjPzBalPX1Yi5/ut/RpjlUN2HYtvxjGLohcjJ58wkK6G/v3DbFBjfixVI+enmzlQE5GGjkWIQgtBG9g1Bk2Rph2k9c7jsp5unoO7fpza619RBLjXsB1g+En+JMJIdD7BYmJa5SVLYyIOb4dOXEFbq0ZLjmAts6p8oZrhzYebYBgZVDVlJrmcw2kUJT0m/e9/A5kIVwX4e14sbJq58+IYXiYeJzn6jBH5BA0YZ2seUqZR2ZpzvJktXRnkKNB6wf/AlrnCiIVKSIlAAAAAElFTkSuQmCC" class="el-image__inner"><!----></div></div> <div class="custom-title">入党信息</div> <div class="custom-header-btns"></div></div>
          <el-row style="width: 80%;margin-top: 22px;">
            <el-col :span="12">
              <el-form-item label="入党时间：" prop="joinPartyTime">
                <el-date-picker disabled v-model="form.joinPartyTime" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择入党时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转正时间：" prop="officialTime">
                <el-date-picker disabled v-model="form.officialTime" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择转正时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="width: 80%;">
            <el-col :span="12">
              <el-form-item label="党员类型：" prop="partyType">
                <el-select v-model="form.partyType" placeholder="请选择党员类型" disabled style="width: 100%">
                  <!-- <el-option v-for="dict in dict.type.party_user_type" :key="dict.value" :label="dict.label"
                    :value="dict.value" /> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否优秀：" prop="isExcellent">
                <el-select v-model="form.isExcellent" placeholder="请选择是否优秀" disabled style="width: 100%">
                  <!-- <el-option v-for="dict in dict.type.sys_number_yes_no" :key="dict.value" :label="dict.label"
                    :value="dict.value" /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="width: 80%;">
            <el-col :span="24">
              <el-form-item label="优秀事迹：">
                <el-input v-model="form.excellentContent" disabled type="textarea" placeholder="请输入优秀事迹" maxlength="400" show-word-limit />
              </el-form-item>              
            </el-col>
          </el-row>

          <div data-v-1075c1c7="" class="custom-header"><div class="custom-icon"><div class="el-image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAAWtJREFUOE/dVMFVwzAM/TIMkA2aEboBWaG0HJoe6AgdoWzQEcoh7oHmBSagbFA2CBPQE1zAQnKaNE449sDjXyLLkmz9fJlQo9jEYB40a6I3jKZls1bjYZPggrnxXacvtU3e2NoVCIlYh1ZiJPYa43SFoojgPnedfVlyDGMSPbAqlGclxrM4ON0nf+y9P8/mYBpiki6CGPUDscQsj4XsTk7WG4XILYufpNDSb0hCEKCtGpf85UJbe4DhW4DaZAuX0Jbr1gYgWgetOSxA/CStrSuOimyIbywlUP9UCOXOk0pKbAcsB1W8VYXOgOONRIwO0tovGE/vvBANrvoX4lIkcX+6keoI0poz+j3B8HPDEZMov8ORYWmLRbQ1R7n9tzrKrcxUOuyRqfqapBFyKzPGUW9EerO2zR5FCO9Ai2zmRAq/+kHVJ8a5nailCEXLcxHyCKPZ/qQj/cVd3Ewl+Qgt9iWT3sYlyvrNOpsgfwDInc0TkT5hiQAAAABJRU5ErkJggg==" class="el-image__inner"><!----></div></div> <div class="custom-title">工作信息</div> <div class="custom-header-btns"></div></div>
          <el-row style="width: 80%;margin-top: 22px;">
            <el-col :span="12">
              <el-form-item label="参加工作时间：" prop="takeJobTime" label-width="120px">
                <el-date-picker disabled v-model="form.takeJobTime" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择参加工作时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form> 
      </el-card>
    </div>

    <div v-show="!isView && isAddOrEdit">
      <el-card class="box-card">
        <div>
          <el-button type="primary" plain @click="goBack">返回</el-button>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <div data-v-1075c1c7="" class="custom-header" style="margin-top: 10px;"><div class="custom-icon"><div class="el-image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAAdBJREFUOE+FVMtVAkEQrJ69iBfJQM3ADDQD3CcelINkgCEYAmawHNSD+hYiECPQEDQDuIgXZqye2WW/yLwHzDI93VXV1SvYtdKnIx8SX339Fyqth2naxXrVA9wtRE58jMOc3wn615O2O9VE6cMJLEYMPAekC+dmEEzhZMFMQybV5NxLAuMmiAefedKQyCP4eQvV3bevbEzSoKM0rR3ynB859CijTow4XpQTJUVFojC4L1cMBeuIMSFVTUzg5eUrOtKiNloR+CK9sQ8R4X84CohlDNMh4pg0wyoQ2d8RjJ1tUDw/nUFUF9z4SMfqjtpcXs0LdKYHs0fkG2qeOwOUt6OArBh1mJQVVT9d+b7cTYclIupKa1SpvT6oiMr5NHQn00oTlbsJvPM8wcUgqVKrCMUH1WqtOrE7goOM2pK/CRGM28yZaaTdkI9W03mUXHn1ulmNHFepNWip6YRCZqNRb73Ss3KXi98ckTotPxqu682q4m6hVzLkKuWFKaJ9Wj/zR4FS+1+IGyaBtpDzqrNVg5dHOjvzjF6yZrLxTN4M9ZaxmiDoprMY7Q8LH+WB9Vna6uzmLLa/RgJCHZVs4rPqOvX962ndLfq8PVEZpe53vNj+ABD37RP26h9lAAAAAElFTkSuQmCC" class="el-image__inner"><!----></div></div> <div class="custom-title">基本信息</div> <div class="custom-header-btns"></div></div>
          <el-row style="width: 80%;margin-top: 22px;">
            <el-col :span="8">
              <el-form-item label="姓名：" prop="userName">
                <el-input placeholder="请选择人员" v-model="form.userName" disabled>
                  <el-button slot="append" icon="el-icon-search" @click="popSelectUser"></el-button>
                </el-input>
                <div class="el-form-item__error" v-if="!form.userId">请选择人员</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别：" prop="sex">
                <el-input v-model="form.sex" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期：" prop="birthday">
                <el-input v-model="form.birthday" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="width: 80%;">
            <el-col :span="8">
              <el-form-item label="身份证号：" prop="idCard">
                <el-input v-model="form.idCard" disabled />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话：" prop="phone">
                <el-input v-model="form.phone" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文化程度：" prop="eduDegree">
                <!-- <dict-tag :options="dict.type.edu_degree" :value="form.eduDegree" class="disabled" style="width: 100%;"/> -->
                <!-- <el-select v-model="form.eduDegree" disabled style="width: 100%">
                  <el-option v-for="dict in dict.type.edu_degree" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-row>
          <div data-v-1075c1c7="" class="custom-header"><div class="custom-icon"><div class="el-image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAAaBJREFUOE+tlN1RwlAQhc8NTzxpB2IFYgWmBJjwAjwIFagdQAVCBeYl4UEyQAXGDqACKQELMOu590r+GXHGnWGGbPZ+e/bnRuGfTJ3FeV24UNKBgsBRc3T7+/K580DHU8vQJ+weUBN4/WkedhoUBSOIEgZTiRzgDcfmYAoTP/XRXQ9Kg9OcOzhNF93uwXiigKWpK0CmhE20qwr6DWJBIx59MVBHXeueFUFVCCOLJaQao1CXzdeYozd4zED5LNVRPsEbzAruKIz5fAeRLXrD27KiGYt9YMCOmbZ2QkeTMfvh5xRZkDZvoOp61EGjGZvGVkrNwaJwS8TNaVC5rDqY48RI5OMndEdF7UzRatGq21gTXIYJYpbtWpBdAQtaBW0keOO/dX7JCuLqJir4REO1s/Fr0JfSWS54eM9GT9inTbqAJhkVJ6KTtbL+y4YT6+hnq8hcyuQZivS86RKs/MvKu4xmpmlBy/Bg1AgzKBCm1/+E6XIUV+M4ethJ/oCCNQ+7aAjv03BrroDwsmqfLVfbO39r3jk/Ww2Jj7v1t8/ISZnANwshpxPiV6zVAAAAAElFTkSuQmCC" class="el-image__inner"><!----></div></div> <div class="custom-title">支部信息</div> <div class="custom-header-btns"></div></div>
          <el-row style="width: 80%;margin-top: 22px;">
            <el-col :span="12">
              <el-form-item label="所属支部：" prop="partyBranchId">
                <el-select v-model="form.partyBranchId" placeholder="请选择所属支部" clearable style="width: 100%">
                  <el-option v-for="item in partyBranchList" :key="item.partyBranchId" :label="item.partyBranchName"
                    :value="item.partyBranchId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职务：" prop="post">
                <el-select v-model="form.post" placeholder="请选择职务" clearable style="width: 100%">
                  <!-- <el-option v-for="dict in dict.type.party_post" :key="dict.value" :label="dict.label"
                    :value="dict.value" /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div data-v-1075c1c7="" class="custom-header"><div class="custom-icon"><div class="el-image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAApNJREFUOE+tlE9IFGEYxp9vdlM361QQFVSHkC7VUeoQkZmBpNLuajurgkjdoiSNokNGpwxZyKBDGJjun2Z31EUjwrbon8eIvLXQoUMUHat1rd3v65n94zo6SIcWhpl593t/3/s87/eOwH/6CUdOcnQzpKcBUjsGIQ9AQoPCe7hUCrX5Z2jq/rU6by1oKnYCUg5BqhoIpAnw8K4ALQvIOgixyPcBnNbnVsLsIHPCx4TrgDLhFvfQ8vE7JutMgt/A3zmMyP1tqNrUz/9PAvlB+LrMMqwCirMSIYcBEYIv8KCwYDJ2EDKXhHLp8Afmlyswo71Qqg9KXGA8ZcWLIMuT3MbXLH0a3uDgcoIFUmqasCD8XRWQtSARvc3KmiDd9WhvXyyCEo/auPgWqsURtOrf/gkUHd2BKk8KLlxGmz5TBJnRESi5B77gKVs31quokBeZZRsW4NOvlkDhl9Sbp4FJeLvuFLtU8shJmlICicglOtMMjc/e4NGStMgrpuYh8iY7cbcibWwLPYgz4St31W3VJsJ9jLdwU4L0EsgIj0DTKC1gl2ZlzkS2YknNMOkzYR2rYI8Z/1CRFo+1QuWHUJ2h2WcrZpezzPBuVhyzwYyxndA2pKC0fvjPzBalPX1Yi5/ut/RpjlUN2HYtvxjGLohcjJ58wkK6G/v3DbFBjfixVI+enmzlQE5GGjkWIQgtBG9g1Bk2Rph2k9c7jsp5unoO7fpza619RBLjXsB1g+En+JMJIdD7BYmJa5SVLYyIOb4dOXEFbq0ZLjmAts6p8oZrhzYebYBgZVDVlJrmcw2kUJT0m/e9/A5kIVwX4e14sbJq58+IYXiYeJzn6jBH5BA0YZ2seUqZR2ZpzvJktXRnkKNB6wf/AlrnCiIVKSIlAAAAAElFTkSuQmCC" class="el-image__inner"><!----></div></div> <div class="custom-title">入党信息</div> <div class="custom-header-btns"></div></div>
          <el-row style="width: 80%;margin-top: 22px;">
            <el-col :span="12">
              <el-form-item label="入党时间：" prop="joinPartyTime">
                <el-date-picker clearable v-model="form.joinPartyTime" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择入党时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转正时间：" prop="officialTime">
                <el-date-picker clearable v-model="form.officialTime" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择转正时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="width: 80%;">
            <el-col :span="12">
              <el-form-item label="党员类型：" prop="partyType">
                <el-select v-model="form.partyType" placeholder="请选择党员类型" clearable style="width: 100%">
                  <!-- <el-option v-for="dict in dict.type.party_user_type" :key="dict.value" :label="dict.label"
                    :value="dict.value" /> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否优秀：" prop="isExcellent">
                <el-select v-model="form.isExcellent" placeholder="请选择是否优秀" clearable style="width: 100%">
                  <!-- <el-option v-for="dict in dict.type.sys_number_yes_no" :key="dict.value" :label="dict.label"
                    :value="dict.value" /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="width: 80%;">
            <el-col :span="24">
              <el-form-item label="优秀事迹：">
                <el-input v-model="form.excellentContent" type="textarea" placeholder="请输入优秀事迹" maxlength="400" show-word-limit />
              </el-form-item>              
            </el-col>
          </el-row>

          <div data-v-1075c1c7="" class="custom-header"><div class="custom-icon"><div class="el-image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAAWtJREFUOE/dVMFVwzAM/TIMkA2aEboBWaG0HJoe6AgdoWzQEcoh7oHmBSagbFA2CBPQE1zAQnKaNE449sDjXyLLkmz9fJlQo9jEYB40a6I3jKZls1bjYZPggrnxXacvtU3e2NoVCIlYh1ZiJPYa43SFoojgPnedfVlyDGMSPbAqlGclxrM4ON0nf+y9P8/mYBpiki6CGPUDscQsj4XsTk7WG4XILYufpNDSb0hCEKCtGpf85UJbe4DhW4DaZAuX0Jbr1gYgWgetOSxA/CStrSuOimyIbywlUP9UCOXOk0pKbAcsB1W8VYXOgOONRIwO0tovGE/vvBANrvoX4lIkcX+6keoI0poz+j3B8HPDEZMov8ORYWmLRbQ1R7n9tzrKrcxUOuyRqfqapBFyKzPGUW9EerO2zR5FCO9Ai2zmRAq/+kHVJ8a5nailCEXLcxHyCKPZ/qQj/cVd3Ewl+Qgt9iWT3sYlyvrNOpsgfwDInc0TkT5hiQAAAABJRU5ErkJggg==" class="el-image__inner"><!----></div></div> <div class="custom-title">工作信息</div> <div class="custom-header-btns"></div></div>
          <el-row style="width: 80%;margin-top: 22px;">
            <el-col :span="12">
              <el-form-item label="参加工作时间：" prop="takeJobTime" label-width="120px">
                <el-date-picker clearable v-model="form.takeJobTime" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择参加工作时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        
          <div style="text-align:center;">
            <el-button @click="goBack">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
            
          </div>
        </el-form> 
      </el-card>

      <el-dialog title="选择人员" :visible.sync="openUser" width="960px" class="custom-dialog-class" append-to-body>
        <el-form ref="formUser" :model="queryUser" label-width="60px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名" prop="userName">
                <el-input
                  v-model="queryUser.userName"
                  placeholder="请输入姓名"
                  clearable
                />
              </el-form-item>              
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号" prop="phonenumber">
                <el-input
                  v-model="queryUser.phonenumber"
                  placeholder="请输入手机号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6"></el-col>
            <el-col :span="6">
                <el-button type="primary" icon="el-icon-search" size="medium" @click="handleQueryUser" style="margin-left: 10px;">搜索</el-button>
                <el-button icon="el-icon-refresh" size="medium" @click="resetQueryUser">重置</el-button>           
            </el-col>
          </el-row>

          
          
          
        </el-form>
        <el-table ref="tbUser" v-loading="loading" :data="userList" @selection-change="handleUserSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="用户名称" align="center" key="userName" prop="userName" :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" width="120" />
          <!-- <el-table-column label="状态" align="center" key="status" >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column> -->
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalUser>0"
          :total="totalUser"
          :page.sync="queryUser.pageNum"
          :limit.sync="queryUser.pageSize"
          @pagination="getUserList"
        />
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="selectUser">确 定</el-button>
          <el-button @click="openUser = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  // import {
  //   listPartyBranch
  // } from "@/api/community/partyBranch";
  // import {
  //   statistics,
  //   listPartyUser,
  //   getPartyUser,
  //   delPartyUser,
  //   addPartyUser,
  //   updatePartyUser
  // } from "@/api/community/partyUser";
  // import { listUser } from "@/api/system/user";
  export default {
    name: "PartyUser",
    // dicts: ['party_post', 'party_user_type', 'sys_number_yes_no', 'sys_user_sex', 'edu_degree'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 党员信息表格数据
        partyUserList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userId: null,
          partyBranchId: null,
          post: null,
          points: null,
          joinPartyTime: null,
          officialTime: null,
          partyType: null,
          isExcellent: null,
          excellentContent: null,
          takeJobTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          partyBranchId: [{ required: true, message: "请选择所属支部", trigger: "blur" }],
          post: [{ required: true, message: "请选择职务", trigger: "blur" }],
        },
        isAddOrEdit:false,
        partyBranchList: [],
        openUser:false,
        formUser:{},
        queryUser: {
          pageNum: 1,pageSize: 1000,userName:null,phonenumber:null
        },
        totalUser: 0,
        userList: [],
        currentUser: null,
        isView:false,
        info: {
          "partyUserAmount": 0,
          "officialAmount": 0,
          "prepareAmount": 0,
          "partyBranchAmount": 0
        }
      };
    },
    created() {
      // this.getList();
      // this.getPartyBranchList();
      // this.getUserList();
      // this.getStatistics();
    },
    methods: {
      goBack() {
        this.isAddOrEdit = false;
        this.isView = false;
      },
      handleQueryUser() {
        this.getUserList()
      },
      resetQueryUser() {
        this.resetForm("formUser");
        this.getUserList();
      },
      getUserList() {
        this.loading = true;
        listUser(this.queryUser).then(response => {            
            this.userList = response.rows;
            this.totalUser = response.total;
            this.loading = false;
          }
        );
      },
      popSelectUser() {
        this.openUser = true;
        this.currentUser = null;
        this.resetQueryUser();
      },
      selectUser() {
        if(this.currentUser) {
          this.form.userId = this.currentUser.userId;
          this.form.userName = this.currentUser.userName;
          this.form.sex = this.currentUser.sex == '0' ? '男' : '女';
          this.form.phone = this.currentUser.phonenumber;
          this.form.idCard = this.currentUser.idCard;
          this.form.birthday = this.currentUser.birthday;
          this.form.eduDegree = this.currentUser.eduDegree;
          this.openUser = false;
          this.$forceUpdate();
        }
        else {
          this.$message({
            message: '请选择人员',
            type: 'warning'
          });
        }
      },
      getPartyBranchList() {
        listPartyBranch({
          pageNum: 1,
          pageSize: 1000
        }).then(response => {
          this.partyBranchList = response.rows;
        });
      },
      getStatistics() {
        statistics().then(response => {
          this.info = response.data;
        })
      },
      /** 查询党员信息列表 */
      getList() {
        this.loading = true;
        listPartyUser(this.queryParams).then(response => {
          response.rows.forEach(item =>{
            item.userName = item.user ? item.user.userName : "";
            item.partyBranchName = item.partyBranch ? item.partyBranch.partyBranchName : "";
            item.sex = item.user ? (item.user.sex == '0' ? '男' : '女') : "";
          })
          this.partyUserList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          partyUserId: null,
          userId: null,
          partyBranchId: null,
          post: null,
          points: null,
          joinPartyTime: null,
          officialTime: null,
          partyType: null,
          isExcellent: null,
          excellentContent: null,
          takeJobTime: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.partyUserId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      handleUserSelectionChange(selection) {
        if (selection.length == 0) {
          this.currentUser = null;
        }  
        else if (selection.length == 1){
          this.currentUser = selection[0]
        }    
        else if (selection.length > 1) {
          this.$refs.tbUser.clearSelection();
          this.$refs.tbUser.toggleRowSelection(selection.pop());          
        }
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.isAddOrEdit = true;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const partyUserId = row.partyUserId || this.ids
        getPartyUser(partyUserId).then(response => {
          response.data.userName = response.data.user ? response.data.user.userName : "";
          response.data.sex = response.data.user ? (response.data.user.sex == '0' ? '男' : '女') : "";
          response.data.phone = response.data.user ? response.data.user.phonenumber : "";          
          response.data.partyBranchName = response.data.partyBranch ? response.data.partyBranch.partyBranchName : "";
          response.data.idCard = response.data.user ? response.data.user.idCard : "";
          response.data.eduDegree = response.data.user ? response.data.user.eduDegree : "";
          response.data.birthday = response.data.user ? response.data.user.birthday : "";

          this.form = response.data;
          this.isAddOrEdit = true;
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.partyUserId != null) {
              updatePartyUser(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.isAddOrEdit = false;
                this.getList();
              });
            } else {
              addPartyUser(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.isAddOrEdit = false;
                this.getList();
              });
            }
          }
        });
      },
      handleView(row) {
        this.reset();
        const partyUserId = row.partyUserId || this.ids
        getPartyUser(partyUserId).then(response => {
          response.data.userName = response.data.user ? response.data.user.userName : "";
          response.data.sex = response.data.user ? (response.data.user.sex == '0' ? '男' : '女') : "";
          response.data.phone = response.data.user ? response.data.user.phonenumber : "";          
          response.data.partyBranchName = response.data.partyBranch ? response.data.partyBranch.partyBranchName : "";
          response.data.idCard = response.data.user ? response.data.user.idCard : "";
          response.data.eduDegree = response.data.user ? response.data.user.eduDegree : "";
          response.data.birthday = response.data.user ? response.data.user.birthday : "";

          this.form = response.data;
          this.isView = true;
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const partyUserIds = row.partyUserId || this.ids;
        this.$modal.confirm('此操作将永久删除该记录, 您确认删除?').then(function () {
          return delPartyUser(partyUserIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('community/partyUser/export', {
          ...this.queryParams
        }, `partyUser_${new Date().getTime()}.xlsx`)
      }
    }
  };

</script>
<style scoped>
  .custom-top-card {
    background: #fff;
    height: 124px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-shadow: 0 0 6px rgba(200, 208, 233, .3);
    box-shadow: 0 0 6px rgba(200, 208, 233, .3);
    opacity: 1;
    border-radius: 6px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex
  }

  .custom-top-card>div.custom-card:not(:last-child) {
    border-right: 1px solid #e1e8ee
  }

  .custom-top-card .custom-card {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1
  }

  .custom-top-card .custom-card .custom-card-title {
    font-size: 18px;
    font-weight: 400;
    line-height: 18px;
    color: #a5b6c5;
    opacity: 1
  }

  .custom-top-card .custom-card .custom-card-content,
  .custom-top-card .custom-card .custom-card-title {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-left: 15%;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
  }

  .custom-top-card .custom-card .custom-card-content {
    margin-top: 15px
  }

  .custom-top-card .custom-card .custom-card-content .custom-card-icon {
    width: 50px;
    height: 50px
  }

  .custom-top-card .custom-card .custom-card-content .custom-card-number {
    font-size: 32px;
    font-weight: 500;
    margin-left: 15px;
    line-height: 32px;
    color: #000;
    opacity: 1
  }

  .custom-top-card .custom-card .custom-card-content .custom-card-unit {
    font-size: 18px;
    margin-left: 10px;
    font-weight: 400;
    line-height: 32px;
    padding-top: 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;
    color: #a5b6c5
  }

  .partyNewInfoTopHeaderStyle .custom-top-card .custom-card .custom-card-content,
  .partyNewInfoTopHeaderStyle .custom-top-card .custom-card .custom-card-title {
    margin-left: 38%;
  }

  .box-card {
    margin: 20px;
  }

  .custom-header {
    background: #e0e8f6;
    height: 32px
}

.custom-header {
    background: #eef5f5
}

.custom-header,.custom-header .custom-icon {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
}

.custom-header .custom-icon {
    padding-left: 20px
}

.custom-header .custom-icon img {
    width: 18px;
    height: 18px
}

.custom-header .custom-title {
    font-size: 16px;
    padding-left: 20px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    line-height: 20px;
    color: #000;
    opacity: 1
}

.disabled {
  background-color: #F5F7FA;
  border-color: #dfe4ed;
  color: #C0C4CC;
  cursor: not-allowed;
  padding: 0 15px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  height: 36px;
  line-height: 36px;
}
</style>
