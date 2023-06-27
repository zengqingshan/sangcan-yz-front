<template>
  <div class="app-container">
    <!-- <el-row :gutter="20"> -->
    <div id="dev-tree-left" class="col-md-2">
      <div autocomplete="off" spellcheck="false" class="container-left">
        <!-- <div class="form-group form-group-sm"> -->
        <!-- <label>搜索</label> -->
        <el-input
          ref="q"
          v-model.trim="q"
          prefix-icon="el-icon-search"
          type="text"
          class="form-control"
          placeholder="搜索组织机构"
          clearable
          @clear="clearSearch"
          @keyup.enter.native="searchOrg"
        />
      </div>
      <div id="tab-tree-wrapper" class="tab-content" style="margin: 10px 0">
        <div id="dev-tree-wrapper" ref="devTreeWrapper" class="tab-pane active">
          <el-tree
            v-if="showTree"
            v-show="showQueryDevTree"
            id="dev-tree"
            ref="devTree"
            highlight-current
            node-key="id"
            :props="treeProps"
            :load="treeLoad"
            lazy
            :empty-text="treeEmptyText"
            :default-expanded-keys="defExpandDevs"
            @node-click="handleNodeClick"
            @node-contextmenu="treeNodeRightClick"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>
                <i :class="['fa', 'fa-folder']" style="color: #9ed9f2" />
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="node.label"
                  placement="top"
                  :open-delay="0"
                >
                  <span
                    class="ellipsis"
                    style="user-select: none; margin-left: 4px"
                    :title="node.label"
                  >{{ node.label }}</span>
                </el-tooltip>
              </span>
            </span>
          </el-tree>
        </div>
      </div>

      <el-tabs v-show="!showQueryDevTree" v-model="activeName1">
        <el-tab-pane label="机构" name="first">
          <searchjigou ref="searchJigou" @searchedOrgClick="searchedOrgClick" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- dev-tree-left -->
    <!--用户数据-->
    <el-col :span="24" :xs="24" class="sys-content">
      <div>
        <div class="info">
          <span class="span">编码设备： {{ currentSelectedOrgName }}</span>
          <span>({{ total }}个)</span>
        </div>

        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="68px"
        >
          <el-input
            v-model="queryParams.name"
            style="width: 125px; marginright: 10px"
            size="small"
            placeholder="设备名称"
            clearable
          />

          <el-input
            v-model="queryParams.serviceId"
            style="width: 125px; marginright: 10px"
            size="small"
            placeholder="设备编码"
            clearable
          />
          <el-select
            v-model="queryParams.status"
            style="width: 125px; marginright: 10px"
            clearable
            size="small"
            placeholder="全部设备状态"
          >
            <el-option label="在线" :value="true">在线</el-option>
            <el-option label="离线" :value="false">离线</el-option>
          </el-select>

          <el-select
            v-model="queryParams.devCategory"
            style="width: 125px; marginright: 10px"
            clearable
            size="small"
            placeholder="设备类型"
          >
            <el-option
              v-for="(item, index) in $dt('dev_category')"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            />
          </el-select>

          <el-select
            v-model="queryParams.vendor"
            style="width: 125px; marginright: 10px"
            clearable
            size="small"
            placeholder="全部厂商"
          >
            <el-option
              v-for="(item, index) in $dt('vendor')"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            />
          </el-select>

          <el-form-item style="float: right">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleQuery"
            >搜索</el-button>
            <el-button
              icon="el-icon-refresh"
              size="small"
              @click="resetQuery"
            >重置</el-button>
            <el-button
              type="primary"
              size="small"
              @click="addDevice"
            >添加</el-button>
            <el-button
              type="primary"
              size="small"
              @click="dialogVisibleimp = true"
            >导入设备编码</el-button>
            <el-button
              type="primary"
              size="small"
              @click="exporttableinfo"
            >导出设备编码</el-button>
          </el-form-item>
        </el-form>
        <el-dialog title="添加设备" :visible.sync="dialogVisible" width="50%">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="设备类型" />
            <el-step title="基本信息" />
            <el-step title="通道信息" />
          </el-steps>
          <div v-show="tanshow" :rules="rules">
            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              *设备厂商
              <el-select
                v-model="form.vendor"
                style="width: 60%; marginright: 10px"
                clearable
                size="small"
                placeholder="请选择设备厂商"
              >
                <el-option
                  v-for="(item, index) in $dt('vendor')"
                  :key="index"
                  :label="item.dictValue"
                  :value="item.dictKey"
                />
              </el-select>
            </div>
            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              *通道类型
              <el-select
                v-model="form.deviceChannelType"
                style="width: 130px; marginright: 10px; width: 60%"
                clearable
                size="small"
                placeholder="请选择通道类型"
              >
                <!-- <el-option  label="单通道IPC" :value="true">单线通道IPC</el-option>
              <el-option  label="多通道NVR" :value="false">多通道NVR</el-option> -->
                <el-option
                  v-for="(item, index) in $dt('device_channel_type')"
                  :key="index"
                  :label="item.dictValue"
                  :value="item.dictKey"
                />
              </el-select>
            </div>
          </div>

          <div v-show="tanshow1" :rules="rules">
            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              *设备名称
              <el-input
                v-model="form.name"
                style="width: 60%; marginright: 10px"
                clearable
                size="small"
                placeholder="请输入设备名称"
              />
            </div>

            <div
              style="
                margin-top: 20px;
                font-size: 17px;
                margin-left: 20%;
                display: flex;
              "
            >
              <div style="display: inline-block">*所属节点</div>
              <treeselect
                v-model="form.orgId"
                no-options-text="无数据"
                :flat="true"
                :auto-select-descendants="true"
                :multiple="false"
                style="
                  line-height: 16px;
                  width: 60%;
                  height: 32px;
                  margin-left: 5px;
                "
                :limit="1"
                :options="orgOptions"
                :show-count="true"
                placeholder="请选择归属机构"
              />
            </div>

            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              *接入协议
              <el-select
                v-model="form.connetType"
                style="width: 60%; marginright: 10px"
                clearable
                size="small"
                placeholder=""
              >
                <el-option
                  v-for="item in $dt('connet_type')"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                />
              </el-select>
            </div>

            <div
              v-if="form.connetType == 'protocol_qly'"
              style="margin-top: 20px; font-size: 17px; margin-left: 20%"
            >
              *设备MAC
              <el-input
                v-model="form.mac"
                style="width: 60%; marginright: 10px"
                clearable
                size="small"
                placeholder="请输入千里眼设备MAC"
              />
            </div>

            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              *所属区域
              <el-cascader
                v-model="form.division"
                style="width: 60%; marginright: 10px"
                clearable
                size="mini"
                :props="divisionProps"
                :options="$dt('division')"
                @change="handleDivisionChange"
              />
            </div>

            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              *所属平台
              <el-select
                v-model="form.deviceSource"
                style="width: 60%; marginright: 10px"
                clearable
                size="small"
                placeholder="请选择设备所属平台"
              >
                <el-option
                  v-for="item in $dt('device_source')"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                />
              </el-select>
            </div>

            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              *详细位置
              <el-input
                v-model="formaddress"
                disabled
                style="width: 60%; margin-right: 10px"
                size="small"
                placeholder="请搜索，或在地图上选择详细位置"
              >
                <template #suffix>
                  <el-button
                    type="text"
                    size="small"
                    @click="showaddress('', '', '')"
                  >查看地图</el-button>
                </template>
              </el-input>

              <el-dialog
                width="80%"
                :visible.sync="innerVisible"
                append-to-body
              >
                <div
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-around;
                  "
                >
                  <div>
                    详细地址
                    <el-input
                      v-model="form.input2"
                      placeholder=""
                      :disabled="true"
                    />
                  </div>
                  <div>
                    地点坐标
                    <el-input
                      v-model="form.input3"
                      placeholder="经度: 0, 纬度: 0"
                      :disabled="true"
                    />
                  </div>
                </div>
              </el-dialog>
            </div>
          </div>

          <div v-show="tanshow2" :rules="rules">
            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              <div style="width: 20%; display: inline-block">*视频通道数</div>
              <el-input
                v-model="form.channelCount"
                :disabled="form.deviceChannelType == 1"
                style="width: 60%; marginright: 10px"
                clearable
                size="small"
                placeholder="1"
              />
            </div>

            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              <div style="width: 20%; display: inline-block">
                *告警输入通道数
              </div>

              <el-input
                v-model="form.alarmInputChannel"
                style="width: 60%; marginright: 10px"
                clearable
                size="small"
                placeholder="0"
              />
            </div>

            <div style="margin-top: 20px; font-size: 17px; margin-left: 20%">
              <div style="width: 20%; display: inline-block">
                *告警输出通道数
              </div>

              <el-input
                v-model="form.alarmOutputChannel"
                style="width: 60%; marginright: 10px"
                clearable
                size="small"
                placeholder="0"
              />
            </div>
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelButton">取 消</el-button>
            <el-button
              style="margin-top: 12px"
              :disabled="active === 0"
              @click="next1"
            >上一步</el-button>
            <el-button
              v-show="toshow"
              type="primary"
              @click="queding"
            >确 定</el-button>
            <el-button
              v-show="toshow1"
              style="margin-top: 12px"
              :disabled="disableButton"
              @click="next"
            >下一步</el-button>
          </span>
        </el-dialog>

        <div class="table">
          <el-table
            v-loading="loading"
            border
            stripe
            :data="deviceList"
            height="600px"
          >
            <div slot="empty">
              <el-empty description="暂无设备" />
            </div>

            <el-table-column
              label="设备名称"
              align="center"
              prop="name"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="所在监控节点"
              align="center"
              prop="orgName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="设备型号"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ getConnetType(scope.row.connetType) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="设备标识"
              align="center"
              prop="serviceId"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="设备状态"
              align="center"
              prop="status"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status" style="background: #67c23a" />
                <span v-else style="background: #606266" />
                <span> {{ scope.row.status ? "在线" : "离线" }} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="套餐详情"
              align="center"
              prop="orgName"
              :show-overflow-tooltip="true"
            >
              <span
                style="cursor: pointer; color: rgb(24, 144, 255)"
                @click="openPackageDialog"
              >
                7天云存储
              </span>
            </el-table-column>

            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="170"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="200"
              class-name="small-padding fixed-width"
            >
              <template v-if="scope.row.id !== 1" slot-scope="scope">
                <el-button
                  v-hasPermi="['system:user:edit']"
                  size="small"
                  type="text"
                  icon="iconfont icon-pen"
                  @click="showsettinginfo(scope.row)"
                >
                  <span class="text">设置</span></el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="handlePlay(scope.row)"
                >
                  <span><svg
                    viewBox="0 0 1024 1024"
                    focusable="false"
                    data-icon="caret-right"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"
                    />
                  </svg>
                  </span>
                  播放
                </el-button>
                <el-button
                  v-hasPermi="['system:user:remove']"
                  size="small"
                  type="text"
                  icon="iconfont icon-delete"
                  style="color: red"
                  @click="handleDelete(scope.row)"
                ><span class="text">删除</span></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.current"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </el-col>

    <!-- </el-row> -->

    <!-- 设置弹窗 -->
    <el-dialog
      top="2%"
      :visible.sync="showsetting"
      width="45%"
      style="margin-top: 0; margin-bottom: 2%"
      center
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-form label-width="120px" :model="settingForm">
            <el-form-item label="设备厂商:">
              <el-input
                :value="settingForm.vendor || '暂无'"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="设备类型:">
              <el-select
                v-model="settingForm.deviceChannelType"
                style="width: 100%"
                clearable
                size="small"
                placeholder="请选择通道类型"
                :disabled="true"
              >
                <el-option
                  v-for="(item, index) in $dt('device_channel_type')"
                  :key="index"
                  :label="item.dictValue"
                  :value="item.dictKey"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称:">
              <el-input v-model="settingForm.name" />
            </el-form-item>
            <el-form-item label="所属节点:">
              <treeselect
                v-model="settingForm.orgId"
                no-options-text="无数据"
                :flat="true"
                :auto-select-descendants="true"
                :multiple="false"
                style="line-height: 16px"
                :limit="1"
                :options="orgOptions"
                :show-count="true"
                placeholder="请选择归属机构"
              />
            </el-form-item>
            <el-form-item label="接入协议:">
              <el-select
                v-model="settingForm.connetType"
                style="width: 100%"
                clearable
                :disabled="true"
                size="small"
              >
                <el-option
                  v-for="item in $dt('connet_type')"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备编码:">
              <el-input v-model="settingForm.serviceId" :disabled="true" />
            </el-form-item>
            <el-form-item label="国标用户id:">
              <el-input v-model="settingForm.loginName" :disabled="true" />
            </el-form-item>
            <el-form-item label="国标接入密码:">
              <el-input v-model="settingForm.loginPwd" />
            </el-form-item>
            <el-form-item label="位置信息:">
              <div style="display: flex; align-items: center">
                <el-input v-model="settingForm.address">
                  <el-button
                    slot="suffix"
                    style="width: 120px; height: 32px"
                    type="text"
                    size="mini"
                    @click="
                      showaddress(
                        settingForm.address,
                        settingForm.longitude,
                        settingForm.latitude
                      )
                    "
                  >查看地图</el-button>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="能力集:">
              <el-tag
                v-for="tag in tags"
                :key="tag.name"
                closable
                :disable-transitions="true"
                :type="tag.type"
                style="margin-left: 5px"
                @close="handleClose(tag)"
              >
                {{ tag.name }}
              </el-tag>
            </el-form-item>
            <el-form-item style="display: flex">
              <el-button
                size="small "
                @click="showsetting = false"
              >取消</el-button>
              <el-button
                type="primary"
                size="small"
                @click="editEquipmentInformation"
              >确认</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通道信息">
          <el-table>
            <el-table-column label="通道号" />
            <el-table-column label="通道名称" />
            <el-table-column label="通道编码" />
            <el-table-column label="所属节点" />
            <el-table-column label="通道能力" />
            <el-table-column label="操作" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      :title="playTitle"
      :visible.sync="playDlgOpen"
      width="60%"
      append-to-body
    >
      <!-- <iframe id="videoPlayer" :src="playerPath" frameborder="0" width="100%" height="100%" /> -->
      <VideoPlayers id="videoPlayers" ref="hlsVideoPlayer" />
    </el-dialog>

    <!-- 坐标 -->
    <el-dialog
      style="margin-top: 0px"
      :visible.sync="mapDialog"
      width="70%"
      append-to-body
    >
      <div class="dia">
        <div class="dia-left">
          <span>详细地址</span>
          <el-input v-model="valueleft" :disabled="true" />
        </div>
        <div class="dia-right">
          <span>地点坐标</span>
          <el-input v-model="valueright" :disabled="true" />
        </div>
      </div>

      <div class="selectinput">
        <el-select v-model="values" placeholder="请选择">
          <el-option
            v-for="(item, index) in disivions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <Map
        ref="map"
        :new-style="newStyle"
        mapid="deviceCodeMap"
        :type="type"
        @click-marker-coor="clickMarkerCoor"
      />
      <span slot="footer" class="dialog-footer">
        <!-- <div class="tip">
          请点击拖动定位图标，进行经纬度的选择：<span
            v-if="coor.length"
          >{{ coor[0] }}，{{ coor[1] }}</span>
        </div> -->
        <el-button @click="mapDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updataAddressAndLlongLat(locationdata)"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 导入设备编码   -->
    <el-dialog
      title="导入设备编码"
      :visible.sync="dialogVisibleimp"
      width="50%"
    >
      <div class="importdevice">
        <div class="title">1. 下载导入模板</div>
        <div class="imp-info">按照要求完善表格内容</div>
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="btn(data)"
        >下载模板表格</el-button>
      </div>

      <div
        style="
          background-color: rgb(239, 242, 244);
          margin: 20px;
          padding: 10px;
        "
      >
        <div style="font-weight: 800; color: black">2. 上传完善后的表格</div>

        <el-upload
          class="upload-demo"
          drag
          :action="uploadurl()"
          :multiple="false"
          :on-success="uploadsuccess"
          style="margin-left: 22%"
          :show-file-list="false"
          :on-change="handleExcel"
          accept="'.xlsx','.xls'"
          :auto-upload="true"
          :headers="headers"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text" style="font-weight: 900">
            点击上传或拖拽文件到这里
          </div>
          <div slot="tip" class="el-upload__tip" style="margin-left: -15%">
            支持的文件类型：XLS、XLSX，每次只能上传一个文件且大小不超过2M，上传记录不超过2000条
          </div>
        </el-upload>
      </div>
    </el-dialog>

    <!-- 信息导出 -->
    <!-- <el-dialog title="编码设备信息导出" :visible.sync="dialogFormVisible" style="width: 50%; margin: 0 auto;">
      <el-form :model="form">
        <el-form-item label="请使用短信验证码确认管理员身份">
          <el-input v-model="form1.phone" autocomplete="off" style="width: 80%; margin-left: 10%;" placeholder="18307071986" :disabled="true" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="form1.codes" autocomplete="off" placeholder="请输入短信验证码" style="width: 45%; margin-left: 10%;" />
          <el-button type="primary" plain style="margin-left: 18px; ">获取验证码</el-button>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="daochu()">确 定</el-button>

      </div>
    </el-dialog> -->
    <!-- 套餐弹窗 -->
    <packageDialog ref="packageDialogRef" />
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import packageDialog from '@/views/device/code/components/packageDialog'
import VideoPlayers from '../../videomonitor/playback/components/videosAllVideos.vue'
import { listPageDevice, getInfoParameter, getInfo } from '@/api/system/device'

