<!--修改成员信息-->
<template>
    <div style="height: 65vh;overflow: auto;">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
        <el-form-item label="学号" prop="User_account">
          <el-input v-model="ruleForm.User_account" style="width:100%" disabled></el-input>
        </el-form-item>


        <el-row type="flex" class="el-row">
          <el-col :span="12">
            <el-form-item label="姓名" prop="User_name"style="width:80%" >
              <el-input v-model="ruleForm.User_name"></el-input>
            </el-form-item>
            <el-form-item label="专业方向" prop="User_direction" style="width:80%">
              <el-input v-model="ruleForm.User_direction"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:8080/admin/uploading/selfie"
                :show-file-list="true"
                :headers="headers"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" style="height: 90px;width: 90px;border: antiquewhite 2px solid;padding: 2px">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>
        <el-row type="flex" class="el-row">
          <el-col :span="12">
            <el-form-item label="年级" prop="User_grade" style="width:80%" >
              <el-input v-model="ruleForm.User_grade"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-left: -8%">
            <el-form-item label="成员班级" prop="User_class" style="width: 80%">
              <el-input v-model="ruleForm.User_class" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="el-row">
          <el-col :span="12">
            <el-form-item label="QQ号" prop="User_qq" style="width: 80%">
              <el-input v-model="ruleForm.User_qq"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-left: -8%">
            <el-form-item label="手机号码" prop="User_phone" style="width: 80%">
              <el-input v-model="ruleForm.User_phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="座右铭" prop="User_motto">
          <el-input type="textarea" v-model="ruleForm.User_motto"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  name: "AlterMember",
  //监听父组件传递过来的值
  props:{
    member_info:[],
  },
  created() {
    this.showData()
  },
  // 深度监听父组件传递来的值
  watch: {
      member_info:'showData',
      deep: true,
      immediate: true

  },
methods:{
  showData(){
    this.ruleForm = this.member_info
    this.imageUrl = this.member_info.User_icon
  },
  handleAvatarSuccess(res, file) {
    this.imageUrl = URL.createObjectURL(file.raw);
    this.ruleForm.User_icon = res.msg
  },
  beforeAvatarUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      this.$message.error('上传头像图片只能是 JPG 格式!');
    }
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
  },
  // 修改按钮
  async submitForm(ruleForm) {
    this.$refs.ruleForm.validate(async valid=> {
      if (!valid) return
      const ret = await this.$http.post("admin/user/alter/user", this.ruleForm)
      if (ret.data.code === 1){
        this.$message({showClose:true,message:ret.data.message,center:true,type:'success',duration:1500,onClose:()=>{
            this.$emit("isalterdialogvisible",false)
          }})
      }else {
        this.$message({showClose:true,message:ret.data.message,center:true,type:'success',duration:1500})
      }
    })
  },
  // 取消按钮
  cancel(){
    this.$emit("isalterdialogvisible",false)
  }
},
  computed: {
    headers() {
      return{
        "Usertoken": localStorage.getItem("usertoken"),  // 直接从本地获取token就行
        "Username": localStorage.getItem("username") // 直接从本地获取token就行
      }
    }
  },
  data() {
    return {
      imageUrl: '',
      ruleForm: {
        User_account: '',
        User_name: '',
        User_direction: '',
        User_grade: '',
        User_class: '',
        User_qq:'',
        User_phone:'',
        User_motto:'',
        User_icon:''
      },rules: {
        User_account: [
          { required: true, message: '输入学号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度是11位', trigger: 'blur' },
          { pattern:/^[0-9]*$/, message: '学号应是11位数字', trigger: 'blur' }
        ],
        User_name: [
          { required: true, message: '输入姓名', trigger: 'change' },
          { min: 2, max: 25, message: '长度应是2-25个字符', trigger: 'blur' }
        ],
        User_direction: [
          { required: true, message: '输入专业方向', trigger: 'change' },
          { min: 2, max: 25, message: '长度应是2-25个字符', trigger: 'blur' }
        ],
        User_grade: [
          { required: true, message: '输入班级', trigger: 'change' },
          { min: 4, max: 4, message: '长度应是4个字符', trigger: 'blur' }
        ],
        User_class: [
          { required: true, message: '输入年级', trigger: 'change' },
          { min: 2, max: 25, message: '长度应是2-25个字符', trigger: 'blur' }
        ],
        User_qq: [
          { required: true, message: '输入QQ号码', trigger: 'change' },
          { min: 5, max: 25, message: 'QQ应是5-25个数字', trigger: 'blur' },
          { pattern:/^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        User_phone: [
          { required: true, message: '输入手机号码', trigger: 'change' },
          { min: 11, max: 11, message: '手机号码应是11位数字', trigger: 'blur' },
          { pattern:/^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        User_motto: [
          { required: true, message: '输入座右铭', trigger: 'change' }
        ]
      }
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
span{
  color: cadetblue;
  padding: 10px;
  font-size: 12px;
}
</style>