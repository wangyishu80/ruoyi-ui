<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="员工姓名:" prop="empName">
        <el-input
          v-model="queryParams.empName"
          placeholder="请输姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学历" prop="empEdu">
        <el-select v-model="queryParams.empEdu"
                   placeholder="请选择学历" clearable size="small">
          <el-option
            v-for="dict in empeduOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门:" prop="empDepartment">
        <treeselect v-model="queryParams.empDepartment" style="width: 200px;"  :options="deptOptions" placeholder="请选择部门" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-setting"
          size="mini"
          :disabled = "single"
          @click="openCostForm"
        >设置成本</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="upload.open = true"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="exportCost"
        >导出</el-button>
      </el-col>
    </el-row>


    <el-table border
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" prop="empId" />
      <!--<el-table-column label="工号" align="center" width="90" prop="empNo" :show-overflow-tooltip="true" />-->
      <el-table-column label="姓名" align="center" width="90" prop="empName" :show-overflow-tooltip="true" />
      <el-table-column label="学历" align="center" width="80" prop="empEdu" :formatter="empeduFormat" :show-overflow-tooltip="true" />
      <el-table-column label="部门" align="center" width="120" prop="empDepartment" :show-overflow-tooltip="true" />
      <el-table-column label="岗位" align="center" width="120" prop="empJob" :show-overflow-tooltip="true" />
      <el-table-column label="职级" align="center" width="100" prop="empLevel" :formatter="levelFormat" :show-overflow-tooltip="true" />
      <el-table-column label="工资" align="center" width="80" prop="empSalary" />
      <el-table-column label="社保" align="center" width="80" prop="empInsurance" />
      <el-table-column label="公积金" align="center" width="80" prop="empFund" />
      <el-table-column label="补助1" align="center" width="80" prop="subsidies1" />
      <el-table-column label="补助2" align="center" width="80" prop="subsidies2" />
      <el-table-column label="补助3" align="center" width="80" prop="subsidies3" />
      <el-table-column label="补助4" align="center" width="80" prop="subsidies4" />
      <el-table-column label="更新时间" align="center" width="180" prop="updateTime" :show-overflow-tooltip="true" :formatter="timeFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="openEmpCostHistory(scope.row)"
          >变更记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog
      width="800px"
      title="设置人员成本"
      :visible.sync="showCostForm"
      :close-on-click-modal = "closeDialog"
      @close="closeCostForm"
      style="margin-top: 10vh; !important">

      <el-form ref="costForm" :model="costForm" :rules="rules" label-position="right" label-width="130px">
        <el-input v-model="costForm.empId" type = "hidden" />
        <el-input v-model="costForm.costId" type = "hidden" />
        <el-row>
          <el-col :span="11">
            <el-form-item label="工资" prop="empSalary" >
              <el-input v-model.number="costForm.empSalary" placeholder="请输入工资" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="社保" prop="empInsurance">
              <el-input v-model="costForm.empInsurance" placeholder="请输入社保成本" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="公积金" prop="empFund">
              <el-input v-model="costForm.empFund" placeholder="请输入公积金" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="补助1" prop="subsidies1">
              <el-input v-model="costForm.subsidies1" placeholder="请输入补助" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="补助2" prop="subsidies2">
              <el-input v-model="costForm.subsidies2" placeholder="请输入补助" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="补助3" prop="subsidies3">
              <el-input v-model="costForm.subsidies3" placeholder="请输入补助" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="补助4" prop="subsidies4">
              <el-input v-model="costForm.subsidies4" placeholder="请输入补助" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="补助5" prop="subsidies5">
              <el-input v-model="costForm.subsidies3" placeholder="请输入补助" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="是否留痕" prop="isHistory">
              <el-radio :disabled="costHistoryDisabled" v-for="yn in ynOptions" v-model="costForm.isHistory" :value="yn.dictValue" :label="yn.dictValue">
                {{ yn.dictLabel }}
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCost">确 定</el-button>
        <el-button type="warning" @click="">重 置</el-button>
        <el-button @click="showCostForm = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 历史记录 -->
    <el-dialog title="变更历史" :visible.sync="showEmpCostHistory" width="800px"
               :close-on-click-modal="closeDialog" @close="closeHistory" style="margin-top: 10vh; !important">

      <el-table border :data="historyList">
        <el-table-column type="selection" width="55" align="center" prop="costId" />
        <el-table-column label="姓名" align="center" width="90" prop="empName" :show-overflow-tooltip="true" />
        <el-table-column label="工资" align="center" width="80" prop="empSalary" />
        <el-table-column label="社保" align="center" width="80" prop="empInsurance" />
        <el-table-column label="公积金" align="center" width="80" prop="empFund" />
        <el-table-column label="补助" align="center" width="80" prop="subsidies1" />
        <el-table-column label="补助2" align="center" width="80" prop="subsidies2" />
        <el-table-column label="补助3" align="center" width="80" prop="subsidies3" />
        <el-table-column label="补助4" align="center" width="80" prop="subsidies4" />
        <el-table-column label="更新时间" align="center" width="180" prop="updateTime" :formatter="timeFormat" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-order"
              @click="deleteHistory(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showEmpCostHistory = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px"
               :close-on-click-modal="closeDialog" @close="closeUpload">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport +'&isHistory=' + upload.isHistory"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" @change="checked">是否更新已经存在的用户数据</el-checkbox>
          <el-checkbox v-model="upload.isHistory" :disabled="upload.historyDis">更新的数据是否留痕</el-checkbox>
          <el-link type="info" style="font-size:12px; float: right;" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, forceLogout } from "@/api/monitor/online";