import {
  listOrg,
  getOrg,
  delOrg,
  addOrg,
  updateOrg,
  deldevice,
  treeselect,
  orginfoAndSubOrgInfo,
  getIndex,
  getInfos
} from '@/api/system/org'
import Map from '@/components/Map/index'
import {
  getInfoserve,
  editdevicename,
  deletedevicename
} from '@/api/system/device'
import { getToken } from '@/utils/auth'
import { equipmentInformationEditing } from '@/api/device/device.js'
import { listRole } from '@/api/system/role'
import { dealTree } from '@/utils/deal-tree'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Searchjigou from './searchjigou.vue'
import DeviceInfo from './components/deviceinfo.vue'
import MapContainer from '../../../components/AMapLoader/AMapLoader.vue'
export default {
  // name: 'DeviceCode',
  components: {
    Treeselect,
    Searchjigou,
    DeviceInfo,
    VideoPlayers,
    MapContainer,
    Map,
    packageDialog
  },
  data() {
    return {
      uploadData: '',
      fileList: [],
      // uploadurl: process.env.VUE_APP_BASE_API + '/jxict-project-sso/org/import', // 导入文件服务器地址
      headers: { Authorization: 'Bearer ' + getToken() }, // 导入文件形式
      dialogVisibleimp: false, // 导入设备编码弹窗
      dialogFormVisible: false, // 导出编码设备弹窗
      form1: {
        phone: '', // 导出弹窗的电话
        codes: '' // 导出弹窗验证码
      },
      divisionProps: {
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      // 设置弹窗
      settingForm: {},
      tags: [
        { name: '云台控制', type: 'info' },
        { name: '光圈控制', type: 'info' },
        { name: '聚焦控制', type: 'info' },
        { name: '视频控制', type: 'info' }
      ],
      dialogVisible1: false,
      i: 0,
      newStyle: {
        height: '500px'
      },
      coor: [],
      type: ['cluster', 'geocoder'], // 显示地图类型

      values: '',
      disivions: [
        {
          label: '北京市',
          value: '北京市'
        },
        {
          label: '天津市',
          value: '天津市'
        },
        {
          label: '河北省',
          value: '河北省'
        },
        {
          label: '山西省',
          value: '山西省'
        },
        {
          label: '内蒙古自治区',
          value: '内蒙古自治区'
        },
        {
          label: '辽宁省',
          value: '辽宁省'
        }
      ],
      chooseTree: true,
      valueright: null,
      valueleft: null,
      mapDialog: false, // 地图弹窗
      showedit: true,
      showsetting: false, // 设置弹窗
      activeName: 'first',
      playerPath: process.env.BASE_URL + 'VnPlayer.html',
      deviceInfoDlgOpen: false,
      playTitle: '',
      input: '',
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      playDlgOpen: false,
      showmore: false,
      innerVisible: false,
      value: '', // 下拉框的值
      options: [
        {
          value: '选项1',
          label: '全部人员角色'
        }
      ],
      showSearchRes: false,
      orgDlgOpen: false,
      orgDlgEditFlag: false,
      currentSelectedOrgId: undefined,
      currentSelectedOrgName: '',
      currentTotalNum: undefined,
      treeProps: {
        label: (data, node) => {
          var label = data.name
          if (data.onelineNum != null && data.deviceNum != null) {
            label += ` [${data.onelineNum}/${data.deviceNum}]`
          }
          return label
        },
        isLeaf: (data, node) => {
          return this.treeLeaf(data)
        },
        disabled: (data, node) => {
          return this.treeLeaf(data)
        }
      },

      disableNextButton: true,

      q: '', // 左侧搜索框的值
      activeTab: 'dev',
      queryDevTreeDataList: [], // 树形组件的数据
      defExpandDevs: [],
      activeName1: 'first',
      showTree: true,
      devLevelFilter: false,
      getInfo1: '',
      treeLoading: false,
      // 弹出层
      dialogVisible: false,
      // 遮罩层
      loading: true,
      tanshow: true,
      tanshow1: false,
      tanshow2: false,
      toshow: false,
      toshow1: true,
      // 导出遮罩层
      exportLoading: false,
      active: 0,

      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      deviceList: null,
      // 弹出层标题
      title: '',
      orgTitle: '',
      // 机构树选项
      orgOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 机构名称
      orgName: undefined,

      getInfo: '',
      // 表单参数
      form: {
        name: '',
        orgId: '',
        connetType: '',
        deviceSource: '',
        address: '',
        division: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 设置弹窗数据
      setpsw: null,
      oldname: null, // 设备名称
      setname: null, // 设备名称
      setcode: null, // 国际编码
      setid: null, // 平台id
      setvendor: null, // 厂商
      settime: null, // 时间
      setnode: null, // 节点
      setAddress: null, // 地址
      id: null,
      // 查询参数
      queryParams: {
        current: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        orgId: undefined,
        serviceId: undefined,
        devCategory: undefined
      },

      orgRules: {
        parentId: [
          {
            required: true,
            message: '上级机构不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '机构名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      // 表单校验

      rules: {
        no: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      formaddress: '' // 添加弹框的位置坐标
    }
  },
  computed: {
    // 下一步按钮
    disableButton() {
      if (this.tanshow) {
        return !this.form.vendor || !this.form.deviceChannelType
      }
      if (this.tanshow1) {
        if (this.form.connetType == 'protocol_qly' && !this.form.mac) {
          // 千里眼协议填写Mac
          return true
        }
        return (
          !this.form.name ||
          !this.form.orgId ||
          !this.form.connetType ||
          !this.form.deviceSource ||
          !this.formaddress ||
          !this.form.division
        )
      }
    },
    showQueryDevTree() {
      if (this.q.length == 0) return true
      if (this.activeTab == 'dev' && this.devLevelFilter) {
        return true
      }
      if (this.showSearchRes) {
        return false
      }
      return true
    },

    treeEmptyText() {
      return this.treeLoading ? '加载中...' : '未查询到组织机构'
    }
  },
  watch: {
    // 根据名称筛选机构树
    orgName(val) {
      this.$refs.tree.filter(val)
    },
    // 监听监控弹窗
    playDlgOpen(val) {
      if (!val) {
        this.$refs.hlsVideoPlayer.closePlayer(0)
      }
    }
  },
  created() {
    this.currentSelectedOrgName = sessionStorage.getItem('tenantName')

    this.getTreeselect()

    this.queryParams.orgId = undefined
  },
  methods: {
    uploadurl() {
      return process.env.VUE_APP_BASE_API + '/jxict-project-sso/org/import'
    },
    // 文件导入成功的回调
    uploadsuccess(response, file, fileList) {
      console.log(response, file, fileList)
    },

    // 导入表格
    async handleExcel(file) {},

    // 导出文件
    async exporttableinfo() {
      const res = await getInfos(this.currentSelectedOrgId)

      const name = this.currentSelectedOrgName
      // 支持IE浏览器
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(res, name)
        return
      }
      const href = window.URL.createObjectURL(res)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = href
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    },
    // 打开套餐弹窗
    openPackageDialog() {
      this.$refs.packageDialogRef.packageDialog = true
    },
    getConnetType(connetType) {
      let value = ''
      this.$store.getters.dict['connet_type'].forEach((item) => {
        if (connetType == item.dictKey) {
          value = item.dictValue
        }
      })
      return value
    },
    handleDivisionChange(e) {
      // console.log(this.$dt("division"));
      this.form.division = e[e.length - 1]
    },
    addDevice() {
      this.form = {}
      this.dialogVisible = true
    },
    // 设置弹窗事件
    async showsettinginfo(row) {
      const res = await getInfo(row.id)
      const arr = this.$dt('vendor')
      this.settingForm = res
      arr.forEach((item) => {
        if (this.settingForm.vendor == item.dictKey) {
          this.settingForm.vendor = item.dictValue
        }
      })
      this.showsetting = true
    },
    // 编辑设备信息
    async editEquipmentInformation() {
      const param = {}
      param.id = this.settingForm.id
      param.name = this.settingForm.name
      param.orgId = this.settingForm.orgId
      param.servicePassword = this.settingForm.servicePassword
      param.address = this.settingForm.address
      param.longitude = this.settingForm.longitude
      param.latitude = this.settingForm.latitude

      const res = await equipmentInformationEditing(param)
      let str = res
      if ((str = '编辑成功')) {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.getList()
        this.showsetting = false
      }
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },

    showaddress(address, longitude, latitude) {
      this.coor.splice(0)
      this.coor.push(longitude, latitude)
      this.address = address
      this.valueright = '经度:' + this.coor[0] + ',纬度:' + this.coor[1]
      this.valueleft = address || '暂无'

      this.mapDialog = true
      this.$nextTick(() => {
        var point = new BMap.Point(longitude, latitude) // 创建点坐标
        this.$refs.map.map.centerAndZoom(point, 15)
        var point1 = new BMap.Point(longitude, latitude)
        var marker = new BMap.Marker(point1) // 创建标注
        this.$refs.map.map.addOverlay(marker) // 将标注添加到地图中
      })
    },
    async updataAddressAndLlongLat(param) {
      if (this.showsetting) {
        this.settingForm.address = param.address
        this.settingForm.longitude = param.longitude
        this.settingForm.latitude = param.latitude
      } else if (this.dialogVisible) {
        this.formaddress = param.address
        this.form.longitude = param.longitude
        this.form.latitude = param.latitude
        this.form.address = this.formaddress
        this.showTree = false
        this.$nextTick(() => {
          this.showTree = true
        })
      }
      this.mapDialog = false
    },

    clickMarkerCoor(e) {
      this.coor = e
      const param = {
        id: this.settingForm.id,
        longitude: e[0],
        latitude: e[1],
        address: e[2]
      }
      this.valueleft = param.address
      this.valueright = '经度:' + param.longitude + ',纬度:' + param.latitude
      this.locationdata = param
    },
    // 编辑设备名称修改
    async commitChanges() {
      this.oldname = this.setname
      const res = await editdevicename({
        id: this.id,
        name: this.setname
      })

      let str = res
      this.getList()
      if ((str = '编辑成功')) {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      } else {
        this.$message.error('编辑失败')
      }
      this.showedit = true
    },

    queding() {
      getInfoParameter(this.form).then(() => {
        this.dialogVisible = false
        this.getList()
      })
    },
    // 取消
    cancelButton() {
      this.dialogVisible = false
      this.active = 0
      this.tanshow1 = false
      this.tanshow2 = false
      this.tanshow = true
    },
    next1() {
      if (this.active-- > 2) this.active = 0
      if (this.active == 1) {
        this.tanshow1 = true
        this.tanshow = false
        this.tanshow2 = false
        this.toshow = false
        this.toshow1 = true
      }
      if (this.active == 0) {
        this.tanshow1 = false
        this.tanshow2 = false
        this.tanshow = true
      }
      if (this.active == 2) {
        this.tanshow2 = true
        this.tanshow1 = false
        this.tanshow = false
        this.toshow = true
        this.toshow1 = false
      }
    },
    next() {
      if (this.active++ > 2) this.active = 0
      if (this.active == 1) {
        this.tanshow1 = true
        this.tanshow = false
        this.tanshow2 = false
      }
      if (this.active == 0) {
        this.tanshow1 = false
        this.tanshow2 = false
        this.tanshow = true
      }
      if (this.active == 2) {
        this.tanshow2 = true
        this.tanshow1 = false
        this.tanshow = false
        this.toshow = true
        this.toshow1 = false
      }
    },
    // handleClose (done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => { });
    // },
    handlePlay(row) {
      this.playTitle = row.name + ' 直播中'
      this.playDlgOpen = true
      this.$nextTick(() => {
        const msgObj = {}
        msgObj.type = 'startPlay'
        msgObj.deviceId = row.serviceId
        msgObj.showTools = '1'
        msgObj.deviceName = row.name
        setTimeout(() => {
          this.$refs.hlsVideoPlayer.requestPlay(
            msgObj.deviceId,
            msgObj.deviceName
          )
        }, 1000)
        //  _iframe.postMessage(JSON.stringify(msgObj), '*')
      })
    },

    searchedOrgClick(orgId, orgName) {
      this.queryParams.current = 1
      this.queryParams.orgId = orgId
      this.getList()
    },
    searchOrg() {
      const queryParams = { name: this.q }
      listOrg(queryParams).then((res) => {
        this.$refs.searchJigou.heightLight(res, this.q)
        this.$refs.searchJigou.orgList = res
        this.$nextTick(() => {
          this.showSearchRes = true
        })
      })
    },
    clearSearch() {
      this.$nextTick(() => {
        this.showSearchRes = false
      })
    },
    orgRefresh() {},
    cancelOrgInfoDlg() {
      this.orgDlgOpen = false
    },

    treeLeaf(data) {
      if (
        data.children != undefined &&
        data.children != null &&
        data.children.length == 0
      ) {
        return true
      } else {
        return false
      }
    },

    treeNodeRightClick() {},

    // tree
    treeLoad(node, resolve) {
      const nodeLevel = node.level

      let orgId
      if (node.data) {
        orgId = node.data.id
      }
      orginfoAndSubOrgInfo({ orgId: orgId })
        .then((ret) => {
          this.getInfo1 = ret.children
          if (nodeLevel == 0) {
            this.defExpandDevs.push(ret.id)
            this.currentSelectedOrgId = ret.id
            this.getList()
          }
          let orgList = []
          if (node.level == 0) {
            orgList.push(ret)
          } else {
            orgList = ret.children || []
          }

          if (!node.level && !this.devLevelFilter) {
            if (orgList.length > 100) {
              this.devLevelFilter = true
            } else if (orgList.length > 1000) {
              this.devLevelFilter = true
            }
          }

          resolve(orgList)

          if (this.q && !node.matched) {
            this.$refs['devTree'].filter(this.q)
          }
        })
        .catch(() => {})
        .then(() => {
          if (
            this.q &&
            !this.q.endsWith(' ') &&
            this.q.split(/\s+/).length === node.level &&
            this.devLevelFilter
          ) {
            this.q += ' '
            this.$refs['q'].focus()
          }
        })
    },

    switchTab(tab) {
      if (this.activeTab != tab) {
        this.q = ''
        this.$nextTick(() => {
          this.activeTab = tab
        })
      }
    },
    /** 查询设备列表 */
    getList() {
      this.loading = true

      listPageDevice(this.queryParams).then((response) => {
        this.deviceList = response.records
        this.total = response.total
        this.loading = false
        this.deviceList = response.records
        this.getInfo = response.records
      })
    },
    /** 查询机构下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        dealTree(response)
        this.disableNotLeaf(response)
        this.orgOptions = response
      })
    },
    disableNotLeaf(options) {
      options.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.isDisabled = true
          this.disableNotLeaf(item.children)
        } else {
          item.isDisabled = false
        }
      })
    },

    // 节点单击事件
    handleNodeClick(data, node, c) {
      this.currentSelectedOrgId = data.id

      this.queryParams.orgId = data.id

      this.currentSelectedOrgName = data.name

      this.getList()
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        current: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        orgId: undefined,
        serviceId: undefined,
        devCategory: undefined
      }
      this.$refs.queryForm.resetFields()
      this.getList()
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除所选的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // debugger
          if (row && row.id) {
            return deldevice(row.id)
          }
        })
        .then(() => {
          this.showTree = false
          this.$nextTick(() => {
            this.showTree = true
            this.currentSelectedOrgId = undefined
            this.getTreeselect()
            this.getList()
            this.msgSuccess('删除成功')
          })
        })
        .catch(() => {})
    },
    /** 表格勾选判断 */
    selectEnable(row) {
      return row.id !== 1
    }
  }
}
</script>
<style lang="scss" scoped>
.importdevice {
  background-color: rgb(239, 242, 244);
  margin: 20px;
  padding: 10px;
  .title {
    margin-bottom: 10px;
    font-weight: 800;
    color: black;
  }
  .imp-info {
    margin-bottom: 10px;
    color: black;
  }
}
.tab-content {
  .tab-pane {
    ::v-deep .el-tree {
      font-size: 13px;
    }
  }
}
.setting-pan {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-left: 25px;
  padding-right: 16px;
}

#videoPlayers {
  width: 100%;
  height: 490px !important;
}

::v-deep .bottom-bar {
  display: none;
}

::v-deep .vue-treeselect__single-value {
  font-size: 14px;
  margin-left: 6px;
}

::v-deep .vue-treeselect__placeholder {
  font-size: 14px;
  margin-left: 5px;
}
::v-deep .vue-treeselect--single .vue-treeselect__input {
  height: 32px;
}

.el-tree {
  width: 13vw;
  height: 37vw;
  overflow: auto;
}

.el-tree > .el-tree-node {
  display: inline-block;
  min-width: 100%;
}

.unloadup {
  display: flex;
  flex-direction: column;
  color: #409eff;
  text-align: center;

  span {
    cursor: pointer;
    font-size: 13px;
  }
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

::v-deep .el-popover {
  width: 200px;
}

.el-icon-more {
  font-size: 13px;
  transform: rotateZ(90deg);
}

::v-deep .el-form-item--medium .el-input--medium .el-input__inner {
  height: 32px;
  line-height: 33px;
  border-radius: 5px;
}

::v-deep .el-tab-pane {
  .el-button--medium {
    padding: 10px 5px;
    font-size: 14px;
    /* border-radius: 4px; */
    width: 100%;
    border: 0;
    text-align: left;
  }
}

::v-deep .pagination-container {
  margin-top: 5px;

  .el-pagination {
    text-align: right;
  }
}

.app-container {
  justify-content: space-between !important;
}

.cell {
  button {
    i {
      font-size: 13px;
    }
  }
}

.sys-content {
  display: flex;
  flex-direction: column;
  width: 80%;

  .table {
    flex: 1;

    .text {
      font-size: 13px;
      margin-left: 4px;
    }
  }

  .info {
    height: 45px;
    margin-top: -16px;
    margin-bottom: 10px;
    width: 76vw;
    line-height: 45px;
    background-color: #e3e8f1;
    color: black;

    .span {
      margin-left: 10px;
    }
  }
}

.container-left {
  margin-bottom: 10px;

  .form-control {
    padding: 0;
    border: 0;
  }
}

::v-deep .el-table {
  font-size: 13px;
}
</style>
