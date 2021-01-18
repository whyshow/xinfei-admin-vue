<!-- 添加动态-->
<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
    <el-form-item label="标题" prop="Article_title">
      <el-input v-model="ruleForm.Article_title" style="width:100%"></el-input>
    </el-form-item>
    <el-row type="flex" class="el-row">
      <el-col :span="8">
        <el-form-item label="类别" prop="Article_category" style="width: 80%">
          <el-input v-model="ruleForm.Article_category"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" style="margin-left: -8%">
        <el-form-item label="作者" prop="Article_user" style="width: 80%">
          <el-input v-model="ruleForm.Article_user"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" style="margin-left: -5%">
        <el-form-item style="width: 80%">
          <el-switch
              v-model="value"
              active-color="#13ce66"
              inactive-value="0"
              active-value="1"
              active-text="上架"
              inactive-text="下架"
              inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="正文">
    <div id="add_article_text">

    </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

var addedit
import E from "wangeditor";
export default {
  name: "AddDynamic",
  mounted() {
    this.CreatewangEditor()
  },
  methods:{
    // 添加按钮
    submitForm(){
      this.$refs.ruleForm.validate(async valid=> {
        if (!valid) return
        const ret = await this.$http.post("admin/article/add", {
          "Article_title":this.ruleForm.Article_title,
          "Article_category":this.ruleForm.Article_category,
          "Article_user":this.ruleForm.Article_user,
          "Article_html":addedit.txt.html(),
          "Article_text":addedit.txt.text(),
          "Article_display":this.value
        }).catch(function (error){
          this.$message({showClose:true,message:error,center:true,type:'error',duration:1500})
          return
        })
        if (ret.data.code === 1){
          this.$message({showClose:true,message:ret.data.message,center:true,type:'success',duration:1500,onClose:()=>{
              this.$emit("isadddialogvisible",{"isup":true,"isopen":false})
            }})
        }else {
          this.$message({showClose:true,message:ret.data.message,center:true,type:'error',duration:1500})
        }
      })
    },
    CreatewangEditor(){
      const editors = new E("#add_article_text");
      editors.config.uploadImgServer = 'http://image.ccit.club/admin/uploading/image'
      editors.config.uploadFileName = 'uploadimage'
      editors.config.height = 560
      editors.config.uploadImgHeaders = {
        "Usertoken" : localStorage.getItem("usertoken"),
        "Username" : localStorage.getItem("username")
      }
      editors.create()
      addedit = editors
    },
    //取消按钮
    cancel(){
      this.$emit("isadddialogvisible",{"isup":false,"isopen":false})
    }
  },
  data(){
    return{
      ruleForm: {
        Article_title: '',
        Article_category: '',
        Article_user: '',
        Article_html: '',
        Article_display:''
      },rules: {
        Article_title: [
          {required: true, message: '标题不能为空!', trigger: 'blur'},
          { min: 2, max: 50, message: '长度是2-50字符', trigger: 'blur' },
        ],
        Article_user: [
          {required: true, message: '作者不能为空!', trigger: 'blur'},
        ]
      },
      value: 0
    }
  },
}
</script>

<style scoped>

</style>