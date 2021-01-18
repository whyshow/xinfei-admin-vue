<template>
  <div class="coen">
    <!-- 面包屑-->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>动态管理</el-breadcrumb-item>
        <el-breadcrumb-item>动态列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box-card">
      <el-card>
        <el-button @click="AddDynamic" size="small" type="primary" icon="el-icon-circle-plus">添加动态</el-button>
        <el-tooltip effect="dark" content="暂未开发" placement="top-start">
          <el-button size="small" type="primary" icon="el-icon-document-add">文档导入动态</el-button>
        </el-tooltip>
        <el-button size="small" type="primary" icon="el-icon-search" style="float: right" disabled>搜索</el-button>
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
                prop="Article_title"
                label="动态标题"
                :show-overflow-tooltip="true"
                width="380">
            </el-table-column>
            <el-table-column
                prop="Article_category"
                label="动态标签"
                width="140">
            </el-table-column>
            <el-table-column
                prop="Article_date"
                label="添加时间"
                width="140">
            </el-table-column>
            <el-table-column
                label="显示/隐藏"
                width="100">
               <template slot-scope="scope">
                <template v-if="scope.row.Article_display === '1'">
                  显示
                </template>
                <template v-else>
                  隐藏
                </template>
              </template>
            </el-table-column>
            <el-table-column
                prop="Article_hot"
                width="150"
                label="访问量">
            </el-table-column>
            <el-table-column
                prop="Article_user"
                width="160"
                label="作者">
            </el-table-column>
            <el-table-column
                label="操作"
                width="220">
              <template slot-scope="scope">
                <el-button
                    icon="el-icon-edit"
                    size="mini"
                    type="primary"
                    @click="Edit(scope.$index)">编辑
                </el-button>
                <el-popover
                    placement="top"
                    :ref="`popover-${scope.$index}`"
                    width="160">
                  <p>要删除这条动态新闻吗？</p>
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
    <div style="text-align: center;margin-top: 1%">
      <span style="font-size: 12px">服务端系统响应时间：{{time}}</span>
    </div>
    <el-dialog
        title="编辑动态"
        top="2vh"
        :visible.sync="AlterDialogVisible"
        width="80%"
        center>
      <!-- 通知和接收子路由信息-->
      <AlterDynamic v-bind:dynamic_info="AlterData" @isalterdialogvisible="AlterResult($event)"></AlterDynamic>
    </el-dialog>
    <el-dialog
        title="添加动态"
        top="2vh"
        :visible.sync="AddDialogVisible"
        width="80%"
        center>
      <AddDynamic @isadddialogvisible="AddSucceed($event)"></AddDynamic>
    </el-dialog>

  </div>
</template>

<script>
import AddDynamic from "@/components/Dynamic/AddDynamic";
import {Message} from "element-ui";
import AlterDynamic from "@/components/Dynamic/AlterDynamic";

export default {
  name: "DynamicList",
  components: {AlterDynamic, AddDynamic},
  data(){
    return{
      AlterData:"",
      tableData: [],
      isDisplay:"",
      time:0, // 服务器后端从接收到请求到结束请求共花费的时间
      total:0, // 总的数据条目数，用来处理分页的
      pagesize:7,
      currentPage:1,
      AddDialogVisible:false,
      AlterDialogVisible:false
    }
  },
  created() {
    this.RequestData(1)
  },
  methods:{
    // 请求动态列表
    async RequestData(val) {
      if (val !== 0){
        this.currentPage = val
      }
      const data = await this.$http.get("admin/article/home?p="+this.currentPage+"&num="+this.pagesize)
      if (data.data.code == 1) {
        this.$notify({title: '加载成功', message: '第'+this.currentPage+'页动态列表加载成功', position: 'bottom-right', duration:2000, type: 'success'});
        this.tableData = data.data.result
        this.total = data.data.total
        this.time = data.data.time
      } else {
      }
    },
    //修改动态弹窗
    Edit(index){
      this.AlterDialogVisible = true
      this.AlterData = this.tableData[index].Article_id
    },
    //删除动态
    Delete(scope) {
      this.$http.post('admin/article/delete', {
        Article_id: scope.row.Article_id
      }).then(function (response) {
        if (response.data.code !== 0){
          // 重新加载信息
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
    AddDynamic(){
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
    AlterResult(b){
      this.AlterDialogVisible = false
      if (b.isup){
        this.RequestData(0)
      }
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
</style>