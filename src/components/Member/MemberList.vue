<template>
  <div class="coen">
    <!-- 面包屑-->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>成员管理</el-breadcrumb-item>
        <el-breadcrumb-item>成员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="box-card">
    <el-card>
      <el-button @click="AddMember" size="small" type="primary" icon="el-icon-circle-plus">添加成员</el-button>
      <el-tooltip effect="dark" content="暂未开发" placement="top-start">
        <el-button size="small" type="primary" icon="el-icon-document-add">批量添加成员</el-button>
      </el-tooltip>
      <el-button size="small" type="primary" icon="el-icon-search" style="float: right" disabled>搜索</el-button>
      <el-input
          placeholder="请输入内容"
          style="width: 20%;float: right"
          size="small">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <!-- 表格-->
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
              prop="User_account"
              label="学号/账号"
              width="140">
          </el-table-column>
          <el-table-column
              prop="User_name"
              label="姓名"
              width="140">
          </el-table-column>
          <el-table-column
              prop="User_qq"
              label="QQ"
              width="140">
          </el-table-column>
          <el-table-column
              prop="User_phone"
              label="手机"
              width="140">
          </el-table-column>
          <el-table-column
              prop="User_class"
              width="140"
              label="班级">
          </el-table-column>
          <el-table-column
              prop="User_motto"
              label="座右铭"
              :show-overflow-tooltip="true"
              width="240">
          </el-table-column>
          <el-table-column
              prop="User_direction"
              label="专业方向"
              width="140">
          </el-table-column>
          <el-table-column
              label="操作"
              width="200">
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
                <p>确定要删除这条信息吗？</p>
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
        title="编辑成员信息"
        :visible.sync="AlterDialogVisible"
        width="50%"
        center>
      <!-- 通知和接收子路由信息-->
      <AlterMember v-bind:member_info="AlterData" @isalterdialogvisible="AlterDialogVisible= $event"></AlterMember>
    </el-dialog>

    <el-dialog
        title="添加成员"
        :visible.sync="AddDialogVisible"
        width="50%"
        center>
      <AddMember @isadddialogvisible="AddSucceed($event)"></AddMember>
    </el-dialog>

  </div>
</template>

<script>
import AlterMember from "@/components/Member/AlterMember";
import AddMember from "@/components/Member/AddMember";
import {Message} from "element-ui";
export default {
  name: "MemberList",
  components: {AddMember, AlterMember},
  created() {
    this.RequestData(1)
  },
  data() {
    return {
      time:0, // 服务器后端从接收到请求到结束请求共花费的时间
      total:0, // 总的数据条目数，用来处理分页的
      pagesize:7,
      currentPage:1,
      AlterData:'',
      tableData: [],
      AddDialogVisible:false,
      AlterDialogVisible:false
    }
  },
  methods: {
    async RequestData(val) {
      if (val !== 0){
        this.currentPage = val
      }
      const data = await this.$http.get("admin/user/home?p="+this.currentPage+"&num="+this.pagesize)
        if (data.data.code === 1) {
          this.$notify({
            title: '加载成功',
            message: '第'+this.currentPage+'页成员信息加载成功',
            position: 'bottom-right',
            duration:2000,
            type: 'success'
          });
          this.tableData = data.data.result
          this.total = data.data.total
          this.time = data.data.time
        } else {
        }
    },
    //编辑成员信息
    Edit(index) {
      this.AlterDialogVisible = true
      this.AlterData = this.tableData[index]
    },
    //删除成员
     Delete(scope) {
       this.$http.post('admin/user/delete', {
        User_account: scope.row.User_account
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
    // 添加新成员
    AddMember(){
      this.AddDialogVisible = true
    },
    // 添加成员后子组件通知父组件的信息
    AddSucceed(b){
      // 关闭弹窗
      this.AddDialogVisible= b.isopen
      // 更新信息
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