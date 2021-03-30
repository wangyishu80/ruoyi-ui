<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="empDepartment"
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
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="员工姓名" prop="empName">
            <el-input
              v-model="queryParams.empName"
              placeholder="请输入员工姓名"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="人员级别" prop="empLevel">
            <el-select
              v-model="queryParams.empLevel"
              placeholder="人员级别"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in empLevelOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="empState">
            <el-select
              v-model="queryParams.empState"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in empStateOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="学历" prop="empEdu">
            <el-select
              v-model="queryParams.empEdu"
              placeholder="员工学历"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in empEduOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
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
          :disabled="single"
          @click="handleBinding"
          v-hasPermi="['system:dict:add']"
        >绑定</el-button>
      </el-col>
     <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUnbundling"
          v-hasPermi="['system:dict:edit']"
        >解绑</el-button>
      </el-col>-->

    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" prop="empId"/>
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column label="部门" align="center" prop="empDepartment" />
      <el-table-column label="岗位" align="center" prop="post.postName" />
      <el-table-column label="人员级别" align="center" prop="empLevel" :formatter="empLevelFormat"/>
      <el-table-column label="状态" align="center" prop="empState" :formatter="empStateFormat" />
      <!--<el-table-column label="绑定状态" align="center" prop="empState" :formatter="empStateFormat" />-->
      <!--<el-table-column label="工资" align="center" prop="cost.empSalary" />-->
      <el-table-column label="学历" align="center" prop="empEdu" :formatter="empEduFormat"/>
      <el-table-column label="联系电话" align="center" prop="empTel" />
      <el-table-column label="现住址" align="center" prop="empAdress" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <!--<el-table-column label="创建时间" align="center" prop="updateTime" width="180"/>-->

    </el-table>


    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getEmpList"
    />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { listDataPer,listEmp,listIsBindEmp, getData, addData,updateBinding, updateData,unBindEmp,selectEmpcost,selectEmpNum } from "@/api/project/assignper";
  // import { listType, getType } from "@/api/system/dict/type";
  import { treeselect } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "Outsourcingper",
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
        // 字典表格数据
        dataList: [],
        // 部门树选项
        deptOptions: undefined,
        // 部门名称
        empDepartment: undefined,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态数据字典
        empStateOptions: [],
        // 学历数据字典
        empEduOptions: [],
        //员工级别数据字典
        empLevelOptions: [],
        // 类型数据字典
        typeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          empDepartment: undefined,
          empName: undefined,
          empLevel: undefined,
          empState: undefined,
          item_level_id: undefined
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 表单校验
        rules: {
          dictLabel: [
            { required: true, message: "数据标签不能为空", trigger: "blur" }
          ],
          dictValue: [
            { required: true, message: "数据键值不能为空", trigger: "blur" }
          ],
          dictSort: [
            { required: true, message: "数据顺序不能为空", trigger: "blur" }
          ]
        }
      };
    },
    watch: {
      // 根据名称筛选部门树
      empDepartment(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      const item_level_id = this.$route.query.item_level_id;
      // const item_id = this.$route.params && this.$route.params.item_id;
      const item_id = this.$route.query.item_id;
      this.getEmpList();
      this.getTreeselect();
      this.getDicts("emp_state").then(response => {
        this.empStateOptions = response.data;
      });
      this.getDicts("emp_level").then(response => {
        this.empLevelOptions = response.data;
      });
      this.getDicts("emp_edu").then(response => {
        this.empEduOptions = response.data;
      });
    },
    methods: {
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.empDepartment = data.id;
        this.getEmpList();
      },
      /** 查询员工数据列表  */
      getEmpList() {
        this.loading = true;
        listEmp(this.queryParams).then(response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 查询项目绑定员工数据列表 */
      getList(item_level_id) {
        this.loading = true;
        listEmp(this.queryParams).then(response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
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
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          empId: undefined,
          empName: undefined,
          empDepartment: undefined,
          empJob: undefined,
          empLevel: undefined,
          empTel: undefined,
          empSalary: undefined,
          empEdu: undefined,
          empAdress: undefined,
          empState: undefined,
          remark: undefined,
          updateTime: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getEmpList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.empDepartment = "";
        this.resetForm("queryForm");
        this.queryParams.dictType = this.defaultDictType;
        this.handleQuery();
      },
      /** 绑定按钮操作 */
      handleBinding(row) {
        this.loading = true;
        const empid = row.empId || this.ids;
        const item_level_id = this.$route.query.item_level_id;
        // const item_id = this.$route.params && this.$route.params.item_id;
        const itemid = this.$route.query.item_id;
        this.form.empid = empid[0];
        this.form.empId = empid[0];
        this.form.item_level_id = item_level_id;
        this.form.itemid = itemid;
        unBindEmp(this.form).then(response => {
          if (response.total === 0) {
            selectEmpNum(this.form).then(response => {
              if (response.binding === true) {
                this.$confirm('此项目已经绑定人数超过此级别录入人数,是否确认绑定!', "警告", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  // this.msgSuccess("'此项目已经绑定人数超过录入人数！");
                  selectEmpcost(this.form).then(response => {
                    if (response.total === 0) {
                      this.msgSuccess("此员工未设置工资信息！");
                      addData(this.form).then(response => {
                        if (response.code === 200) {
                          this.msgSuccess("绑定成功");
                          this.getEmpList();
                        } else {
                          this.msgError(response.msg);
                        }
                      });
                    } else {
                      addData(this.form).then(response => {
                        if (response.code === 200) {
                          this.msgSuccess("绑定成功");
                          this.getEmpList();
                        } else {
                          this.msgError(response.msg);
                        }
                      });
                    }
                  });
                });
                this.getEmpList();
              }else {
                selectEmpcost(this.form).then(response => {
                  if (response.total === 0) {
                    this.msgSuccess("此员工未设置工资信息！");
                    addData(this.form).then(response => {
                      if (response.code === 200) {
                        this.msgSuccess("绑定成功");
                        this.getEmpList();
                      } else {
                        this.msgError(response.msg);
                      }
                    });
                  }else {
                    addData(this.form).then(response => {
                      if (response.code === 200) {
                        this.msgSuccess("绑定成功");
                        this.getEmpList();
                      } else {
                        this.msgError(response.msg);
                      }
                    });
                  }
                });

              }
            });
          }else{
            selectEmpNum(this.form).then(response => {
              if (response.binding === true) {
                this.$confirm('此项目已经绑定人数超过此级别录入人数,是否确认绑定!', "警告", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  selectEmpcost(this.form).then(response => {
                    if (response.total === 0) {
                      this.msgSuccess("此员工未设置工资信息！");
                      this.form.delflag = "0";
                      updateBinding(this.form).then(response => {
                        if (response.code === 200) {
                          this.msgSuccess("绑定成功");
                          this.getEmpList();
                        } else {
                          this.msgError(response.msg);
                        }
                      });
                    } else {
                      this.form.delflag = "0";
                      updateBinding(this.form).then(response => {
                        if (response.code === 200) {
                          this.msgSuccess("绑定成功");
                          this.getEmpList();
                        } else {
                          this.msgError(response.msg);
                        }
                      });
                    }
                  });
                });
                this.getEmpList();
                }else{
                selectEmpcost(this.form).then(response => {
                  if (response.total === 0) {
                    this.msgSuccess("此员工未设置工资信息！");
                    this.form.delflag = "0";
                    updateBinding(this.form).then(response => {
                      if (response.code === 200) {
                        this.msgSuccess("绑定成功");
                        this.getEmpList();
                      } else {
                        this.msgError(response.msg);
                      }
                    });
                  } else {
                    this.form.delflag = "0";
                    updateBinding(this.form).then(response => {
                      if (response.code === 200) {
                        this.msgSuccess("绑定成功");
                        this.getEmpList();
                      } else {
                        this.msgError(response.msg);
                      }
                    });
                  }
                });
              }
              });
          }
        });
            /*selectEmpcost(this.form).then(response => {
            if (response.total === 0) {
              this.msgSuccess("此员工未设置工资信息！");
              addData(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("绑定成功");
                  this.getEmpList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }else {
              addData(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("绑定成功");
                  this.getEmpList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          });*/
      },
      /** 解绑按钮操作 */
      handleUnbundling(row) {
        this.loading = true;
        const empid = row.empId || this.ids;
        const item_level_id = this.$route.params && this.$route.params.item_level_id;
        this.form.empid = empid[0];
        this.form.item_level_id = item_level_id;
        listIsBindEmp(this.form).then(response => {
          if (response.total === 0) {
            this.msgSuccess("此员工未绑定！");
            this.getList(item_level_id);
          }else {
            updateData(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("解绑成功");
                this.getList(item_level_id);
              } else {
                this.msgError(response.msg);
              }
            });
          }
        });

      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.empId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const dictCode = row.dictCode || this.ids
        getData(dictCode).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改字典数据";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.dictCode != undefined) {
              updateData(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addData(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      }

    }
  };
</script>