import { listEmpCost, addCost, getCost, updateCost, listEmpCostHistory, delCostHistory, exportEmpCost, importTemplate } from "@/api/employee/empCost";
import { timeFormat } from "@/api/employee/employee";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
import ElRow from "element-ui/packages/row/src/row";
import ElCol from "element-ui/packages/col/src/col";


  export default {
    components: {
      ElRow,
      ElCol,
      Treeselect
    },
    name: "EmpCost",

    data() {
      return {
        //点击dialog外，是否关闭dialog
        closeDialog : false,
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        // 成本变更历史纪录表格数据
        historyList : [],

        deptOptions : [],
        // 查询参数
        queryParams: {
          empEdu: undefined,
          empName: undefined,
          empDepartment : undefined,
          pageNum: 1,
          pageSize: 10
        },

        single : true,

        //学历
        empeduOptions: [],
        //职级
        levelOptions : [],
        //是否
        ynOptions : [],

        showCostForm : false,

        showEmpCostHistory : false,

        costForm : {
          costId : undefined,
          empId : undefined,
          empSalary : undefined,
          empInsurance  :undefined,
          empFund :undefined,
          subsidies1 :undefined,
          subsidies2 :undefined,
          subsidies3 :undefined,
          subsidies4 :undefined,
          subsidies5 :undefined,
          isHistory : undefined
        },

        costHistoryDisabled : false,

        empId : undefined,

        rules: {
          empSalary: [
            { required: true, message: '不能为空'},
            { type: 'number', message: '工资必须为数字值'}
          ],
          isHistory: [
            { required: true, message: '是否留痕', trigger: 'change' }
          ],
        },

        empIds : [],

        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "员工成本导入",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: false,

          isHistory: false,
          historyDis: true,

          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/employee/cost/importCost"

        },


      };
    },


    mounted : function () {
      this.getTreeselect();
      this.getList();

      this.getDicts("emp_edu").then(response => {
        this.empeduOptions = response.data;
      });
      this.getDicts("emp_level").then(response => {
        this.levelOptions = response.data;
      });
      this.getDicts("sys_yes_no").then(response => {
        this.ynOptions = response.data;
      });
    },
    methods: {

      //职级，数据字典翻译
      levelFormat(row, column){
        return this.selectDictLabel(this.levelOptions, row.empLevel);
      },

      // 学历字典翻译
      empeduFormat(row, column) {
        return this.selectDictLabel(this.empeduOptions, row.empEdu);
      },

      showYnLabel(row, column, cellValue){
        return this.selectDictLabel(this.ynOptions, cellValue);
      },

      //获取部门下拉树的部门数据
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },

      /** 查询员工成本列表 */
      getList() {
        this.loading = true;
        listEmpCost(this.queryParams).then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }).catch(()=>{
          this.msgError("查询失败，请稍后重试！");
        });
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

      //员工表格 多选框选中数据
      handleSelectionChange(selection) {
        this.empIds = selection.map(item => item.empId);
        this.single = selection.length != 1;
      },

      //成本设置表单清空
      emptyResetEduForm(){
        this.costForm = {
          costId : undefined,
          empId : undefined,
          empSalary : undefined,
          empInsurance  :undefined,
          empFund :undefined,
          subsidies1 :undefined,
          subsidies2 :undefined,
          subsidies3 :undefined,
          subsidies4 :undefined,
          subsidies5 :undefined,
          isHistory : undefined
        }
        this.resetForm("costForm");
      },

      openCostForm(){
        this.costForm.empId = this.empIds[0];
        getCost(this.empIds).then(response =>{
          if(response.data){
            this.costForm = response.data;
          } else {
            this.costForm.isHistory = 'N';
            this.costHistoryDisabled = true;
          }
          this.showCostForm = true;
        });
      },

      closeCostForm(){
        this.emptyResetEduForm();
        this.costHistoryDisabled = false;
      },

      submitCost(){
        this.$refs["costForm"].validate(valid => {
          if (valid) {
            if(!this.costForm.empId){
              this.msgError("获取员工信息失败，请稍后重试！");
            } else if (this.costForm.costId != undefined) {
              updateCost(this.costForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("设置成功");
                  this.showCostForm = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addCost(this.costForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("设置成功");
                  this.showCostForm = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },

      timeFormat(row, column){
          return timeFormat(row);
      },

      openEmpCostHistory(row){
        if(!row || !row.empId){
          this.msgError("获取员工信息失败，请稍后重试！");
          return;
        }
        this.empId = row.empId;
        listEmpCostHistory(row.empId).then(response => {
          if(response.code === 200){
            if(response.rows && response.rows.length > 0){
              this.showEmpCostHistory = true;
              response.rows.forEach(history => {
                history.empName = row.empName;
              });
              this.historyList = response.rows;
            }else{
              this.$notify({
                title: '提示',
                message: '该员工成本无变更记录！',
                duration: 1500,
                type: 'success'
              });
            }
          }

        }).catch(()=>{
          this.msgError("查询失败，请稍后重试！");
        });

      },

      closeHistory(){
        this.historyList = [];
        this.empId = undefined;
      },

      deleteHistory(row){
        this.$confirm('确定要删除历史记录吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCostHistory(row.costId);
        }).then(response => {
          listEmpCostHistory(this.empId).then(response=>{
            if(response.code === 200){
              if(response.rows && response.rows.length > 0){
                this.showEmpCostHistory = true;
                response.rows.forEach(history => {
                  history.empName = row.empName;
                });
                this.historyList = response.rows;
              }else{
                this.historyList = [];
              }
            }
          });
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

      /** 导出人员成本列表 */
      exportCost(){
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出闲置列表数据项?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportEmpCost(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      },

      /** 导入按钮操作 */
      handleImport() {
        this.upload.open = true;
      },
      checked(){
        if(this.upload.updateSupport){
            this.upload.historyDis = false;
        }else {
          this.upload.isHistory = false;
          this.upload.historyDis = true;
        }
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
        this.getList();
      },

      closeUpload(){
        this.$refs.upload.clearFiles();
        this.upload.updateSupport = false;
        this.upload.isHistory = false;
        this.upload.historyDis = true;
      },

      /** 下载导入模板 */
      importTemplate() {
        importTemplate().then(response => {
          this.download(response.msg);
        });
      },

      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },





    }
  };
</script>

