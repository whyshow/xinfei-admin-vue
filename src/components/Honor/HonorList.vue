<template>
  <div class="coen">
    <!-- 面包屑-->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>成果管理</el-breadcrumb-item>
        <el-breadcrumb-item>成果列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box-card">
      <el-card>
        <el-button @click="AddHonor" size="small" type="primary" icon="el-icon-circle-plus">添加成果</el-button>
        <el-select v-model="options.message" size="small" style="left: 50%" placeholder="请选择" @change="Hchangeitem">
          <el-option
              v-for="item in options"
              :key="item.classify"
              :label="item.classify"
              :value="item.classify">
          </el-option>
        </el-select>
        <el-button size="small" type="primary" icon="el-icon-search" style="float: right;margin-left: 5px" disabled>搜索</el-button>
        <el-input
            placeholder="请输入内容"
            style="width: 20%;float: right"
            size="small">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="menber-table">
          <el-table
              :data="tableData"
              :header-cell-style="{textAlign: 'center',backgroundColor:'#fafafa'}"
              :cell-style="{ textAlign: 'center' }"
              stripe
              resizable
              border
              header-align="center"
              style="width: 100%">
            <el-table-column
                prop="Honor_classify"
                label="成果类别"
                :show-overflow-tooltip="true"
                width="240">
            </el-table-column>
            <el-table-column
                prop="Honor_year"
                label="成果图像"
                width="350">
              <template slot-scope="scope">
                <el-image
                    style="width: 100px; height: 100px"
                    :src="tableData[scope.$index].Honor_url"
                    :preview-src-list="srcList">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
                prop="Honor_year"
                label="获得年度"
                width="220">
            </el-table-column>
            <el-table-column
                prop="Honor_describe"
                label="成果介绍"
                width="240">
            </el-table-column>
            <el-table-column
                label="操作"
                width="240">
              <template slot-scope="scope">
                <el-popover
                    placement="top"
                    :ref="`popover-${scope.$index}`"
                    width="160">
                  <p>要删除这个成果吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()" >取消</el-button>
                    <el-button type="primary" size="mini" @click=" Delete(scope)">确定</el-button>
                  </div>
                  <el-button
                      icon="el-icon-delete"
                      size="mini"
                      style="margin-left: 3%"
                      slot="reference"
                      type="danger">删除
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align: center;margin-top: 1%">
          <el-pagination
              background
              @current-change="RequestData"
              layout="prev, pager, next"
              :page-size="pagesize"
              :total="total">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <el-dialog
        title="添加成果"
        top="2vh"
        :visible.sync="AddDialogVisible"
        width="80%"
        center>
      <AddHonor @isadddialogvisible="AddSucceed($event)"></AddHonor>
    </el-dialog>
  </div>
</template>

<script>
import AddHonor from "@/components/Honor/AddHonor";
import {Message} from "element-ui";
export default {
  name: "HonorList",
  components: {AddHonor},
  data(){
    return{
      AddDialogVisible:false,
      pagesize:7,
      cl:"",
      options:[],
      tableData:[],
      currentPage:1,
      srcList:[],
      total:0
    }
  },
  created() {
    this.RequestData(1)
    this.GetClassify()
  },
  methods:{
    // 请求动态列表
    async RequestData(val) {
      if (val !== 0){
        this.currentPage = val
      }
      var url
      if (this.cl === ""){
        url = "admin/honor/home?p="+this.currentPage+"&num="+this.pagesize
      }else {
        url = "admin/honor/cl?p="+this.currentPage+"&n="+this.pagesize+"&c="+this.cl
      }
      const data = await this.$http.get(url)
      if (data.data.code === 1) {
        this.$notify({
          title: '加载成功',
          message: '第'+this.currentPage+'页列表加载成功',
          position: 'bottom-right',
          duration:2000,
          type: 'success'
        });
        this.tableData = data.data.result
        for(var i =0;i<data.data.result.length;i++){
          this.srcList.push(data.data.result[i].Honor_url);
        }
        this.total = data.data.total
        //this.time = data.data.time
      } else {
        this.tableData = []
        this.$notify({
          title: '提示',
          message: data.data.message,
          position: 'bottom-right',
          duration:2000,
          type: 'warning'
        });
      }
    },
    // 获取分类列表
    async GetClassify() {
      const rest = await this.$http.get("api/ryfl")
      if (rest.data.code === 1) {
        this.options = rest.data.result.array
      } else {

      }
    },
    //删除成果
    Delete(scope) {
      this.$http.post('admin/honor/delete', {
        Honor_id: scope.row.Honor_id
      }).then(function (response) {
        if (response.data.code !== 0){
          Message({message: response.data.message, center: true, type: 'success', duration: 2000})
        }else {
          Message({message: response.data.message, center: true, type: 'error', duration: 2000})
        }
      }).catch(function (error) {
        Message({message: error, center: true, type: 'error', duration: 2000})
      });
      scope._self.$refs[`popover-${scope.$index}`].doClose()
      this.RequestData(0)
    },
    //打开添加成果的弹出框
    AddHonor(){
      this.AddDialogVisible = true
    },
    // 添加动态后子组件通知父组件的信息
    AddSucceed(b){
      // 关闭弹窗
      this.AddDialogVisible= b.isopen
      // 更新信息
      if (b.isup){
        this.RequestData(0)
      }
    },
    // 根据分类刷新数据
    Hchangeitem(v){
      this.cl = v
      this.RequestData(0)
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.breadcrumb {
  background-color: white;
  padding: 5px;
  height: 30px;
}

.el-breadcrumb {
  line-height: 30px;
}
.menber-table{
  margin-top: 1%;
}
.el-card {
  margin-left: 10px;
  margin-right: 10px;
  height: 100%;
  margin-top: 1%;
}
.box-card{
  height: 100%;
}
.el-table td, .el-table th {
  text-align: center;
}
.coen{
  padding-bottom: 3%;
}
</style>