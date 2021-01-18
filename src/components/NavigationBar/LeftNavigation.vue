<!-- 左侧导航栏组件-->
<template>
    <el-menu
        background-color="#545c64"
        text-color="#fff"
        :router="true"
        :unique-opened= "true"
        active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chengyuan"></use>
          </svg>
          <span>成员管理</span>
        </template>
          <el-menu-item :index="'/'+'menberlist'">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>成员管理</span>
              </template>
          </el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gongsidongtai"></use>
          </svg>
          <span>动态管理</span>
        </template>
          <el-menu-item :index="'/'+'dynamiclist'">
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span>动态列表</span>
            </template>
          </el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-nb-"></use>
          </svg>
          <span>成果管理</span>
        </template>
          <el-menu-item :index="'/'+'homelist'">
            <template slot="title">
              <i class="el-icon-trophy"></i>
              <span>成果列表</span>
            </template>
          </el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-A"></use>
          </svg>
          <span>智慧教育</span>
        </template>
        <el-menu-item index="4-1" disabled>
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>智慧产品管理</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shuangsechangyongtubiao-"></use>
          </svg>
          <span>数据统计</span>
        </template>
        <el-menu-item index="5-1" disabled>
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>IP归属地统计</span>
          </template>
        </el-menu-item>
        <el-menu-item index="5-2" disabled>
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>访问量统计</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-youxiang"></use>
          </svg>
          <span>邮件系统</span>
        </template>
        <el-menu-item :index="'/'+'sendmail'">
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>写邮件</span>
          </template>
        </el-menu-item>
        <el-menu-item :index="'/'+'sendmails'">
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>群发邮件</span>
          </template>
        </el-menu-item>
        <el-menu-item index="6-3" disabled>
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>成员邮箱管理</span>
          </template>
        </el-menu-item>
        <el-menu-item index="6-4" disabled>
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>收件室</span>
          </template>
        </el-menu-item>
      </el-submenu>


      <el-submenu index="7">
        <template slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-A"></use>
          </svg>
          <span>设置</span>
        </template>
          <el-menu-item index="7-1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>footer设置</span>
            </template>
          </el-menu-item>
          <el-menu-item index="7-2" disabled>
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>轮播设置</span>
            </template>
          </el-menu-item>

      </el-submenu>
    </el-menu>
</template>

<script>
export default {
  name: "LeftNavigation"
}
</script>

<style scoped>
.el-menu{
  width: 180px;
}
.el-menu-item{
  width: 180px;
}
.el-submenu .el-menu-item{
  min-width: 180px;
}
.icon {
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5em;
  fill: currentColor;
  overflow: hidden;
}
</style>