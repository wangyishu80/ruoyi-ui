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

    <el-tabs v-model="activeName">
      <el-tab-pane label="当前闲置" name="first" style="height: 100%;">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="exportIdleEmp"
            >导出</el-button>
          </el-col>
        </el-row>
        <!-- 员工基本信息列表 -->
        <el-table v-loading="loading" :data="idleEmpList" border>
          <el-table-column type="selection" width="55" align="center" prop="empId" />
          <!--<el-table-column label="工号" align="center" prop="empNo" width="100" />-->
          <el-table-column label="姓名" align="center" prop="empName" width="80" />
          <el-table-column label="性别" align="center" prop="empSex" width="60" :formatter="sexFormat"/>
          <el-table-column label="年龄" align="center" prop="empAge" width="60"/>
          <el-table-column label="身份证号" align="center" prop="idCard" width="110" :show-overflow-tooltip="true" />
          <el-table-column label="学历" align="center" prop="empEdu" width="80" :formatter="empeduFormat"/>
          <el-table-column label="部门" align="center" prop="empDepartment" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="岗位" align="center" prop="empJob" width="100" :show-overflow-tooltip="true" />
          <el-table-column label="职级" align="center" prop="empLevel" width="130" :formatter="levelFormat" :show-overflow-tooltip="true" />
          <el-table-column label="联系电话" align="center" prop="empTel" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="现住址" align="center" prop="empAdress" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="参加工作日期" align="center" prop="empWorkdate" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="合同状态" align="center" prop="empState" width="100" :formatter="empstatusFormat"/>
          <el-table-column label="入职时间" align="center" prop="empEntrydate" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="开始闲置时间" align="center" prop="idleStartDate" width="120"
                           fixed="right" class-name="small-padding fixed-width" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-paperclip"
                @click="getProHistory(scope.row)"
              >历史项目</el-button>

            </template>
          </el-table-column>
        </el-table>
        <!-- 列表分页控件 -->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          style="margin-bottom: 20px; margin-top: 4px"
        />
      </el-tab-pane>

      <el-tab-pane label="闲置统计" name="second">
        <!-- 员工基本信息列表 -->
        <el-table v-loading="loading" :data="idleEmpListHistory" border>
          <el-table-column type="selection" width="55" align="center" prop="empId" />
          <!--<el-table-column label="工号" align="center" prop="empNo" width="100" />-->
          <!--<el-table-column type="index" label="序号" width="50" />-->
          <el-table-column label="姓名" align="center" prop="empName" width="80" />
          <el-table-column label="性别" align="center" prop="empSex" width="60" :formatter="sexFormat"/>
          <el-table-column label="年龄" align="center" prop="empAge" width="60"/>
          <el-table-column label="身份证号" align="center" prop="idCard" width="110" :show-overflow-tooltip="true" />
          <el-table-column label="学历" align="center" prop="empEdu" width="80" :formatter="empeduFormat"/>
          <el-table-column label="部门" align="center" prop="empDepartment" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="岗位" align="center" prop="empJob" width="100" :show-overflow-tooltip="true" />
          <el-table-column label="职级" align="center" prop="empLevel" width="130" :formatter="levelFormat" :show-overflow-tooltip="true" />
          <el-table-column label="联系电话" align="center" prop="empTel" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="现住址" align="center" prop="empAdress" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="参加工作日期" align="center" prop="empWorkdate" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="合同状态" align="center" prop="empState" width="100" :formatter="empstatusFormat"/>
          <el-table-column label="入职时间" align="center" prop="empEntrydate" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-paperclip"
                @click="empIdleStatistic(scope.row)"
              >闲置统计</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 列表分页控件 -->
        <pagination
          v-show="empIdleHistoryPage.total>0"
          :total="empIdleHistoryPage.total"
          :page.sync="empIdleHistoryPage.pageNum"
          :limit.sync="empIdleHistoryPage.pageSize"
          @pagination="getIdleHistoryList"
          style="margin-bottom: 20px; margin-top: 4px"
        />
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="历史项目" :visible.sync="showHistoryPro" width="810px"
               :close-on-click-modal="closeDialog" @close="closeProHistory" style="margin-top: 10vh; !important">

      <el-table border :data="historyProList">
        <el-table-column label="项目编号" align="center" prop="item_numbering" :show-overflow-tooltip="true" />
        <el-table-column label="项目名称" align="center" prop="item_name" :show-overflow-tooltip="true" />
        <el-table-column label="项目类型" align="center" prop="item_type" :formatter="proTypeFormat" />
        <el-table-column label="所属部门" align="center" prop="dept_name" :show-overflow-tooltip="true" />
        <el-table-column label="项目负责人" align="center" prop="emp_name" />
        <el-table-column label="参与日期" align="center" prop="startdate" :show-overflow-tooltip="true" />
        <el-table-column label="结束日期" align="center" prop="enddate" :show-overflow-tooltip="true" />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showHistoryPro = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="闲置统计" :visible.sync="showEmpIdleHistory" width="810px"
               :close-on-click-modal="closeDialog" @close="closeEmpIdleStatistic" style="margin-top: 10vh; !important">

      <el-table border :data="empIdleStatisticList">
        <el-table-column type="selection" align="center" prop="idleId" :show-overflow-tooltip="true" />
        <el-table-column label="姓名" align="center" prop="empId" :show-overflow-tooltip="true" />
        <el-table-column label="开始闲置" align="center" prop="startdate" :show-overflow-tooltip="true" />
        <el-table-column label="结束闲置" align="center" prop="enddate" :show-overflow-tooltip="true"/>
        <el-table-column label="闲置前项目" align="center" prop="" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delEmpIdleData(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showEmpIdleHistory = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { listIdleEmp, listIdleEmpHistory, exportIdleEmp, idleEmpPro, empIdleStatistic, delEmpIdleData } from "@/api/employee/employee";
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

        empId : undefined,

        activeName: 'first',
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        idleEmpList: [],
        // 闲置统计表格数据
        idleEmpListHistory: [],

        // 闲置时间统计
        empIdleStatisticList : [],
        //历史项目数据
        historyProList : [],

        // 性别状态字典
        sexOptions: [],
        //员工状态
        empstateOptions:[],

        deptOptions : [],
        // 查询参数
        queryParams: {
          empEdu: undefined,
          empName: undefined,
          empDepartment : undefined,
          pageNum: 1,
          pageSize: 10
        },

        empIdleHistoryPage: {
          total : 0,
          pageNum: 1,
          pageSize: 10
        },

        closeDialog : false,

        //学历
        empeduOptions: [],
        //职级
        levelOptions : [],
        //是否
        ynOptions : [],
        //项目类型
        proTypeOptions : [],
        showHistoryPro : false,

        showEmpIdleHistory : false,

        rules: {
          empSalary: [
            { required: true, message: '不能为空'},
            { type: 'number', message: '工资必须为数字值'}
          ],
          isHistory: [
            { required: true, message: '是否留痕', trigger: 'change' }
          ],
        },


        empIds : []
      };
    },


    mounted: function() {
      this.getDicts("emp_edu").then(response => {
        this.empeduOptions = response.data;
      });
      this.getDicts("emp_level").then(response => {
        this.levelOptions = response.data;
      });
      this.getDicts("item_type").then(response => {
        this.proTypeOptions = response.data;
      });
      this.getDicts("sys_user_sex").then(response => {
        this.sexOptions = response.data;
      });
      this.getDicts("emp_state").then(response => {
        this.empstateOptions = response.data;
      });

      this.getList();
      this.getIdleHistoryList();
      this.getTreeselect();
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

      proTypeFormat(row, column){
          return this.selectDictLabel(this.proTypeOptions, row.item_type);
      },

      //性别，数据字典翻译
      sexFormat(row, column) {
        return this.selectDictLabel(this.sexOptions, row.empSex);
      },

      // 状态字典翻译
      empstatusFormat(row, column) {
        return this.selectDictLabel(this.empstateOptions, row.empState);
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
        listIdleEmp(this.queryParams).then(response => {
          this.idleEmpList = response.rows;
          this.total = response.total;
          this.loading = false;
        }).catch(()=>{
          this.msgError("查询失败，请稍后重试！");
        });
      },

      /** 查询员工成本列表 */
      getIdleHistoryList() {
        this.loading = true;
        listIdleEmpHistory(this.empIdleHistoryPage).then(response => {
          this.idleEmpListHistory = response.rows;
          this.empIdleHistoryPage.total = response.total;
          this.loading = false;
        }).catch(()=>{
          this.msgError("查询失败，请稍后重试！");
        });
      },



      /** 搜索按钮操作 */
      handleQuery() {
        if(this.activeName === 'first'){
          this.queryParams.pageNum = 1;
          this.getList();
        }else if(this.activeName === 'second'){
          this.empIdleHistoryPage.pageNum = 1;
          this.empIdleHistoryPage.empEdu = this.queryParams.empEdu;
          this.empIdleHistoryPage.empName = this.queryParams.empName;
          this.empIdleHistoryPage.empDepartment = this.queryParams.empDepartment;
          this.getIdleHistoryList();
        }


      },

      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },

      timeFormat(row, column){
          return timeFormat(row);
      },

      /** 导出按钮操作 */
      exportIdleEmp() {
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出闲置列表数据项?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportIdleEmp(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      },


      getProHistory(row) {
        if(!row || !row.empId){
          this.msgError("获取员工信息失败，请稍后重试！");
          return;
        }
        const empId = row.empId;
        idleEmpPro(empId).then(response=>{
          if(response.code === 200){
            if(response.rows && response.rows.length > 0){
              this.showHistoryPro = true;
              this.historyProList = response.rows;
            }else{
              this.$notify({
                title: '提示',
                message: '该员工未参与过公司项目！',
                duration: 1500,
                type: 'success'
              });
            }
          }
        })
      },

      empIdleStatistic(row) {

        if(!row || !row.empId){
          this.msgError("获取员工信息失败，请稍后重试！");
          return;
        }
        const empId = row.empId;
        if(!this.empId){
          this.empId = empId;
        }
        empIdleStatistic(empId).then(response=>{
          if(response.code === 200){
            if(response.rows.length == 0 && !this.showEmpIdleHistory){
              this.$notify({
                title: '提示',
                message: '该员工无闲置！',
                duration: 1500,
                type: 'success'
              });
              return;
            }
            this.showEmpIdleHistory = true;
            this.empIdleStatisticList = response.rows;
          }
        })
      },

      delEmpIdleData(row){
        var _this = this;
        this.$confirm('确认要删除所选教育信息及附件吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          if(!row || !row.idleId){
            this.msgError("获取员工闲置信息失败，请稍后重试！");
            return;
          }
          const idleId = row.idleId;
          delEmpIdleData(idleId).then(response =>{
            if (response.code === 200) {
              _this.empIdleStatistic({empId:_this.empId});
              _this.msgSuccess("删除成功。");
            } else {
              this.msgError("删除失败，请稍后重试。");
            }
          });
        }).catch(()=>{});
      },


      closeProHistory(){
        this.historyProList = [];
      },

      closeEmpIdleStatistic(){
        this.empId = undefined;
        this.empIdleStatisticList = [];
        this.getIdleHistoryList();
      }







    }
  };
</script>

