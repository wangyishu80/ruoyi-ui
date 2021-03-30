<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!-- 左侧部门树 -->
      <el-col :span="4" :xs="24" style="border-right: solid #e8edf1 1px; height: calc(82vh);">
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
        <!-- 员工基本信息检索表单 -->
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="员工姓名" prop="empName">
                <el-input
                  v-model="queryParams.empName"
                  placeholder="请输入员工名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="身份证号" prop="idCard">
                <el-input
                  v-model="queryParams.idCard"
                  placeholder="请输入员工编号"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="员工状态" prop="empState">
                <el-select v-model="queryParams.empState"
                placeholder="请选择员工状态" clearable size="small">
                  <el-option
                    v-for="dict in empstateOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
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
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="专业" prop="major">
                <el-input
                  v-model="queryParams.major"
                  placeholder="请输入专业"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="岗位" prop="empJob">
                <el-select v-model="queryParams.empJob" placeholder="请选择" clearable size="small">
                  <el-option
                    v-for="job in jobOptions"
                    :key="job.postId"
                    :label="job.postName"
                    :value="job.postId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 员工基本信息列表操作按钮 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="single"
              @click="deleteEmp"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload"
              size="mini"
              :disabled="single"
              @click="empInfoUpload.show = true"
            >附件上传</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="empImport.open=true"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="exportEmpInfo"
            >导出</el-button>
          </el-col>
        </el-row>

        <!-- 员工基本信息列表 -->
        <el-table v-loading="loading" :data="empList" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection" width="55" align="center" class-name="small-padding fixed-width" fixed="left" prop="empId;" />
          <!--<el-table-column label="工号" align="center" prop="empNo" class-name="small-padding fixed-width" fixed="left" width="100" />-->
          <el-table-column label="姓名" align="center" prop="empName" class-name="small-padding fixed-width" fixed="left" width="80" />
          <el-table-column label="性别" align="center" prop="empSex" width="60" :formatter="sexFormat"/>
         <!-- <el-table-column label="年龄" align="center" prop="empAge" width="60"/>-->
          <el-table-column label="身份证号" align="center" prop="idCard" width="110" :show-overflow-tooltip="true" />
          <el-table-column label="学历" align="center" prop="empEdu" width="80" :formatter="empeduFormat"/>
          <el-table-column label="专业" align="center" prop="major" width="120" />
          <el-table-column label="毕业院校" align="center" prop="eduSchoolList" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="学信网是否可查" align="center" prop="isLearnWeb"  width="120" />
          <el-table-column label="二级部" align="center" prop="empDepartment" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="所在项目" align="center" prop="projectName" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="岗位" align="center" prop="empJob" width="100" :show-overflow-tooltip="true" />
          <!--<el-table-column label="职级" align="center" prop="empLevel" width="130" :formatter="levelFormat" :show-overflow-tooltip="true" />-->
          <el-table-column label="联系电话" align="center" prop="empTel" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="邮箱" align="center" prop="empEmail" width="150" />
          <el-table-column label="现住址" align="center" prop="empAdress" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="家庭住址" align="center" prop="empFamadress" width="150" :show-overflow-tooltip="true" />
          <el-table-column label="紧急联系人" align="center" prop="empEmecontact" width="100" />
          <el-table-column label="紧急联系人电话" align="center" prop="empEmecontacttel" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="参加工作日期" align="center" prop="empWorkdate" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="合同状态" align="center" prop="empState" width="100" :formatter="empstatusFormat"/>
          <el-table-column label="入职时间" align="center" prop="empEntrydate" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="转正时间" align="center" prop="empSepardate" width="140" :show-overflow-tooltip="true" />
          <el-table-column label="离职时间" align="center" prop="empQuitdate" width="140" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-paperclip"
                @click="getEmpEduList(scope.row)"
              >学历</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-folder-opened"
                @click="getEmpSkillList(scope.row)"
              >证书</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-download"
                @click="getEmpDocList(scope.row)"
              >附件下载</el-button>

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
      />
      </el-col>
    </el-row>

    <!-- 员工基本信息，附件上传 -->
    <el-dialog title="上传附件" :visible.sync="empInfoUpload.show" width="400px"
               style="margin-top: 10vh; !important" @close="empInfoUploadClose">
      <label style="font-weight: normal;">附件类型：</label>
      <el-select v-model="empInfoUpload.docType" style = "margin-bottom: 10px"
                 placeholder="请选择附件类型" clearable size="small" @change="docTypeChange">
        <el-option
          v-for="dict in empDocTypeOptions"
          :key="dict.dictValue"
          :label="dict.dictLabel"
          :value="dict.dictValue"
        />
      </el-select>

      <el-upload
        ref="empInfoUpload"
        :limit="empInfoUpload.limitNum"
        accept="*"
        :multiple = "true"
        :on-change = "empInfoUploadOnChange"
        :disabled="empInfoUpload.isEmpInfo"
        :auto-upload="false"
        :file-list="empInfoUpload.fileList"
        :on-exceed="empInfoUploadExceed"
        action = "#"
        drag
      >

        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip"></div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="empUploadSubmit(empInfoUpload.fileList, ids, ids, empInfoUpload.docType)">立即上传</el-button>
        <el-button size="small"  @click="empInfoUpload.show = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改 员工信息对话框 -->
    <el-dialog :title="title" :visible.sync="addOrUpdateEmp" width="800px"
               :close-on-click-modal="close" :close-on-press-escape="close" @close="closeAddOrUpdateEmp">
      <el-form ref="form" :model="form" :rules="rules" :label-position="labelPosition" label-width="130px">
        <el-input v-model="form.empId" type = "hidden" />
        <el-row>
          <el-col :span="11">
            <el-form-item label="员工姓名" prop="empName" >
              <el-input v-model="form.empName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性别" prop="empSex">
              <el-select v-model="form.empSex" placeholder="请选择" style="width:218px; !important;">
                <el-option
                  v-for="sex in sexOptions"
                  :key="sex.dictValue"
                  :label="sex.dictLabel"
                  :value="sex.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <!--<el-col :span="11">
            <el-form-item label="工号" prop="empNo">
              <el-input v-model="form.empNo" placeholder="请输入工号" />
            </el-form-item>
          </el-col>-->
          <el-col :span="11">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="empEmail">
              <el-input v-model="form.empEmail" placeholder="请输入邮箱地址" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="学历" prop="empEdu">
              <el-select v-model="form.empEdu" placeholder="请选择" style="width:218px; !important;">
                <el-option
                  v-for="edu in empeduOptions"
                  :key="edu.dictValue"
                  :label="edu.dictLabel"
                  :value="edu.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="专业" prop="major">
              <el-input v-model="form.major" placeholder="请输入专业" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="所属部门" prop="empDepartment">
              <treeselect v-model="form.empDepartment" :options="deptOptions" placeholder="请选择归属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="岗位" prop="empJob">
              <el-select v-model="form.empJob" placeholder="请选择" style="width:218px; !important;">
                <el-option
                  v-for="job in jobOptions"
                  :key="job.postId"
                  :label="job.postName"
                  :value="job.postId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="职级" prop="empLevel">
              <el-select v-model="form.empLevel" placeholder="请选择" style="width:218px; !important;">
                <el-option
                  v-for="level in levelOptions"
                  :key="level.dictValue"
                  :label="level.dictLabel"
                  :value="level.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="empTel">
              <el-input v-model="form.empTel" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="现住址" prop="empAdress">
              <el-input v-model="form.empAdress" placeholder="请输入现住址" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="家庭住址" prop="empFamadress">
              <el-input v-model="form.empFamadress" placeholder="请输入家庭住址" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="紧急联系人" prop="empEmecontact">
              <el-input v-model="form.empEmecontact" placeholder="请输入紧急联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="紧急联系人电话" prop="empEmecontacttel">
              <el-input v-model="form.empEmecontacttel" placeholder="请输入紧急联系人电话" />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="入职日期" prop="empEntrydate">
              <el-date-picker type="date" placeholder="请选择日期"
                              v-model="form.empEntrydate" style="width: 100%;"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="empEntrydateChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="合同状态" prop="empState">
              <el-select v-model="form.empState" placeholder="请选择" style="width:218px; !important;">
                <el-option
                  v-for="state in empstateOptions"
                  :key="state.dictValue"
                  :label="state.dictLabel"
                  :value="state.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="转正日期" prop="empSepardate">
              <el-date-picker type="date" placeholder="请选择日期"
                              v-model="form.empSepardate" style="width: 100%;"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="empSepardateChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="参加工作日期" prop="empWorkdate">
              <el-date-picker type="date" placeholder="请选择日期"
                              v-model="form.empWorkdate" style="width: 100%;"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="empWorkdateChange">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="2"></el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="form.remark" />

            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button type="warning" @click="reset">重 置</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!--------------------------- 教育经历 ------------------------------->
    <el-dialog title="教育经历" :visible.sync="showEmpEdu" width="800px"
               :close-on-click-modal="close" :close-on-press-escape="close"
               @close="clearEmpInfo('edu')" style="margin-top: 10vh; !important">
      <!-- 教育经历列表，按钮操作 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini"
            @click="innerEduFormAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" icon="el-icon-edit" size="mini"
            @click="innerEduFormUpdate" :disabled = "innerEdu.one"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" icon="el-icon-delete"  size="mini"
            @click="deleteEduInfo" :disabled = "innerEdu.many"
          >删除</el-button>
        </el-col>
      </el-row>
      <!-- 教育经历列表 -->
      <el-table v-loading="loading" :data="innerEdu.empEduList" @selection-change="handleSelectionEdu" border>
        <el-table-column type="selection" width="55" align="center" prop="eduId;" />
        <el-table-column label="毕业院校" align="center" prop="eduSchool" width="150" />
        <el-table-column label="开始时间" align="center" prop="eduBegin" width="120" />
        <el-table-column label="结束时间" align="center" prop="eduGraduation" width="120"/>
        <el-table-column label="学历" align="center" prop="empEdu" width="80" :formatter="empeduFormat"/>
        <el-table-column label="是否有毕业证书" align="center" prop="isdisploma" :formatter="showYnLabel" width="120" />
        <el-table-column label="是否有学位证书" align="center" prop="isdegree" :formatter="showYnLabel" width="120" />
        <el-table-column label="学信网是否可查" align="center" prop="isLearnWeb" :formatter="showYnLabel" width="120" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.isdisploma == 'N' && scope.row.isdegree == 'N'"
              size="mini"
              type="text"
              icon="el-icon-sell"
              @click="showEduUpload(scope.row)"
            >上传附件</el-button>
            <!--<el-button
              size="mini"
              type="text"
              icon="el-icon-paperclip"
              @click=""
            >查看证书</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <!-- 教育经历(新增，修改)表单 -->
      <el-dialog
        width="800px"
        :title="innerEdu.innerTitle"
        :close-on-click-modal="close"
        :visible.sync="innerEdu.showInnerEdu"
        append-to-body @close="resetTitle('edu')"
        style="margin-top: 10vh; !important">

        <el-form ref="eduForm" :model="innerEdu.eduForm" :label-position="labelPosition" label-width="130px">
          <el-input v-model="innerEdu.eduForm.eduId" type = "hidden" />
          <el-input v-model="innerEdu.eduForm.empId" type = "hidden" />
          <el-row>
            <el-col :span="11">
              <el-form-item label="毕业院校" prop="eduSchool" >
                <el-input v-model="innerEdu.eduForm.eduSchool" placeholder="请输入毕业院校" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="学历" prop="empEdu">
                <el-select v-model="innerEdu.eduForm.empEdu" placeholder="请选择" >
                  <el-option
                    v-for="edu in empeduOptions"
                    :key="edu.dictValue"
                    :label="edu.dictLabel"
                    :value="edu.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="开始日期" prop="eduBegin">
                <el-date-picker type="date" placeholder="请选择日期"
                                v-model="innerEdu.eduForm.eduBegin" style="width: 100%;"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="eduBeginDateChange">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="结束日期" prop="eduGraduation">
                <el-date-picker type="date" placeholder="结束日期"
                                v-model="innerEdu.eduForm.eduGraduation" style="width: 100%;"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="eduEndDateChange">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="是否有毕业证" prop="isdisploma">
                <el-radio v-for="yn in ynOptions" v-model="innerEdu.eduForm.isdisploma" :value="yn.dictValue" :label="yn.dictValue">
                  {{ yn.dictLabel }}
                </el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="是否有学位证" prop="isdegree">
                <el-radio v-for="yn in ynOptions" v-model="innerEdu.eduForm.isdegree" :value="yn.dictValue" :label="yn.dictValue">
                  {{ yn.dictLabel }}
                </el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="学信网是否可查" prop="isLearnWeb">
                <el-radio v-for="yn in ynOptions" v-model="innerEdu.eduForm.isLearnWeb" :value="yn.dictValue" :label="yn.dictValue">
                  {{ yn.dictLabel }}
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addOrUpdateEdu">确 定</el-button>
          <el-button type="warning" @click="resetEduForm">重 置</el-button>
          <el-button @click="cancelEduForm">取 消</el-button>
        </div>
      </el-dialog>

      <!-- begin ---- 附件上传 -->
      <el-dialog title="上传学历附件" :visible.sync="innerEdu.showEduUpload" width="400px" :close-on-click-modal="close"
                 style="margin-top: 10vh; !important" append-to-body @close="cancelUpload">

        <el-upload
          ref="eduUpload"
          :limit="eduInfoUpload.limitNum"
          accept="*"
          :multiple = "true"
          :on-change="eduInfoUploadOnChange"
          action="#"
          :disabled="eduInfoUpload.isUploading"
          :auto-upload="false"
          :on-exceed="eduUploadExceed"
          :file-list="eduInfoUpload.fileList"
          drag
        >

          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" style="color:red" slot="tip"></div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary"
                     @click="empUploadSubmit(eduInfoUpload.fileList, innerEdu.empId, eduInfoUpload.eduId, empInfoUpload.docType)"
          >立即上传</el-button>
          <el-button size="small"  @click="innerEdu.showEduUpload=false">取消</el-button>
        </div>
      </el-dialog>
      <!-- end ---- 附件上传 -->

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEmpEdu">取 消</el-button>
      </div>
    </el-dialog>

    <!--------------------------- 证书信息 ------------------------------->
    <el-dialog title="技能证书" :visible.sync="showEmpSkill" width="800px"
               :close-on-click-modal="close" :close-on-press-escape="close"
               @close="clearEmpInfo('skill')" style="margin-top: 10vh; !important">
      <!-- 技能证书列表，按钮操作 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini"
                     @click="innerSkillFormAdd"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" icon="el-icon-edit" size="mini"
                     @click="innerSkillFormUpdate" :disabled = "innerSkill.one"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" icon="el-icon-delete"  size="mini"
                     @click="deleteSkillInfo" :disabled = "innerSkill.many"
          >删除</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="innerSkill.skillList" border @selection-change="handleSelectionSkill">
        <el-table-column type="selection" width="55" align="center" prop="skillId;" />
        <el-table-column label="技能名称" align="center" prop="skillName" width="130" :show-overflow-tooltip="true"/>
        <el-table-column label="证书级别" align="center" prop="skillLevel" width="120" :formatter="skillFormat"/>
        <el-table-column label="认证机构" align="center" prop="certificationOrg" width="180" :show-overflow-tooltip="true"/>
        <el-table-column label="证书编号" align="center" prop="skillNo" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="获得日期" align="center" prop="skillDate" width="120" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-sell"
              @click="showSkillUpload(scope.row)"
            >上传附件</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 技能证书(录入、修改 表单) -->
      <el-dialog
        width="750px"
        :title="innerSkill.innerTitle"
        :close-on-click-modal="close"
        :visible.sync="innerSkill.showInnerSkill"
        append-to-body @close="resetTitle('skill')"
        style="margin-top: 10vh; !important">

        <el-form ref="skillForm" :model="innerSkill.skillForm" :label-position="labelPosition" label-width="130px">
          <el-input v-model="innerSkill.skillForm.skillId" type = "hidden" />
          <el-input v-model="innerSkill.skillForm.empId" type = "hidden" />
          <el-row>
            <el-col :span="11">
              <el-form-item label="技能名称" prop="skillName" >
                <el-input v-model="innerSkill.skillForm.skillName" placeholder="请输入技能名称" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="证书级别" prop="skillLevel">
                <el-select v-model="innerSkill.skillForm.skillLevel" placeholder="请选择" >
                  <el-option
                    v-for="sl in skillLevelOptions"
                    :key="sl.dictValue"
                    :label="sl.dictLabel"
                    :value="sl.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="认证机构" prop="certificationOrg">
                <el-input v-model="innerSkill.skillForm.certificationOrg" placeholder="请输入技能认证机构" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="获得日期" prop="skillDate">
                <el-date-picker type="date" placeholder="结束日期"
                                v-model="innerSkill.skillForm.skillDate" style="width: 100%;"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="证书编号" prop="skillNo">
                <el-input v-model="innerSkill.skillForm.skillNo" placeholder="请输入证书编号" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addOrUpdateSkill">确 定</el-button>
          <el-button type="warning" @click="resetSkillForm">重 置</el-button>
          <el-button @click="cancelSkillForm">取 消</el-button>
        </div>
      </el-dialog>

      <!-- begin ---- 技能证书附件上传 -->
      <el-dialog title="上传技能证书附件" :visible.sync="innerSkill.showSkillUpload" width="400px" :close-on-click-modal="close"
                 style="margin-top: 10vh; !important" append-to-body @close="cancelSkillUpload">

        <el-upload
          ref="skillUpload"
          :limit="skillUpload.limitNum"
          accept="*"
          :multiple = "true"
          :on-change="skillUploadOnChange"
          action="#"
          :disabled="skillUpload.isSkill"
          :auto-upload="false"
          :on-exceed="skillUploadExceed"
          :file-list="skillUpload.fileList"
          drag
        >

          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" style="color:red" slot="tip"></div>
        </el-upload>

        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary"
                     @click="empUploadSubmit(skillUpload.fileList, innerSkill.empId, skillUpload.skillId, empInfoUpload.docType)"
          >立即上传</el-button>
          <el-button size="small"  @click="innerSkill.showSkillUpload=false">取消</el-button>
        </div>
      </el-dialog>
      <!-- end ---- 附件上传 -->

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEmpSkill">取 消</el-button>
      </div>
    </el-dialog>

    <!--------------------------- 附件信息 ------------------------------->
    <el-dialog :title="docTitle" :visible.sync="showEmpDoc" width="850px"
               :close-on-click-modal="close" :close-on-press-escape="close"
               @close="clearEmpInfo('doc')" >
      <!-- 附件信息列表，按钮操作 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini"
                     @click="downLoadDoc" :disabled = "innerDoc.downloadAll"
          >下载全部
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" icon="el-icon-delete"  size="mini"
                     @click="deleteEmpDocs" :disabled = "innerDoc.many"
          >删除</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="innerDoc.loading" :data="innerDoc.docList" border @selection-change="handleSelectionDoc" height="calc(60vh)">
        <el-table-column type="selection" width="55" align="center" prop="docId;" />
        <el-table-column label="附件名称" align="center" prop="docName" width="160" :show-overflow-tooltip="true"/>
        <el-table-column label="附件大小" align="center" prop="docSize" width="120" :formatter="docSizeFormat"/>
        <el-table-column label="附件类型" align="center" prop="docType" width="180" :formatter="docTypeFormat"/>
        <el-table-column label="上传时间" align="center" prop="updateTime" width="150" :formatter="uploadTimeFormat" :show-overflow-tooltip="true"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="openDocView(scope.row)"
            >查看附件</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 附件预览 -->
      <el-dialog
        width="70%"
        :title="docView.title"
        :close-on-click-modal="close"
        :visible.sync="docView.show"
        append-to-body
        @close="closeDocView">

        <div v-if="docView.isImg" style="width: 100%; height: calc(70vh); overflow: scroll">
          <img id="img" style="width: 100%; height: auto;">
        </div>
        <iframe v-if="!docView.isImg" id = "view"
          style="width: 100%;height: calc(70vh); z-index:100; "
        ></iframe>
        <div slot="footer" class="dialog-footer">
          <el-button @click="docView.show = false">取 消</el-button>
        </div>
      </el-dialog>


      <div slot="footer" class="dialog-footer">
        <el-button @click="showEmpDoc = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--------------------------- 人员信息导入 ------------------------------->
    <el-dialog title="员工信息导入" :visible.sync="empImport.open" width="400px"
               :close-on-click-modal="close" @close="closeEmpImport">

      <label style="font-weight: normal;">导入类型：</label>
      <el-select v-model="empImport.type" style = "margin-bottom: 10px"
                 placeholder="请选择导入类型" clearable size="small" @change="selectImportType">
        <el-option key="0" label="基础信息" value="0"/>
        <el-option key="1" label="教育经历" value="1"/>
        <el-option key="2" label="技能证书" value="2"/>
      </el-select>

      <el-upload
        ref="empImport"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="empImport.headers"
        :action="empImport.url + '?updateSupport=' + empImport.updateSupport"
        :disabled="empImport.isUploading"
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
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="empImport.updateSupport">是否更新已经存在的用户数据</el-checkbox>
          <el-link type="info" style="font-size:12px; float: right;" :disabled="empImport.isTemplate" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEmpImport">确 定</el-button>
        <el-button @click="empImport.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--------------------------- 人员附件挂接 ------------------------------->
    <el-dialog title="员工附件挂接" :visible.sync="empDocBind.open" width="400px"
               :close-on-click-modal="close" @close="closeEmpImport">

      <label style="font-weight: normal;">挂接包名：</label>
      <el-select v-model="empDocBind.zip" style = "margin-bottom: 10px"
                 placeholder="请选择挂接包" clearable size="small">
        <el-option
          v-for="zip in empDocBind.bindZipList"
          :key="zip"
          :label="zip"
          :value="zip"
        />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="">挂 接</el-button>
        <el-button @click="empImport.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios';
