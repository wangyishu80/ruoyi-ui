<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dict:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:dict:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:dict:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleAssignper"
          v-hasPermi="['system:dict:edit']"
        >分配人员</el-button>
      </el-col>
     <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:dict:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" border >
      <el-table-column type="selection" width="55" align="center" prop="item_level_id"/>
      <el-table-column label="级别名称" align="center" prop="level_name" />
      <el-table-column label="级别人数" align="center" prop="level_num" />
      <el-table-column label="级别定价(/元)" align="center" prop="level_price" />
      <el-table-column label="创建时间" align="center" prop="update_time" width="180">
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="perlevelopen" width="550px" border>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" >
        <el-col :span="12">
        <el-form-item label="级别名称" prop="level_name">
          <el-select v-model="form.level_name" placeholder="请选择">
            <el-option
              v-for="dict in perlevelOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别人数" prop="level_num">
              <el-input v-model="form.level_num" placeholder="请输入人数" />
            </el-form-item>
          </el-col>
          <!--<el-col :span="11">
            <el-form-item v-if="form.ischange != 'F'" label="是否变更" prop="ischange">
              <el-radio-group v-model="form.ischange">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>-->
          <el-col :span="24">
            <el-form-item label="级别定价(/元)" prop="level_price">
              <el-input v-model="form.level_price" placeholder="请输入级别定价" />
            </el-form-item>
          </el-col>
        <!--<el-col :span="12">
          <el-form-item  label="是否变更项目" prop="ischange">
            <el-radio-group v-model="form.ischange">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listData, getData, delData, addData, updateData, exportData,selectIsLevel } from "@/api/project/perlevel";
  import { listDataPer } from "@/api/project/assignper";
  export default {
    name: "Perlevel",
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
        // 级别数据字典
        perlevelOptions: [],
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
        // 表单校验
        rules: {
          level_name: [
            { required: true, message: "级别名称不能为空", trigger: "blur" }
          ],
          level_num: [
            { required: true, message: "级别人数不能为空", trigger: "blur" },
            { validator:function(rule,value,callback){
                if(/^\+?[1-9][0-9]*$/.test(value) == false){
                  callback(new Error("请输入正确的正整数"));
                }else{
                  callback();
                }
              },trigger: "blur"
            }
          ],
          level_price: [
            { required: true, message: "级别定价不能为空", trigger: "blur" },
            { validator:function(rule,value,callback){
                if(/^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/.test(value) == false){
                  callback(new Error("请输入正确的项目金额(保留2位小数)"));
                }else{
                  callback();
                }
              },trigger: "blur"
            }
          ],
          ischange: [
            { required: true, message: "是否变更项目没有选", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      const item_id = this.$route.params && this.$route.params.item_id;
      this.getList(item_id);
      // this.getType(dictId);
      // this.getTypeList();
      this.getDicts("item_emp_level").then(response => {
        this.perlevelOptions = response.data;
      });
    },
    methods: {
      /** 查询项目人员级别信息 */
      getList(item_id) {
        this.loading = true;
        listData(item_id).then(response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 数据级别字典翻译
      levelFormat(row, column) {
        return this.selectDictLabel(this.perlevelOptions, row.level_name);
      },
      // 取消按钮
      cancel() {
        this.perlevelopen = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          item_level_id: undefined,
          item_id: undefined,
          level_name: undefined,
          level_num: undefined,
          level_price: undefined,
          ischange: undefined
        };
        this.resetForm("form");
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.perlevelopen = true;
        this.title = "添加项目人员级别";
        this.form.item_id = this.$route.params.item_id;
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.item_level_id);
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const item_level_id = row.item_level_id || this.ids;
        getData(item_level_id).then(response => {
          this.form = response.data;
          this.perlevelopen = true;
          this.title = "修改项目人员级别数据";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.item_level_id != undefined) {
              updateData(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.perlevelopen = false;
                  this.getList(this.form.item_id);
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              selectIsLevel(this.form).then(response => {
                if (response.total === 0) {
                  addData(this.form).then(response => {
                    if (response.code === 200) {
                      this.msgSuccess("新增成功");
                      this.perlevelopen = false;
                      this.getList(this.form.item_id);
                    } else {
                      this.msgError(response.msg);
                    }
                  });
                } else {
                  this.msgError("此级别已存在！");
                }
              });
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const item_level_id = row.item_level_id || this.ids;
        const item_id = this.$route.params && this.$route.params.item_id;
        this.$confirm('是否确认删除项目外包人员级别为"' + item_level_id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=> {
          listDataPer(item_level_id).then(response => {
            if(response.total ===0){
              return delData(item_level_id).then(response => {
                if (response.code === 200) {
                  this.getList(item_id);
                  this.msgSuccess("删除成功");
                } else {
                  this.msgError(response.msg);
                }
              });
            }else {
              this.msgSuccess("请先解除外包人员！");
            }
          });
          })
      },
      //外包人员分配
      handleAssignper(row) {
        const item_level_id = row.item_level_id || this.ids;
        const item_id = this.$route.params && this.$route.params.item_id;
        this.$router.push({path:"/Outsourcingper/type/index/", query:{item_level_id:item_level_id[0],item_id:item_id}});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportData(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
