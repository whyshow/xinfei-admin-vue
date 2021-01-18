<template>
  <el-container class="homecontainer">
      <!-- 顶部导航栏部分-->
    <el-header>
      <TopNavigation></TopNavigation>
    </el-header>
    <!-- 页面主体-->
    <el-container>
      <!-- 左侧导航栏部分-->
      <el-aside width="181px">
        <LeftNavigation></LeftNavigation>

      </el-aside>
      <!-- 右侧主体部分-->
      <el-main>
        <keep-alive>
        <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftNavigation from "@/components/NavigationBar/LeftNavigation";
import TopNavigation from "@/components/NavigationBar/TopNavigation";
export default {
  name:"Home",
  created() {
  },
  components:{
    TopNavigation,
    LeftNavigation
  },
  methods:{
    async request() {
      const data = await this.$http.get("admin/home")
      if (data.data.status == 401){

        this.$message({message:data.data.message,center:true,type:'warning',duration:1500,onClose:()=>{
            this.$router.push('/login')
          }})
      }

    }
  }
}
</script>

<style lang="css" scoped>
*{
  margin: 0px;
  padding: 0px;
}
.homecontainer{
  height: 100%;
}
.el-header{
  background-color: #545c64;
  height: 45px;
  padding: 0px;
}
.el-container{
  background-color: #545c64
}
.el-main{
  padding: 0px;
  margin: 0px;
 background-color: #f8f7f7;
}

</style>