import { listemployee, addEmployee, getEmp, updateEmp, timeFormat, importTemplate, exportEmpInfo, delEmp,exportEmpInfoId } from "@/api/employee/employee";
import { bindZipList } from "@/api/employee/docbind";
import { listEdu, addEdu, updateEdu, delEdu, getEdu } from "@/api/employee/education";
import { listSkill, getSkill, addSkill, updateSkill, delSkill } from "@/api/employee/empSkill";
import { downLoadZip } from "@/utils/zipdownload";
import { getDocs, deleteDocs, submitUploadDoc } from "@/api/employee/empDocument";
import ElRow from "element-ui/packages/row/src/row";
import ElCol from "element-ui/packages/col/src/col";
import { allPost } from "@/api/system/post";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";

export default {
  components: {
    ElCol,
    ElRow,
    Treeselect},
  name: "Employee",

  data() {
    return {

      //左侧部门树
      deptPanel : {
        deptName : '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      },

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 是否可删除员工
      isDel : true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,

      close : false,
      // 总条数
      total: 0,
      // 员工表格数据
      empList: [],
      // 弹出层标题
      title: "",
      // 是否显示 新增用户 弹出框
      addOrUpdateEmp: false,

      showEmpEdu : false,

      showEmpSkill: false,

      showEmpDoc : false,

      docTitle : '',

      empInfoUpload : {
        show : false,
        limitNum : 6,
        docType : undefined,
        isEmpInfo : true,
        fileList : [],
        empId : undefined,
        itemId : undefined,
      },

      empImport : {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "员工信息导入",
        // 是否禁用上传
        isUploading: true,
        // 是否禁用模板下载按钮
        isTemplate : true,
        // 是否更新已经存在的用户数据
        updateSupport: false,
        //导入类型
        type : undefined,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/employee/info/import",

        templateUrl : '',

        resultTitle : '导出结果'
      },

      eduInfoUpload: {
        limitNum : 4,

        isUploading: false,

        eduId : '',

        fileList : []
      },

      // 性别状态字典
      sexOptions: [],
      //员工状态
      empstateOptions:[],
      //学历
      empeduOptions: [],
      //岗位
      jobOptions:[],
      //职级
      levelOptions : [],
      //是否
      ynOptions : [],
      //证书级别
      skillLevelOptions : [],
      //附件类型
      empDocTypeOptions : [],

      // 部门树选项
      deptOptions: undefined,


      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empDepartment : undefined,
        empName:undefined,
        idCard:undefined,
        empState:undefined,
        empEdu:undefined,
        empJob:undefined,
        major : undefined
      },
      // 表单参数
      labelPosition: 'right',
      form : {
        empId : undefined,
        empName : '',
        empSex : '',
        empNo : '',
        idCard : '',
        empEdu : '',
        major : '',
        empDepartment : undefined,
        empJob : undefined,
        empLevel : '',
        empTel : '',
        empEmail : '',
        empAdress : '',
        empFamadress : '',
        empEmecontact : '',
        empEmecontacttel : '',
        empEntrydate : '',
        empState : '',
        empWorkdate : '',
        empSepardate: '',
        textarea : ''
      },
      // 表单校验
      rules: {
        empName: [
          { required: true, message: "员工姓名不能为空", trigger: "blur" }
        ],
        empSex: [
          { required: true, message: "请选择员工性别", trigger: "change" }
        ],
        idCard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '证件号码格式有误！', trigger: 'blur'}
        ],
        empNo: [
          { required: true, message: "工号名称不能为空", trigger: "blur" },
        ],
        empEdu: [
          { required: true, message: "请选择学历", trigger: "change" }
        ],
        empDepartment: [
          { required: true, message: "请选择部门", trigger: "change" }
        ],
        empJob: [
          { required: true, message: "请选择岗位", trigger: "change" }
        ],
        empLevel: [
          { required: true, message: "请选择职级", trigger: "change" }
        ],
        empTel: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        empEntrydate: [
          { required: true, message: "请选择入职日期", trigger: "change" }
        ],
        empState: [
          { required: true, message: "请选择合同状态", trigger: "change" }
        ],
        empEmail: [
          { required: true, message: "请填写邮箱地址", trigger: "blur" },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱格式有误！', trigger: 'blur'}
        ]

      },

      innerEdu:{
        eduForm : {
          eduId :  undefined,
          empId : undefined,
          eduSchool : undefined,
          empEdu : undefined,
          eduBegin : undefined,
          eduGraduation : undefined,
          isdisploma : undefined,
          isdegree : undefined,
          isLearnWeb : undefined
        },
        showInnerEdu : false,
        empEduList : [],
        innerTitle : '',
        eduIds : [],
        one : true,
        many : true,
        empId : undefined,
        showEduUpload : false
      },

      innerSkill:{
        skillForm : {
          skillId :  undefined,
          empId : undefined,
          skillNo : undefined,
          skillName : undefined,
          skillLevel : undefined,
          skillDate : undefined,
          certificationOrg : undefined
        },
        showInnerSkill : false,
        skillList : [],
        innerTitle : '',
        skillIds : [],
        one : true,
        many : true,
        empId : undefined,
        showSkillUpload : false
      },
      innerDoc : {
        loading : true,
        empId : undefined,
        docList : [],
        many : true,
        downloadAll : true,
        docIds : []
      },
      skillUpload : {
        limitNum : 4,
        isSkill: false,
        skillId : '',
        fileList : []
      },
      docView : {
        isImg : true,
        show : false,
        title : '',
        src : undefined
      },

      empDocBind : {
        bindZipList : [],
        open : false,
      }
    };
  },

  mounted: function() {

    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("emp_state").then(response => {
      this.empstateOptions = response.data;
    });
    this.getDicts("emp_edu").then(response => {
      this.empeduOptions = response.data;
    });
    this.getDicts("emp_level").then(response => {
      this.levelOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.ynOptions = response.data;
    });
    this.getDicts("emp_skill_level").then(response => {
      this.skillLevelOptions = response.data;
    });
    this.getDicts("emp_doc_type").then(response => {
      this.empDocTypeOptions = response.data;
    });
    this.getList();
    this.getJobList();
    this.getTreeselect();
  },

  watch: {
    // 根据名称筛选部门树
    'deptPanel.deptName' : function(val) {
      this.$refs.tree.filter(val);
    },
    'form.empState' : function (val) {
      if(val === '3' && this.form.empEntrydate){
        let startDateStr = this.form.empEntrydate
        this.form.empSepardate = this.computeDate(startDateStr, 3);
      }else {
        this.form.empSepardate = '';
      }
    },
    'form.empEntrydate' : function (val) {
      if(val && this.form.empState === '3'){
        this.form.empSepardate = this.computeDate(val, 3);
      }else {
        this.form.empSepardate = '';
      }
    }

  },

  methods: {

    //计算日期，n个月以后的时间
    computeDate(dateStr, n){
      var s = dateStr.split("-");
      var yy = parseInt(s[0]);
      var mm = parseInt(s[1]);
      var dd = parseInt(s[2]);
      var dt = new Date(yy, mm, dd);
      var num = dt.getMonth() + n;
      if(num/12>1){
        yy+=Math.floor(num/12) ;
        mm=num%12;
      }else{
        mm+=n;
      }
      return yy + "-" + mm  + "-" + dd;
    },

    empEntrydateChange(val){
      this.form.empEntrydate = val;
    },
    empSepardateChange(val){
      this.form.empSepardate = val;
    },
    empWorkdateChange(val){
      this.form.empWorkdate = val;
    },
    eduBeginDateChange(val){
      this.innerEdu.eduForm.eduBegin = val;
    },
    eduEndDateChange(val){
      this.innerEdu.eduForm.eduGraduation = val;
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    //点击左侧部门树 -- 单击事件
    handleNodeClick(data) {
      this.queryParams.empDepartment = data.id;
      this.handleQuery();
    },

    //查询员工列表
    getList() {
      this.loading = true;
      listemployee(this.queryParams).then(response => {
        this.empList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    //获取用户教育经历列表
    getEmpEduList(row){
      this.loading = true;
      if(row.empId){
        if(this.innerEdu.innerTitle == ''){
          /*if(!this.empInfoUpload.docType){
            this.empInfoUpload.docType = '2';
          }*/
          this.showEmpEdu = true;
          this.innerEdu.empId = row.empId
          this.innerEdu.eduForm.empId = row.empId
        }
        listEdu(row.empId).then(response => {
          this.innerEdu.empEduList = response.rows;
          this.loading = false;
        });
      }else{
        this.empInfoUpload.docType = undefined;
        this.errorNotify("获取员工信息失败，请稍后重试");
      }
    },

    errorNotify(msg){
      this.$notify({
        title: '错误',
        message: msg,
        duration: 1500,
        type: 'error'
      });
    },

    getEmpSkillList(row){
      this.loading = true;
      if(row.empId){
        if(this.innerSkill.innerTitle == ''){
          /*if(!this.empInfoUpload.docType){
            this.empInfoUpload.docType = '3';
          }*/
          this.showEmpSkill = true;
          this.innerSkill.empId = row.empId
          this.innerSkill.skillForm.empId = row.empId
        }
        listSkill(row.empId).then(response => {
          this.innerSkill.skillList = response.rows;
          this.loading = false;
        });
      }else{
        this.empInfoUpload.docType = undefined;
        this.errorNotify("获取员工信息失败，请稍后重试");
        this.loading = false;
      }
    },

    getEmpDocList(row){
      this.innerDoc.empId = row.empId;
      this.innerDoc.loading = true;
      if(row.empId){
        getDocs(row.empId).then(response => {
          if(response.rows.length === 0 && !this.showEmpDoc){
            this.$notify({
              title: '提示',
              message: '该员工未上传附件！',
              duration: 1500,
              type: 'success'
            });
            return;
          }
          this.showEmpDoc = true;
          this.docTitle = row.empName + "-附件信息"
          this.innerDoc.docList = response.rows;
          this.innerDoc.loading = false;
          if(this.innerDoc.docList.length > 0){
            this.innerDoc.downloadAll = false;
          }
        });
      }else{
        this.errorNotify("获取员工信息失败，请稍后重试");
        this.innerDoc.loading = false;
      }

    },

    //关闭员工技能证书列表弹框
    clearEmpInfo(type){
      if('edu' === type){
        this.innerEdu.empId = undefined;
        this.innerEdu.eduForm.empId = undefined;
      }
      if('skill' === type){
        this.innerSkill.empId = undefined;
        this.innerSkill.skillForm.empId = undefined;
      }
      if('doc' === type){
        this.innerDoc.empId = undefined;
        this.docTitle = '';
        if(this.innerDoc.loading){
          this.innerDoc.loading = false;
        }
      }

      if(this.empInfoUpload.docType){
        this.empInfoUpload.docType = undefined;
      }
      if(this.loading){
        this.loading = false;
      }
    },


    //查询岗位列表
    getJobList() {
      allPost().then(response=> {
          this.jobOptions = response.data;
      });
    },

    //获取部门下拉树的部门数据
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },

    //性别，数据字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.empSex);
    },

    //职级，数据字典翻译
    levelFormat(row, column){
        return this.selectDictLabel(this.levelOptions, row.empLevel);
    },

    //表格，岗位显示，数据字典转义
    jobFormat(row, column, cellValue, index) {
      for(var i=0; i<this.jobOptions.length; i++){
        if(this.jobOptions[i].postId == cellValue){
            return this.jobOptions[i].postName;
        }
      }
    },

    // 状态字典翻译
    empstatusFormat(row, column) {
      return this.selectDictLabel(this.empstateOptions, row.empState);
    },

    // 学历字典翻译
    empeduFormat(row, column) {
      return this.selectDictLabel(this.empeduOptions, row.empEdu);
    },

    showYnLabel(row, column, cellValue){
        return this.selectDictLabel(this.ynOptions, cellValue);
    },

    skillFormat(row, column){
      return this.selectDictLabel(this.skillLevelOptions, row.skillLevel);
    },

    docTypeFormat(row, column){
        return this.selectDictLabel(this.empDocTypeOptions, row.docType);
    },

    docSizeFormat(row, column){
        var docSize = Number(row.docSize);
        if(docSize){
          docSize = (docSize/(1024)).toFixed(2);
        }
        return docSize+='KB';
    },

    uploadTimeFormat(row, column){
      return timeFormat(row);
    },


    //员工录入， 取消按钮
    cancel() {
      this.addOrUpdateEmp = false;
      this.emptyReset();
    },

    //教育经历取消按钮
    cancelEduForm() {
      this.innerEdu.showInnerEdu = false;
      this.emptyResetEduForm();
    },

    //证书信息取消按钮
    cancelSkillForm() {
      this.innerSkill.showInnerSkill = false;
      this.emptyResetSkillForm();
    },
    resetTitle(type){
      if('edu' === type){
        this.innerEdu.innerTitle = '';
      }
      if('skill' === type){
        this.innerSkill.innerTitle = '';
      }
    },
    //关闭教育经历列表
    cancelEmpEdu() {
      this.showEmpEdu = false;
    },
    //关闭技能列表
    cancelEmpSkill(){
      this.showEmpSkill = false;
    },


    // 员工录入表单重置
    reset() {
      if('修改员工信息'===this.title) {
        this.$nextTick(() => {
          this.resetForm("form");
        });
      }else {
        this.emptyReset();
      }
    },
    //员工录入表单清空
    emptyReset(){
      this.form = {
        empId: undefined,
        empName: '',
        empSex: '',
        empNo: '',
        idCard: '',
        empEdu: '',
        empDepartment: undefined,
        empJob: undefined,
        empLevel: '',
        empTel: '',
        empEmail: '',
        empAdress: '',
        empFamadress: '',
        empEmecontact: '',
        empEmecontacttel: '',
        empEntrydate: '',
        empState: '',
        empWorkdate: '',
        textarea: ''
      };
      this.resetForm("form");
    },

    closeAddOrUpdateEmp(){
      this.emptyReset();
    },

    //教育经历表单重置
    resetEduForm(){
      if('修改教育信息' === this.innerEdu.innerTitle){
        this.resetForm("eduForm");
        this.innerEdu.eduForm.empId = this.innerEdu.empId;
      }else{
        this.emptyResetEduForm();
      }
    },
    //教育经历表单清空
    emptyResetEduForm(){
      this.innerEdu.eduForm = {
        eduId :  undefined,
        empId : undefined,
        eduSchool : undefined,
        empEdu : undefined,
        eduBegin : undefined,
        eduGraduation : undefined,
        isdisploma : undefined,
        isdegree : undefined
      }
      this.resetForm("eduForm");
      this.innerEdu.eduForm.empId = this.innerEdu.empId;
    },

    //技能证书表单重置
    resetSkillForm(){
      if('修改技能信息' === this.innerSkill.innerTitle){
        this.resetForm("skillForm");
        this.innerSkill.skillForm.empId = this.innerSkill.empId;
      }else{
        this.emptyResetSkillForm();
      }
    },
    //技能证书表单清空
    emptyResetSkillForm(){
      this.innerSkill.skillForm  =  {
        skillId :  undefined,
        skillNo : undefined,
        skillName : undefined,
        skillLevel : undefined,
        skillDate : undefined,
        certificationOrg : undefined
      };
      this.resetForm("skillForm");
      this.innerSkill.skillForm.empId = this.innerSkill.empId;
    },

    /** 员工列表搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 员工列表搜索表单重置按钮操作 */
    resetQuery() {
      this.queryParams.empDepartment = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //员工表格 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.empId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      if(selection.length == 1){
          this.isDel = selection[0].empState != '2';
      }
    },

    /** 员工 新增按钮操作 */
    handleAdd() {
      this.addOrUpdateEmp = true;
      this.title = "添加员工信息";
    },
    /** 员工 修改按钮操作 */
    handleUpdate(row) {
      /*if(!this.isDel){
        this.errorNotify("该员工已离职，不可被修改。");
        return;
      }*/
      const empId = row.empId || this.ids;
      getEmp(empId).then(response => {
        this.form = response.data;
        this.form.empJob = parseInt(response.data.empJob);
        this.addOrUpdateEmp = true;
        this.title = "修改员工信息";
      });
    },

    deleteEmp(){
      var _this = this;
      if(!_this.isDel){
        _this.errorNotify("该员工已离职，不可再次删除。");
          return;
      }
      _this.$confirm('请确定该员工是否离职！', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
          debugger;
        if(!_this.ids || _this.ids.length == 0){
          _this.errorNotify("获取员工信息失败，请稍后重试。");
          return;
        }
        const empId = _this.ids;
        return delEmp(empId);
      }).then(response => {
        if (response.code === 200) {
          _this.msgSuccess("删除成功");
          _this.getList();
        } else {
          _this.msgError(response.msg);
        }
      }).catch(function() {});
    },


    /** 教育经历录入按钮操作 */
    innerEduFormAdd(){
      this.emptyResetEduForm();
      this.innerEdu.showInnerEdu = true;
      this.innerEdu.innerTitle = '添加教育信息';
    },

    /** 教育经历修改按钮操作 */
    innerEduFormUpdate(){
      this.emptyResetEduForm();
      const eduId = this.innerEdu.eduIds;
      getEdu(eduId).then(response => {
        this.innerEdu.eduForm = response.data;
        this.innerEdu.showInnerEdu = true;
        this.innerEdu.innerTitle = '修改教育信息';
      })
    },
    /** 教育经历删除按钮操作 */
    deleteEduInfo(){
      var _this = this;
      this.$confirm('确认要删除所选教育信息及附件吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        const eduIds = _this.innerEdu.eduIds;
        delEdu(eduIds).then(response =>{
          if (response.code === 200) {
            _this.getEmpEduList(_this.innerEdu.eduForm);
            _this.msgSuccess("删除成功。");
          } else {
            this.msgError("删除失败，请稍后重试。");
          }
        });
      }).catch(()=>{});
    },

    /** 技能信息录入按钮操作 */
    innerSkillFormAdd(){
      this.emptyResetSkillForm();
      this.innerSkill.showInnerSkill = true;
      this.innerSkill.innerTitle = '添加技能信息';
    },

    /** 技能信息修改按钮操作 */
    innerSkillFormUpdate(){
      this.emptyResetSkillForm();
      const skillId = this.innerSkill.skillIds;
      getSkill(skillId).then(response => {
        this.innerSkill.skillForm = response.data;
        this.innerSkill.showInnerSkill = true;
        this.innerSkill.innerTitle = '修改技能信息';
      })
    },
    /** 技能信息删除按钮操作 */
    deleteSkillInfo(){
      var _this = this;
      this.$confirm('确认要删除所选证书信息及附件吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        const skillIds = _this.innerSkill.skillIds;
        delSkill(skillIds).then(response =>{
          if (response.code === 200) {
            _this.getEmpSkillList(_this.innerSkill.skillForm);
            _this.msgSuccess("删除成功。");
          } else {
            this.msgError("删除失败，请稍后重试。");
          }
        });
      }).catch(()=>{});
    },

    /** 员工录入表单 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.empId != undefined) {
            updateEmp(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.emptyReset();
                this.addOrUpdateEmp = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addEmployee(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.emptyReset();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 员工附件上传，下拉框change事件 */
    docTypeChange(value){
      const empInfo = { empId : this.ids }
      if('1'=== value){
        this.empInfoUpload.isEmpInfo = false;
      }else if('2' === value){
        this.getEmpEduList(empInfo);
        this.empInfoUpload.show = false;
        this.empInfoUpload.isEmpInfo = true;
      }else if('3' === value){
        this.getEmpSkillList(empInfo);
        this.empInfoUpload.show = false;
        this.empInfoUpload.isEmpInfo = true;
      }else {
        this.empInfoUpload.isEmpInfo = true;
      }
    },
    empInfoUploadClose(){
      this.$refs.empInfoUpload.clearFiles();
      this.empInfoUpload.isEmpInfo = true;
      this.empInfoUpload.fileList = [];
      this.empInfoUpload.docType = undefined;
    },

    empInfoUploadOnChange(file, fileList){
      if(fileList.length != 0){
        this.empInfoUpload.fileList = fileList;
      }
    },

    empUploadSubmit(fileList, empId, itemId, docType){
      if(!fileList || fileList.length==0){
        this.errorNotify("获取上传附件列表失败，请稍后重试。");
        return;
      }
      if(!empId){
        this.errorNotify("未获取到对应的员工信息，请稍后重试。");
        return;
      }
      if(!itemId){
        this.errorNotify("未获取到附件对应的条目信息，请稍后重试。");
        return;
      }
      if(!docType){
        this.errorNotify("未获取到附件类型，请稍后重试。");
        return;
      }
      var formData = new FormData();
      fileList.forEach(file => {
        formData.append('file', file.raw, file.raw.name);
      });
      formData.append('empId', empId);
      formData.append('itemId', itemId);
      formData.append('docType', docType);

      if('1' === docType){
        this.empInfoUpload.isEmpInfo = true;
      }else if('2' === docType){
        this.eduInfoUpload.isUploading = true;
      }else if('3' === docType){
        this.skillUpload.isSkill = true;
      }

      /*submitUploadDoc(formData).then((response) =>{
        if(response.code === 200){
          this.msgSuccess("附件上传成功");
        }else {
          this.msgError(response.msg);
        }
        if('1' === docType){
          this.empInfoUpload.show = false;
        }else if('2' === docType){
          this.innerEdu.showEduUpload = false;
        }else if('3' === docType){
          this.innerSkill.showSkillUpload = false;
        }
        this.empInfoUpload.docType = undefined;
      }).catch(()=>{
        if('1' === docType){
          this.empInfoUpload.isEmpInfo = false;
        }
        this.msgError("上传失败，请稍后重试！");
      });*/

      axios({
        method: 'post',
        url: process.env.VUE_APP_BASE_API + "/employee/info/upload",
        data: formData,
        headers : { "Content-Type" : "multipart/form-data", "Authorization" : "Bearer " + getToken() }
      }).then(response => {
        if(response.data.code === 200){
          this.msgSuccess("附件上传成功");
        }else {
          this.msgError(response.data.msg);
        }
        if('1' === docType){
          this.empInfoUpload.show = false;
        }else if('2' === docType){
          this.innerEdu.showEduUpload = false;
        }else if('3' === docType){
          this.innerSkill.showSkillUpload = false;
        }
        this.empInfoUpload.docType = undefined;
      }).catch(()=>{
        if('1' === docType){
          this.empInfoUpload.isEmpInfo = false;
        }
        this.msgError("上传文件单个大小不可大于10M，总数不可大于20M，请重新选择文件。");
      });
    },

    /** 下载导入模板 */
    importTemplate() {
      const templateUrl = this.empImport.templateUrl;
      importTemplate(templateUrl).then(response => {
        this.download(response.msg);
      });
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.empImport.isUploading = true;
    },

    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.empImport.isUploading = true;
      this.$refs.empImport.clearFiles();
      if(this.empImport.type === '0'){
        this.getList();
        this.empImport.resultTitle = '基本信息导入结果';
      }else if(this.empImport.type ==='1'){
        this.empImport.resultTitle = '教育经历导入结果';
      }else if(this.empImport.type ==='2'){
        this.empImport.resultTitle = '技能证书导入结果';
      }
      this.$alert(response.msg, this.empImport.resultTitle, { dangerouslyUseHTMLString: true });
      this.empImport.open = false;
    },

    closeEmpImport(){
      this.$refs.empImport.clearFiles();
      this.empImport.updateSupport = false;
      this.empImport.isUploading = true;
      this.empImport.isTemplate = true;
      this.empImport.url = '';
      this.empImport.templateUrl = '';
    },
    // 提交上传文件
    submitEmpImport() {
      this.$refs.empImport.submit();
    },

    exportEmpInfo(){
      /** 导出人员成本列表 */
      var _this = this;
      console.log("==",_this.ids);
      const queryParams = this.queryParams;
      // queryParams.dept_id=_this.ids;
      if(_this.ids.length == 0){
        this.$confirm("是否确认导出员工信息列表数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportEmpInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }else {
        this.$confirm("是否确认导出选中员工信息列表数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportEmpInfoId(_this.ids);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }

    },


    //教育信息添加，表单
    addOrUpdateEdu: function (){
      this.$refs["eduForm"].validate(valid => {
        if (valid) {
          if (this.innerEdu.eduForm.eduId != undefined) {
            updateEdu(this.innerEdu.eduForm).then(response => {
                if(response.code === 200){
                  this.msgSuccess("修改成功");
                  this.getEmpEduList(this.innerEdu.eduForm);
                  this.cancelEduForm();
                }else {
                    this.msgError(response.msg);
                }
            });
          } else {
            addEdu(this.innerEdu.eduForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.getEmpEduList(this.innerEdu.eduForm);
                this.emptyResetEduForm();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },

    eduInfoUploadOnChange(file, fileList){
      if(fileList.length != 0){
        this.eduInfoUpload.fileList = fileList;
      }
    },

    //证书信息添加，表单
    addOrUpdateSkill: function (){
      this.$refs["skillForm"].validate(valid => {
        if (valid) {
          if (this.innerSkill.skillForm.skillId != undefined) {
            updateSkill(this.innerSkill.skillForm).then(response => {
              if(response.code === 200){
                this.msgSuccess("修改成功");
                this.getEmpSkillList(this.innerSkill.skillForm);
                this.cancelSkillForm();
              }else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSkill(this.innerSkill.skillForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.getEmpSkillList(this.innerSkill.skillForm);
                this.emptyResetSkillForm();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },

    /** 教育经历表格，多选 */
    handleSelectionEdu(selection) {
      this.innerEdu.eduIds = selection.map(item => item.eduId);
      this.innerEdu.one = selection.length != 1;
      this.innerEdu.many = !selection.length;
    },

    /** 技能证书表格，多选 */
    handleSelectionSkill(selection) {
      this.innerSkill.skillIds = selection.map(item => item.skillId);
      this.innerSkill.one = selection.length != 1;
      this.innerSkill.many = !selection.length;
    },

    handleSelectionDoc(selection){
      this.innerDoc.docIds = selection.map(item => item.docId);
      this.innerDoc.many = !selection.length;
    },

    /** 教育经历附件上传 */
    showEduUpload(row){
      this.innerEdu.showEduUpload = true;
      this.eduInfoUpload.eduId = row.eduId;
      if(!this.empInfoUpload.docType){
        this.empInfoUpload.docType = '2';
      }
    },
    /** 技能证书附件上传 */
    showSkillUpload(row){
      this.innerSkill.showSkillUpload = true;
      this.skillUpload.skillId = row.skillId;
      if(!this.empInfoUpload.docType){
        this.empInfoUpload.docType = '3';
      }
    },

    /** 移除文件上传列表中的文件 */
    /*removeFile(file, fileList){
      console.log(file);
      console.log(fileList);
    },*/
    /** 上传成功时调用 */
    /*uploadSuccess(response, file, fileList){
      if(response.code === 200){
        this.$message({
          showClose: true,
          message: response.msg,
          type: 'success'
        });
      }else{
        this.$message({
          showClose: true,
          message: response.msg,
          type: 'error'
        });
      }
      this.innerEdu.showEduUpload = false;
      this.$refs.eduUpload.clearFiles();
      fileList = [];
      this.eduInfoUpload.isUploading = false;
    },*/
    /** 附件上传，提交 */
    /*submitEduUpload(){
      this.$refs.eduUpload.submit();
    },*/
    /** 上传失败时调用 */
    /*uploadError(response, file, fileList){
      this.$message({
        showClose: true,
        message: "附件上传失败，请稍后重试！",
        type: 'error'
      });
      this.innerEdu.showEduUpload = false;
      this.$refs.eduInfoUpload.clearFiles();
      fileList = [];
      this.eduInfoUpload.isUploading = false;
    },
    uploadProgress(event, file, fileList) {
      this.eduInfoUpload.isUploading = true;
    },*/
    uploadExceedMsg(limit){
      this.$message({
        showClose: true,
        message: "上传文件数不可大于"+ limit +"个!",
        type: 'error'
      });
    },
    eduUploadExceed(files, fileList){
      this.uploadExceedMsg(this.eduInfoUpload.limitNum);
      this.eduInfoUpload.isUploading = false;
    },
    skillUploadExceed(files, fileList){
      this.uploadExceedMsg(this.skillUpload.limitNum);
      this.skillUpload.isSkill = false;
    },
    empInfoUploadExceed(files, fileList){
      this.uploadExceedMsg(this.empInfoUpload.limitNum);
      this.empInfoUpload.isEmpInfo = false;
    },

    cancelUpload(){
      this.$refs.eduUpload.clearFiles();
      this.eduInfoUpload.isUploading = false;
      this.eduInfoUpload.eduId = undefined;
      this.eduInfoUpload.fileList = [];
    },
    cancelSkillUpload(){
      this.$refs.skillUpload.clearFiles();
      this.skillUpload.isSkill = false;
      this.skillUpload.skillId = undefined;
      this.skillUpload.fileList = [];
    },
    skillUploadOnChange(file, fileList){
      if(fileList.length != 0){
        this.skillUpload.fileList = fileList;
      }
    },
    downLoadDoc(){
      if(this.innerDoc.empId){
        downLoadZip('/employee/info/downLoad/' + this.innerDoc.empId);
      }else{
        this.errorNotify("获取员工信息失败，请稍后重试");
      }
    },
    deleteEmpDocs(){
      var _this = this;
      this.$confirm('确认要删除所选附件吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        deleteDocs(_this.innerDoc.docIds).then(response =>{
          if (response.code === 200) {
            _this.getEmpDocList({"empId": _this.innerDoc.empId});
            _this.msgSuccess("删除成功。");
          } else {
            this.msgError("删除失败，请稍后重试。");
          }
        });
      }).catch(()=>{});
    },

    openDocView(row){
      var _this = this;
      var src = process.env.VUE_APP_BASE_API + row.docPath;
      var type = src.substring(src.lastIndexOf('.')+1);
      var imgTypes = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'];
      //判断是否为图片
      if(imgTypes.indexOf(type) !== -1){
        _this.docView.isImg = true;
      } else {
        _this.docView.isImg = false;
      }
      _this.docView.show = true;
      _this.docView.title = row.docName;

      var xhr = new XMLHttpRequest();
      xhr.open('GET', src);
      xhr.responseType = 'blob';
      xhr.setRequestHeader('Authorization', 'Bearer ' + getToken());
      xhr.onreadystatechange = e =>{
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          var blob = xhr.response;
          console.log(blob);

          var data_url = URL.createObjectURL(blob);
          if(_this.docView.isImg){
            document.querySelector('#img').src = data_url;
          }else{
            document.querySelector('#view').src = data_url;
          }
        } /*else {
            console.error(e);
          }*/
      };
      xhr.send();

      if(type !='pdf' && _this.docView.isImg == false){
        _this.docView.show = false;
      }


    },

    closeDocView(){
      this.docView.title = '';
      this.docView.src = undefined;
      document.querySelector('#img').src = '';
      document.querySelector('#view').src = '';
    },

    selectImportType(value){
      if(value){
        this.empImport.isUploading = false;
        this.empImport.isTemplate = false;
        if(value === '0'){
          this.empImport.url = process.env.VUE_APP_BASE_API + "/employee/info/import";
          this.empImport.templateUrl = '/employee/info/importTemplate';
        }else if(value === '1'){
          this.empImport.url = process.env.VUE_APP_BASE_API + "/education/info/import";
          this.empImport.templateUrl = '/education/info/importTemplate';
        }else if(value === '2'){
          this.empImport.url = process.env.VUE_APP_BASE_API + "/empSkill/info/import";
          this.empImport.templateUrl = '/empSkill/info/importTemplate';
        }
      }else{
        this.empImport.isUploading = true;
        this.empImport.isTemplate = true;
        this.empImport.url = '';
        this.empImport.templateUrl = '';
      }
    },

    bindZips(){
      bindZipList().then(response => {
        this.empDocBind.bindZipList = response.data;
      });
    }


  }
};
</script>
<style>
  .el-dialog__body {
    padding: 10px 20px 20px 20px;
  }
  .el-dialog__footer {
    padding: 0px 20px 20px 20px;
  }
</style>
