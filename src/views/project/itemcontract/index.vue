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

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" prop="contract_id"/>
      <el-table-column label="合同名称" align="center" prop="contract_name" />
      <el-table-column label="合同编号" align="center" prop="contract_num" />
      <el-table-column label="开始日期" align="center" prop="start_date" />
      <el-table-column label="结束日期" align="center" prop="end_date" />
      <!--<el-table-column label="合同阶段" align="center" prop="stage" :formatter="phaseFormat"/>-->
      <el-table-column label="创建时间" align="center" prop="update_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.update_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sell"
            @click="showContractUpload(scope.row)"
          >上传附件</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="getContractDocList(scope.row)"
          >附件下载</el-button>
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
    <el-dialog :title="title" :visible.sync="contractopen" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="height: 180px">
        <el-col :span="11">
          <el-form-item label="合同名称" prop="contract_name">
            <el-input v-model="form.contract_name"placeholder="请输入合同名称" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="合同编号" prop="contract_num">
            <el-input v-model="form.contract_num "placeholder="请输入合同编号" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="合同开始日期" prop="start_date">
            <el-date-picker
              v-model="form.start_date"
              :picker-options="start_date"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="合同结束日期" prop="end_date">
            <el-date-picker
              v-model="form.end_date"
              :picker-options="end_date"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <!--<el-col :span="11">
          <el-form-item label="合同阶段" prop="stage">
            <el-select v-model="form.stage" placeholder="请选择">
              <el-option
                v-for="dict in phaseOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :span="22">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入合同备注" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- begin ---- 附件上传 -->
    <el-dialog title="上传项目合同附件" :visible.sync="innerContract.showContractUpload" width="400px" :close-on-click-modal="close"
               style="margin-top: 10vh; !important" append-to-body @close="cancelUpload">

      <el-upload
        ref="ContractUpload"
        :limit="ContractInfoUpload.limitNum"
        accept="*"
        :multiple = "true"
        :on-change="ContractInfoUploadOnChange"
        action="#"
        :disabled="ContractInfoUpload.isUploading"
        :auto-upload="false"
        :on-exceed="ContractUploadExceed"
        :file-list="ContractInfoUpload.fileList"
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
                   @click="empUploadSubmit(ContractInfoUpload.fileList, ContractInfoUpload.contract_id)"
        >立即上传</el-button>
        <el-button size="small"  @click="innerContract.showContractUpload=false">取消</el-button>
      </div>
    </el-dialog>

    <!--------------------------- 附件信息 ------------------------------->
    <el-dialog :title="docTitle" :visible.sync="showContractDoc" width="850px"
               :close-on-click-modal="close" :close-on-press-escape="close"
               @close="clearContractInfo('doc')" >
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
                     @click="deleteContractDocs" :disabled = "innerDoc.many"
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
        <el-button @click="showContractDoc = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import axios from 'axios';
  import { getToken } from "@/utils/auth";
  import { listDataContract, getData, delData, addData, updateData, exportData,getDocs,deleteDocs } from "@/api/project/itemcontract";
  import { downLoadZip } from "@/utils/zipdownload";
  export default {
    name: "Contract",
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
        // 合同数据
        dataList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        contractopen: false,
        //是否显示附件
        showContractDoc : false,
        // 级别数据字典
        emplevelOptions: [],
        //合同阶段
        phaseOptions: [],
        //附件类型
        contractDocTypeOptions : [],
        docTitle : '',
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dictName: undefined,
          dictType: undefined,
          status: undefined
        },
        innerContract:{
          ContractForm : {
            contract_id :  undefined,
            item_id : undefined,
            empContract : undefined,
            ContractBegin : undefined,
            ContractGraduation : undefined,
            isdisploma : undefined,
            isdegree : undefined
          },
          showInnerContract : false,
          empContractList : [],
          innerTitle : '',
          ContractIds : [],
          one : true,
          many : true,
          item_id : undefined,
          showContractUpload : false
        },
        ContractUpload : {
          show : false,
          docType : undefined,
          isEmpInfo : true,
          fileList : [],
          empId : undefined,
          itemId : undefined,//项目ID
        },
        ContractInfoUpload: {
          limitNum : 4,

          isUploading: false,

          contract_id : '',
          // 设置上传的请求头部
          //headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          //url: process.env.VUE_APP_BASE_API + "/employee/info/upload",

          fileList : []
        },
        empInfoUpload : {
          show : false,
          limitNum : 6,
          docType : undefined,
          isEmpInfo : true,
          fileList : [],
          empId : undefined,
          itemId : undefined,
        },
        innerDoc : {
          loading : true,
          contract_id : undefined,
          docList : [],
          many : true,
          downloadAll : true,
          docIds : []
        },
        docView : {
          isImg : true,
          show : false,
          title : '',
          src : undefined
        },
        // 表单参数
        form: {
          start_date: '',
          end_date: ''
        },
        // 开始日期小于结束日期
        start_date: {
          disabledDate: time => {
            let endDate = this.form.end_date;
            let beginDateVal = new Date(endDate);
            if (endDate) {
              return time.getTime() > beginDateVal;
            }
          }
        },
        // 结束日期大于开始日期
        end_date: {
          disabledDate: time => {
            let startDate = this.form.start_date;
            let beginDateVal = new Date(startDate);
            if (startDate) {
              return time.getTime() < beginDateVal - 3600 * 1000 * 24 * 1;
            }
          }
        },
        // 表单校验
        rules: {
          contract_name: [
            { required: true, message: "合同名称不能为空", trigger: "blur" }
          ],
          contract_num: [
            { required: true, message: "合同编号不能为空", trigger: "blur" }
          ],
          start_date: [
            { required: true, message: "开始日期不能为空", trigger: "blur" }
          ],
          end_date: [
            { required: true, message: "结束日期不能为空", trigger: "blur" }
          ],
          stage: [
            { required: true, message: "合同阶段不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      const item_id = this.$route.params && this.$route.params.item_id;
      this.getList(item_id);
      // this.getType(dictId);
      // this.getTypeList();
      this.getDicts("contract_phase").then(response => {
        this.phaseOptions = response.data;
      });
      this.getDicts("contract_doc_type").then(response => {
        this.contractDocTypeOptions = response.data;
      });
    },
    methods: {
      /** 查询合同信息 */
      getList(item_id) {
        this.loading = true;
        listDataContract(item_id).then(response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 合同阶段字典翻译
      phaseFormat(row, column) {
        return this.selectDictLabel(this.phaseOptions, row.stage);
      },
      // 取消按钮
      cancel() {
        this.contractopen = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          contract_id: undefined,
          item_id: undefined,
          contract_name: undefined,
          contract_num: undefined,
          start_date: undefined,
          end_date: undefined,
          stage: undefined,
          remark: undefined
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
        this.contractopen = true;
        this.title = "添加合同信息";
        this.form.item_id = this.$route.params.item_id;
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.contract_id);
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const contract_id = row.contract_id || this.ids;
        getData(contract_id).then(response => {
          this.form = response.data;
          this.contractopen = true;
          this.title = "修改合同信息";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.contract_id != undefined) {
              updateData(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.contractopen = false;
                  this.getList(this.form.item_id);
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addData(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.contractopen = false;
                  this.getList(this.form.item_id);
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const contract_id = row.contract_id || this.ids;
        const item_id = this.$route.params && this.$route.params.item_id;
        getDocs(contract_id).then(response => {
          if (response.total === 0){
          this.$confirm('是否确认删除合同信息为"' + contract_id + '"的数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function () {
            return delData(contract_id);
          }).then(() => {
            this.getList(item_id);
            this.msgSuccess("删除成功");
          }).catch(function () {
          });
      }else{
            this.msgSuccess("请先删除附件信息！");
      }
        });
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
      },
      /** 项目合同附件上传 */
      showContractUpload(row){
        this.innerContract.showContractUpload = true;
        this.ContractInfoUpload.contract_id = row.contract_id;
      },
      ContractInfoUploadOnChange(file, fileList){
        if(fileList.length != 0){
          this.ContractInfoUpload.fileList = fileList;
        }
      },
      ContractUploadExceed(files, fileList){
        this.uploadExceedMsg(this.ContractInfoUpload.limitNum);
        this.ContractInfoUpload.isUploading = false;
      },
      cancelUpload(){
        this.$refs.ContractUpload.clearFiles();
        this.ContractInfoUpload.isUploading = false;
        this.ContractInfoUpload.contract_id = undefined;
        this.ContractInfoUpload.fileList = [];
      },
      docSizeFormat(row, column){
        var docSize = Number(row.docSize);
        if(docSize){
          docSize = (docSize/(1024)).toFixed(2);
        }
        return docSize+='KB';
      },
      docTypeFormat(row, column){
        return this.selectDictLabel(this.contractDocTypeOptions, row.docType);
      },
      uploadTimeFormat(row, column){
        var date = new Date(row.updateTime);
        var year = date.getFullYear();
        var month =(date.getMonth() + 1).toString();
        var day = (date.getDate()).toString();
        var h = date.getHours().toString();
        var m = date.getMinutes().toString();
        var s = date.getSeconds().toString();
        if (month.length == 1) {
          month = "0" + month;
        }
        if (day.length == 1) {
          day = "0" + day;
        }
        if (h.length == 1) {
          h = "0" + day;
        }
        if (m.length == 1) {
          m = "0" + day;
        }
        if (s.length == 1) {
          s = "0" + day;
        }
        var dateTime = year + "-" + month + "-" + day + " "+ h + ":" + m +":"+ s;
        return dateTime.trim();
      },
      empUploadSubmit(fileList, contract_id){
        if(!fileList || fileList.length==0){
          this.errorNotify("获取上传附件列表失败，请稍后重试。");
          return;
        }
        /*if(!item_id){
          this.errorNotify("未获取到对应的项目信息，请稍后重试。");
          return;
        }*/
        if(!contract_id){
          this.errorNotify("未获取到附件对应的合同信息，请稍后重试。");
          return;
        }
        /*if(!docType){
          this.errorNotify("未获取到附件类型，请稍后重试。");
          return;
        }*/
        var formData = new FormData();
        fileList.forEach(file => {
          formData.append('file', file.raw, file.raw.name);
        });
        formData.append('empId', null);
        formData.append('itemId', contract_id);
        formData.append('docType', "10");//项目合同

        /*if('1' === docType){
          this.ContractUpload.isEmpInfo = true;
        }else if('2' === docType){
          this.ContractInfoUpload.isUploading = true;
        }else if('3' === docType){
          this.skillUpload.isSkill = true;
        }*/

        axios({
          method: 'post',
          url: process.env.VUE_APP_BASE_API + "/project/info/upload",
          data: formData,
          headers : { "Content-Type" : "multipart/form-data", "Authorization" : "Bearer " + getToken() }
        }).then(response => {
          if(response.data.code === 200){
            this.msgSuccess("附件上传成功");
          }else {
            this.msgError(response.data.msg);
          }

         /* if('1' === docType){
            this.ContractUpload.show = false;
          }else if('2' === docType){
            this.innerContract.showContractUpload = false;
          }else if('3' === docType){
            this.innerSkill.showSkillUpload = false;
          }
          this.ContractUpload.docType = undefined;*/
        });
      },
      errorNotify(msg){
        this.$notify({
          title: '错误',
          message: msg,
          duration: 1500,
          type: 'error'
        });
      },
      getContractDocList(row){
        this.showContractDoc = true;
        this.docTitle = row.contract_name + "-附件信息"
        this.innerDoc.contract_id = row.contract_id;
        this.innerDoc.loading = true;
        if(row.contract_id){
          getDocs(row.contract_id).then(response => {
            this.innerDoc.docList = response.rows;
            this.innerDoc.loading = false;
            if(this.innerDoc.docList.length > 0){
              this.innerDoc.downloadAll = false;
            }
          });
        }else{
          this.errorNotify("获取合同信息失败，请稍后重试");
          this.innerDoc.loading = false;
        }

      },
      //关闭合同列表弹框
      clearContractInfo(type){
        /*if('edu' === type){
          this.innerEdu.empId = undefined;
          this.innerEdu.eduForm.empId = undefined;
        }
        if('skill' === type){
          this.innerSkill.empId = undefined;
          this.innerSkill.skillForm.empId = undefined;
        }*/
        if('doc' === type){
          this.innerDoc.contract_id = undefined;
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
      downLoadDoc(){
        if(this.innerDoc.contract_id){
          downLoadZip('/project/info/downLoad/' + this.innerDoc.contract_id);
        }else{
          this.errorNotify("获取合同信息失败，请稍后重试");
        }
      },
      deleteContractDocs(){
        var _this = this;
        this.$confirm('确认要删除所选附件吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          alert(_this.innerDoc.docIds);
          deleteDocs(_this.innerDoc.docIds).then(response =>{
            if (response.code === 200) {
              _this.getContractDocList({"contract_id": _this.innerDoc.contract_id});
              _this.msgSuccess("删除成功。");
            } else {
              this.msgError("删除失败，请稍后重试。");
            }
          });
        }).catch(()=>{});
      },
      handleSelectionDoc(selection){
        this.innerDoc.docIds = selection.map(item => item.docId);
        this.innerDoc.many = !selection.length;
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
            var data_url = URL.createObjectURL(xhr.response);
            if(_this.docView.isImg){
              document.querySelector('#img').src = data_url;
            }else{
              document.querySelector('#view').src = data_url;
            }
          } else {
            console.error(e);
          }
        };
        xhr.send();

        if(type !='pdf' && _this.docView.isImg == false){
          _this.docView.show = false;
        }
      },
      closeDocView(){
        this.docView.title = '';
        this.docView.src = undefined;
        document.querySelector('#img').src = undefined;
        document.querySelector('#view').src = undefined;
      }
    }
  };
</script>
