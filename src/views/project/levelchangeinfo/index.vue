<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleHisQuery"
          v-hasPermi="['system:user:export']"
        >级别变更历史</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="levelchangeinfoList" border>
      <!--<el-table-column  width="55" align="center" prop="item_id" style="display:none"/>-->
      <el-table-column label="员工姓名" align="center" prop="empName" />
      <el-table-column label="项目名称" align="center" prop="itemName"  />
      <el-table-column label="当前级别名称" align="center" prop="level_name" />
      <el-table-column label="学历" align="center" prop="emp_edu" />
      <el-table-column label="毕业日期" align="center" prop="edu_graduation" />
      <el-table-column label="提示信息" align="center" prop="message" />
      <el-table-column label="创建日期" align="center" prop="createdate" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import { getLevelChangeInfo,exportHistory} from "@/api/project/info";

  export default {
    name: "Message",
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
      /** 查询变更信息列表 */
      getList() {
        this.loading = true;
        getLevelChangeInfo().then(response => {
          this.levelchangeinfoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      handleHisQuery(){
        this.$router.push('/levelchangehisinfo/type/index');
      }
    }
  };
</script>

