<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="客户名称" prop="customer_name">
        <el-input
          v-model="queryParams.customer_name"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户地址" prop="customer_adress">
        <el-input
          v-model="queryParams.customer_adress"
          placeholder="请输入客户地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          icon="el-icon-plus"
          size="mini"
          @click="customerAdd"
          v-hasPermi="['monitor:job:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['monitor:job:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:job:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-view"
          size="mini"
          :disabled="single"
          @click="outsourcingCost"
          v-hasPermi="['monitor:job:add']"
        >成本预估</el-button>
      </el-col>-->
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

    <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" prop="customer_id"/>
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.$index +1+ (queryParams.pageNum-1)*queryParams.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center" prop="customer_name" />
      <el-table-column label="客户类型" align="center" prop="customer_type"  :formatter="customer_typeFormat"/>
      <!--<el-table-column label="客户联系方式" align="center" prop="customer_tel"   />-->
      <el-table-column label="客户邮箱" align="center" prop="customer_email" />
      <el-table-column label="客户地址" align="center" prop="customer_adress" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.update_time) }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


    <!-- 新增客户基本信息 -->
    <el-dialog :title="title" :visible.sync="customerOpen" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row prop="customer_id">
          <el-col :span="11">
            <el-form-item label="客户名称" prop="customer_name">
              <el-input v-model="form.customer_name" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <!--<el-col :span="11">
            <el-form-item label="客户联系方式" prop="customer_tel">
              <el-input v-model="form.customer_tel" placeholder="请输入客户联系方式" maxlength="11"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="11">
            <el-form-item label="客户邮箱" prop="customer_email">
              <el-input v-model="form.customer_email" placeholder="请输入客户邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户地址" prop="customer_adress">
              <el-input v-model="form.customer_adress" placeholder="请输入客户地址" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户类型" prop="customer_type">
              <el-select v-model="form.customer_type" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="customerOpen=false">取 消</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
  import { listCustomer,  addCustomer,selectCustomer,selectOutsourcingCost,updateCustomer,deleteCustomer,checkIsLevel,exportCustomer,  download,filelist,deleteFile } from "@/api/customer/info";
  import { getToken } from "@/utils/auth";
  import { treeselect } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: "Customer",
    components: { Treeselect },
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
        // 定时任务表格数据
        jobList: [],
        form : {
          customer_id: undefined,
          customer_name: undefined,
          customer_type: undefined,
          customer_tel: undefined,
          customer_email: undefined,
          customer_adress: undefined,
          emp_num: undefined,
          contract_fund: undefined,
          emp_cost: undefined,
          empProfit: undefined,
          remark: undefined
        },
        // 弹出层标题
        title: "",
        // 部门树选项
        deptOptions: undefined,
        // 部门名称
        department_name: undefined,
        // 是否显示弹出层
        customerOpen: false,
        //预估成本弹出层
        outsourcingCostOpen: false,
        //查看文件弹窗
        fileVisible:false,
        //文件上传弹框
        uploadFileVisible:false,
        // 是否显示详细弹出层
        openView: false,
        //客户类型字典
        typeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          item_name: undefined,
          item_numbering: undefined
        },

        // 表单校验
        rules: {
          customer_name: [
            { required: true, message: "客户名称不能为空", trigger: "blur" }
          ],
          customer_type: [
            { required: true, message: "客户类型不能为空", trigger: "blur" }
          ],
          customer_email: [
            /*{ required: true, message: "客户邮箱不能为空", trigger: "blur" },*/
            {
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: "请输入正确的邮箱",
              trigger: "blur"
            }
          ],
          customer_adress: [
            { required: true, message: "客户地址不能为空", trigger: "blur" }
          ],
          customer_tel: [
            { required: true, message: "手机号码不能为空", trigger: "blur" },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        }
      };
    },
    watch: {
      // 根据名称筛选部门树
      department_name(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.getList();
      this.getTreeselect();
      this.getDicts("item_type").then(response => {
        this.typeOptions = response.data;
      });
    },
    methods: {
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.customer_id !=undefined ) {
              updateCustomer(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.customerOpen = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addCustomer(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.customerOpen = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },
      // 项目类型字典翻译
      customer_typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.customer_type);
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        // this.getTreeselect();
        const customer_id = row.customer_id || this.ids;
        selectCustomer(customer_id).then(response => {
          this.form = response.data;
          this.postOptions = response.posts;
          /*this.roleOptions = response.roles;
          this.form.postIds = response.postIds;
          this.form.roleIds = response.roleIds;*/
          this.customerOpen = true;
          this.title = "修改任务";
        });
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const customerids = row.customer_id || this.ids;
        this.$confirm('是否确认删除客户编号为"' + customerids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteCustomer(customerids).then(response => {
            if (response.code === 200) {
              this.getList();
              this.msgSuccess("删除成功");
            } else {
              this.msgError(response.msg);
            }
          });
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.customer_id);
        // this.upload.item_id=selection[0]["item_id"];
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },

      /** 新增按钮操作 */
      customerAdd() {
        this.reset();
        this.customerOpen = true;
        this.title = "客户基本信息";
        /*selectProject().then(response => {
          /!*this.postOptions = response.posts;
          this.roleOptions = response.roles;*!/
          this.projectOpen = true;
          this.title = "项目基本信息";
        });*/
      },
      // 取消按钮
      cancel() {
        this.customerOpen = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          customer_id: undefined,
          customer_name: undefined,
          customer_type: undefined,
          customer_tel: undefined,
          customer_email: undefined,
          customer_adress: undefined,
          emp_num: undefined,
          contract_fund: undefined,
          emp_cost: undefined,
          empProfit: undefined,
          remark: undefined
        };
        this.resetForm("form");
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
        this.getFileList();
        this.uploadFileVisible=false;
      },

      /** 查询项目信息列表 */
      getList() {
        this.loading = true;
        listCustomer(this.queryParams).then(response => {
          this.jobList = response.rows;
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
        this.resetForm("queryForm");
        this.handleQuery();
      },



      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出客户列表数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCustomer(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };

</script>
