<template>
  <div class="coen">
    <!-- 面包屑-->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>邮件系统</el-breadcrumb-item>
        <el-breadcrumb-item>写邮件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box-card">
      <el-card>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-dynamic">
          <el-form-item
              prop="Addressee"
              style="width: 60%"
              label="收件人邮箱"
              :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}]">
            <el-input v-model="ruleForm.Addressee" placeholder="暂不支持多收件人发送"></el-input>
          </el-form-item>
          <el-form-item
              label="主题"
              style="width: 60%"
              prop="Subject"
              :rules="[
              { required: true, message: '请输入发送主题名称', trigger: 'blur' },
              { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }]">
            <el-input v-model="ruleForm.Subject"></el-input>
          </el-form-item>
          <el-form-item
              label="发件人"
              style="width: 60%">
            <el-input v-model="sendname" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮件正文">
            <div id="mail_text">
            </div>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')":disabled="disabled" >发送</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

  </div>
</template>

<script>
import E from "wangeditor";
var alteredit
export default {
  name: "SendMail",
  created() {

  },
  mounted() {
    this.CreatewangEditor()
  },
  data() {
    return {
      ruleForm: {
        Addressee: '',
        Subject:'',
        Mailtext:''
      },
      disabled:false,
      sendname:'message@ccit.club'
    };
  },
  methods:{
    // 发送邮件
    submitForm(ruleForm){
      this.ruleForm.Mailtext = alteredit.txt.html()
      this.$refs.ruleForm.validate(async valid=> {
        if (!valid) return
        this.disabled = true
            const ret = await this.$http.post("admin/email/send/one", this.ruleForm).catch(function (error){
              this.$message({showClose:true,message:error,center:true,type:'error',duration:1500})
              return
            })
        if (ret.data.code === 1){
          this.$notify({
            title: '提示',
            message: '邮件发送成功',
            position: 'bottom-right',
            duration:2000,
            type: 'success'
          });
          this.disabled = false
          this.ruleForm.Addressee = ''
        }else {
          this.disabled = false
          this.$notify({
            title: '提示',
            message: '邮件发送失败,原因:'+ret.data.message,
            position: 'bottom-right',
            duration:2000,
            type: 'error'
          });
        }

      })
    },
    //重置
    resetForm(formName){
      this.$refs[formName].resetFields();
    },
    CreatewangEditor(){
      const editors = new E("#mail_text");
      editors.config.uploadImgServer = 'http://image.ccit.club/admin/uploading/image'
      editors.config.uploadFileName = 'uploadimage'
      editors.config.height = 480
      editors.config.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
       // 'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
      editors.config.uploadImgHeaders = {
        "Usertoken" : localStorage.getItem("usertoken"),
        "Username" : localStorage.getItem("username")
      }
      editors.create()
      alteredit = editors
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
.box-card{
  height: 100%;
}
.el-card {
  margin-left: 10px;
  margin-right: 10px;
  height: 100%;
  margin-top: 1%;
}
.el-breadcrumb {
  line-height: 30px;
}
</style>