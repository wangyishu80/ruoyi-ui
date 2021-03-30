<!--<template>
  <div>
    <svg-icon  icon-class="bell" @click="goto" :count="msgTotal"/>
  </div>
</template>-->
<template>
  <div>
    <el-badge  slot="reference"  v-if="this.total>0" :value="this.total" class>
      <div class="alarm">
        <svg-icon  icon-class="bell" @click="goto" />
      </div>
    </el-badge>
    <el-badge  slot="reference"  v-else class>
      <div class="alarm">
        <svg-icon  icon-class="bell" @click="goto" />
      </div>
    </el-badge>
  </div>
</template>
<script>
  import { getLevelChangeInfo} from "@/api/project/info";
  export default {
    name: 'Message',
    data() {
      return {
        loading: true,
        // 定时任务表格数据
        jobList: [],
        // 总条数
        total: 0
      }
    },
    created() {
      this.getList();
    },
    watch: {
      jobList() {
        this.timer()
      },
      destroyed() {
        clearInterval(this.timer)
      }
    },
    methods: {
      // 定时器
      timer() {
        return setTimeout(()=>{
          this.getList()
        },1800000)
      },
      goto() {
        this.$router.push('/levelchangeinfo/type/index');
      },
      /** 查询变更信息列表 */
      getList() {
        this.loading = true;
        getLevelChangeInfo().then(response => {
          this.jobList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .bell-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }
  </style>
<style >
  .alarm {
    /*position: absolute;*/
    color: white;
    font-size: 26px;
    /*background-color: red;*/
    /*height: 24px;改前*/
   /* min-height: 24px;*//*改后新增的代码*/
    /*min-width:24px;*//*改后新增的代码*/
    line-height: 10px;
    right:-12%;
    top: -4px;
    text-align: center;
    -webkit-border-radius: 20px;
    border-radius: 12px;
    padding:-4px;
  }
  .item {
    margin-top: 6px;
    margin-right: 12px;
  }
</style>
