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

      <el-table v-loading="loading" :data="dataList" highlight-current-row size="small" style="width: 100%;">
        <!--<el-table-column :label="$t('table.id')" type="index" min-width="5%" align="center" v-if="false"/>-->
        <el-table-column width="120px" prop="empName" label="姓名" align="center" fixed="left"/>

        <el-table-column v-for="item in columnFirstOptions" :label="item.value" :key="item.id" :property="item.id"
                               align="center" width="100%">
          <el-table-column min-width="100%" v-for="ccitem in columnSecondOptions[item.id]" :label="ccitem.value"
                           :key="ccitem.id" :property="ccitem.id" align="center">
            <template slot-scope="scope" >
              <span >{{ scope.row["monthname"][item.id][scope.column.property] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="开始日期" align="center" prop="empStartDate" width="100px" fixed="right"/>
        <el-table-column label="结束日期" align="center" prop="empEndDate" width="100px" fixed="right"/>
        <el-table-column label="毛利费用率" align="center" prop="empProfitrate" width="100px" fixed="right"/>
        <el-table-column label="成本合计(/元)" align="center" prop="empTotalSalary" width="100px" fixed="right"/>

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
  import {  exportData,selectPerCost } from "@/api/project/percost";
  export default {
    name: "Percost",
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
        //月份列表头(一级)
        columnFirstOptions: [
          {id: 'january', value: "一月"},
          {id: 'february', value: "二月"},
          {id: 'march', value: "三月"},
          {id: 'april', value: "四月"},
          {id: 'may', value: "五月"},
          {id: 'june', value: "六月"},
          {id: 'july', value: "七月"},
          {id: 'august', value: "八月"},
          {id: 'september', value: "九月"},
          {id: 'october', value: "十月"},
          {id: 'november', value: "十一月"},
          {id: 'december', value: "十二月"}

        ],
        //二级表格头
        columnSecondOptions: {
          "january": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "february": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "march": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "april": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "may": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "june": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "july": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "august": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "september": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "october": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "november": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ],
          "december": [
            {id: 'empSalary', value: "税前工资(/元)"},
            {id: 'empInsuranceFund', value: "五险一金小计(/元)"},
            {id: 'empMonthSalary', value: "每月成本合计(/元)"}
          ]
        },
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
        selectPerCost(item_id).then(response => {
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
      handleExport() {
        // const queryParams = this.queryParams;
        const item_id = this.$route.params && this.$route.params.item_id;
        this.$confirm('是否确认导出所有数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportData(item_id);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
