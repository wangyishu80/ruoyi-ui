<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:user:export']"
        >导出</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="recordList" border>
      <!--<el-table-column  width="55" align="center" prop="item_id" style="display:none"/>-->
      <el-table-column label="变更批次" align="center" prop="change_num" />
      <el-table-column label="项目编号" align="center" prop="item_numbering" />
      <el-table-column label="项目名称" align="center" prop="item_name"  />
     <!-- <el-table-column label="项目级别" align="center" prop="item_level"  :formatter="levelFormat" />-->
      <el-table-column label="项目类型" align="center" prop="item_type"  :formatter="item_typeFormat"/>
      <el-table-column label="所属部门" align="center" prop="dept.deptName" />
      <el-table-column label="项目负责人" align="center" prop="empId" />
      <el-table-column label="项目负责人电话" align="center" prop="item_leadertel" width="120"/>
      <el-table-column label="项目阶段" align="center" prop="item_phase" :formatter="phaseFormat"/>
      <el-table-column label="项目人数" align="center" prop="item_num" />
      <el-table-column label="项目总资金" align="center" prop="item_fund" />
      <el-table-column label="项目实施费用" align="center" prop="workcost" />
      <el-table-column label="项目税率" align="center" prop="taxrate" />
      <el-table-column label="项目开始日期" align="center" prop="item_startdate" />
      <el-table-column label="项目结束日期" align="center" prop="item_enddate" />
      <el-table-column label="客户名称" align="center" prop="customer_id" />
      <!--<el-table-column label="工作地点" align="center" prop="item_adress" />-->
      <el-table-column label="变更日期" align="center" prop="update_time" width="160"/>
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

   <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->
  </div>
</template>

<script>
  import { recordlistProject,exportHistory} from "@/api/project/info";

  export default {
    name: "Record",
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
        // 变更记录数据
        recordList: [],
        // 默认字典类型
        defaultDictType: "",
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态数据字典
        statusOptions: [],
        // 类型数据字典
        typeOptions: [],
        // 部门树选项
        deptOptions: undefined,
        // 部门名称
        department_name: undefined,
        //项目级别字典
        levelOptions: [],
        //项目类型
        typeOptions: [],
        customerOptions: [],
        //项目阶段
        phaseOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dictName: undefined,
          dictType: undefined,
          status: undefined
        }

      };
    },
    created() {
      const item_id = this.$route.params && this.$route.params.item_id;
      this.getList(item_id);
      // this.getTreeselect();
      this.getDicts("item_level").then(response => {
        this.levelOptions = response.data;
      });
      this.getDicts("item_type").then(response => {
        this.typeOptions = response.data;
      });
      this.getDicts("item_phase").then(response => {
        this.phaseOptions = response.data;
      });
    },
    methods: {
      // 项目级别字典翻译
      levelFormat(row, column) {
        return this.selectDictLabel(this.levelOptions, row.item_level);
      },
      // 项目类型字典翻译
      item_typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.item_type);
      },
      // 项目阶段字典翻译
      phaseFormat(row, column) {
        return this.selectDictLabel(this.phaseOptions, row.item_phase);
      },
      /** 导出按钮操作 */
      handleExport() {
        const item_id = this.$route.params && this.$route.params.item_id;
        this.$confirm('是否确认导出项目历史数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHistory(item_id);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      },
      /** 查询项目变更信息列表 */
      getList(item_id) {
        this.loading = true;
        item_id = this.$route.params && this.$route.params.item_id;
        recordlistProject(item_id).then(response => {
          this.recordList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    }
  };
</script>
