<template>
  <div class="coen">
    <!-- 面包屑-->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>邮件系统</el-breadcrumb-item>
        <el-breadcrumb-item>群发邮件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box-card">
      <el-card>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-dynamic">
          <el-form-item
              style="width: 60%"
              label="定时发送">
            <el-date-picker
                v-model="value1"
                size="small"
                type="datetime"
                @change="datetime"
                placeholder="选择日期时间"
                align="center"
                disabled
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

          <el-form-item
              style="width: 60%;margin-top: 0%"
              label="邮箱模板">
            <el-button size="small" type="primary" @click="download()">下载模板<i class="el-icon-download el-icon--right"></i></el-button>
          </el-form-item>

          <el-form-item
              style="width: 60%"
              label="收件人邮箱">
            <el-upload
                class="upload-demo"
                action="http://image.ccit.club/admin/uploading/excel"
                :show-file-list="true"
                :headers="headers"
                accept=".xls,.xlsx">
              <el-button size="small" type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
              <div slot="tip" class="el-upload__tip">上传Excel文件，内容请按照相关格式，否则无法发送</div>
            </el-upload>
          </el-form-item>

          <el-form-item
              label="主题"
              style="width: 60%"
              prop="Subject"
              :rules="[
              { required: true, message: '请输入发送主题名称', trigger: 'blur' },
              { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }]">
            <el-input v-model="ruleForm.Subject"  placeholder="系统会在填写的主题名称前添加xx同学"></el-input>
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
              <el-button type="primary" @click="submitForm('ruleForm')" :disabled="disabled">发送</el-button>
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
      disabled:false
      ,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value1: '',
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
            const ret = await this.$http.post("admin/email/send/emails", this.ruleForm).catch(function (error){
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
          this.$notify({
            title: '提示',
            message: '共发送成功'+ret.data.nums+"人",
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
    // 选择定时发送的日期时间
    datetime(date){
console.log(date)
    }
    ,
    // 下载群发模板
    async download() {
      window.location.href = "http://api.ccit.club/static/model/群发模板.xlsx";
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
        'video',  // 插入视频
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
  },
  computed: {
    headers() {
      return{
        "Usertoken": localStorage.getItem("usertoken"),  // 直接从本地获取token就行
        "Username": localStorage.getItem("username") // 直接从本地获取token就行
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
.el-date-picker.has-sidebar.has-time{
  z-index: 99999;

}

</style>