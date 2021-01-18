<template>
  <div style="height: 65vh;overflow: auto;">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >

      <el-row type="flex" class="el-row">
        <el-col :span="12">
          <el-form-item label="成果类别" style="width:80%" >
            <el-select v-model="options.message" placeholder="请选择" style="width:100%" @change="changeitem">
              <el-option
                  v-for="item in options"
                  :key="item.classify"
                  :label="item.classify"
                  :value="item.classify">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获得年度" prop="Honor_year"style="width:80%" >
            <el-input v-model="ruleForm.Honor_year" placeholder="2020" ></el-input>
          </el-form-item>
          <el-form-item label="成果介绍" prop="Honor_describe" style="width:80%">
            <el-input v-model="ruleForm.Honor_describe" placeholder="请输入内容" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-upload
              class="avatar-uploader"
              action="http://image.ccit.club/admin/uploading/honor"
              :show-file-list="true"
              :headers="headers"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AddHonor",
  created() {
    this.GetClassify()
  },
  mounted() {
    this.GetClassify()
  },
  methods:{
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.ruleForm.honor_url = res.msg
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
    // 添加按钮
    submitForm(ruleForm) {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        const ret = await this.$http.post("admin/honor/add", this.ruleForm).catch(function (error) {
          this.$message({showClose: true, message: error, center: true, type: 'error', duration: 1500})
          return
        })
        if (ret.data.code === 1) {
          this.$message({
            showClose: true, message: ret.data.message, center: true, type: 'success', duration: 1500, onClose: () => {
              this.$emit("isadddialogvisible", {"isup": true, "isopen": false})
            }
          })
        } else {
          this.$message({
            showClose: true, message: ret.data.message, center: true, type: 'error', duration: 1500, onClose: () => {
            }
          })
        }
      })
    },
    // 获取分类列表
    async GetClassify() {
      const rest = await this.$http.get("api/ryfl")
      if (rest.data.code === 1) {
        this.options = rest.data.result.array
      } else {

      }
    },
    changeitem(v){
     this.ruleForm.honor_classify = v
      this.$forceUpdate()
    },
    // 取消按钮
    cancel(){
      this.$emit("isadddialogvisible",{"isup":false,"isopen":false})
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
  data(){
    return{
      imageUrl: '',
      options:[],
      ruleForm: {
        Honor_classify: '',
        Honor_year: '',
        Honor_describe: '',
        Honor_url:""
      },rules: {
        Honor_classify: [
          {required: true, message: '选择分类', trigger: 'blur'},
        ],
        Honor_year: [
          {required: true, message: '输入姓名', trigger: 'change'},
          {min: 4, max: 4, message: '例如：2020', trigger: 'blur'},
          {pattern: /^[0-9]*$/, message: '4位数字', trigger: 'blur'}
        ],
        Honor_describe: [
          {required: true, message: '输入文字描述', trigger: 'change'},
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
  width: 400px;
  height: 400px;
  line-height: 400px;
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