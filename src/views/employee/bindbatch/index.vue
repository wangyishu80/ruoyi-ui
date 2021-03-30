<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="挂接包名:" prop="zipName">
        <el-select v-model="queryParams.zipName"
                   placeholder="请选择挂接包" clearable size="small">
          <el-option
            v-for="zip in zipList"
            :key="zip"
            :label="zip"
            :value="zip"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="挂接日期:" prop="bindDate">
        <el-date-picker type="date" placeholder="请选择日期"
                        v-model="queryParams.bindDate" style="width: 100%;"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>



    <!-- 员工基本信息列表 -->
    <el-table v-loading="loading" :data="docBindBatchList" :span-method="arraySpanMethod" style="width: 100%" border>
      <el-table-column label="id"  align="center" v-if="false"  prop="id" />
      <el-table-column label="包名" align="center" prop="zipname" :show-overflow-tooltip="true" v-if="false" />
      <!--<el-table-column label="大小" align="center" prop="zipsize" />-->
      <el-table-column label="员工信息" align="center" prop="empInfo" :formatter="empInfoFormat" />
      <el-table-column label="员工id" align="center" prop="empid" v-if="false" />
      <el-table-column label="附件类型" align="center" width="100" prop="doctype" :formatter="docTypeFormat" />
      <el-table-column label="条目名称" align="center" prop="itemName" :show-overflow-tooltip="true" />
      <el-table-column label="附件名" align="center" prop="docname" :show-overflow-tooltip="true" />
      <el-table-column label="附件大小" align="center" width="100" prop="docsize" :formatter="docSizeFormat" />
      <el-table-column label="是否挂接成功" width="130" align="center" prop="issuccess" :formatter="showYnLabel" />
      <el-table-column label="消息" align="center" width="300" prop="msg" :show-overflow-tooltip="true" />
      <el-table-column label="挂接时间" align="center" prop="bindDate" :show-overflow-tooltip="true" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click=""
          >删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 列表分页控件 -->
    <!--<
      v-show="total>0"
      :topaginationtal="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->


  </div>
</template>

<script>
import { listBatch, listZip } from "@/api/employee/docbind";
import { getToken } from "@/utils/auth";
import ElRow from "element-ui/packages/row/src/row";
import ElCol from "element-ui/packages/col/src/col";


  export default {
    components: {
      ElRow,
      ElCol
    },
    name: "EmpDocBindBatch",

    data() {
      return {

        // 遮罩层
        loading: true,
        // 总条数
        total: 0,

        zipList : [],

        /************************************************************/
        docBindBatchList: [],// 表格数据
        empInfoArr: [],
        empInfoPos: 0,
        docTypeArr: [],
        docTypePos: [],
        itemNameArr: [],
        itemNamePos: [],
        /***********************************************************/

        // 查询参数
        queryParams: {
          zipname : undefined,
          bindDate : undefined,
          /*pageNum: 1,
          pageSize: 10*/
        },

        closeDialog : false,

        //是否
        ynOptions : [],
        //附件类型
        empDocTypeOptions : [],
      };
    },


    mounted: function() {
      this.selectAllZipName();
      this.getList();
      this.getDicts("sys_yes_no").then(response => {
        this.ynOptions = response.data;
      });
      this.getDicts("emp_doc_type").then(response => {
        this.empDocTypeOptions = response.data;
      });

    },

    methods: {

      showYnLabel(row, column, cellValue){
        return this.selectDictLabel(this.ynOptions, cellValue);
      },
      docTypeFormat(row, column){
        return this.selectDictLabel(this.empDocTypeOptions, row.doctype);
      },
      docSizeFormat(row, column){
        var docSize = Number(row.docsize);
        if(docSize){
          docSize = (docSize/(1024)).toFixed(2);
        }
        return docSize+='KB';
      },

      empInfoFormat(row, column, cellValue){
          return cellValue.toString().replace(' ',' \n ');
      },

      selectAllZipName(){
        listZip().then(response => {
          this.zipList = response.data;
        });
      },

    /** 查询员工成本列表 */
      getList() {
        this.loading = true;
        listBatch(this.queryParams).then(response => {
          this.docBindBatchList = response.data;
          this.loading = false;
          this.merage();
        })
      },

      /************************* 表格合并单元格 ***************************/

      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          //第一列的合并方法,省
          const _row_1 = this.empInfoArr[rowIndex];
          const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
          return {
            rowspan: _row_1,
            colspan: _col_1
          }
        } else if (columnIndex === 1) {
          //第二列的合并方法,市
          const _row_2 = this.docTypeArr[rowIndex];
          const _col_2 = _row_2 > 0 ? 1 : 0;
          return {
            rowspan: _row_2,
            colspan: _col_2
          }
        } else if (columnIndex === 2) {

          //第三列的合并方法,区
          var _row_3 = this.itemNameArr[rowIndex];
          var _col_3 = _row_3 > 0 ? 1 : 0;
          return {
            rowspan: _row_3,
            colspan: _col_3
          }
        }

      },


      merage() {
        //要合并的数组的方法
        this.merageInit();
        for (var i = 0; i < this.docBindBatchList.length; i++) {
          if (i === 0) {
            //第一行必须存在
            this.empInfoArr.push(1);
            this.empInfoPos = 0;
            this.docTypeArr.push(1);
            this.docTypePos = 0;
            this.itemNameArr.push(1);
            this.itemNamePos = 0;
          }
          else {
            // 判断当前元素与上一个元素是否相同 this.provincePos是provinceArr内容的序号

            //用户信息
            if (this.docBindBatchList[i].empInfo === this.docBindBatchList[i - 1].empInfo) {
              this.empInfoArr[this.empInfoPos] += 1;
              this.empInfoArr.push(0);
            } else {
              this.empInfoArr.push(1);
              this.empInfoPos = i;
            }
            //附件类型
            if (this.docBindBatchList[i].doctype === this.docBindBatchList[i - 1].doctype
                  && this.docBindBatchList[i].empInfo === this.docBindBatchList[i - 1].empInfo) {
              this.docTypeArr[this.docTypePos] += 1;
              this.docTypeArr.push(0);
            } else {
              this.docTypeArr.push(1);
              this.docTypePos = i;
            }
            //条目名称
            if (this.docBindBatchList[i].itemName === this.docBindBatchList[i - 1].itemName
              && this.docBindBatchList[i].doctype === this.docBindBatchList[i - 1].doctype
              && this.docBindBatchList[i].empInfo === this.docBindBatchList[i - 1].empInfo) {
              this.itemNameArr[this.itemNamePos] += 1;
              this.itemNameArr.push(0);
            } else {
              this.itemNameArr.push(1);
              this.itemNamePos = i;
            }
          }
        }
      },
      merageInit() {
        //初始化省市区的合并行的数组
        this.empInfoArr = [];
        this.empInfoPos = 0;
        this.docTypeArr = [];
        this.docTypePos = 0;
        this.itemNameArr = [];
        this.itemNamePos = 0;
      },

      /*************************************************************************/

      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },

      timeFormat(row, column){
          return timeFormat(row);
      },











    }
  };
</script>

