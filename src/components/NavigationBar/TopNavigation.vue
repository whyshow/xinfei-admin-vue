<!-- 顶部导航栏组件-->
<template>
  <div class="top-nav">
    <div class="top-left">
      <span>信飞门户站管理后台</span>
    </div>
    <div class="top-right">
      <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
        <el-submenu index="1" disabled>
          <template slot="title">系统重启</template>
          <el-menu-item index="1-1">立即重启</el-menu-item>
          <el-menu-item index="1-2">定时重启</el-menu-item>
        </el-submenu>
        <el-submenu index="2" disabled>
          <template slot="title">admin</template>
          <el-menu-item index="2-1">切换账号</el-menu-item>
          <el-menu-item index="2-2">退出登录</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" disabled>前台首页</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopNavigation",
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
    }
  }
}
</script>

<style scoped>
span{
  color: white;
  margin-left: 3%;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
}
.el-menu{
  float: right;
  height: 60px;
}
.top-nav{
  width: 100%;
  position: absolute;
  height: 60px;
}
.top-left{
  width: 50%;
  float:left;
  height: 100%;
}
.top-right{
  left: 5%;
  float:left;
  hheight: 100%;
  width: 50%;
}
</style>