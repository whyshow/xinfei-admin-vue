import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login";
import MemberList from "@/components/Member/MemberList";
import Welcome from "@/components/Welcome";
import HonorList from "@/components/Honor/HonorList";
import DynamicList from "@/components/Dynamic/DynamicList";
import SendMail from "@/components/Email/SendMail";
import SendMails from "@/components/Email/SendMails";
import axios from "axios";
import {Message} from "element-ui";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect:'/welcome',
        children:[
            {path:'/welcome',component:Welcome, meta: {title: "信飞门户管理后台"}},
            {path:'/menberlist',component:MemberList,meta: {title: "信飞门户管理后台"}},
            {path:'/dynamiclist',component:DynamicList,meta: {title: "信飞门户管理后台"}},
            {path: '/homelist',component: HonorList,meta: {title: "信飞门户管理后台"}},
            {path: '/sendmail',component: SendMail,meta: {title: "信飞门户管理后台"}},
            {path: '/sendmails',component: SendMails,meta: {title: "信飞门户管理后台"}}
        ],
        meta: {
            title: "信飞门户管理后台",

        }
    },
    {path: '/login', name: 'Login', component: Login, meta: {title: "信飞门户管理登录"}}
]
const router = new VueRouter({
    mode: 'history',
    routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 表示从哪个路径来
    // next 是一个函数表示放行
   if (to.path === '/login'){
       // 先判断登录是否有效，如果有效则不跳转到登录页面
       axios.get('admin/token')
           .then( (response)=>{
               // 判定登录失效 重新跳转到登录页面
               if (response.data.status === 401) {
                   next()
               } else {
                   //判定登录有效 重新跳转到Home页面
                   Message({
                       message: "登录身份有效，无须再次登录", center: true, type: 'warning', duration: 2000, onClose: () => {
                           next('/')
                       }
                   })
               }
           })
           .catch( (error)=> {
               Message({
                   message: "系统错误!"+error, center: true, type: 'error', duration: 2000, onClose: () => {
                       next()
                   }
               })
           });
    } else {
          axios.get('admin/token')
            .then( (response)=> {
                if (response.data.status === 401) {
                    Message({
                        message: response.data.message, center: true, type: 'warning', duration: 2000, onClose: () => {
                            next('/login')
                        }
                    })
                }
                else next()
            })
            .catch( (error)=> {
                Message({
                    message: "系统错误!"+error, center: true, type: 'error', duration: 2000, onClose: () => {
                        next('/login')
                    }
                })
            });
    }
})

export default router
