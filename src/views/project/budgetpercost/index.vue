<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleBudgetExport"
          v-hasPermi="['system:user:export']"
        >导出</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="dataList" highlight-current-row size="big" style="width: 100%;" border>
      <!--<el-table-column :label="$t('table.id')" type="index" min-width="5%" align="center" v-if="false"/>-->
      <el-table-column label="姓名" align="center" prop="empName" width="300px"  />
      <el-table-column label="开始日期" align="center" prop="empStartDate" width="300px"/>
      <el-table-column label="结束日期" align="center" prop="empEndDate"  width="300px"/>
      <el-table-column label="毛利费用率" align="center" prop="empProfitrate" width="300px"/>
      <el-table-column label="成本合计(/元)" align="center" prop="empTotalSalary"  width="300px"/>

    </el-table>

    <!--<pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

  </div>
</template>

<script>
  import {  exportBudgetCostData,selectPerCostBudget } from "@/api/project/budgetpercost";
  export default {
    name: "Percostbudget",
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
        // 人员级别数据
        dataList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        perlevelopen: false,
        //员工级别数据字典
        empLevelOptions: [],

        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dictName: undefined,
          dictType: undefined,
          status: undefined
        },
        // 表单参数
        form: {},

      };
    },
    created() {
      const item_id = this.$route.params && this.$route.params.item_id;
      this.getList(item_id);
      // this.getType(dictId);
      // this.getTypeList();
      this.getDicts("emp_level").then(response => {
        this.empLevelOptions = response.data;
      });
    },
    methods: {
      /** 查询项目人员薪资 */
      getList(item_id) {
        this.loading = true;
        selectPerCostBudget(item_id).then(response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 员工级别字典翻译
      empLevelFormat(row, column) {
        return this.selectDictLabel(this.empLevelOptions, row.empLevel);
      },
      // 取消按钮
      cancel() {
        this.perlevelopen = false;
        this.reset();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams.dictType = this.defaultDictType;
        this.handleQuery();
      },

      /** 导出按钮操作 */
      handleBudgetExport() {
        // const queryParams = this.queryParams;
        const item_id = this.$route.params && this.$route.params.item_id;
        this.$confirm('是否确认导出所有数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBudgetCostData(item_id);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
