<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptPanel.deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="deptPanel.defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="项目名称" prop="item_name">
            <el-input
              v-model="queryParams.item_name"
              placeholder="请输入项目名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="项目编号" prop="item_numbering">
            <el-input
              v-model="queryParams.item_numbering"
              placeholder="请输入项目编号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="项目类型" prop="item_type">
            <el-select v-model="queryParams.item_type"
                       placeholder="请选择项目类型" clearable size="small">
              <el-option
                v-for="dict in typeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['module:item:query']" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="projectAdd"
              v-hasPermi="['module:item:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['module:item:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['module:item:remove']"
            >删除</el-button>
          </el-col>
          <!--<el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-view"
              size="mini"
              :disabled="single"
              @click="projectCost"
              v-hasPermi="['monitor:job:add']"
            >成本预估</el-button>
          </el-col>-->
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['module:item:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['module:item:import']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handlePerCost"
              v-hasPermi="['module:item:cost']"
            >人员成本</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handlePerIncome"
              v-hasPermi="['module:item:income']"
            >外包人员收入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleCostbudget"
              v-hasPermi="['module:item:costbudget']"
            >成本预估</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleRevenueforecast"
              v-hasPermi="['module:item:incomebudget']"
            >外包人员收入预估</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="itemList" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection" width="55" align="center" prop="item_id" fixed="left"/>
          <el-table-column
            label="序号"
            type="index"
            width="80"
            fixed="left"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.$index +1+ (queryParams.pageNum-1)*queryParams.pageSize}}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目编号" align="center" prop="item_numbering" width="120"/>
          <el-table-column label="项目名称" align="center" prop="item_name" width="120" />
          <!-- <el-table-column label="项目级别" align="center" prop="item_level"  :formatter="levelFormat" />-->
          <el-table-column label="项目类型" align="center" prop="item_type"  :formatter="item_typeFormat"/>
          <el-table-column label="开始日期" align="center" prop="item_startdate" width="100"/>
          <el-table-column label="结束日期" align="center" prop="item_enddate" width="100"/>
          <el-table-column label="所属部门" align="center" prop="dept.deptName" width="100"/>
          <el-table-column label="项目负责人" align="center" prop="empId" width="100"/>
          <el-table-column label="项目阶段" align="center" prop="item_phase" :formatter="phaseFormat"/>
          <el-table-column label="项目人数" align="center" prop="item_num" />
          <el-table-column label="项目总资金" align="center" prop="item_fund" width="150"/>
          <!--<el-table-column label="项目周期" align="center" prop="item_cycle" />-->
          <el-table-column label="变更批次" align="center" prop="change_num" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.update_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
          >
            <template slot-scope="scope">
              <!--<router-link :to="'/info/data/' + scope.row.item_id" class="link-type">
                <span>变更记录</span>
              </router-link>
              <router-link :to="'/info/perlevel/' + scope.row.item_id" class="link-type">
                <span v-if="scope.row.item_type=='2'">级别设置</span>
              </router-link>
              <router-link :to="'/info/assignper/' + scope.row.item_id" class="link-type">
                <span  v-if="scope.row.item_type=='0' || scope.row.item_type=='1'">分配人员</span>
              </router-link>
              <router-link :to="'/info/itemcontract/' + scope.row.item_id" class="link-type" >
                <span>合同信息</span>
              </router-link>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-search"
                @click="handleSelectPer(scope.row)"
              >查看人员</el-button>-->
              <el-dropdown>
          <span class="el-dropdown-link" ref="echarType">
           更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
                <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      v-hasPermi="['module:item:changeinfo']"
                      @click="handleChangeInfo(scope.row)"
                    >变更记录</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      v-hasPermi="['module:item:levelsettings']"
                      v-show="scope.row.item_type=='2'"
                      @click="handleLevelSettings(scope.row)"
                    >级别设置</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      v-hasPermi="['module:item:assignemp']"
                      v-show="scope.row.item_type=='0' || scope.row.item_type=='1'"
                      @click="handleAssignEmp(scope.row)"
                    >分配人员</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      v-hasPermi="['module:item:contract']"
                      @click="handleContract(scope.row)"
                    >合同信息</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      @click="handleSelectPer(scope.row)"
                    >查看人员</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

      </el-col>
    </el-row>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增项目基本信息 -->
    <el-dialog :title="title" :visible.sync="projectOpen" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row prop="item_id">
          <el-col :span="11">
            <el-form-item label="项目名称" prop="item_name">
              <el-input v-model="form.item_name" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目所属部门" prop="dept_id">
              <treeselect v-model="form.dept_id" :options="deptOptions" placeholder="请选择项目所属部门" @select="handleEmpNodeClick"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目编号" prop="item_numbering">
              <el-input v-model="form.item_numbering" placeholder="请输入项目编号" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目负责人" prop="empId" >
              <el-select v-model="form.empId"  placeholder="请选择标签" filterable :filter-method="empIdFilter()">
                <el-option
                  v-for="dict in empOptions"
                  :key="dict.empId"
                  :label="dict.empName"
                  :value="dict.empId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目负责人电话" prop="item_leadertel">
              <el-input v-model="form.item_leadertel" placeholder="请输入项目负责人电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目类型" prop="item_type" >
              <el-select v-model="form.item_type" placeholder="请选择" @change="handleCusNodeClick" >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目阶段" prop="item_phase">
              <el-select v-model="form.item_phase" placeholder="请选择">
                <el-option
                  v-for="dict in phaseOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" >
            <el-form-item label="客户名称" prop="customer_id">
              <el-select v-model="form.customer_id" placeholder="请选择标签" filterable :filter-method="customerFilter()">
                <!-- <div class="el-input" style="width:90%;margin-left:5%;">
                   <input type="text" placeholder="请输入" class="el-input__inner" v-model="form.customer_name" @keyup="dropDownSearch">
                 </div>-->
                <!--<el-option v-for="item in customerOptions" :value="item"></el-option>-->
                <el-option
                  v-for="dict in customerOptions"
                  :key="dict.customer_id"
                  :label="dict.customer_name"
                  :value="dict.customer_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col  :span="11">
            <el-form-item label="项目人数" prop="item_num" >
              <el-input v-model="form.item_num" placeholder="请输入项目人数" />
            </el-form-item>
          </el-col>
          <el-col :span="11" >
            <el-form-item label="项目资金(/元)" prop="item_fund" v-show="form.item_type==0">
              <el-input v-model="form.item_fund" placeholder="请输入项目资金" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目开始时间" prop="item_startdate">
              <el-date-picker
                v-model="form.item_startdate"
                :picker-options="item_startdate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目结束时间" prop="item_enddate">
              <el-date-picker
                v-model="form.item_enddate"
                :picker-options="item_enddate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目实施费用(/元)" prop="workcost">
              <el-input v-model="form.workcost" placeholder="请输入项目实施费用" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="项目税率" prop="taxrate">
              <el-select v-model="form.taxrate" placeholder="请选择">
                <el-option
                  v-for="dict in taxrateOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item  label="是否变更项目" prop="ischange">
              <el-radio-group v-model="form.ischange">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="11">
             <el-form-item label="项目周期(月)" prop="item_cycle">
               <el-input v-model="form.item_cycle" placeholder="请输入项目周期" />
             </el-form-item>
           </el-col>-->
          <el-col :span="22">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button type="warning" @click="reset">重 置</el-button>
        <el-button @click="projectOpen=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 人员绑定信息 -->
    <el-dialog title="人员绑定详情" :visible.sync="perbindingOpen" width="800px"
               :close-on-click-modal="close" :close-on-press-escape="close"
               @close="clearEmpInfo()" style="margin-top: 10vh; !important">
      <!--解绑按钮操作 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUnbundling"
            v-hasPermi="['system:dict:edit']"
          >解绑</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="dataPerList" @selection-change="handleSelectionEmpChange" border>
        <el-table-column type="selection" width="55" align="center" prop="empId"/>
        <el-table-column label="姓名" align="center" prop="empName" />
        <el-table-column label="部门" align="center" prop="empDepartment" />
        <el-table-column label="岗位" align="center" prop="post.postName" />
        <el-table-column label="人员公司级别" align="center"  prop="empLevel" :formatter="empLevelFormat"/>
        <el-table-column label="人员外包级别" align="center"  prop="level.level_name" :formatter="perlevelFormat"/>
        <el-table-column label="状态" align="center" prop="empState" :formatter="empStateFormat" />
        <!--<el-table-column label="绑定状态" align="center" prop="empState" :formatter="empStateFormat" />-->
        <el-table-column label="工资" align="center" prop="cost.empSalary" />
        <!-- <el-table-column label="学历" align="center" prop="empEdu" :formatter="empEduFormat"/>-->
        <!--<el-table-column label="联系电话" align="center" prop="empTel" />-->
        <!--<el-table-column label="现住址" align="center" prop="empAdress" />-->
        <!--<el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />-->
        <!--<el-table-column label="创建时间" align="center" prop="updateTime" width="180"/>-->

      </el-table>
      <pagination
        v-show="totalper>0"
        :total="totalper"
        :page.sync="queryParamsPer.pageNum"
        :limit.sync="queryParamsPer.pageSize"
        @pagination="listPer"
      />
    </el-dialog>

    <!-- 文件上传窗口  -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="500px"    append-to-body>
      <el-form :model="form">
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
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
          <!--<div class="el-upload__tip" style="color:red" slot="tip"></div>-->
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" >是否更新已经存在的用户数据</el-checkbox>
            <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
          </div>
          <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
        </el-upload>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitFileForm">立即上传</el-button>
          <el-button size="small"  @click="upload.open=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import { listProject,  addProject,selectProject,selectProjectCost,updateProject,deleteProject,checkIsLevel,exportProject,download,filelist,deleteFile,getCustomer, importTemplate,listPerBinding,listemployee ,listDataBindingEmp } from "@/api/project/info";
  import { listCustomer} from "@/api/customer/info";
  import { getToken } from "@/utils/auth";
  import { treeselect } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { listData} from "@/api/project/perlevel";
  import { listDataEmp,listIsBindEmp, updateData } from "@/api/project/assignper";
  export default {
    components: { Treeselect },
    name: "Project",
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
        // 总条数
        total: 0,
        // 总条数
        totalper: 0,
        // 项目表格数据
        itemList: [],
        // 绑定人员数据
        dataPerList: [],
        // 日期范围
        dateRange: [],
        // 弹出层标题
        title: "",
        // 部门树选项
        deptOptions: undefined,

        // 是否显示弹出层
        projectOpen: false,
        // 是否显示弹出层人员绑定
        perbindingOpen: false,
        //查看文件弹窗
        fileVisible:false,
        //文件上传弹框
        uploadFileVisible:false,
        //项目级别字典
        levelOptions: [],
        //项目类型
        typeOptions: [],
        //项目阶段
        phaseOptions: [],
        // 状态字典
        statusOptions: [],
        //客户名称
        customerOptions: [],
        // 状态数据字典
        empStateOptions: [],
        // 学历数据字典
        empEduOptions: [],
        //员工级别数据字典
        empLevelOptions: [],
        //员工
        empOptions: [],
        //项目税率
        taxrateOptions: [],
        //人员级别
        perlevelOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          item_name: undefined,
          item_numbering: undefined,
          dept_id: undefined,
          item_type: undefined
        },
        // 查询参数
        queryParamsPer: {
          pageNum: 1,
          pageSize: 10,
          item_id: undefined,
          itemid: undefined
        },
        empform:{
          empDepartment: undefined
        },
        // 表单参数
        form :{
          /*item_id: undefined,
          dept_id: undefined,
          item_name: '',
          item_numbering: '',
          empId: undefined,*/
          item_startdate: '',
          item_enddate: '',
          /*item_leadertel: '',
          item_level: '',
          item_type: '',
          item_phase: '',
          item_num: '',
          item_fund: '',
          item_cycle: '',
          customer_id: '',
          customer_name: '',
          // item_adress: undefined,
          ischange: '',
          change_num: '',
          remark: '',
          itemCost: '',
          itemProfit: '',
          empName: '',
          empDepartment: '',
          delflag: '',
          itemid: undefined,
          taxrate: '',
          workcost: '',
          level_name: ''*/
        },
        // 项目导入参数
        upload: {
          // 是否显示弹出层（项目导入）
          open: false,
          // 弹出层标题（项目导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的项目数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/file/load/importData"
        },

        // 开始日期小于结束日期
        item_startdate: {
          disabledDate: time => {
            let endDate = this.form.item_enddate;
            let beginDateVal = new Date(endDate);
            if (endDate) {
              return time.getTime() > beginDateVal;
            }
          }
        },
        // 结束日期大于开始日期
        item_enddate: {
          disabledDate: time => {
            let startDate = this.form.item_startdate;
            let beginDateVal = new Date(startDate);
            if (startDate) {
              return time.getTime() < beginDateVal - 3600 * 1000 * 24 * 1;
            }
          }
        },
        //左侧部门树
        deptPanel : {
          deptName : '',
          defaultProps: {
            children: 'children',
            label: 'label'
          },
        },
        // 表单校验
        rules: {
          item_name: [
            { required: true, message: "项目名称不能为空", trigger: "blur" }
          ],
          item_numbering: [
            { required: true, message: "项目编号不能为空", trigger: "blur" }
          ],
          dept_id: [
            { required: true, message: "项目所属部门不能为空", trigger: "blur" }
          ],
          empId: [
            { required: true, message: "项目负责人不能为空", trigger: "blur" }
          ],
          item_leadertel: [
            { required: true, message: "手机号码不能为空", trigger: "blur" },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ],
          item_level: [
            { required: true, message: "项目级别不能为空", trigger: "blur" }
          ],
          item_type: [
            { required: true, message: "项目类型不能为空", trigger: "blur" }
          ],
          item_phase: [
            { required: true, message: "项目阶段不能为空", trigger: "blur" }
          ],
          item_num: [
            { required: true, message: "项目人数不能为空", trigger: "blur" },
            { validator:function(rule,value,callback){
                if(/^\+?[1-9][0-9]*$/.test(value) == false){
                  callback(new Error("请输入正确的正整数"));
                }else{
                  callback();
                }
              },trigger: "blur"
            }
          ],
          item_fund: [
            { required: true, message: "项目金额不能为空", trigger: "blur" },
            { validator:function(rule,value,callback){
                /*if(/^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/.test(value) == false){*/
                if(/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/.test(value) == false){
                  callback(new Error("请输入正确的项目金额(保留2位小数)"));
                }else{
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          workcost: [
            { required: true, message: "项目实施费用不能为空", trigger: "blur" },
            { validator:function(rule,value,callback){
                if(/^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/.test(value) == false){
                  callback(new Error("请输入正确的项目实施费用金额(保留2位小数)"));
                }else{
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          taxrate: [
            { required: true, message: "项目税率不能为空", trigger: "blur" }
          ],
          item_startdate: [
            { required: true, message: "项目开始日期不能为空", trigger: "blur" }
          ],
          item_enddate: [
            { required: true, message: "项目结束日期不能为空", trigger: "blur" }
          ],
          customer_id: [
            { required: true, message: "客户名称不能为空", trigger: "blur" }
          ],
          /*item_adress: [
            { required: true, message: "工作地址不能为空", trigger: "blur" }
          ],*/
          ischange: [
            { required: true, message: "是否变更项目没有选", trigger: "blur" }
          ]
        }
      };
    },

    mounted: function() {
      listCustomer().then(response => {
        this.customerOptions = response.rows;
      });
      listemployee().then(response => {
        this.empOptions = response.rows;
      });
      this.getDicts("item_level").then(response => {
        this.levelOptions = response.data;
      });
      this.getDicts("item_type").then(response => {
        this.typeOptions = response.data;
      });
      this.getDicts("item_phase").then(response => {
        this.phaseOptions = response.data;
      });
      this.getDicts("emp_state").then(response => {
        this.empStateOptions = response.data;
      });
      this.getDicts("emp_level").then(response => {
        this.empLevelOptions = response.data;
      });
      this.getDicts("emp_edu").then(response => {
        this.empEduOptions = response.data;
      });
      this.getDicts("item_taxrate").then(response => {
        this.taxrateOptions = response.data;
      });
      this.getDicts("item_emp_level").then(response => {
        this.perlevelOptions = response.data;
      });
      this.getList();
      this.getTreeselect();
    },
    watch: {
      // 根据名称筛选部门树
      deptName(val) {
        this.$refs.tree.filter(val);
      }
    },

    methods: {
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.item_id !=undefined ) {
              updateProject(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.projectOpen = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addProject(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.projectOpen = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },
      empIdFilter() {
        return this.empOptions.filter((item) => {
          if (item.empName.includes(this.value)) {
            return item
          }
        })
      },
      customerFilter() {
        return this.customerOptions.filter((item) => {
          if (item.customer_name.includes(this.value)) {
            return item
          }
        })
      },

      /* dropDownSearch () {
         var _this = this;
         _this.form.customer_id = [];
         _this.customerOptions = _this.customerOptions.filter(_this.filterSearch);
       },
       filterSearch (item) {
         if(this.form.customer_name === ''){
           return this.getCustomerselect();
         }else {
           return item.customer_name.includes(this.form.customer_name);
         }
       },*/
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.dept_id = data.id;
        this.handleQuery();
      },
      // 部门对应员工节点单击事件
      handleEmpNodeClick(data) {
        this.empform.empDepartment = data.id;
        this.loading = true;
        listemployee(this.empform).then(response => {
          this.empOptions = response.rows;
        });
        this.getList();
      },
      // 项目对应客户节点单击事件
      handleCusNodeClick(val) {
        this.form.item_type = val;
        getCustomer(this.form.item_type).then(response => {
            this.customerOptions = response.data;
          if (this.form.item_type !== '0') {
            this.form.item_fund = '0.00';
          }
        });
        // this.getList();
      },
      // 项目类型字典翻译
      item_typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.item_type);
      },
      // 项目阶段字典翻译
      phaseFormat(row, column) {
        return this.selectDictLabel(this.phaseOptions, row.item_phase);
      },
      // 数据状态字典翻译
      empStateFormat(row, column) {
        return this.selectDictLabel(this.empStateOptions, row.empState);
      },
      // 学历字典翻译
      empEduFormat(row, column) {
        return this.selectDictLabel(this.empEduOptions, row.empEdu);
      },
      // 员工级别字典翻译
      empLevelFormat(row, column) {
        return this.selectDictLabel(this.empLevelOptions, row.empLevel);
      },
      // 员工级别字典翻译
      perlevelFormat(row, column) {
        return this.selectDictLabel(this.perlevelOptions, row.level.level_name);
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const item_id = row.item_id || this.ids;
        selectProject(item_id).then(response => {
          this.form = response.data;
          // this.postOptions = response.posts;
          /*this.roleOptions = response.roles;
          this.form.postIds = response.postIds;
          this.form.roleIds = response.roleIds;*/
          this.projectOpen = true;
          this.title = "修改项目信息";
        });
      },
      /** 查看绑定人员 */
      handleSelectPer(row) {
        this.form.item_id = row.item_id;
        listDataEmp(this.form).then(response => {
          this.dataPerList = response.rows;
          this.totalper = response.total;
          this.loading = false;
          // this.postOptions = response.posts;
          /*this.roleOptions = response.roles;
          this.form.postIds = response.postIds;
          this.form.roleIds = response.roleIds;*/
          this.form.item_id = row.item_id;
          this.perbindingOpen = true;
          this.title = "人员绑定详情";
        });
      },
      /** 变更记录 */
      handleChangeInfo(row) {
        this.$router.push('/changeinfo/type/data/'+row.item_id);
      },
      /** 级别设置 */
      handleLevelSettings(row) {
        this.$router.push('/perlevel/type/index/'+row.item_id);
      },
      /** 人员分配 */
      handleAssignEmp(row) {
        this.$router.push('/assignper/type/index/'+row.item_id);
      },
      /** 合同信息 */
      handleContract(row) {
        this.$router.push('/itemcontract/type/index/'+row.item_id);
      },
      /** 解绑按钮操作 */
      handleUnbundling(row) {
        this.loading = true;
        const empid = row.empId || this.ids;
        this.form.empid = empid[0];
        this.form.delflag = "2";
        this.form.itemid=this.form.item_id;
        updateData(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("解绑成功");
            this.listPer(this.form.item_id);
          } else {
            this.msgError(response.msg);
            this.loading = false;
          }
        });

      },
      /** 查询项目绑定员工数据列表 */
      listPer() {
        this.loading = true;
        this.queryParamsPer.item_id = this.form.item_id;
        listDataEmp(this.queryParamsPer).then(response => {
          this.dataPerList = response.rows;
          this.totalper = response.total;
          this.loading = false;
          this.title = "人员绑定详情";
        });
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      /** 查询下拉客户列表 */
      /*getCustomerselect() {
        getCustomer().then(response => {
          this.customerOptions = response.data;
        });
      },*/
      /** 删除按钮操作 */
      handleDelete(row) {
        const item_id = row.item_id || this.ids;
        const item_type = this.item_type;
        this.$confirm('是否确认删除项目编号为"' + item_id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if(item_type == 2) {
            //判断是否设置级别
            listData(item_id[0]).then(response => {
              if (response.total !== 0) {
                this.msgError("请先删除项目人员级别！");
                // this.getList();
              } else {
                listPerBinding(item_id[0]).then(response => {
                  if (response.total !== 0){
                    this.msgSuccess("请先解除项目人员！");
                    // this.getList();
                  }else{
                    deleteProject(item_id).then(response => {
                      if (response.code === 200) {
                        this.getList();
                        this.msgSuccess("删除成功");
                      } else {
                        this.msgError(response.msg);
                      }
                    });
                  }
                });
              }
            });
          }else{
            this.queryParamsPer.item_id = item_id[0];
            listDataEmp(this.queryParamsPer).then(response => {
              if (response.total !== 0){
                this.msgSuccess("请先解除项目人员！");
                // this.getList();
              }else{
                deleteProject(item_id).then(response => {
                  if (response.code === 200) {
                    this.getList();
                    this.msgSuccess("删除成功");
                  } else {
                    this.msgError(response.msg);
                  }
                });
              }
            });

          }
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.item_id);
        this.item_type = selection.map(item => item.item_type);
        // this.upload.item_id=selection[0]["item_id"];
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      // 多选框选中数据
      handleSelectionEmpChange(selection) {
        this.ids = selection.map(item => item.empId)
        this.item_id = selection.map(item => item.item_id);
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      //关闭人员绑定页面
      clearEmpInfo(){
        this.perbindingOpen = false;
      },
      handlePerCost(row) {
        this.reset();
        const item_id = row.item_id || this.ids;
        const item_type = this.item_type;
        if(item_type == 2){
          //判断是否设置级别
          listData(item_id[0]).then(response => {
            if (response.total === 0){
              this.msgSuccess("请先设置项目人员级别！");
            } else {
              listPerBinding(item_id[0]).then(response => {
                if (response.total === 0){
                  this.msgSuccess("请先分配项目人员！");
                }else{
                  this.$router.push('/percost/type/index/' + item_id[0]);
                }
              });
            }
          });
        }else {
          //判断是否设置项目人员
          this.queryParamsPer.itemid = item_id[0];
          listDataBindingEmp(this.queryParamsPer).then(response => {
            if (response.total === 0){
              this.msgSuccess("请先分配项目人员！");
            }else{
              this.$router.push('/percost/type/index/' + item_id[0]);
            }
          });
        }
      },
      handleCostbudget(row) {
        this.reset();
        const item_id = row.item_id || this.ids;
        const item_type = this.item_type;
        if(item_type == 2){
          //判断是否设置级别
          listData(item_id[0]).then(response => {
            if (response.total === 0){
              this.msgSuccess("请先设置项目人员级别！");
            } else {
              listPerBinding(item_id[0]).then(response => {
                if (response.total === 0){
                  this.msgSuccess("请先分配项目人员！");
                }else{
                  this.$router.push('/budgetpercost/type/index/' + item_id[0]);
                }
              });
            }
          });
        }else {
          //判断是否设置项目人员
          this.queryParamsPer.item_id = item_id[0];
          listDataBindingEmp(this.queryParamsPer).then(response => {
            if (response.total === 0){
              this.msgSuccess("请先分配项目人员！");
            }else{
              this.$router.push('/budgetpercost/type/index/' + item_id[0]);
            }
          });
        }
      },
      //外包人员收入
      handlePerIncome(row) {
        this.reset();
        const item_id = row.item_id || this.ids;
        const item_type = this.item_type;
        if(item_type == 2){
          //判断是否设置级别
          listData(item_id[0]).then(response => {
            if (response.total === 0){
              this.msgSuccess("请先设置项目人员级别！");
            } else {
              listPerBinding(item_id[0]).then(response => {
                if (response.total === 0){
                  this.msgSuccess("请先分配项目人员！");
                }else{
                  this.$router.push('/perincome/type/index/' + item_id[0]);
                }
              });
            }
          });
        }else {
          this.msgSuccess("抱歉！此项目类型为项目外包，不允许此操作");
        }
      },

      //外包人员收入预估
      handleRevenueforecast(row) {
        this.reset();
        const item_id = row.item_id || this.ids;
        const item_type = this.item_type;
        if(item_type == 2){
          //判断是否设置级别
          listData(item_id[0]).then(response => {
            if (response.total === 0){
              this.msgSuccess("请先设置项目人员级别！");
            } else {
              listPerBinding(item_id[0]).then(response => {
                if (response.total === 0){
                  this.msgSuccess("请先分配项目人员！");
                }else{
                  this.$router.push('/budgetperincome/type/index/' + item_id[0]);
                }
              });
            }
          });
        }else {
          this.msgSuccess("抱歉！此项目类型为项目外包，不允许此操作");
        }
      },
      upload_button() {
        this.uploadFileVisible = true;
        this.title = "文件上传";
      },
      //打开文件查询
      fileSearchOpen() {
        this.getFileList();
        this.fileVisible = true;
        this.title = "文件查询";
      },
      // 取消按钮
      fileSearchCancel() {
        this.fileVisible = false;
        //this.reset();
      },
      /** 新增按钮操作 */
      projectAdd() {
        this.reset();
        this.projectOpen = true;
        this.title = "项目基本信息";
        /*selectProject().then(response => {
          /!*this.postOptions = response.posts;
          this.roleOptions = response.roles;*!/
          this.projectOpen = true;
          this.title = "项目基本信息";
        });*/
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 项目表单重置
      reset() {
        if('修改项目信息'===this.title) {
          this.$nextTick(() => {
            this.resetForm("form");
          });
        }else {
          this.emptyReset();
        }
      },
      // 表单重置
      emptyReset() {
        this.form = {
          item_id: undefined,
          dept_id: undefined,
          item_name: undefined,
          item_numbering: undefined,
          empId: undefined,
          item_leadertel: undefined,
          item_level: '',
          item_type: '',
          item_phase: '',
          item_num: undefined,
          item_startdate: undefined,
          item_enddate: undefined,
          item_fund: undefined,
          item_cycle: undefined,
          customer_id: undefined,
          customer_name: undefined,
          // item_adress: undefined,
          ischange: undefined,
          change_num: undefined,
          remark: undefined,
          itemCost: undefined,
          itemProfit: undefined,
          empName: undefined,
          empDepartment: undefined,
          delflag: undefined,
          itemid: undefined,
          taxrate: undefined,
          workcost: undefined,
          level_name: undefined
        };
        this.resetForm("form");
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
        /*this.getFileList();
        this.uploadFileVisible=false;*/
      },
      /** 下载模板操作 */
      importTemplate() {
        importTemplate().then(response => {
          this.download(response.msg);
        });
      },
      /** 查询项目信息列表 */
      getList() {
        this.loading = true;
        listProject(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.itemList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 查询项目文件列表 */
      getFileList() {
        this.loading = true;
        this.item={
          item_id:this.ids[0]
        };
        filelist(this.item).then(response => {
          this.filedate.fileList = response.rows;
          this.filedate.total = response.total;
          this.loading = false;
        });
      },


      downloadBotton() {
        download(this.queryParams).then(response => {
          if (response.headers['content-type'].indexOf('json') === -1) {// 返回的数据不是
            if (!response.data) {
              return;
            }
            if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
              let url = window.URL.createObjectURL(new Blob([response.data]));
              let link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
              window.URL.revokeObjectURL(link.href) // 释放url
              document.body.removeChild(link) // 释放标签
            } else { // 其他浏览器
              navigator.msSaveBlob(new Blob([response.data]), fileName)
            }
          }else{
            if (response.request.responseType === 'arraybuffer'
              && response.data.toString() === '[object ArrayBuffer]') {
              // 返回的数据是 arraybuffer，内容是 json
              var text = Buffer.from(response.data).toString('utf8');
              var json = JSON.parse(text);
              Message.error({
                message: json.msg
              });
            }
          }
        }).catch(err=>{
          reject(err);
        });
      },
      //文件列表选中数据
      fileSelectChange(fileSelect) {
        this.filedate.fileIds = fileSelect.map(item => item.id);

        //this.single = fileSelect.length != 1;
        //this.multiple = !fileSelect.length;
      },
      //删除文件
      fileDelete() {
        const fileIds = this.filedate.fileIds;
        this.$confirm('是否确认删除定时任务编号为"' + fileIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          deleteFile(fileIds).then(response => {
            this.title = "修改任务";
          });
        });
      },


      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.dept_id = "";
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },

      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出项目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProject(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "项目导入";
        this.upload.open = true;
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
      }
    }
  };


</script>
