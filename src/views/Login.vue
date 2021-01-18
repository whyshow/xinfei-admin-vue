<!-- 登录页面-->
<template>
  <div class="login-container">
    <transition name="slide-fade">
    <div class="login-box" v-if="show">
      <div class="login-form">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="Admin_name">
          <el-input type=""  prefix-icon="el-icon-user" v-model="ruleForm.Admin_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="Admin_password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="ruleForm.Admin_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  :disabled="disabled" style="width: 110px;height:42px" type="primary" @click="login('ruleForm')" :loading="loading">登 录</el-button>
          <el-button  :disabled="disabled" style="width: 110px;height:42px" @click="resetForm('ruleForm')">重 置</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>
    </transition>
    <el-button class="slide-button" v-on:click="show = !show" type="primary">
      <span v-if="show">隐藏登录表单</span>
      <span v-if="!show">展开登录表单</span>
    </el-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
        this.disabled = false
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
        this.loading = false
        this.disabled = false
      } else {
        callback();
      }
    };
    return {
      loading:false,
      show: true,
      disabled:false,
      ruleForm: {
        Admin_name:'',
        Admin_password: ''
      },
      rules: {
        Admin_password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        Admin_name: [
          { validator: validateName, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    login(form){
      this.loading = true
      this.disabled = true
      this.$refs.ruleForm.validate(async valid=>{
        if (!valid) return
        await this.$http.post("manage/request_login",{Admin_name:this.ruleForm.Admin_name,Admin_password:this.ruleForm.Admin_password})
            .then( (response)=> {
              if (response.data.code == 0){
                this.loading = false
                this.disabled = false
                this.$message({showClose:true,message:'错误提示! 您输入的'+response.data.message,center:true,type:'error'})
              } else {
                // window.sessionStorage.setItem("usertoken",response.data.message.token)
                // window.sessionStorage.setItem("username",response.data.message.name)
                localStorage.setItem("username",response.data.message.name)
                localStorage.setItem("usertoken",response.data.message.token)
                axios.defaults.headers.common['usertoken'] = response.data.message.token
                axios.defaults.headers.common['username'] = response.data.message.name
                this.$message({showClose:true,message:"登录成功",center:true,type:'success',duration:1500,onClose:()=>{
                    this.$router.push('/')
                }})
              }

            }).catch((error)=>{
              this.loading = false
              this.disabled = false
              this.$message({showClose:true,message:"系统请求超时!"+error,center:true,type:'error',duration:2000})
            })
      })

    }
  }
}

</script>

<style scoped>
.login-container{

 background-image: url('../../public/bac.jpg');
  -moz-background-size:100% 100%; background-size:100% 100%;
  width: 100%;
  height: 100%;
}
.login-box{
  width: 330px;
  height: 220px;
  background-color: #ffffff;
  border-radius: 5px;
  position: absolute;
  left: 70%;
  top: 20%;
}
.login-form{
  top: 10%;
  left: -13%;
  position: absolute;
}
.slide-button{
  position: absolute;
  bottom: 5%;
  right: 5%;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .7s ease;
}
.slide-fade-leave-active {
  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(30%);
  opacity: 0;
}
</style>